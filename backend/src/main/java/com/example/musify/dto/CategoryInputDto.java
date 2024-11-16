package com.example.musify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryInputDto {

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;
}
