package com.example.musify.controllers;

import com.example.musify.dto.UserInputDto;
import com.example.musify.dto.UserOutputDto;
import com.example.musify.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
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
}
