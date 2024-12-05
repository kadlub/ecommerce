package com.example.musify.repositories;

import com.example.musify.entities.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, UUID> {

    @Query("SELECT COUNT(oi) > 0 FROM OrderItems oi WHERE oi.product.productId = :productId")
    boolean isProductInAnyOrder(@Param("productId") UUID productId);
}
