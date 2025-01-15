package com.example.review_service.controller;

import com.example.common.dto.ReviewOutputDto;
import com.example.common.dto.ReviewInputDto;
import com.example.review_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
//@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public List<ReviewOutputDto> getAllReviews() {
        return reviewService.findAllReviews();
    }

    @PostMapping
    public ReviewOutputDto createReview(@Valid @RequestBody ReviewInputDto reviewInputDto) {
        return reviewService.createReview(reviewInputDto);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewOutputDto>> getReviewsForUser(@PathVariable UUID userId) {
        List<ReviewOutputDto> reviews = reviewService.findReviewsForUser(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/reviewer/{userId}")
    public ResponseEntity<List<ReviewOutputDto>> getReviewsByUser(@PathVariable UUID userId) {
        List<ReviewOutputDto> reviews = reviewService.findReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReviewOutputDto>> getMyReviews(Authentication authentication) {
        String username = authentication.getName();
        List<ReviewOutputDto> reviews = reviewService.findReviewsForUsername(username);
        return ResponseEntity.ok(reviews);
    }


}
