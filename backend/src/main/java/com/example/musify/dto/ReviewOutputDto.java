package com.example.musify.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReviewOutputDto {

    private Long reviewId;
    private UUID productId;
    private UUID userId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
