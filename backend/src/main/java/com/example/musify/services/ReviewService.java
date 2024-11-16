package com.example.musify.services;

import com.example.musify.entities.Reviews;
import com.example.musify.repositories.ReviewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewsRepository reviewsRepository;

    @Autowired
    public ReviewService(ReviewsRepository reviewsRepository) {
        this.reviewsRepository = reviewsRepository;
    }

    public List<Reviews> findAllReviews() {
        return reviewsRepository.findAll();
    }

    public Reviews createReview(Reviews review) {
        return reviewsRepository.save(review);
    }
}
