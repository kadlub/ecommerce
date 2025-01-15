package com.example.common.repository;

import com.example.common.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, UUID> {
    List<Reviews> findByReviewedUser_UserId(UUID userId);
    List<Reviews> findByReviewer_UserId(UUID userId);
    List<Reviews> findByReviewedUser_Username(String username);
}
