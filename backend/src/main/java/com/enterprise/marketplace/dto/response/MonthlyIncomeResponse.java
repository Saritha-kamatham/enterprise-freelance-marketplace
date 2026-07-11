package com.enterprise.marketplace.dto.response;

import java.math.BigDecimal;

public record MonthlyIncomeResponse(
    String month,
    BigDecimal income
) {}
