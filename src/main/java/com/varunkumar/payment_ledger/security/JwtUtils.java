package com.varunkumar.payment_ledger.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    // IMPORTANT: Yeh key kam se kam 32 characters ki honi chahiye.
    // Isse ek simple string ke bajaye Base64 encoded string rakhein.
    private final String SECRET = "af01b2c3d4e5f67890123456789012345678901234567890";

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET); // Agar key Base64 hai
        return Keys.hmacShaKeyFor(SECRET.getBytes()); // Agar direct string use kar rahe ho
    }

    // Token Generate Karne ke liye
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hours
                .signWith(getSigningKey())
                .compact();
    }

    // Token Validate aur Username nikalne ke liye
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}