package com.example.product_service.service;

import com.example.common.dto.CategoryInputDto;
import com.example.common.dto.CategoryOutputDto;
import com.example.common.entity.Categories;
import com.example.common.repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
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

    public List<UUID> getAllSubcategoryIds(UUID categoryId) {
        List<UUID> categoryIds = new ArrayList<>();
        categoryIds.add(categoryId);
        List<Categories> subcategories = categoriesRepository.findByParentCategory_CategoryId(categoryId);

        for (Categories subcategory : subcategories) {
            categoryIds.addAll(getAllSubcategoryIds(subcategory.getCategoryId()));
        }

        return categoryIds;
    }

    public List<CategoryOutputDto> getCategoryTree() {
        List<Categories> allCategories = categoriesRepository.findAll();

        // Mapa kategorii z kluczem jako ID
        Map<UUID, CategoryOutputDto> categoryMap = allCategories.stream()
                .collect(Collectors.toMap(
                        Categories::getCategoryId,
                        this::convertToOutputDto
                ));

        // Budowanie drzewa kategorii
        List<CategoryOutputDto> rootCategories = new ArrayList<>();
        for (Categories category : allCategories) {
            Categories parentCategory = category.getParentCategory();
            if (parentCategory == null) {
                // Jeśli nie ma nadrzędnej kategorii, to jest to kategoria główna
                rootCategories.add(categoryMap.get(category.getCategoryId()));
            } else {
                // Przypisz jako podkategorię
                CategoryOutputDto parentCategoryDto = categoryMap.get(parentCategory.getCategoryId());
                if (parentCategoryDto != null) {
                    parentCategoryDto.getSubcategories().add(categoryMap.get(category.getCategoryId()));
                }
            }
        }

        return rootCategories;
    }

    private List<CategoryOutputDto> findSubcategories(UUID parentCategoryId) {
        // Pobierz bezpośrednie podkategorie
        return categoriesRepository.findByParentCategory_CategoryId(parentCategoryId)
                .stream()
                .map(category -> {
                    // Konwertuj bieżącą kategorię do DTO
                    CategoryOutputDto dto = convertToOutputDto(category);

                    // Rekurencyjnie pobierz i ustaw podkategorie
                    dto.setSubcategories(findSubcategories(category.getCategoryId()));

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<CategoryOutputDto> findSubcategoriesByName(String parentCategoryName) {
        // Znajdź kategorię nadrzędną według nazwy
        Categories parentCategory = categoriesRepository.findByName(parentCategoryName)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono kategorii o nazwie: " + parentCategoryName));

        // Pobierz podkategorie rekurencyjnie
        return categoriesRepository.findByParentCategory_CategoryId(parentCategory.getCategoryId())
                .stream()
                .map(category -> {
                    CategoryOutputDto dto = convertToOutputDto(category);
                    // Ustawienie zagnieżdżonych podkategorii
                    dto.setSubcategories(findSubcategories(category.getCategoryId()));
                    return dto;
                })
                .collect(Collectors.toList());
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
                .subcategories(new ArrayList<>()) // Inicjalizujemy pustą listę podkategorii
                .build();
    }
}

