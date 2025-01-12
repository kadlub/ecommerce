package com.example.product_service.controller;

import com.example.common.dto.CategoryInputDto;
import com.example.common.dto.CategoryOutputDto;
import com.example.product_service.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
//@CrossOrigin
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryOutputDto> getAllCategories() {
        return categoryService.findAllCategories();
    }

    @PostMapping
    public CategoryOutputDto createCategory(@Valid @RequestBody CategoryInputDto categoryInputDto) {
        return categoryService.createCategory(categoryInputDto);
    }

    @GetMapping("/tree")
    public List<CategoryOutputDto> getCategoryTree() {
        return categoryService.getCategoryTree();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryOutputDto> getCategoryById(@PathVariable UUID id) {
        return categoryService.findCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name/{name}/subcategories")
    public List<CategoryOutputDto> getSubcategoriesByName(@PathVariable String name) {
        return categoryService.findSubcategoriesByName(name);
    }

}
