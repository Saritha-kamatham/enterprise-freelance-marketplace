package com.enterprise.marketplace.repository;

import com.enterprise.marketplace.domain.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByProjectId(Long projectId);
    List<Bid> findByFreelancerId(Long freelancerId);
    Optional<Bid> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.project.id = :projectId")
    long countByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT MIN(b.bidAmount) FROM Bid b WHERE b.project.id = :projectId")
    BigDecimal findMinBidAmountByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT MAX(b.bidAmount) FROM Bid b WHERE b.project.id = :projectId")
    BigDecimal findMaxBidAmountByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT AVG(b.bidAmount) FROM Bid b WHERE b.project.id = :projectId")
    Double findAvgBidAmountByProjectId(@Param("projectId") Long projectId);
}
