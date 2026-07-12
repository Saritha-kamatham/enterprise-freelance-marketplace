package com.enterprise.marketplace.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record GoogleRoleSelectionRequest(
    @NotBlank(message = "Registration token is required")
    String regToken,

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "CLIENT|FREELANCER", message = "Role must be CLIENT or FREELANCER")
    String role,

    String companyName,
    String fullName
) {}
