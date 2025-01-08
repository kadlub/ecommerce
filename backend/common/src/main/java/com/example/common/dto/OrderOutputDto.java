package com.example.common.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class OrderOutputDto {

    private UUID orderId;
    private UUID userId; // Kupujący
    private String buyerName; // Opcjonalne: nazwa użytkownika kupującego
    private BigDecimal totalPrice;
    private String status;
    private String deliveryDate; // Data dostawy
    private String paymentMethod; // Metoda płatności
    private DeliveryAddressDto deliveryAddress; // Adres dostawy
    private List<OrderItemOutputDto> items; // Szczegóły zamówienia

    @Data
    @Builder
    public static class OrderItemOutputDto {
        private UUID productId;
        private String productName;
        private BigDecimal price;
        private Integer quantity; // Ilość zamówionych produktów
        private String sellerName; // Opcjonalne: sprzedawca
        private UUID sellerId; // Identyfikator sprzedawcy
    }

    @Data
    @Builder
    public static class DeliveryAddressDto {
        private String city;
        private String street;
        private String buildingNumber;
        private String apartmentNumber; // Opcjonalne
        private String zipCode;
    }
}
