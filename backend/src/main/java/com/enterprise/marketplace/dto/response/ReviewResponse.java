package com.enterprise.marketplace.dto.response;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    Long contractId,
    Long reviewerId,
    String reviewerName,
    Long revieweeId,
    int score,
    String comment,
    LocalDateTime createdAt
) {}
