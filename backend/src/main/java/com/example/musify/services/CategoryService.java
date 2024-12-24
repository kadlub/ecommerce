package com.example.musify.services;

import com.example.musify.dto.CategoryInputDto;
import com.example.musify.dto.CategoryOutputDto;
import com.example.musify.entities.Categories;
import com.example.musify.repositories.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoriesRepository categoriesRepository;

    @Autowired
    public CategoryService(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }

    public List<CategoryOutputDto> findAllCategories() {
        return categoriesRepository.findAll()
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    public Optional<CategoryOutputDto> findCategoryById(UUID categoryId) {
        return categoriesRepository.findById(categoryId)
                .map(this::convertToOutputDto);
    }

    public CategoryOutputDto createCategory(CategoryInputDto categoryInputDto) {
        Categories parentCategory = null;
        if (categoryInputDto.getParentCategoryId() != null) {
            parentCategory = categoriesRepository.findById(categoryInputDto.getParentCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
        }

        Categories category = Categories.builder()
                .name(categoryInputDto.getName())
                .description(categoryInputDto.getDescription())
                .parentCategory(parentCategory)
                .build();

        Categories savedCategory = categoriesRepository.save(category);
        return convertToOutputDto(savedCategory);
    }

    private CategoryOutputDto convertToOutputDto(Categories category) {
        return CategoryOutputDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .parentCategoryId(
                        category.getParentCategory() != null
                                ? category.getParentCategory().getCategoryId()
                                : null
                )
                .build();
    }
}
