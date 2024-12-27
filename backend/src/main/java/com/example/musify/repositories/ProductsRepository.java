package com.example.musify.repositories;

import com.example.musify.entities.Categories;
import com.example.musify.entities.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductsRepository extends JpaRepository<Products, UUID>, JpaSpecificationExecutor<Products> {
    List<Products> findByCategory_CategoryId(UUID categoryId);
    List<Products> findByCategoryIn(List<Categories> categories);
    List<Products> findByCategory_CategoryIdIn(List<UUID> categoryIds);
    Optional<Products> findBySlug(String slug);

}
