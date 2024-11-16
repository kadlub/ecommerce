package com.example.musify.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class OrderInputDto {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @Size(min = 1, message = "Order must contain at least one item")
    private List<OrderItemInputDto> items;

    @Data
    public static class OrderItemInputDto {
        @NotNull(message = "Product ID is required")
        private UUID productId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;
    }
}
