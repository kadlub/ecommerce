package com.example.musify.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${JWT_KEY}")
    private String SECRET_KEY;

    @Value("${JWT_EXPIRATION_MS:3600000}") // Domyślnie 1 godzina (w milisekundach)
    private long JWT_EXPIRATION_MS;

    /**
     * Generuje token JWT na podstawie identyfikatora użytkownika.
     *
     * @param userId Unikalny identyfikator użytkownika
     * @return Token JWT
     */
    public String generateToken(UUID userId) {
        return Jwts.builder()
                .setSubject(userId.toString()) // Ustaw userId jako subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    /**
     * Pobiera identyfikator użytkownika z tokena JWT.
     *
     * @param token Token JWT
     * @return UUID użytkownika
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Pobiera unikalny identyfikator użytkownika z tokena JWT.
     *
     * @param token Token JWT
     * @return UUID użytkownika
     */
    public UUID extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return UUID.fromString(claims.getSubject());
        } catch (Exception e) {
            System.err.println("Failed to extract userId: " + e.getMessage());
            return null;
        }
    }

    /**
     * Waliduje token JWT.
     *
     * @param token       Token JWT
     * @param userDetails Szczegóły użytkownika
     * @return true, jeśli token jest ważny
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        String extractedIdentifier = extractUsername(token);
        return extractedIdentifier.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
