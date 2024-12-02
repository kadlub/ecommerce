package com.example.musify.services;

import com.example.musify.dto.OrderInputDto;
import com.example.musify.dto.OrderOutputDto;
import com.example.musify.entities.Orders;
import com.example.musify.entities.OrderItems;
import com.example.musify.entities.Products;
import com.example.musify.entities.Users;
import com.example.musify.repositories.OrdersRepository;
import com.example.musify.repositories.ProductsRepository;
import com.example.musify.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrdersRepository ordersRepository;
    private final ProductsRepository productsRepository;
    private final UsersRepository usersRepository;

    @Autowired
    public OrderService(OrdersRepository ordersRepository, UsersRepository usersRepository,ProductsRepository productsRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.productsRepository = productsRepository;
    }

    public List<OrderOutputDto> findAllOrders() {
        return ordersRepository.findAll()
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    public Optional<OrderOutputDto> findOrderById(UUID orderId) {
        return ordersRepository.findById(orderId)
                .map(this::convertToOutputDto);
    }

    public OrderOutputDto createOrder(OrderInputDto orderInputDto) {
        Users user = usersRepository.findById(orderInputDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Orders order = new Orders();
        order.setUser(user);
        order.setStatus("Pending");

        List<OrderItems> items = orderInputDto.getItems().stream().map(inputItem -> {
            Products product = productsRepository.findById(inputItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            return OrderItems.builder()
                    .product(product)
                    .price(product.getPrice())
                    .order(order)
                    .build();
        }).collect(Collectors.toList());

        order.setOrderItems(items);
        order.setTotalPrice(items.stream()
                .map(OrderItems::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        Orders savedOrder = ordersRepository.save(order);

        return convertToOutputDto(savedOrder);

    }

    public void deleteOrder(UUID orderId){
        if(!ordersRepository.existsById(orderId)){
            throw new RuntimeException("Order not found");
        }
        ordersRepository.deleteById(orderId);
    }

    private OrderOutputDto convertToOutputDto(Orders order){
        return OrderOutputDto.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .items(order.getOrderItems().stream().map(item -> OrderOutputDto.OrderItemOutputDto.builder()
                        .productId(item.getProduct().getProductId())
                        .productName(item.getProduct().getName())
                        .price(item.getProduct().getPrice())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
