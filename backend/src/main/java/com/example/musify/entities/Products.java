package com.example.musify.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, unique = true)
    private UUID productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String description;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImages> productImages = new ArrayList<>();

    @Column(nullable = false)
    private String condition;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column(nullable = false)
    private LocalDateTime updateDate;

    @Column(nullable = false, unique = true) // Dodanie pola slug
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Categories category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Users seller;

    @PrePersist
    public void onPrePersist(){
        this.setCreationDate(LocalDateTime.now());
        this.setUpdateDate(LocalDateTime.now());
        if (this.slug == null || this.slug.isEmpty()) {
            this.slug = this.name.toLowerCase().replaceAll("\\s+", "-");
        }
    }

    @PreUpdate
    public void onPreUpdate(){
        this.setUpdateDate(LocalDateTime.now());
    }


}
