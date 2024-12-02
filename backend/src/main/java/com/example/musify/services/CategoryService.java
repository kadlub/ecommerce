package com.example.musify.services;

import com.example.musify.dto.CategoryInputDto;
import com.example.musify.dto.CategoryOutputDto;
import com.example.musify.entities.Categories;
import com.example.musify.repositories.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public CategoryOutputDto createCategory(CategoryInputDto categoryInputDto){
        Categories category = Categories.builder()
                .name(categoryInputDto.getName())
                .description(categoryInputDto.getDescription())
                .build();

        Categories savedCategory = categoriesRepository.save(category);
        return convertToOutputDto(savedCategory);
    }

    private CategoryOutputDto convertToOutputDto(Categories category){
        return CategoryOutputDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
