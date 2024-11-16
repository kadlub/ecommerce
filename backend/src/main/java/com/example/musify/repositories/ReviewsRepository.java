package com.example.musify.repositories;

import com.example.musify.entities.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, UUID> {
}
