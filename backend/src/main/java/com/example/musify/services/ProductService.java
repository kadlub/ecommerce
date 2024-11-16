package com.example.musify.services;

import com.example.musify.entities.Products;
import com.example.musify.repositories.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductsRepository productsRepository;

    @Autowired
    public ProductService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }

    public List<Products> findAllProducts() {
        return productsRepository.findAll();
    }

    public Optional<Products> findProductById(UUID productId) {
        return productsRepository.findById(productId);
    }

    public Products createProduct(Products product) {
        return productsRepository.save(product);
    }

    public Products updateProduct(UUID productId, Products productDetails) {
        return productsRepository.findById(productId)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setPrice(productDetails.getPrice());
                    product.setCondition(productDetails.getCondition());
                    return productsRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void deleteProduct(UUID productId) {
        productsRepository.deleteById(productId);
    }
}
