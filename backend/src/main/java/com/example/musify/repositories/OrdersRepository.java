package com.example.musify.repositories;

import com.example.musify.entities.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrdersRepository extends JpaRepository<Orders, UUID> {
}
