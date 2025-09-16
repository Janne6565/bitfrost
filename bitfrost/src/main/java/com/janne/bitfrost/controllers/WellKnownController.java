package com.janne.bitfrost.controllers;


import com.nimbusds.jose.jwk.JWKSet;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/.well-known")
@RequiredArgsConstructor
public class WellKnownController {

    private final JWKSet jwkSet;
    @Value("${app.jwt.issuer-uri}")
    private String issuerUrl;

    @GetMapping(value = "/jwks.json", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> jwks() {
        return jwkSet.toJSONObject();
    }

    @GetMapping(value = "/openid-configuration", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> openidConfiguration() {
        Map<String, Object> config = new HashMap<>();
        config.put("issuer", issuerUrl);
        config.put("jwks_uri", issuerUrl + "/.well-known/jwks.json");
        config.put("authorization_endpoint", issuerUrl + "/oauth2/authorize");
        config.put("token_endpoint", issuerUrl + "/oauth2/token");
        config.put("response_types_supported", new String[]{"token"});
        config.put("subject_types_supported", new String[]{"public"});
        config.put("id_token_signing_alg_values_supported", new String[]{"RS256"});
        config.put("scopes_supported", new String[]{"openid", "profile", "email"});
        return config;
    }
}