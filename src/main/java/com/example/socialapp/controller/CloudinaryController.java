package com.example.socialapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/cloudinary")
public class CloudinaryController {

    // Returns signature and keys needed for direct client upload.
    @PostMapping("/sign")
    public ResponseEntity<?> sign(@RequestBody(required = false) Map<String, Object> params) {
        try {
            String url = System.getenv("CLOUDINARY_URL");
            if (url == null || url.isBlank()) return ResponseEntity.badRequest().body("CLOUDINARY_URL not set");
            // parse cloudinary://API_KEY:API_SECRET@CLOUD_NAME
            String cleaned = url.trim();
            if (!cleaned.startsWith("cloudinary://")) return ResponseEntity.badRequest().body("invalid CLOUDINARY_URL");
            String body = cleaned.substring("cloudinary://".length());
            String[] parts = body.split("@");
            if (parts.length != 2) return ResponseEntity.badRequest().body("invalid CLOUDINARY_URL");
            String creds = parts[0];
            String cloudName = parts[1];
            String[] credsParts = creds.split(":");
            if (credsParts.length != 2) return ResponseEntity.badRequest().body("invalid CLOUDINARY_URL");
            String apiKey = credsParts[0];
            String apiSecret = credsParts[1];

            long timestamp = Instant.now().getEpochSecond();
            // Build param string: include timestamp and any signed params provided.
            Map<String, Object> signed = new TreeMap<>();
            if (params != null) signed.putAll(params);
            signed.put("timestamp", timestamp);
            StringBuilder toSign = new StringBuilder();
            boolean first = true;
            for (Map.Entry<String, Object> e : signed.entrySet()) {
                if (!first) toSign.append('&');
                first = false;
                toSign.append(e.getKey()).append('=').append(e.getValue());
            }
            String toHash = toSign.toString() + apiSecret;
            String signature = sha1Hex(toHash);

            return ResponseEntity.ok(Map.of(
                    "api_key", apiKey,
                    "cloud_name", cloudName,
                    "timestamp", timestamp,
                    "signature", signature
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("signing failed: " + e.getMessage());
        }
    }

    private static String sha1Hex(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
