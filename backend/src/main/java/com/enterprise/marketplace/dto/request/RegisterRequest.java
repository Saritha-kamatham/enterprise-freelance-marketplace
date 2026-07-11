package com.enterprise.marketplace.dto.request;

import com.enterprise.marketplace.domain.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password,

    @NotNull(message = "Role is required")
    Role role,

    // Freelancer specific
    String fullName,

    // Client specific
    String companyName
) {}
