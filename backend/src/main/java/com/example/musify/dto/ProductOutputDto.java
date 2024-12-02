package com.example.musify.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProductOutputDto {

    private UUID productId;
    private String name;
    private BigDecimal price;
    private String description;
    private String condition;
    private Float rating;
    private LocalDateTime creationDate;
    private UUID categoryId;
    private String categoryName;
    private UUID sellerId;
    private String sellerName;
}
