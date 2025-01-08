package com.example.common.repository;

import com.example.common.entity.ProductImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductImagesRepository extends JpaRepository<ProductImages, UUID> {
    // Custom method to fetch images by product ID
    List<ProductImages> findByProduct_ProductId(UUID productId);
}
