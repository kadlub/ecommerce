package com.example.musify.entities;

import jakarta.persistence.*;
import lombok.*;


import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "authorities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString(exclude = "users")
public class Authority {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name; // Przykładowo: "ROLE_USER", "ROLE_ADMIN"

    @ManyToMany(mappedBy = "authorities")
    private List<Users> users; // Lista użytkowników z tą rolą
}
