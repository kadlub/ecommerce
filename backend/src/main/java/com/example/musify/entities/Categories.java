package com.example.musify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Categories {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID categoryId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column
    private String description;

    // Relacja do nadrzędnej kategorii
    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private Categories parentCategory;

    // Relacja do podrzędnych kategorii
    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL)
    private List<Categories> subcategories;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Products> products;
}
