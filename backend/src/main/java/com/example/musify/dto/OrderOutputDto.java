package com.example.musify.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class OrderOutputDto {

    private UUID orderId;
    private UUID userId;
    private BigDecimal totalPrice;
    private String status;
    private List<OrderItemOutputDto> items;

    @Data
    public static class OrderItemOutputDto {
        private UUID productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }
}
