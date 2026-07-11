package com.enterprise.marketplace.dto.response;

import com.enterprise.marketplace.domain.enums.BidStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BidResponse(
    Long id,
    Long projectId,
    String projectTitle,
    Long freelancerId,
    String freelancerName,
    BigDecimal bidAmount,
    int deliveryDays,
    String proposalText,
    BidStatus status,
    LocalDateTime submittedAt
) {}
