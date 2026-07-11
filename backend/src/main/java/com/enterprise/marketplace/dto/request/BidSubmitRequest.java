package com.enterprise.marketplace.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BidSubmitRequest(
    @NotNull(message = "Project ID is required")
    Long projectId,

    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bid amount must be greater than 0")
    BigDecimal bidAmount,

    @Min(value = 1, message = "Delivery days must be at least 1 day")
    int deliveryDays,

    @NotBlank(message = "Proposal text is required")
    String proposalText
) {}
