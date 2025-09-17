package com.janne.bitfrost.configs;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import java.nio.file.Files;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
public class JwtKeyConfig {

    @Value("${app.jwt.keys.public}")
    private Resource publicKeyResource;

    @Value("${app.jwt.keys.private}")
    private Resource privateKeyResource;

    @Value("${app.jwt.key-id}")
    private String keyId;

    @Bean
    public JWKSource<SecurityContext> jwkSource(RSAPublicKey publicKey, PrivateKey privateKey) throws Exception {
        RSAKey rsaKey = new RSAKey.Builder(publicKey)
            .privateKey(privateKey)
            .keyID(keyId)
            .build();

        JWKSet jwkSet = new JWKSet(rsaKey);
        return (jwkSelector, context) -> jwkSelector.select(jwkSet);
    }

    @Bean
    public JWKSet jwkSet(RSAPublicKey publicKey) throws Exception {
        RSAKey rsaKey = new RSAKey.Builder(publicKey)
            .keyID(keyId)
            .build();

        return new JWKSet(rsaKey);
    }

    @Bean
    public RSAPublicKey rsaPublicKey() throws Exception {
        return (RSAPublicKey) readPublicKey(publicKeyResource);
    }

    @Bean
    public PrivateKey privateKey() throws Exception {
        return readPrivateKey(privateKeyResource);
    }

    private PublicKey readPublicKey(Resource resource) throws Exception {
        String key = Files.readString(resource.getFile().toPath());
        return PemUtils.readPublicKey(key);
    }

    private PrivateKey readPrivateKey(Resource resource) throws Exception {
        String key = Files.readString(resource.getFile().toPath());
        return PemUtils.readPrivateKey(key);
    }

    @Bean
    public JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    public JwtDecoder jwtDecoder(RSAPublicKey rsaPublicKey) {
        return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();
    }

}