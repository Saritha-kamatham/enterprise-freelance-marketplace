package com.enterprise.marketplace.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewCreateRequest(
    @NotNull(message = "Contract ID is required")
    Long contractId,

    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 5, message = "Score cannot be more than 5")
    int score,

    String comment
) {}
