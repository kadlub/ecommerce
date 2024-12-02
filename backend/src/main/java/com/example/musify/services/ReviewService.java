package com.example.musify.services;

import com.example.musify.dto.ReviewOutputDto;
import com.example.musify.dto.ReviewInputDto;
import com.example.musify.entities.Reviews;
import com.example.musify.entities.Users;
import com.example.musify.repositories.ReviewsRepository;
import com.example.musify.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public ReviewOutputDto createReview(ReviewInputDto reviewInputDto) {
        Users reviewedUser = usersRepository.findById(reviewInputDto.getReviewedUserId())
                .orElseThrow(() -> new RuntimeException("Reviewed User not found"));

        Users reviewer = usersRepository.findById(reviewInputDto.getReviewerUserId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        Reviews review = Reviews.builder()
                .reviewedUser(reviewedUser)
                .reviewer(reviewer)
                .rating(reviewInputDto.getRating())
                .comment(reviewInputDto.getComment())
                .build();

        Reviews savedReview = reviewsRepository.save(review);
        return convertToOutputDto(savedReview);
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

    // Konwersja DTO wejściowego na encję
    /*private Reviews convertToEntity(ReviewInputDto reviewInputDto) {
        return Reviews.builder()
                .userId(reviewInputDto.getUserId())
                .rating(reviewInputDto.getRating())
                .comment(reviewInputDto.getComment())
                .build();
    }*/
}

