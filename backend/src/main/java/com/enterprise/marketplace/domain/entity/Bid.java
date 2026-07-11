package com.enterprise.marketplace.domain.entity;

import com.enterprise.marketplace.domain.enums.BidStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"project_id", "freelancer_id"})
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private FreelancerProfile freelancer;

    @Column(name = "bid_amount", nullable = false)
    private BigDecimal bidAmount;

    @Column(name = "delivery_days", nullable = false)
    private int deliveryDays;

    @Column(name = "proposal_text", nullable = false, columnDefinition = "TEXT")
    private String proposalText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BidStatus status = BidStatus.PENDING;

    @CreatedDate
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
}
