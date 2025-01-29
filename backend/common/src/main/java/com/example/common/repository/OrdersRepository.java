package com.example.common.repository;

import com.example.common.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, UUID> {

    // Sprawdź, czy produkt znajduje się w jakimkolwiek zamówieniu
    @Query("SELECT COUNT(oi) > 0 FROM OrderItems oi WHERE oi.product.productId = :productId")
    boolean isProductInAnyOrder(@Param("productId") UUID productId);

    // Pobierz zamówienia dla kupującego
    @Query("SELECT o FROM Orders o WHERE o.user.userId = :userId")
    List<Orders> findByUser_UserId(@Param("userId") UUID userId);

    // Pobierz zamówienia dla sprzedawcy
    @Query("SELECT DISTINCT o FROM Orders o JOIN o.orderItems oi WHERE oi.product.seller.userId = :sellerId")
    List<Orders> findByItems_Product_Seller_UserId(@Param("sellerId") UUID sellerId);

    List<Orders> findByStatus(String status);
}
