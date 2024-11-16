package com.example.musify.controllers;

import com.example.musify.entities.Orders;
import com.example.musify.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Orders> getAllOrders() {
        return orderService.findAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrderById(@PathVariable UUID id) {
        return orderService.findOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Orders createOrder(@RequestBody Orders order) {
        return orderService.createOrder(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
