package com.example.user_service.service;

import com.example.common.*;
import com.example.common.dto.UserInputDto;
import com.example.common.dto.UserOutputDto;
import com.example.common.entity.Authority;
import com.example.common.entity.Users;
import com.example.common.security.JwtUtil;
import com.example.common.repository.AuthorityRepository;
import com.example.common.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@EnableWebSecurity
public class UserService {

    private final UsersRepository usersRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil; // Dodaj zależność do JwtUtil

    @Autowired
    public UserService(UsersRepository usersRepository, AuthorityRepository authorityRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usersRepository = usersRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil; // Inicjalizuj JwtUtil
    }

    // Metoda do wyciągania nazwy użytkownika z tokena JWT
    public String getUsernameFromToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // Usuwanie prefixu "Bearer " z tokena
        }
        return jwtUtil.extractUsername(token);
    }

    // Metoda do pobierania użytkownika po nazwie użytkownika
    public Optional<Users> findUserEntityByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    // Dotychczasowa metoda pozostaje bez zmian
    public Optional<UserOutputDto> findUserByUsername(String username) {
        return usersRepository.findByUsername(username)
                .map(this::convertToOutputDto); // Konwersja do DTO
    }

    // Pobranie wszystkich użytkowników
    public List<UserOutputDto> findAllUsers() {
        return usersRepository.findAll()
                .stream()
                .map(this::convertToOutputDto) // Konwersja encji na DTO wyjściowe
                .collect(Collectors.toList());
    }

    // Pobranie użytkownika po ID
    public Optional<UserOutputDto> findUserById(UUID userId) {
        return usersRepository.findById(userId)
                .map(this::convertToOutputDto); // Konwersja encji na DTO wyjściowe
    }

    // Tworzenie nowego użytkownika z przypisaniem domyślnej roli USER
    public UserOutputDto createUser(UserInputDto userInputDto) {
        if (usersRepository.existsByEmail(userInputDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }
        if (usersRepository.existsByUsername(userInputDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }
        System.out.println("Creating user: " + userInputDto);
        try {
            Users user = convertToEntity(userInputDto);

            // Hashowanie hasła
            user.setPasswordHash(passwordEncoder.encode(userInputDto.getPasswordHash()));

            // Dodanie domyślnej roli USER
            Authority defaultRole = authorityRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            user.setAuthorities(List.of(defaultRole));

            Users savedUser = usersRepository.save(user);
            System.out.println("User saved: " + savedUser);

            return convertToOutputDto(savedUser);
        } catch (Exception e) {
            System.out.println("Error during user creation: " + e.getMessage());
            throw e;
        }
    }


    // Aktualizacja użytkownika
    public UserOutputDto updateUser(UUID userId, UserInputDto userInputDto) {
        return usersRepository.findById(userId)
                .map(user -> {
                    user.setUsername(userInputDto.getUsername());
                    user.setEmail(userInputDto.getEmail());

                    // Aktualizacja hasła, jeśli dostarczone
                    if (userInputDto.getPasswordHash() != null) {
                        user.setPasswordHash(passwordEncoder.encode(userInputDto.getPasswordHash()));
                    }

                    user.setIsSeller(userInputDto.getIsSeller());
                    Users updatedUser = usersRepository.save(user);
                    return convertToOutputDto(updatedUser); // Konwersja encji na DTO wyjściowe
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Usuwanie użytkownika
    public void deleteUser(UUID userId) {
        usersRepository.deleteById(userId);
    }

    // Konwersja encji na DTO wyjściowe
    private UserOutputDto convertToOutputDto(Users user) {
        return UserOutputDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isSeller(user.getIsSeller())
                .createdAt(user.getCreatedAt())
                .roles(user.getAuthorities().stream()
                        .map(Authority::getName)
                        .collect(Collectors.toList())) // Dodanie listy ról do DTO
                .build();
    }

    // Konwersja DTO wejściowego na encję
    private Users convertToEntity(UserInputDto userInputDto) {
        return Users.builder()
                .username(userInputDto.getUsername())
                .email(userInputDto.getEmail())
                .passwordHash(userInputDto.getPasswordHash()) // Hasło będzie hashowane przed zapisem
                .isSeller(userInputDto.getIsSeller())
                .build();
    }
}

