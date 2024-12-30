package com.example.musify.controllers;

import com.example.musify.dto.ProductInputDto;
import com.example.musify.dto.ProductOutputDto;
import com.example.musify.security.CustomUserDetails;
import com.example.musify.services.ProductService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
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
        logger.info("Fetching products with categoryId: {}", categoryId);

        List<ProductOutputDto> products = (categoryId != null)
                ? productService.findProductsByCategory(categoryId)
                : productService.findAllProducts();

        if (products.isEmpty()) {
            logger.info("No products found for categoryId: {}", categoryId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductOutputDto> getProductById(@PathVariable UUID id) {
        logger.info("Fetching product with id: {}", id);

        return productService.findProductById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Product with id: {} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductOutputDto> createProduct(
            @RequestPart("product") @Valid ProductInputDto productInputDto,
            @RequestPart("images") List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {

        logger.info("Received request to create product with input: {}", productInputDto);

        UUID userId = customUserDetails.getUserId();
        String username = customUserDetails.getUsername();

        logger.debug("Extracted userId: {} and username: {}", userId, username);

        try {
            // Ustawienie `sellerId` w DTO
            productInputDto.setSellerId(userId);

            // Wywołanie usługi tworzenia produktu
            ProductOutputDto createdProduct = productService.createProduct(productInputDto, images, customUserDetails);

            logger.info("Product created successfully with ID: {}", createdProduct.getProductId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);

        } catch (Exception e) {
            logger.error("An unexpected error occurred while creating product: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<ProductOutputDto> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductInputDto productInputDto) {
        logger.info("Updating product with id: {}, input: {}", id, productInputDto);

        return productService.findProductById(id)
                .map(product -> {
                    ProductOutputDto updatedProduct = productService.updateProduct(id, productInputDto);
                    return ResponseEntity.ok(updatedProduct);
                })
                .orElseGet(() -> {
                    logger.warn("Product with id: {} not found for update", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        logger.info("Deleting product with id: {}", id);

        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            logger.info("Product with id: {} successfully deleted", id);
            return ResponseEntity.noContent().build();
        } else {
            logger.warn("Product with id: {} not found for deletion", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductOutputDto>> getFilteredProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String condition) {
        logger.info("Fetching filtered products with categoryId: {}, priceMin: {}, priceMax: {}, condition: {}",
                categoryId, priceMin, priceMax, condition);

        List<ProductOutputDto> filteredProducts = productService.findFilteredProducts(categoryId, priceMin, priceMax, condition);

        if (filteredProducts.isEmpty()) {
            logger.info("No filtered products found for the given criteria");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(filteredProducts);
    }

    @GetMapping("/by-category/{categoryName}")
    public ResponseEntity<List<ProductOutputDto>> getProductsByCategoryName(@PathVariable String categoryName) {
        logger.info("Fetching products by category name: {}", categoryName);

        List<ProductOutputDto> products = productService.findProductsByCategoryName(categoryName);

        if (products.isEmpty()) {
            logger.info("No products found for category name: {}", categoryName);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductOutputDto> getProductBySlug(@PathVariable String slug) {
        logger.info("Fetching product by slug: {}", slug);

        return productService.findProductBySlug(slug)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Product with slug: {} not found", slug);
                    return ResponseEntity.notFound().build();
                });
    }
}
