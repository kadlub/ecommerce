package com.example.common.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReviewOutputDto {

    private UUID reviewId;
    private UUID revieweduserId;
    private String reviewedUserName;
    private UUID reviewerUserId;
    private String reviewerUserName;
    private Float rating;
    private String comment;
    private LocalDateTime createdAt;
}
