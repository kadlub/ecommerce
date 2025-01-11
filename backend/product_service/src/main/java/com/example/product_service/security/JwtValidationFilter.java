package com.example.product_service.security;

import com.example.common.security.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtValidationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(JwtValidationFilter.class);

    public JwtValidationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        logger.info("Incoming request to path: {}", path);

        // Pomiń walidację JWT dla publicznych endpointów
        if (path.startsWith("/api/categories/") || path.startsWith("/api/products/")) {
            logger.info("Skipping JWT validation for public endpoint: {}", path);
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                jwtUtil.extractUsername(token); // Weryfikacja poprawności JWT
                logger.info("JWT validation successful for token: {}", token);
            } catch (Exception e) {
                logger.error("JWT validation failed: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: Invalid token.");
                return;
            }
        } else {
            logger.warn("Authorization header missing or invalid for request to: {}", path);
        }

        chain.doFilter(request, response);
    }
}
