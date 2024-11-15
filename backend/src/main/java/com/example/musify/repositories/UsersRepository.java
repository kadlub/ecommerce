package com.example.musify.repositories;

import com.example.musify.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UsersRepository extends JpaRepository<Users, UUID> {

}
