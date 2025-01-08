package com.example.common.repository;

import com.example.common.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority, UUID> {

    // Wyszukiwanie roli po jej nazwie, np. "ROLE_USER"
    Optional<Authority> findByName(String name);
}
