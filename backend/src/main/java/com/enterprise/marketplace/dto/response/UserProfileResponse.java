package com.enterprise.marketplace.dto.response;

import java.math.BigDecimal;

public record UserProfileResponse(
    Long id,
    String email,
    String role,
    
    // Freelancer profile fields (null if client)
    String fullName,
    String phone,
    String headline,
    String bio,
    String skills,
    int experienceYears,
    BigDecimal hourlyRate,
    BigDecimal ratingAvg,
    int completedProjectsCount,

    // Client profile fields (null if freelancer)
    String companyName,
    String contactPerson,
    String location,
    String website,
    boolean verifiedStatus
) {}
