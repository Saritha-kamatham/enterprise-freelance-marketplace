package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.domain.entity.Contract;
import com.enterprise.marketplace.domain.entity.FreelancerProfile;
import com.enterprise.marketplace.domain.entity.Review;
import com.enterprise.marketplace.domain.entity.User;
import com.enterprise.marketplace.dto.request.ReviewCreateRequest;
import com.enterprise.marketplace.repository.ContractRepository;
import com.enterprise.marketplace.repository.FreelancerProfileRepository;
import com.enterprise.marketplace.repository.ReviewRepository;
import com.enterprise.marketplace.repository.UserRepository;
import com.enterprise.marketplace.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            ContractRepository contractRepository,
            UserRepository userRepository,
            FreelancerProfileRepository freelancerProfileRepository) {
        this.reviewRepository = reviewRepository;
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.freelancerProfileRepository = freelancerProfileRepository;
    }

    @Override
    @Transactional
    public void submitReview(ReviewCreateRequest request, String clientEmail) {
        Contract contract = contractRepository.findById(request.contractId())
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        // Validate client is part of contract
        if (!contract.getClient().getUser().getEmail().equals(clientEmail)) {
            throw new SecurityException("Only the client of the contract can leave a review");
        }

        // Check if review already exists
        if (reviewRepository.findByContractId(request.contractId()).isPresent()) {
            throw new IllegalArgumentException("Review already submitted for this contract");
        }

        User clientUser = contract.getClient().getUser();
        User freelancerUser = contract.getFreelancer().getUser();

        Review review = new Review();
        review.setContract(contract);
        review.setReviewer(clientUser);
        review.setReviewee(freelancerUser);
        review.setScore(request.score());
        review.setComment(request.comment());

        reviewRepository.save(review);

        // Recalculate freelancer average rating
        FreelancerProfile freelancerProfile = contract.getFreelancer();
        List<Review> reviews = reviewRepository.findByRevieweeId(freelancerUser.getId());
        
        int totalScore = 0;
        for (Review r : reviews) {
            totalScore += r.getScore();
        }
        
        // Ensure new review is included in calculation
        boolean isNewIncluded = reviews.stream().anyMatch(r -> r.getId() != null && r.getId().equals(review.getId()));
        if (!isNewIncluded) {
            totalScore += review.getScore();
            reviews.add(review);
        }

        BigDecimal avgRating = BigDecimal.valueOf(totalScore)
                .divide(BigDecimal.valueOf(reviews.size()), 2, RoundingMode.HALF_UP);

        freelancerProfile.setRatingAvg(avgRating);
        freelancerProfile.setCompletedProjectsCount(reviews.size());
        
        freelancerProfileRepository.save(freelancerProfile);
    }
}
