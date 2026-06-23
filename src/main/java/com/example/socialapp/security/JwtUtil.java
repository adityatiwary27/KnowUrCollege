package com.example.socialapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
    private final Key signingKey;
    private final long validityMillis;

    public JwtUtil(String secret, long validityMillis) {
        if (secret == null || secret.isBlank()) {
            // use a stable default dev secret when not provided (development only)
            String dev = "dev-secret-please-change-this-to-a-secure-key";
            this.signingKey = Keys.hmacShaKeyFor(dev.getBytes());
        } else {
            this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        }
        this.validityMillis = validityMillis;
    }

    public String generateToken(String username) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + validityMillis))
                .signWith(signingKey)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token).getBody();
    }
}
