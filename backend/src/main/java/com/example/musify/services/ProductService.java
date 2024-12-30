package com.example.musify.services;

import com.example.musify.dto.ProductInputDto;
import com.example.musify.dto.ProductOutputDto;
import com.example.musify.entities.Categories;
import com.example.musify.entities.ProductImages;
import com.example.musify.entities.Products;
import com.example.musify.entities.Users;
import com.example.musify.repositories.CategoriesRepository;
import com.example.musify.repositories.ProductImagesRepository;
import com.example.musify.repositories.ProductsRepository;
import com.example.musify.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductsRepository productsRepository;
    private final CategoriesRepository categoriesRepository;
    private final UsersRepository usersRepository;
    private final ProductImagesRepository productImagesRepository;
    private final String uploadDir = "uploads/products";

    @Autowired
    public ProductService(
            ProductsRepository productsRepository,
            CategoriesRepository categoriesRepository,
            UsersRepository usersRepository,
            ProductImagesRepository productImagesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.usersRepository = usersRepository;
        this.productImagesRepository = productImagesRepository;

        // Create the upload directory if it doesn't exist
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }
    }

    public void uploadProductImage(UUID productId, MultipartFile imageFile, String altText) {
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String fileName = productId + "_" + UUID.randomUUID() + ".jpg";
        Path imagePath = Paths.get(uploadDir, fileName);
        try {
            Files.write(imagePath, imageFile.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save product image", e);
        }

        ProductImages productImage = ProductImages.builder()
                .product(product)
                .url(fileName)
                .altText(altText)
                .build();

        productImagesRepository.save(productImage);
    }

    public List<String> getProductImages(UUID productId) {
        return productImagesRepository.findByProduct_ProductId(productId)
                .stream()
                .map(ProductImages::getUrl)
                .collect(Collectors.toList());
    }

    public byte[] getImageFile(String fileName) {
        Path imagePath = Paths.get(uploadDir, fileName);
        try {
            return Files.readAllBytes(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Image not found", e);
        }
    }

    public List<ProductOutputDto> findAllProducts() {
        return productsRepository.findAll()
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    public Optional<ProductOutputDto> findProductById(UUID productId) {
        return productsRepository.findById(productId)
                .map(this::convertToOutputDto);
    }

    public List<ProductOutputDto> findFilteredProducts(UUID categoryId, BigDecimal priceMin, BigDecimal priceMax, String condition) {
        Specification<Products> spec = Specification.where(null);

        if (categoryId != null) {
            List<UUID> categoryIds = getAllSubcategoryIds(categoryId);
            spec = spec.and((root, query, criteriaBuilder) -> root.get("category").get("categoryId").in(categoryIds));
        }
        if (priceMin != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("price"), priceMin));
        }
        if (priceMax != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("price"), priceMax));
        }
        if (condition != null) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("condition"), condition));
        }

        return productsRepository.findAll(spec)
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    public List<ProductOutputDto> findProductsByCategoryName(String categoryName) {
        // Pobierz kategorię na podstawie nazwy
        Categories category = categoriesRepository.findByName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Pobierz wszystkie ID podkategorii (rekurencyjnie)
        List<UUID> categoryIds = getAllSubcategoryIds(category.getCategoryId());

        // Pobierz produkty z kategorii i ich podkategorii
        return productsRepository.findByCategory_CategoryIdIn(categoryIds)
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductOutputDto createProduct(ProductInputDto productInputDto, List<MultipartFile> images, UserDetails userDetails) {
        Categories category = categoriesRepository.findById(productInputDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Users seller = usersRepository.findById(productInputDto.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Products product = Products.builder()
                .name(productInputDto.getName())
                .price(productInputDto.getPrice())
                .description(productInputDto.getDescription())
                .condition(productInputDto.getCondition())
                .category(category)
                .seller(seller)
                .build();

        // Zapisujemy produkt do bazy danych
        Products savedProduct = productsRepository.save(product);

        // Zapis zdjęć
        for (int i = 0; i < images.size(); i++) {
            MultipartFile image = images.get(i);
            String imageUrl = saveImageToStorage(image);

            ProductImages productImage = ProductImages.builder()
                    .product(savedProduct)
                    .url(imageUrl)
                    .isPrimary(i == 0) // Pierwsze zdjęcie jest główne
                    .build();

            productImagesRepository.save(productImage);
        }

        if (!Boolean.TRUE.equals(seller.getIsSeller())) {
            seller.setIsSeller(true);
            usersRepository.save(seller);
        }

        return convertToOutputDto(savedProduct);
    }

    public Optional<ProductOutputDto> findProductBySlug(String slug) {
        return productsRepository.findBySlug(slug) // Musisz dodać odpowiednią metodę w repository
                .map(this::convertToOutputDto);
    }

    public ProductOutputDto updateProduct(UUID productId, ProductInputDto productInputDto) {
        return productsRepository.findById(productId)
                .map(product -> {
                    product.setName(productInputDto.getName());
                    product.setDescription(productInputDto.getDescription());
                    product.setPrice(productInputDto.getPrice());
                    product.setCondition(productInputDto.getCondition());

                    Categories category = categoriesRepository.findById(productInputDto.getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found"));
                    product.setCategory(category);

                    Users seller = usersRepository.findById(productInputDto.getSellerId())
                            .orElseThrow(() -> new RuntimeException("Seller not found"));
                    product.setSeller(seller);

                    return convertToOutputDto(productsRepository.save(product));
                })
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public boolean deleteProduct(UUID productId) {
        Optional<Products> product = productsRepository.findById(productId);
        if (product.isPresent()) {
            productsRepository.delete(product.get());
            return true; // Produkt został usunięty
        }
        return false; // Produkt nie istnieje
    }

    private String saveImageToStorage(MultipartFile file) {
        try {
            // Tworzenie unikalnej nazwy pliku
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, filename);

            // Tworzenie katalogu, jeśli nie istnieje
            Files.createDirectories(filePath.getParent());

            // Zapis pliku na dysk
            Files.write(filePath, file.getBytes());

            return "/uploads/products/" + filename; // Ścieżka URL do zapisanego pliku
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image to storage", e);
        }
    }

    public List<ProductOutputDto> findProductsByCategory(UUID categoryId) {
        List<UUID> categoryIds = getAllSubcategoryIds(categoryId);

        return productsRepository.findByCategory_CategoryIdIn(categoryIds)
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    private List<UUID> getAllSubcategoryIds(UUID categoryId) {
        List<UUID> categoryIds = new ArrayList<>();
        categoryIds.add(categoryId);

        List<Categories> subcategories = categoriesRepository.findByParentCategory_CategoryId(categoryId);
        for (Categories subcategory : subcategories) {
            categoryIds.addAll(getAllSubcategoryIds(subcategory.getCategoryId()));
        }

        return categoryIds;
    }

    private ProductOutputDto convertToOutputDto(Products product) {
        List<ProductImages> productImages = product.getProductImages();

        // Szukamy głównego zdjęcia
        String mainImageUrl = productImages.stream()
                .filter(ProductImages::isPrimary)
                .map(ProductImages::getUrl)
                .findFirst()
                .orElse(null);

        List<String> allImageUrls = productImages.stream()
                .map(ProductImages::getUrl)
                .collect(Collectors.toList());

        return ProductOutputDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .condition(product.getCondition())
                .creationDate(product.getCreationDate())
                .imageUrl(mainImageUrl) // Główne zdjęcie
                .imageUrls(allImageUrls) // Wszystkie zdjęcia
                .categoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .sellerId(product.getSeller() != null ? product.getSeller().getUserId() : null)
                .sellerName(product.getSeller() != null ? product.getSeller().getUsername() : null)
                .slug(product.getSlug())
                .build();
    }
}
