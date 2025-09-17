package com.janne.bitfrost.configs;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class PemUtils {

    public static PublicKey readPublicKey(String pem) throws Exception {
        String content = pem.replaceAll("-----BEGIN (.*)-----", "")
            .replaceAll("-----END (.*)----", "")
            .replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(content);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
        return KeyFactory.getInstance("RSA").generatePublic(keySpec);
    }

    public static PrivateKey readPrivateKey(String pem) throws Exception {
        String content = pem.replaceAll("-----BEGIN (.*)-----", "")
            .replaceAll("-----END (.*)----", "")
            .replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(content);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
        return KeyFactory.getInstance("RSA").generatePrivate(keySpec);
    }
}
