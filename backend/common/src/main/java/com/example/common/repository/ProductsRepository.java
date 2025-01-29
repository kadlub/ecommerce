package com.example.common.repository;

import com.example.common.entity.Categories;
import com.example.common.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
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
    List<Products> findBySeller_UserId(UUID userId);
    boolean existsBySlug(String slug);

    @Query("SELECT p FROM Products p WHERE p.isSold = false")
    List<Products> findAllAvailableProducts();

}
