package com.example.order_service.security;

import com.example.common.entity.Users;
import com.example.common.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Autowired
    public CustomUserDetailsService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Tworzymy UserDetails na podstawie użytkownika z bazy danych
        return User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash()) // Używamy zaszyfrowanego hasła
                .authorities(user.getAuthorities().stream()
                        .map(role -> role.getName()) // Mapujemy role na String
                        .toArray(String[]::new)) // Konwertujemy na tablicę
                .build();
    }
}
