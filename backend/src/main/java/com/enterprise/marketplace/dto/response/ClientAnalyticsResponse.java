package com.enterprise.marketplace.dto.response;

import java.math.BigDecimal;

public record ClientAnalyticsResponse(
    BigDecimal totalSpent,
    long activeProjects,
    Double averageCompletionTime
) {}
