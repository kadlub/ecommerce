package com.example.musify.controllers;

import com.example.musify.entities.Products;
import com.example.musify.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Products> getAllProducts() {
        return productService.findAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Products> getProductById(@PathVariable UUID id) {
        return productService.findProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Products createProduct(@RequestBody Products product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProduct(@PathVariable UUID id, @RequestBody Products productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
