package com.enterprise.marketplace.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record FreelancerAnalyticsResponse(
    BigDecimal totalEarnings,
    double winRate,
    List<MonthlyIncomeResponse> monthlyIncome
) {}
