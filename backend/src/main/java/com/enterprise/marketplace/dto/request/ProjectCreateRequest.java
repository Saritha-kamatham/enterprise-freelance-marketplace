package com.enterprise.marketplace.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProjectCreateRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotBlank(message = "Description is required")
    String description,

    @NotBlank(message = "Category is required")
    String category,

    String requiredSkills,

    @NotNull(message = "Minimum budget is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum budget must be greater than 0")
    BigDecimal budgetMin,

    @NotNull(message = "Maximum budget is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum budget must be greater than 0")
    BigDecimal budgetMax,

    @NotBlank(message = "Deadline is required")
    String deadline
) {}
