package com.example.order_service.service;

import com.example.common.dto.OrderInputDto;
import com.example.common.dto.OrderNotificationRequest;
import com.example.common.dto.OrderOutputDto;
import com.example.common.entity.Orders;
import com.example.common.entity.OrderItems;
import com.example.common.entity.Products;
import com.example.common.entity.Users;
import com.example.common.repository.OrdersRepository;
import com.example.common.repository.ProductsRepository;
import com.example.common.repository.UsersRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

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
    private final RestTemplate restTemplate;

    @Autowired
    public OrderService(OrdersRepository ordersRepository, UsersRepository usersRepository,
                        ProductsRepository productsRepository, RestTemplate restTemplate) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.productsRepository = productsRepository;
        this.restTemplate = restTemplate;
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

    public List<OrderOutputDto> findOrdersByUsername(String username) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ordersRepository.findByUser_UserId(user.getUserId()).stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    // Utwórz nowe zamówienie
    @Transactional
    public OrderOutputDto createOrder(OrderInputDto orderInputDto) {
        Users buyer = usersRepository.findByUsername(orderInputDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Orders order = new Orders();
        order.setUser(buyer);
        order.setStatus("W realizacji"); // Ustawienie początkowego statusu
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

        sendNotifications(savedOrder);

        return convertToOutputDto(savedOrder);
    }

    private void sendNotifications(Orders order) {
        // Pobierz token z aktualnego kontekstu HTTP
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String jwtToken = attributes.getRequest().getHeader("Authorization");

        order.getOrderItems().forEach(item -> {
            Products product = item.getProduct();
            Users seller = product.getSeller();

            OrderNotificationRequest notificationRequest = OrderNotificationRequest.builder()
                    .buyerEmail(order.getUser().getEmail())
                    .sellerEmail(seller.getEmail())
                    .productName(product.getName())
                    .deliveryDetails(order.getCity() + ", " + order.getStreet() + " " + order.getBuildingNumber())
                    .totalPrice(order.getTotalPrice().toString())
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", jwtToken); // Dodaj token do nagłówka

            HttpEntity<OrderNotificationRequest> requestEntity = new HttpEntity<>(notificationRequest, headers);

            restTemplate.postForObject(
                    "http://notificationservice:8085/api/notifications/order-confirmation",
                    requestEntity,
                    Void.class
            );
        });
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

    // Automatyczna zmiana statusów zamówień
    @Scheduled(fixedRate = 60000) // Co 1 minutę
    @Transactional
    public void updateOrderStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Zamówienia "Przyjęte" zmieniają się na "W dostawie" po 1 godzinie
        ordersRepository.findByStatus("W realizacji").forEach(order -> {
            if (order.getCreatedAt().plusHours(1).isBefore(now)) {
                order.setStatus("W dostawie");
                ordersRepository.save(order);
            }
        });

        // Zamówienia "W dostawie" zmieniają się na "Dostarczone" w dniu dostawy
        ordersRepository.findByStatus("W dostawie").forEach(order -> {
            if (order.getDeliveryDate().toLocalDate().isEqual(now.toLocalDate())) {
                order.setStatus("Dostarczone");
                ordersRepository.save(order);
            }
        });
    }

    // Walidacja statusu zamówienia
    private boolean isValidStatus(String status) {
        return List.of("W realizacji", "W dostawie", "Dostarczone")
                .stream()
                .anyMatch(validStatus -> validStatus.equalsIgnoreCase(status));
    }

    // Konwersja encji na DTO
    private OrderOutputDto convertToOutputDto(Orders order) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return OrderOutputDto.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .buyerName(order.getUser().getUsername())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .deliveryDate(order.getDeliveryDate().format(formatter))
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
