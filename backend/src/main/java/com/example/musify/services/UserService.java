package com.example.musify.services;

import com.example.musify.entities.Users;
import com.example.musify.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UsersRepository usersRepository;

    @Autowired
    public UserService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public List<Users> findAllUsers() {
        return usersRepository.findAll();
    }

    public Optional<Users> findUserById(UUID userId) {
        return usersRepository.findById(userId);
    }

    public Users createUser(Users user) {
        return usersRepository.save(user);
    }

    public Users updateUser(UUID userId, Users userDetails) {
        return usersRepository.findById(userId)
                .map(user -> {
                    user.setUsername(userDetails.getUsername());
                    user.setEmail(userDetails.getEmail());
                    user.setPasswordHash(userDetails.getPasswordHash());
                    user.setIsSeller(userDetails.getIsSeller());
                    return usersRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(UUID userId) {
        usersRepository.deleteById(userId);
    }
}
