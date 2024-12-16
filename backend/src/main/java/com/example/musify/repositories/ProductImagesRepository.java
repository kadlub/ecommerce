package com.example.musify.repositories;

import com.example.musify.entities.ProductImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductImagesRepository extends JpaRepository<ProductImages, UUID> {
    // Custom method to fetch images by product ID
    List<ProductImages> findByProduct_ProductId(UUID productId);
}
