package com.example.musify.repositories;

import com.example.musify.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, UUID> {

    // Wyszukiwanie użytkownika po nazwie użytkownika
    Optional<Users> findByUsername(String username);

    // Wyszukiwanie użytkownika po e-mailu (jeśli używasz e-maila do logowania)
    Optional<Users> findByEmail(String email);
}
