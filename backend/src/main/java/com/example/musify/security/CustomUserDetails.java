package com.example.musify.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.UUID;

/**
 * Custom implementation of UserDetails to include userId along with username, password, and authorities.
 */
public class CustomUserDetails implements UserDetails {
    private final UUID userId; // Unique identifier of the user
    private final String username; // Username of the user
    private final String password; // Encrypted password
    private final Collection<? extends GrantedAuthority> authorities; // User's granted roles/authorities

    // Additional fields can be added here (e.g., email, phone, etc.) if needed in the future

    public CustomUserDetails(UUID userId, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    /**
     * Returns the unique ID of the user.
     *
     * @return userId (UUID)
     */
    public UUID getUserId() {
        return userId;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        // Logic to handle account expiration if needed
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Logic to handle account lock if needed
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Logic to handle credential expiration if needed
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Logic to check if the user is enabled (can be toggled from the database)
        return true;
    }

    @Override
    public String toString() {
        return "CustomUserDetails{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", authorities=" + authorities +
                '}';
    }
}
