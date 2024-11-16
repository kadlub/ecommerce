package com.example.musify.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoryOutputDto {

    private UUID categoryId;
    private String name;
    private String description;
}
