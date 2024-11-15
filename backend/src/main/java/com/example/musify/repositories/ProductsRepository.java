package com.example.musify.repositories;

import com.example.musify.entities.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductsRepository extends JpaRepository<Products, UUID> {
}
