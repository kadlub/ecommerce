package com.example.common.repository;

import com.example.common.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoriesRepository extends JpaRepository<Categories, UUID> {
    Optional<Categories> findByName(String name);
    List<Categories> findByParentCategory_CategoryId(UUID parentCategoryId);
    List<Categories> findByNameIn(List<String> names);

}
