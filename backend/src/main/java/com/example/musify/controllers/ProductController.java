package com.example.musify.controllers;

import com.example.musify.dto.ProductInputDto;
import com.example.musify.dto.ProductOutputDto;
import com.example.musify.entities.Products;
import com.example.musify.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    // Upload image for a product
    @PostMapping("/{productId}/images")
    public ResponseEntity<String> uploadProductImage(
            @PathVariable UUID productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText) {
        productService.uploadProductImage(productId, file, altText);
        return ResponseEntity.ok("Image uploaded successfully");
    }

    // Retrieve all image URLs for a product
    @GetMapping("/{productId}/images")
    public ResponseEntity<List<String>> getProductImages(@PathVariable UUID productId) {
        List<String> imageUrls = productService.getProductImages(productId);
        return ResponseEntity.ok(imageUrls);
    }

    // Serve an image file by filename
    @GetMapping("/images/{fileName}")
    public ResponseEntity<byte[]> getImageFile(@PathVariable String fileName) {
        byte[] image = productService.getImageFile(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Adjust MIME type if necessary
        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }

    @GetMapping
    public List<ProductOutputDto> getAllProducts() {
        return productService.findAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductOutputDto> getProductById(@PathVariable UUID id) {
        return productService.findProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductOutputDto createProduct(@Valid @RequestBody ProductInputDto productInputDto) {
        return productService.createProduct(productInputDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductOutputDto> updateProduct(@PathVariable UUID id, @Valid @RequestBody ProductInputDto productInputDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productInputDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}

