package com.example.musify.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserOutputDto {

    private UUID userId;
    private String username;
    private String email;
    private Boolean isSeller;
    private LocalDateTime createdAt;
}
