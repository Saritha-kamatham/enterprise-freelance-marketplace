package com.enterprise.marketplace.dto.response;

import com.enterprise.marketplace.domain.enums.ProjectStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProjectResponse(
    Long id,
    Long clientId,
    String companyName,
    String title,
    String description,
    String category,
    String requiredSkills,
    BigDecimal budgetMin,
    BigDecimal budgetMax,
    ProjectStatus status,
    LocalDateTime deadline,
    Long version,
    LocalDateTime createdAt,
    
    // Statistical values (optional/computed)
    long bidCount,
    BigDecimal minBid,
    BigDecimal maxBid,
    Double avgBid
) {}
