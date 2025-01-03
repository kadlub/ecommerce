package com.example.musify.controllers;

import com.example.musify.dto.ProductInputDto;
import com.example.musify.dto.ProductOutputDto;
import com.example.musify.entities.Products;
import com.example.musify.entities.Users;
import com.example.musify.repositories.UsersRepository;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final UsersRepository usersRepository;

    @Autowired
    public ProductController(ProductService productService, UsersRepository usersRepository) {
        this.productService = productService;
        this.usersRepository = usersRepository;
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
            @RequestParam(required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();

        UUID sellerId = usersRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                        .getUserId();

        productInputDto.setSellerId(sellerId);

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
            @RequestParam(required = false) List<String> categoryNames,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String condition) {
        logger.info("Fetching filtered products with categoryId: {}, priceMin: {}, priceMax: {}, condition: {}",
                categoryNames, priceMin, priceMax, condition);

        List<ProductOutputDto> filteredProducts = productService.findFilteredProductsByNames(categoryNames, priceMin, priceMax);

        if (filteredProducts.isEmpty()) {
            logger.info("No filtered products found for the given criteria");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(filteredProducts);
    }

    // Pobieranie produktów po nazwie kategorii
    @GetMapping("/by-category/{categoryName}")
    public ResponseEntity<List<ProductOutputDto>> getProductsByCategoryName(@PathVariable String categoryName) {
        String decodedCategoryName = java.net.URLDecoder.decode(categoryName, StandardCharsets.UTF_8);
        logger.info("Fetching products by category name: {}", decodedCategoryName);

        List<ProductOutputDto> products = productService.findProductsByCategoryName(decodedCategoryName);

        if (products.isEmpty()) {
            logger.info("No products found for category name: {}", decodedCategoryName);
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

    @GetMapping("/filter-by-id")
    public ResponseEntity<List<ProductOutputDto>> getFilteredProductsById(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String condition) {
        logger.info("Fetching filtered products by ID with categoryId: {}, priceMin: {}, priceMax: {}, condition: {}",
                categoryId, priceMin, priceMax, condition);

        List<ProductOutputDto> filteredProducts = productService.findFilteredProducts(categoryId, priceMin, priceMax, condition);

        if (filteredProducts.isEmpty()) {
            logger.info("No filtered products found for the given criteria");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(filteredProducts);
    }

    // Endpoint dla filtrowania po nazwach kategorii
    @GetMapping("/filter-by-name")
    public ResponseEntity<List<ProductOutputDto>> getFilteredProductsByName(
            @RequestParam List<String> categoryNames,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax) {
        logger.info("Fetching filtered products by name with categoryNames: {}, priceMin: {}, priceMax: {}",
                categoryNames, priceMin, priceMax);

        List<ProductOutputDto> filteredProducts = productService.findFilteredProductsByNames(categoryNames, priceMin, priceMax);

        if (filteredProducts.isEmpty()) {
            logger.info("No filtered products found for the given criteria");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(filteredProducts);
    }
}

