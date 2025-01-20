package com.example.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderNotificationRequest {
    private String buyerEmail;        // Email kupującego
    private String sellerEmail;       // Email sprzedającego
    private String productName;       // Nazwa produktu
    private String deliveryDetails;   // Szczegóły dostawy
    private String totalPrice;        // Cena całkowita
}
