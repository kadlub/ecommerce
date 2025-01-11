package com.example.review_service.controller;

import com.example.common.dto.ReviewOutputDto;
import com.example.common.dto.ReviewInputDto;
import com.example.review_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/reviews")
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
}
