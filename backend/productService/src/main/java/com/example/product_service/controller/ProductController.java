package com.example.product_service.controller;

import com.example.common.dto.ProductInputDto;
import com.example.common.dto.ProductOutputDto;
import com.example.common.entity.Products;
import com.example.common.entity.Users;
import com.example.common.repository.*;
import com.example.product_service.service.ProductService;
import com.example.common.repository.UsersRepository;
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

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
//@CrossOrigin
public class ProductController {

    private final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final UsersRepository usersRepository;

    @Autowired
    public ProductController(ProductService productService, UsersRepository usersRepository) {
        this.productService = productService;
        this.usersRepository = usersRepository;
    }

    // Pobieranie wszystkich dostępnych produktów
    @GetMapping
    public ResponseEntity<List<ProductOutputDto>> getAllAvailableProducts() {
        logger.info("Fetching all available products");
        List<ProductOutputDto> products = productService.findAllAvailableProducts();

        if (products.isEmpty()) {
            logger.info("No available products found");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    // Pobieranie produktów z opcjonalnym filtrowaniem po kategorii
    @GetMapping("/all")
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

    @GetMapping("/my-products")
    public ResponseEntity<List<ProductOutputDto>> getUserProducts(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        logger.info("Fetching products for user: {}", username);

        List<ProductOutputDto> userProducts = productService.getUserProducts(username);

        if (userProducts.isEmpty()) {
            logger.info("No products found for user: {}", username);
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(userProducts);
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
            @RequestParam List<String> categoryNames,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) String condition) {
        logger.info("Fetching filtered products with categoryNames: {}, priceMin: {}, priceMax: {}, condition: {}",
                categoryNames, priceMin, priceMax, condition);

        List<ProductOutputDto> filteredProducts = productService.findFilteredProductsByNames(categoryNames, priceMin, priceMax, condition);

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

    @PostMapping("/api/uploads/products")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get("/uploads/products");
            Files.copy(file.getInputStream(), uploadPath.resolve(file.getOriginalFilename()));
            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }

}
// Endpoint dla filtrowania po nazwach kategorii
    /*@GetMapping("/filter-by-name")
    public ResponseEntity<List<ProductOutputDto>> getFilteredProductsByName(
            @RequestParam List<String> categoryNames,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax),
            @RequestParam(required = false) String condition) {
        logger.info("Fetching filtered products by name with categoryNames: {}, priceMin: {}, priceMax: {}, condition: {}",
                categoryNames, priceMin, priceMax, condition);

        List<ProductOutputDto> filteredProducts = productService.findFilteredProductsByNames(categoryNames, priceMin, priceMax, condition);

        if (filteredProducts.isEmpty()) {
            logger.info("No filtered products found for the given criteria");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(filteredProducts);
    }*/

