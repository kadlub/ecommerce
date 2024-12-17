package com.example.musify.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.mapping.Set;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean isSeller;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "user_authorities",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "authority_id")
    )
    private List<Authority> authorities; // Lista ról przypisanych użytkownikowi

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL)
    private List<Products> products;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Orders> orders;

    @OneToMany(mappedBy = "reviewedUser", cascade = CascadeType.ALL)
    private List<Reviews> receivedReviews;

    @OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL)
    private List<Reviews> writtenReviews;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
