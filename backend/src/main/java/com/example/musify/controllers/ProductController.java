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
import org.springframework.http.MediaType;
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

    // Pobieranie produktów z opcjonalnym filtrowaniem po kategorii
    @GetMapping
    public ResponseEntity<List<ProductOutputDto>> getProducts(
            @RequestParam(required = false) UUID categoryId) {
        logger.info("Fetching products with categoryId: {}", categoryId);

        List<ProductOutputDto> products = (categoryId != null) ?
                productService.findProductsByCategory(categoryId) :
                productService.findAllProducts();

        if (products.isEmpty()) {
            logger.info("No products found for categoryId: {}", categoryId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    // Pobieranie produktu po ID
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

    // Tworzenie produktu - uwzględnia zalogowanego użytkownika jako sprzedawcę
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductOutputDto> createProduct(
            @Valid @ModelAttribute ProductInputDto productInputDto,
            @RequestParam(required = false) List<MultipartFile> images) {
        logger.info("Creating product with input: {}", productInputDto);

        // Tworzenie produktu w serwisie
        ProductOutputDto createdProduct = productService.createProduct(productInputDto);

        // Jeśli przesłano obrazy, zapisz je
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                productService.uploadProductImage(createdProduct.getProductId(), image, "Default alt text");
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    // Aktualizacja istniejącego produktu
    @PutMapping("/{id}")
    public ResponseEntity<ProductOutputDto> updateProduct(@PathVariable UUID id, @Valid @RequestBody ProductInputDto productInputDto) {
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

    // Usuwanie produktu
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

    // Pobieranie produktów z filtrami
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

    // Pobieranie produktów po nazwie kategorii
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

    // Pobieranie produktu po slug
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
