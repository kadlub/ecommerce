package com.example.review_service.service;

import com.example.common.dto.ReviewOutputDto;
import com.example.common.dto.ReviewInputDto;
import com.example.common.entity.Reviews;
import com.example.common.entity.Users;
import com.example.common.repository.ReviewsRepository;
import com.example.common.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewsRepository reviewsRepository;
    private final UsersRepository usersRepository;

    @Autowired
    public ReviewService(ReviewsRepository reviewsRepository, UsersRepository usersRepository) {
        this.reviewsRepository = reviewsRepository;
        this.usersRepository = usersRepository;
    }

    public List<ReviewOutputDto> findAllReviews() {
        return reviewsRepository.findAll()
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    /**
     * Tworzy nową opinię przypisaną do zalogowanego użytkownika (recenzenta).
     */
    public ReviewOutputDto createReview(ReviewInputDto reviewInputDto) {
        // Pobierz zalogowanego użytkownika (recenzenta) z SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Users reviewer = usersRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        // Pobierz użytkownika, którego dotyczy opinia
        Users reviewedUser = usersRepository.findById(reviewInputDto.getReviewedUserId())
                .orElseThrow(() -> new RuntimeException("Reviewed User not found"));

        // Tworzenie encji opinii
        Reviews review = Reviews.builder()
                .reviewedUser(reviewedUser) // Przypisanie użytkownika, którego dotyczy opinia
                .reviewer(reviewer) // Automatyczne przypisanie recenzenta
                .rating(reviewInputDto.getRating())
                .comment(reviewInputDto.getComment())
                .build();

        // Zapis opinii w bazie
        Reviews savedReview = reviewsRepository.save(review);

        return convertToOutputDto(savedReview);
    }

    public List<ReviewOutputDto> findReviewsForUser(UUID userId) {
        return reviewsRepository.findByReviewedUser_UserId(userId)
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    public List<ReviewOutputDto> findReviewsByUser(UUID userId) {
        return reviewsRepository.findByReviewer_UserId(userId)
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    public List<ReviewOutputDto> findReviewsForUsername(String username) {
        return reviewsRepository.findByReviewedUser_Username(username)
                .stream()
                .map(this::convertToOutputDto)
                .collect(Collectors.toList());
    }

    // Konwersja encji na DTO wyjściowe
    private ReviewOutputDto convertToOutputDto(Reviews review) {
        return ReviewOutputDto.builder()
                .reviewId(review.getReviewId())
                .revieweduserId(review.getReviewedUser().getUserId())
                .reviewedUserName(review.getReviewedUser().getUsername())
                .reviewerUserId(review.getReviewer().getUserId())
                .reviewerUserName(review.getReviewer().getUsername())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
