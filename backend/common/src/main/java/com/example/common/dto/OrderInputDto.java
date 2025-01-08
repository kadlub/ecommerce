package com.example.common.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class OrderInputDto {

    @NotNull(message = "Username is required")
    private String username;

    @NotNull(message = "Delivery address is required")
    private DeliveryAddressDto deliveryAddress;

    @NotNull(message = "Delivery date is required")
    private String deliveryDate; // Format: "YYYY-MM-DD"

    @NotNull(message = "Payment method is required")
    private String paymentMethod;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    @Size(min = 1, message = "Order must contain at least one item")
    private List<OrderItemInputDto> items;

    @Data
    public static class OrderItemInputDto {
        @NotNull(message = "Product ID is required")
        private UUID productId;

        @NotNull(message = "Product name is required")
        private String productName;

        @NotNull(message = "Product price is required")
        private BigDecimal price;

        private Integer quantity;
    }

    @Data
    public static class DeliveryAddressDto {
        @NotNull(message = "City is required")
        private String city;

        @NotNull(message = "Street is required")
        private String street;

        @NotNull(message = "Building number is required")
        private String buildingNumber;

        private String apartmentNumber; // Opcjonalne

        @NotNull(message = "Zip code is required")
        private String zipCode;
    }
}
