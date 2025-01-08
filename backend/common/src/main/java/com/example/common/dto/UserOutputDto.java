package com.example.common.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserOutputDto {

    private UUID userId;
    private String username;
    private String email;
    private Boolean isSeller;
    private LocalDateTime createdAt;
    private List<String> roles;
}
