package com.enterprise.marketplace.service;

import com.enterprise.marketplace.dto.request.ReviewCreateRequest;

public interface ReviewService {
    void submitReview(ReviewCreateRequest request, String clientEmail);
}
