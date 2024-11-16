package com.example.musify.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ProductOutputDto {

    private UUID productId;
    private String name;
    private BigDecimal price;
    private String description;
    private String condition;
    private String categoryName;
    private Float rating;
    private Integer stock;
    private LocalDateTime creationDate;
}
