package com.example.musify.controllers;

import com.example.musify.entities.Categories;
import com.example.musify.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Categories> getAllCategories() {
        return categoryService.findAllCategories();
    }
}
