package com.example.api_gateway.configuration;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomRouteLocator {

    @Bean("customRouteLocatorBean")
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("product_service", r -> r.path("/api/categories/**", "/api/products/**")
                        .filters(f -> f.filter((exchange, chain) -> {
                            System.out.println("Incoming request to product_service: " + exchange.getRequest().getPath());
                            return chain.filter(exchange);
                        }))
                        .uri("http://localhost:8082"))
                .route("user_service", r -> r.path("/api/auth/**", "/api/users/**")
                        .filters(f -> f.filter((exchange, chain) -> {
                            System.out.println("Incoming request to user_service: " + exchange.getRequest().getPath());
                            return chain.filter(exchange);
                        }))
                        .uri("http://localhost:8081"))
                .route("order_service", r -> r.path("/api/orders/**")
                        .filters(f -> f.filter((exchange, chain) -> {
                            System.out.println("Incoming request to order_service: " + exchange.getRequest().getPath());
                            return chain.filter(exchange);
                        }))
                        .uri("http://localhost:8083"))
                .build();
    }

    @Bean
    public GlobalFilter customGlobalFilter() {
        return (exchange, chain) -> {
            System.out.println("Incoming request: " + exchange.getRequest().getPath());
            return chain.filter(exchange);
        };
    }

}
