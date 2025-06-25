package com.janne.bitfrost.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.janne.bitfrost.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.jackson.io.JacksonSerializer;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Key;
import java.security.KeyFactory;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class JwtService {

    private final ObjectMapper objectMapper;
    @Getter
    private final long jwtIdentityValidityDuration;
    @Getter
    private final long jwtRefreshValidityDuration;
    private final Key signingKey;
    private final JwtParser jwtParser;

    public JwtService(
        @Value("${app.jwt.identity.duration}") long jwtIdentityValidityDuration,
        @Value("${app.jwt.refresh.duration}") long jwtRefreshValidityDuration,
        @Value("${app.jwt.private-key-path}") String privateKeyPath,
        @Value("${app.jwt.secret}") String jwtSecret, ObjectMapper objectMapper
    ) {
        this.jwtIdentityValidityDuration = jwtIdentityValidityDuration;
        this.jwtRefreshValidityDuration = jwtRefreshValidityDuration;

        try {
            String key = new String(Files.readAllBytes(Path.of(privateKeyPath)))
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
            byte[] keyBytes = Base64.getDecoder().decode(key);

            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            this.signingKey = kf.generatePrivate(keySpec);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load RSA private key from " + privateKeyPath, e);
        }

        this.objectMapper = objectMapper;
        this.jwtParser = Jwts.parserBuilder().setSigningKey(this.signingKey).build();
    }

    public String generateToken(Map<String, Object> claims, String subject, TokenType tokenType, User.UserRole role) {
        Map<String, Object> claimsMap = new HashMap<>(claims);
        claimsMap.put("type", tokenType.toString());
        claimsMap.put("role", role.toString());
        return Jwts.builder()
            .serializeToJsonWith(new JacksonSerializer<>(objectMapper))
            .setIssuedAt(new Date())
            .setAudience("bitfrost")
            .setSubject(subject)
            .setExpiration(new Date(new Date().getTime() + (tokenType == TokenType.IDENTITY_TOKEN ? jwtIdentityValidityDuration : tokenType == TokenType.REFRESH_TOKEN ? jwtRefreshValidityDuration : 0)))
            .addClaims(claimsMap)
            .signWith(signingKey)
            .compact();
    }

    public Claims parseJwt(String token, TokenType tokenType) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();
        if (claims.getExpiration().before(new Date())) {
            return null;
        }
        if (!"bitfrost".equals(claims.getAudience())) {
            return null;
        }
        TokenType givenTokenType = TokenType.valueOf(claims.get("type", String.class));
        if (givenTokenType != tokenType) {
            return null;
        }
        return claims;
    }

    public enum TokenType {
        REFRESH_TOKEN,
        IDENTITY_TOKEN,
        VALIDITY_TOKEN
    }

}
