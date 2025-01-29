package com.example.product_service.service;

import com.example.common.dto.ProductInputDto;
import com.example.common.dto.ProductOutputDto;
import com.example.common.entity.Categories;
import com.example.common.entity.ProductImages;
import com.example.common.entity.Products;
import com.example.common.entity.Users;
import com.example.common.repository.CategoriesRepository;
import com.example.common.repository.ProductImagesRepository;
import com.example.common.repository.ProductsRepository;
import com.example.common.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
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

    public List<ProductOutputDto> findAllAvailableProducts() {
        return productsRepository.findAllAvailableProducts()
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    // Oznaczenie produktu jako sprzedanego
    public boolean markAsSold(UUID productId) {
        Optional<Products> productOpt = productsRepository.findById(productId);
        if (productOpt.isPresent()) {
            Products product = productOpt.get();
            if (product.isSold()) {
                return false; // Produkt już sprzedany
            }
            product.setSold(true);
            productsRepository.save(product);
            return true;
        }
        return false;
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
                .filter(product -> !product.isSold())
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
                .filter(product -> !product.isSold())
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductOutputDto createProduct(ProductInputDto productInputDto) {
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
                .slug(generateUniqueSlug(productInputDto.getName()))
                .build();

        Products savedProduct = productsRepository.save(product);

        if (!Boolean.TRUE.equals(seller.getIsSeller())) {
            seller.setIsSeller(true);
            usersRepository.save(seller);
        }

        return convertToOutputDto(savedProduct);
    }

    public Optional<ProductOutputDto> findProductBySlug(String slug) {
        return productsRepository.findBySlug(slug)
                .map(this::convertToOutputDto);
    }

    private String generateUniqueSlug(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }

        String baseSlug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");

        String uniqueSlug = baseSlug;
        int counter = 1;

        while (productsRepository.existsBySlug(uniqueSlug)) {
            uniqueSlug = baseSlug + "-" + counter;
            counter++;
        }

        return uniqueSlug;
    }

    public ProductOutputDto updateProduct(UUID productId, ProductInputDto productInputDto) {
        return productsRepository.findById(productId)
                .map(product -> {
                    product.setName(productInputDto.getName());
                    product.setDescription(productInputDto.getDescription());
                    product.setPrice(productInputDto.getPrice());
                    product.setCondition(productInputDto.getCondition());

                    // Znajdź kategorię i ustaw, jeśli jest przekazana
                    if (productInputDto.getCategoryId() != null) {
                        Categories category = categoriesRepository.findById(productInputDto.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found"));
                        product.setCategory(category);
                    }

                    // Aktualizacja sluga jeśli nazwa produktu została zmieniona
                    if (!product.getName().equals(productInputDto.getName())) {
                        product.setSlug(generateUniqueSlug(productInputDto.getName()));
                    }

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

    public List<ProductOutputDto> findProductsByCategory(UUID categoryId) {
        List<UUID> categoryIds = getAllSubcategoryIds(categoryId);

        return productsRepository.findByCategory_CategoryIdIn(categoryIds)
                .stream()
                .map(this::convertToOutputDto)
                .filter(product -> !product.isSold())
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

    public List<ProductOutputDto> findFilteredProductsByNames(List<String> categoryNames, BigDecimal priceMin, BigDecimal priceMax, String condition) {
        // Pobierz wszystkie kategorie na podstawie nazw
        List<UUID> categoryIds = categoriesRepository.findByNameIn(categoryNames)
                .stream()
                .flatMap(category -> getAllSubcategoryIds(category.getCategoryId()).stream())
                .distinct()
                .collect(Collectors.toList());

        Specification<Products> spec = Specification.where(null);

        if (!categoryIds.isEmpty()) {
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
        if (condition != null && !condition.isBlank()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("condition"), condition));
        }

        // Warunek wykluczający sprzedane produkty
        spec = spec.and((root, query, criteriaBuilder) ->
                criteriaBuilder.isFalse(root.get("isSold")));

        return productsRepository.findAll(spec)
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    public List<ProductOutputDto> getUserProducts(String username) {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return productsRepository.findBySeller_UserId(user.getUserId())
                .stream()
                .sorted(Comparator.comparing(Products::isSold).reversed()
                        .thenComparing(Products::getCreationDate).reversed())
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    private ProductOutputDto convertToOutputDto(Products product) {
        // Sprawdzenie, czy productImages nie jest null i operowanie na liście
        List<String> imageUrls = (product.getProductImages() != null)
                ? product.getProductImages().stream()
                .map(ProductImages::getUrl)
                .collect(Collectors.toList())
                : Collections.emptyList();

        return ProductOutputDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .condition(product.getCondition())
                .creationDate(product.getCreationDate())
                .imageUrl(imageUrls.isEmpty() ? null : imageUrls.get(0)) // Pierwszy obraz jako domyślny, null jeśli brak
                .imageUrls(imageUrls) // Pełna lista obrazów
                .categoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .sellerId(product.getSeller() != null ? product.getSeller().getUserId() : null)
                .sellerName(product.getSeller() != null ? product.getSeller().getUsername() : null)
                .slug(product.getSlug())
                .isSold(product.isSold())
                .build();
    }
}