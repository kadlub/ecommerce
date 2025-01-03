package com.example.musify.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebSecurityConfig implements WebMvcConfigurer {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtFilter jwtFilter;

    public WebSecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint, JwtFilter jwtFilter) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtFilter = jwtFilter;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("uploads/products/**")
                .addResourceLocations("file:uploads/products/");
    }

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Wyłącz CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Obsługa CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/register", "/auth/login").permitAll() // Zezwól na te endpointy bez autoryzacji
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // Zezwól na preflight OPTIONS
                        .requestMatchers("/users/profile").hasAnyRole("USER", "ADMIN") // Endpoint wymaga ról USER lub ADMIN
                        .requestMatchers("/categories", "categories/**").permitAll()
                        .requestMatchers("/products/**","/products").permitAll()
                        .requestMatchers("/uploads/products/**","/uploads/products/0e732607-1ae9-45c5-978f-ba54e7619cde_c7fff558-ae21-4cea-9b74-d4c5f056afa0").permitAll()
                        .requestMatchers("/error").permitAll()
                        .anyRequest().authenticated() // Wszystkie inne żądania wymagają autoryzacji
                        //.anyRequest().permitAll() // Zezwól na wszystkie żądania
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Ustaw stateless session
                .exceptionHandling(exception -> exception.disable()) // Wyłącz obsługę błędów autoryzacji
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        System.out.println("Security Filter Chain configured!");


        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        config.setExposedHeaders(Arrays.asList("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
