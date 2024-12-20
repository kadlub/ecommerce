package com.example.musify.controllers;

import com.example.musify.dto.UserInputDto;
import com.example.musify.dto.UserOutputDto;
import com.example.musify.security.JwtUtil;
import com.example.musify.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        System.out.println("AuthController initialized!");
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // Rejestracja użytkownika - NIE WYMAGA TOKENA JWT
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserInputDto userInputDto) {
        System.out.println("Received registration request: " + userInputDto);
        try {
            UserOutputDto registeredUser = userService.createUser(userInputDto);
            System.out.println("Registration successful: " + registeredUser);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            System.out.println("Error during registration: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Logowanie użytkownika - GENEROWANIE TOKENA JWT
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");

            // Uwierzytelnienie użytkownika
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            // Generowanie tokena JWT
            String token = jwtUtil.generateToken(new UsernamePasswordAuthenticationToken(username, null));

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }
}
