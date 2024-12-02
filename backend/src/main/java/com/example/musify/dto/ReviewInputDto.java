package com.example.musify.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ReviewInputDto {

    @NotNull(message = "Reviewed user ID is required")
    private UUID reviewedUserId;

    @NotNull(message = "Reviewer user ID is required")
    private UUID reviewerUserId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Float rating;

    @NotBlank(message = "Comment is required")
    private String comment;
}
