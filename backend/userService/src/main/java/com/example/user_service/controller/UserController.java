package com.example.user_service.controller;

import com.example.common.*;
import com.example.common.dto.UserInputDto;
import com.example.common.dto.UserOutputDto;
import com.example.common.entity.Authority;
import com.example.common.entity.Users;
import com.example.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
//@CrossOrigin
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Pobranie wszystkich użytkowników
    @GetMapping
    public List<UserOutputDto> getAllUsers() {
        return userService.findAllUsers();
    }

    // Pobranie użytkownika po ID
    @GetMapping("/{id}")
    public ResponseEntity<UserOutputDto> getUserById(@PathVariable UUID id) {
        return userService.findUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tworzenie nowego użytkownika
    @PostMapping
    public UserOutputDto createUser(@Valid @RequestBody UserInputDto userInputDto) {
        return userService.createUser(userInputDto);
    }

    // Aktualizacja użytkownika
    @PutMapping("/{id}")
    public ResponseEntity<UserOutputDto> updateUser(@PathVariable UUID id, @Valid @RequestBody UserInputDto userInputDto) {
        return ResponseEntity.ok(userService.updateUser(id, userInputDto));
    }

    // Usuwanie użytkownika
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserOutputDto>> getAllUsersForAdmin(@AuthenticationPrincipal UserDetails userDetails) {
        // Sprawdzenie, czy użytkownik ma rolę ADMIN
        if (userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .noneMatch(role -> role.equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build(); // Zwróć 403, jeśli użytkownik nie ma roli ADMIN
        }

        List<UserOutputDto> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    // Pobranie profilu użytkownika
    @GetMapping("/profile")
    public ResponseEntity<UserOutputDto> getUserProfile(@RequestHeader("Authorization") String token) {
        String username = userService.getUsernameFromToken(token);
        return userService.findUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/info")
    public ResponseEntity<UserOutputDto> getUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        Users user = userService.findUserEntityByUsername(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found")); // Wyjątek, jeśli użytkownik nie istnieje

        UserOutputDto userInfo = UserOutputDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .isSeller(user.getIsSeller())
                .createdAt(user.getCreatedAt())
                .roles(user.getAuthorities().stream()
                        .map(Authority::getName) // Pobierz nazwy ról
                        .collect(Collectors.toList())) // Zamień na listę Stringów
                .build();

        return ResponseEntity.ok(userInfo);
    }
}

