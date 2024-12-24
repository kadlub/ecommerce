package com.example.musify.controllers;

import com.example.musify.dto.CategoryInputDto;
import com.example.musify.dto.CategoryOutputDto;
import com.example.musify.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@CrossOrigin
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

    @GetMapping("/{id}")
    public ResponseEntity<CategoryOutputDto> getCategoryById(@PathVariable UUID id) {
        return categoryService.findCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
