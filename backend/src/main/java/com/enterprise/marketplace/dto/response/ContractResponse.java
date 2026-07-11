package com.enterprise.marketplace.dto.response;

import com.enterprise.marketplace.domain.enums.ContractStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ContractResponse(
    Long id,
    Long projectId,
    String projectTitle,
    Long clientId,
    String companyName,
    Long freelancerId,
    String freelancerName,
    BigDecimal agreedAmount,
    LocalDateTime startDate,
    LocalDateTime endDate,
    ContractStatus status,
    Long version,
    LocalDateTime createdAt
) {}
