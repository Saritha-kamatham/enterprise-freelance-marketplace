package com.enterprise.marketplace.dto.response;

import com.enterprise.marketplace.domain.enums.MilestoneStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MilestoneResponse(
    Long id,
    Long contractId,
    String title,
    BigDecimal amount,
    LocalDateTime dueDate,
    MilestoneStatus status,
    Long version
) {}
