package com.example.musify.services;

import com.example.musify.entities.Categories;
import com.example.musify.repositories.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoriesRepository categoriesRepository;

    @Autowired
    public CategoryService(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }

    public List<Categories> findAllCategories() {
        return categoriesRepository.findAll();
    }
}
