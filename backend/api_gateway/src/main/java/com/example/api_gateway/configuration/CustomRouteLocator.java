package com.example.api_gateway.configuration;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URI;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class CustomRouteLocator {

    @Bean("customRouteLocatorBean")
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("productservice", r -> r.path("/api/categories/**", "/api/products/**", "/api/uploads/**")
                        .filters(f -> f.removeRequestHeader("Access-Control-Allow-Ometodarigin"))
                        .uri("http://productservice:8082"))
                .route("userservice", r -> r.path("/api/auth/**", "/api/users/**")
                        .filters(f -> f.removeRequestHeader("Access-Control-Allow-Origin"))
                        .uri("http://userservice:8081"))
                .route("orderservice", r -> r.path("/api/orders/**")
                        .filters(f -> f.removeRequestHeader("Access-Control-Allow-Origin"))
                        .uri("http://orderservice:8083"))
                .route("reviewservice", r -> r.path("/api/reviews/**")
                        .filters(f -> f.removeRequestHeader("Access-Control-Allow-Origin"))
                        .uri("http://reviewservice:8084"))
                .route("productservice-images", r -> r.path("/uploads/products/**")
                        .uri("http://productservice:8082"))
                .route("notificationservice", r -> r.path("/api/notifications/**")
                        .filters(f -> f.removeRequestHeader("Access-Control-Allow-Origin"))
                        .uri("http://notificationservice:8085"))
                .build();
    }

    private String validateAndLogUri(String uri) {
        try {
            URI.create(uri); // Sprawdza, czy URI jest poprawne
            System.out.println("Configuring route with URI: " + uri);
            return uri;
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Invalid URI: " + uri, e);
        }
    }


    private String getServiceUri(String envVarName, String defaultUri) {
        String uri = System.getenv(envVarName);
        System.out.println("Resolved URI for " + envVarName + ": " + uri);
        if (uri == null || uri.isBlank()) {
            System.out.println("Environment variable " + envVarName + " is not set. Using default: " + defaultUri);
            return defaultUri;
        }
        return uri;
    }

    private String logUri(String uri) {
        System.out.println("Configuring route with URI: " + uri);
        return uri;
    }
}
