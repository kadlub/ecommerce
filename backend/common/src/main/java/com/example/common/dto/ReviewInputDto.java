package com.example.common.dto;

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
    private UUID reviewedUserId; // ID użytkownika, którego dotyczy opinia
    private float rating;
    private String comment;
}
