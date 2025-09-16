package com.janne.bitfrost.services;

import com.janne.bitfrost.entities.User;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class JwtService {

    @Getter
    private final long jwtIdentityValidityDuration;
    @Getter
    private final long jwtRefreshValidityDuration;
    @Getter
    private final long jwtExecutionValidityDuration;
    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    @Value("${app.jwt.issuer-uri}")
    private String issuerUri;

    public JwtService(
        @Value("${app.jwt.identity.duration}") long jwtIdentityValidityDuration,
        @Value("${app.jwt.refresh.duration}") long jwtRefreshValidityDuration,
        @Value("${app.jwt.executor.duration}") long jwtExecutionValidityDuration,
        JwtEncoder jwtEncoder,
        JwtDecoder jwtDecoder
    ) {
        this.jwtIdentityValidityDuration = jwtIdentityValidityDuration;
        this.jwtRefreshValidityDuration = jwtRefreshValidityDuration;
        this.jwtExecutionValidityDuration = jwtExecutionValidityDuration;
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    public String generateToken(Map<String, Object> claims, String subject, TokenType tokenType, User.UserRole role) {
        Map<String, Object> claimsMap = new HashMap<>(claims);
        claimsMap.put("type", tokenType.toString());
        claimsMap.put("role", role.toString());

        Instant now = Instant.now();
        long duration = switch (tokenType) {
            case IDENTITY_TOKEN -> jwtIdentityValidityDuration;
            case REFRESH_TOKEN -> jwtRefreshValidityDuration;
            case EXECUTOR_TOKEN -> jwtExecutionValidityDuration;
            default -> 1000;
        };

        JwtClaimsSet jwtClaims = JwtClaimsSet.builder()
            .issuer(issuerUri)
            .issuedAt(now)
            .expiresAt(now.plusMillis(duration))
            .subject(subject)
            .audience(List.of("bitfrost"))
            .claims(c -> c.putAll(claimsMap))
            .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwtClaims)).getTokenValue();
    }

    public Jwt parseJwt(String token, TokenType tokenType) {
        try {
            Jwt jwt = jwtDecoder.decode(token);

            // expiration is checked automatically by JwtDecoder
            if (!jwt.getAudience().contains("bitfrost")) {
                return null;
            }
            TokenType givenTokenType = TokenType.valueOf(jwt.getClaimAsString("type"));
            if (givenTokenType != tokenType) {
                return null;
            }
            return jwt;
        } catch (JwtException e) {
            log.error("Invalid JWT: {}", e.getMessage());
            return null;
        }
    }

    public enum TokenType {
        REFRESH_TOKEN,
        IDENTITY_TOKEN,
        VALIDITY_TOKEN,
        EXECUTOR_TOKEN
    }
}