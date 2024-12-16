package com.example.musify.services;

import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

@Service
public class StartupService {

    @Value("${app.upload-dir:../uploads/products}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            // Tworzy folder tylko jeśli nie istnieje
            Files.createDirectories(Paths.get(uploadDir));
            System.out.println("Upload directory created or already exists: " + Paths.get(uploadDir).toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }
}
