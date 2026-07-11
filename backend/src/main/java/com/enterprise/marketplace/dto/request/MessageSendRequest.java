package com.enterprise.marketplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MessageSendRequest(
    @NotNull(message = "Receiver ID is required")
    Long receiverId,

    Long contractId,

    @NotBlank(message = "Message content is required")
    String content
) {}
