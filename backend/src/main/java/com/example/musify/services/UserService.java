package com.example.musify.services;

import com.example.musify.dto.UserInputDto;
import com.example.musify.dto.UserOutputDto;
import com.example.musify.entities.Users;
import com.example.musify.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UsersRepository usersRepository;

    @Autowired
    public UserService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
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

    // Tworzenie nowego użytkownika
    public UserOutputDto createUser(UserInputDto userInputDto) {
        Users user = convertToEntity(userInputDto); // Konwersja DTO wejściowego na encję
        Users savedUser = usersRepository.save(user);
        return convertToOutputDto(savedUser); // Konwersja encji na DTO wyjściowe
    }

    // Aktualizacja użytkownika
    public UserOutputDto updateUser(UUID userId, UserInputDto userInputDto) {
        return usersRepository.findById(userId)
                .map(user -> {
                    user.setUsername(userInputDto.getUsername());
                    user.setEmail(userInputDto.getEmail());
                    user.setPasswordHash(userInputDto.getPasswordHash());
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
                .build();
    }

    // Konwersja DTO wejściowego na encję
    private Users convertToEntity(UserInputDto userInputDto) {
        return Users.builder()
                .username(userInputDto.getUsername())
                .email(userInputDto.getEmail())
                .passwordHash(userInputDto.getPasswordHash())
                .isSeller(userInputDto.getIsSeller())
                .build();
    }
}
