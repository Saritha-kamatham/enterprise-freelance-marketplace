package com.enterprise.marketplace.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MilestoneCreateRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    BigDecimal amount,

    @NotBlank(message = "Due date is required")
    String dueDate
) {}
