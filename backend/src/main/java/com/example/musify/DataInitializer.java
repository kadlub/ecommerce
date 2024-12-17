package com.example.musify;

import com.example.musify.entities.Authority;
import com.example.musify.repositories.AuthorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAuthorities(AuthorityRepository authorityRepository) {
        return args -> {
            if (authorityRepository.findByName("ROLE_USER").isEmpty()) {
                Authority userRole = Authority.builder()
                        .id(UUID.randomUUID())
                        .name("ROLE_USER")
                        .build();
                authorityRepository.save(userRole);
                System.out.println("Added ROLE_USER");
            }

            if (authorityRepository.findByName("ROLE_ADMIN").isEmpty()) {
                Authority adminRole = Authority.builder()
                        .id(UUID.randomUUID())
                        .name("ROLE_ADMIN")
                        .build();
                authorityRepository.save(adminRole);
                System.out.println("Added ROLE_ADMIN");
            }
        };
    }
}
