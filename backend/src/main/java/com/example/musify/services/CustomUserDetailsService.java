package com.example.musify.services;

import com.example.musify.entities.Users;
import com.example.musify.repositories.UsersRepository;
import com.example.musify.security.CustomUserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UsersRepository usersRepository;

    public CustomUserDetailsService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Users user;

        try {
            // Sprawdź, czy identyfikator to UUID
            UUID userId = UUID.fromString(identifier);
            user = usersRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
        } catch (IllegalArgumentException e) {
            // Jeśli to nie UUID, traktuj jako username
            user = usersRepository.findByUsername(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + identifier));
        }

        // Konwertuj encję użytkownika na obiekt UserDetails
        return new CustomUserDetails(
                user.getUserId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getAuthorities().stream()
                        .map(authority -> (GrantedAuthority) () -> authority.getName()) // Mapowanie Authority na GrantedAuthority
                        .toList()
        );
    }
}
