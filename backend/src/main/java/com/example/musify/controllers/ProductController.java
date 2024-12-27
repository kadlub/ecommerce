package com.example.musify.controllers;

import com.example.musify.dto.ProductInputDto;
import com.example.musify.dto.ProductOutputDto;
import com.example.musify.entities.Products;
import com.example.musify.services.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductOutputDto>> getProducts(
            @RequestParam(required = false) UUID categoryId) {
        logger.debug("Fetching products with categoryId: {}", categoryId);

        List<ProductOutputDto> products = (categoryId != null) ?
                productService.findProductsByCategory(categoryId) :
                productService.findAllProducts();

        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductOutputDto> getProductById(@PathVariable UUID id) {
        logger.debug("Fetching product with id: {}", id);

        return productService.findProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductOutputDto> createProduct(@Valid @RequestBody ProductInputDto productInputDto) {
        logger.debug("Creating product with input: {}", productInputDto);

        ProductOutputDto createdProduct = productService.createProduct(productInputDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductOutputDto> updateProduct(@PathVariable UUID id, @Valid @RequestBody ProductInputDto productInputDto) {
        logger.debug("Updating product with id: {}, input: {}", id, productInputDto);

        ProductOutputDto updatedProduct = productService.updateProduct(id, productInputDto);
        return ResponseEntity.ok(updatedProduct);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        logger.debug("Deleting product with id: {}", id);

        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductOutputDto>> getFilteredProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String condition) {
        logger.debug("Fetching filtered products with categoryId: {}, priceMin: {}, priceMax: {}, condition: {}",
                categoryId, priceMin, priceMax, condition);

        List<ProductOutputDto> filteredProducts = productService.findFilteredProducts(categoryId, priceMin, priceMax, condition);

        if (filteredProducts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(filteredProducts);
    }

    @GetMapping("/by-category/{categoryName}")
    public ResponseEntity<List<ProductOutputDto>> getProductsByCategoryName(@PathVariable String categoryName) {
        logger.debug("Fetching products by category name: {}", categoryName);

        List<ProductOutputDto> products = productService.findProductsByCategoryName(categoryName);

        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductOutputDto> getProductBySlug(@PathVariable String slug) {
        logger.debug("Fetching product by slug: {}", slug);

        return productService.findProductBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
