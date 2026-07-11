package com.enterprise.marketplace.repository;

import com.enterprise.marketplace.domain.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByContractId(Long contractId);
    List<Review> findByRevieweeId(Long revieweeId);
}
