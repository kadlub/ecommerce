package com.example.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryInputDto {

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    private UUID parentCategoryId; // ID kategorii nadrzędnej
}
