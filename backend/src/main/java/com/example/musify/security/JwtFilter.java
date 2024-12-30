package com.example.musify.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    // Ścieżki wykluczone z filtrowania JWT
    private static final Set<String> EXCLUDED_PATHS = Set.of(
            "/api/auth/register",
            "/api/auth/login"
    );

    public JwtFilter(JwtUtil jwtUtil, @Qualifier("customUserDetailsService") UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Sprawdzenie, czy ścieżka jest wykluczona
        if (shouldSkipPath(path)) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String identifier = null;
        String jwtToken = null;

        // Pobierz token JWT
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwtToken = authHeader.substring(7);
            identifier = jwtUtil.extractUsername(jwtToken); // Domyślnie traktuj "username" lub "userId" jako subject
        }

        // Jeśli w kontekście nie ma autoryzacji
        if (identifier != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Pobierz dane użytkownika
                UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);

                // Walidacja tokena JWT
                if (jwtUtil.validateToken(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            } catch (Exception e) {
                logger.error("Authentication failed for token: " + jwtToken, e);
            }
        }

        chain.doFilter(request, response);
    }

    /**
     * Sprawdza, czy ścieżka powinna zostać pominięta przez filtr.
     */
    private boolean shouldSkipPath(String path) {
        String normalizedPath = path.startsWith("/api/") ? path : "/api" + path;
        boolean shouldSkip = EXCLUDED_PATHS.stream().anyMatch(normalizedPath::equals);
        System.out.println("Skipping JWT filter for path: " + path + "? " + shouldSkip);
        return shouldSkip;
    }
}
