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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    public OrderService(OrdersRepository ordersRepository, UsersRepository usersRepository, ProductsRepository productsRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.productsRepository = productsRepository;
    }

    // Pobierz wszystkie zamówienia
    public List<OrderOutputDto> findAllOrders() {
        return ordersRepository.findAll()
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    // Pobierz zamówienie po ID
    public Optional<OrderOutputDto> findOrderById(UUID orderId) {
        return ordersRepository.findById(orderId)
                .map(this::convertToOutputDto);
    }

    // Utwórz nowe zamówienie
    public OrderOutputDto createOrder(OrderInputDto orderInputDto) {
        Users buyer = usersRepository.findById(orderInputDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Orders order = new Orders();
        order.setUser(buyer);
        order.setStatus("Pending");
        order.setPaymentMethod(orderInputDto.getPaymentMethod());

        LocalDateTime deliveryDate = LocalDateTime.parse(orderInputDto.getDeliveryDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        order.setDeliveryDate(deliveryDate);

        order.setCity(orderInputDto.getDeliveryAddress().getCity());
        order.setStreet(orderInputDto.getDeliveryAddress().getStreet());
        order.setBuildingNumber(orderInputDto.getDeliveryAddress().getBuildingNumber());
        order.setApartmentNumber(orderInputDto.getDeliveryAddress().getApartmentNumber());
        order.setZipCode(orderInputDto.getDeliveryAddress().getZipCode());

        List<OrderItems> items = orderInputDto.getItems().stream().map(inputItem -> {
            Products product = productsRepository.findById(inputItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.isSold()) {
                throw new RuntimeException("Product is already sold");
            }

            // Oznacz produkt jako sprzedany
            product.setSold(true);
            productsRepository.save(product);

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

    // Usuń zamówienie
    public void deleteOrder(UUID orderId) {
        if (!ordersRepository.existsById(orderId)) {
            throw new RuntimeException("Order not found");
        }
        ordersRepository.deleteById(orderId);
    }

    // Zmień status zamówienia
    public OrderOutputDto updateOrderStatus(UUID orderId, String newStatus) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Walidacja statusu
        if (!isValidStatus(newStatus)) {
            throw new RuntimeException("Invalid status");
        }

        order.setStatus(newStatus);
        Orders updatedOrder = ordersRepository.save(order);

        return convertToOutputDto(updatedOrder);
    }

    // Pobierz zamówienia kupującego
    public List<OrderOutputDto> findOrdersByUser(UUID userId) {
        return ordersRepository.findByUser_UserId(userId).stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    // Pobierz zamówienia sprzedawcy
    public List<OrderOutputDto> findOrdersBySeller(UUID sellerId) {
        return ordersRepository.findByItems_Product_Seller_UserId(sellerId).stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    // Walidacja statusu zamówienia
    private boolean isValidStatus(String status) {
        return List.of("Pending", "Completed", "Cancelled")
                .stream()
                .anyMatch(validStatus -> validStatus.equalsIgnoreCase(status));
    }

    // Konwersja encji na DTO
    private OrderOutputDto convertToOutputDto(Orders order) {
        // Formatter for converting LocalDateTime to String
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return OrderOutputDto.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .buyerName(order.getUser().getUsername())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .deliveryDate(order.getDeliveryDate().format(formatter)) // Convert LocalDateTime to String
                .paymentMethod(order.getPaymentMethod())
                .deliveryAddress(OrderOutputDto.DeliveryAddressDto.builder()
                        .city(order.getCity())
                        .street(order.getStreet())
                        .buildingNumber(order.getBuildingNumber())
                        .apartmentNumber(order.getApartmentNumber())
                        .zipCode(order.getZipCode())
                        .build())
                .items(order.getOrderItems().stream().map(item -> OrderOutputDto.OrderItemOutputDto.builder()
                        .productId(item.getProduct().getProductId())
                        .productName(item.getProduct().getName())
                        .price(item.getPrice())
                        .sellerId(item.getProduct().getSeller().getUserId())
                        .sellerName(item.getProduct().getSeller().getUsername())
                        .build()).collect(Collectors.toList()))
                .build();
    }

}
