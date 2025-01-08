package com.example.common.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProductOutputDto {

    private UUID productId;
    private String name;
    private BigDecimal price;
    private String description;
    private String condition;
    private LocalDateTime creationDate;
    private String imageUrl; // Domyślny obraz
    private List<String> imageUrls; // Lista wszystkich obrazów
    private UUID categoryId;
    private String categoryName;
    private UUID sellerId;
    private String sellerName;
    private String slug;
    private boolean isSold; // Dodane pole
}
