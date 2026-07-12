package com.enterprise.marketplace.dto.response;

public record GoogleAuthResponse(
    boolean rolePending,
    String regToken,
    String email,
    String name,
    AuthResponse authResponse
) {}
