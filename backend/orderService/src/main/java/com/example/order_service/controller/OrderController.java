package com.example.order_service.controller;

import com.example.common.dto.OrderInputDto;
import com.example.common.dto.OrderOutputDto;
import com.example.common.entity.Orders;
import com.example.order_service.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
//@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderOutputDto> getAllOrders() {
        // Pobierz username z kontekstu bezpieczeństwa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Pobierz zamówienia tylko dla zalogowanego użytkownika
        return orderService.findOrdersByUsername(username);
    }


    @GetMapping("/{id}")
    public ResponseEntity<OrderOutputDto> getOrderById(@PathVariable UUID id) {
        // Pobierz username z kontekstu bezpieczeństwa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Pobierz zamówienie i sprawdź, czy należy do zalogowanego użytkownika
        return orderService.findOrderById(id)
                .filter(order -> order.getBuyerName().equals(username)) // Sprawdzenie właściciela zamówienia
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build()); // Zwróć 403, jeśli użytkownik nie jest właścicielem
    }

    @PostMapping
    public OrderOutputDto createOrder(@RequestBody @Valid OrderInputDto orderInputDto) {
        // Pobierz username z kontekstu bezpieczeństwa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Przypisz username do OrderInputDto
        orderInputDto.setUsername(username);

        return orderService.createOrder(orderInputDto);
    }

    @GetMapping("/user")
    public List<OrderOutputDto> getOrdersForUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return orderService.findOrdersByUsername(username);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
        // Pobierz username z kontekstu bezpieczeństwa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Sprawdź, czy zamówienie należy do zalogowanego użytkownika
        OrderOutputDto order = orderService.findOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyerName().equals(username)) {
            return ResponseEntity.status(403).build(); // Zwróć 403, jeśli użytkownik nie jest właścicielem
        }

        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // zmiana statusu zamówienia
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderOutputDto> updateOrderStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        // Pobierz username z kontekstu bezpieczeństwa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Sprawdź, czy zamówienie należy do zalogowanego użytkownika
        OrderOutputDto order = orderService.findOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyerName().equals(username)) {
            return ResponseEntity.status(403).build(); // Zwróć 403, jeśli użytkownik nie jest właścicielem
        }

        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}

