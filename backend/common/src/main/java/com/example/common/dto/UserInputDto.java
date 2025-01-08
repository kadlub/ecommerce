package com.example.common.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserInputDto {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String passwordHash;

    @NotNull(message = "Seller status is required")
    private Boolean isSeller = false; // Domyślnie `false`
}
