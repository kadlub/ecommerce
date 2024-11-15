package com.example.musify.repositories;

import com.example.musify.entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoriesRepository extends JpaRepository<Categories, UUID> {
}
