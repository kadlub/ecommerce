package com.example.musify.services;

import com.example.musify.dto.ProductInputDto;
import com.example.musify.dto.ProductOutputDto;
import com.example.musify.entities.Categories;
import com.example.musify.entities.Products;
import com.example.musify.entities.Users;
import com.example.musify.repositories.CategoriesRepository;
import com.example.musify.repositories.ProductsRepository;
import com.example.musify.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductsRepository productsRepository;
    private final CategoriesRepository categoriesRepository;
    private final UsersRepository usersRepository;

    @Autowired
    public ProductService(ProductsRepository productsRepository, CategoriesRepository categoriesRepository, UsersRepository usersRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.usersRepository = usersRepository;
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

    public ProductOutputDto createProduct(ProductInputDto productInputDto) {
        Products product = convertToEntity(productInputDto);
        Products savedProduct = productsRepository.save(product);
        return convertToOutputDto(savedProduct);
    }

    public ProductOutputDto updateProduct(UUID productId, ProductInputDto productInputDto) {
        return productsRepository.findById(productId)
                .map(product -> {
                    product.setName(productInputDto.getName());
                    product.setDescription(productInputDto.getDescription());
                    product.setPrice(productInputDto.getPrice());
                    product.setCondition(productInputDto.getCondition());

                    // Ustawienie kategorii
                    Categories category = categoriesRepository.findById(productInputDto.getCategoryId())
                            .orElseThrow(() -> new RuntimeException("Category not found"));
                    product.setCategory(category);

                    // Ustawienie sprzedawcy
                    Users seller = usersRepository.findById(productInputDto.getSellerId())
                            .orElseThrow(() -> new RuntimeException("Seller not found"));
                    product.setSeller(seller);

                    Products updatedProduct = productsRepository.save(product);
                    return convertToOutputDto(updatedProduct);
                })
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void deleteProduct(UUID productId) {
        productsRepository.deleteById(productId);
    }

    private ProductOutputDto convertToOutputDto(Products product){
        return ProductOutputDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .condition(product.getCondition())
                .rating(product.getRating())
                .creationDate(product.getCreationDate())
                .categoryId(product.getCategory().getCategoryId())
                .categoryName(product.getCategory().getName())
                .sellerId(product.getSeller().getUserId())
                .sellerName(product.getSeller().getUsername())
                .build();
    }

    private Products convertToEntity(ProductInputDto productInputDto){
        Categories category = categoriesRepository.findById(productInputDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Users seller = usersRepository.findById(productInputDto.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        return Products.builder()
                .name(productInputDto.getName())
                .price(productInputDto.getPrice())
                .description(productInputDto.getDescription())
                .condition(productInputDto.getDescription())
                .condition(productInputDto.getCondition())
                .category(category)
                .seller(seller)
                .build();
    }
}
