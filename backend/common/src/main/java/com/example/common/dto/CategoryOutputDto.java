package com.example.common.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CategoryOutputDto {

    private UUID categoryId;
    private String name;
    private String description;
    private UUID parentCategoryId; // Dodane pole dla ID kategorii nadrzędnej
    private List<CategoryOutputDto> subcategories; // Dodane pole dla podkategorii
}
