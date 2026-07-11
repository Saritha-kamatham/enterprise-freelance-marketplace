package com.enterprise.marketplace.service;

import com.enterprise.marketplace.dto.request.LoginRequest;
import com.enterprise.marketplace.dto.request.RegisterRequest;
import com.enterprise.marketplace.dto.response.AuthResponse;
import com.enterprise.marketplace.dto.response.UserProfileResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserProfileResponse getProfile(String email);
    UserProfileResponse updateFreelancerProfile(Long id, UserProfileResponse request, String email);
    UserProfileResponse updateClientProfile(Long id, UserProfileResponse request, String email);
}
