package com.example.musify.controllers;

import com.example.musify.dto.ReviewOutputDto;
import com.example.musify.dto.ReviewInputDto;
import com.example.musify.services.ReviewService;
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
