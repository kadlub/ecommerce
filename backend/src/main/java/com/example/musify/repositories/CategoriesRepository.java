package com.example.musify.repositories;

import com.example.musify.entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, UUID> {
    Optional<Categories> findByName(String name);
    List<Categories> findByParentCategory_CategoryId(UUID parentCategoryId);
}
