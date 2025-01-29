package com.example.common.repository;

import com.example.common.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, UUID> {

    // Wyszukiwanie użytkownika po nazwie użytkownika
    Optional<Users> findByUsername(String username);

    // Wyszukiwanie użytkownika po e-mailu
    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

}
