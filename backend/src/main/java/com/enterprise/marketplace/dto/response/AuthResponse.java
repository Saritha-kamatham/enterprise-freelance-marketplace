package com.enterprise.marketplace.dto.response;

public record AuthResponse(
    String token,
    Long userId,
    String email,
    String role,
    String name
) {}
