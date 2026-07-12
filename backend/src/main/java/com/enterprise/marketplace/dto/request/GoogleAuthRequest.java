package com.enterprise.marketplace.dto.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(
    @NotBlank(message = "Google ID token is required")
    String credential
) {}
