package com.example.musify.controllers;

import com.example.musify.entities.Reviews;
import com.example.musify.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public List<Reviews> getAllReviews() {
        return reviewService.findAllReviews();
    }

    @PostMapping
    public Reviews createReview(@RequestBody Reviews review) {
        return reviewService.createReview(review);
    }
}
