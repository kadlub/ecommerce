package com.example.musify.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CategoryOutputDto {

    private UUID categoryId;
    private String name;
    private String description;
    private UUID parentCategoryId; // ID kategorii nadrzędnej
}
