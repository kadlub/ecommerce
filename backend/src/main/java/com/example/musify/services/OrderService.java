package com.example.musify.services;

import com.example.musify.entities.Orders;
import com.example.musify.repositories.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    private final OrdersRepository ordersRepository;

    @Autowired
    public OrderService(OrdersRepository ordersRepository) {
        this.ordersRepository = ordersRepository;
    }

    public List<Orders> findAllOrders() {
        return ordersRepository.findAll();
    }

    public Optional<Orders> findOrderById(UUID orderId) {
        return ordersRepository.findById(orderId);
    }

    public Orders createOrder(Orders order) {
        return ordersRepository.save(order);
    }

    public void deleteOrder(UUID orderId) {
        ordersRepository.deleteById(orderId);
    }
}
