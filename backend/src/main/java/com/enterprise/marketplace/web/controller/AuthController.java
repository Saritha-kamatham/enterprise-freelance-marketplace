package com.enterprise.marketplace.web.controller;

import com.enterprise.marketplace.dto.request.LoginRequest;
import com.enterprise.marketplace.dto.request.RegisterRequest;
import com.enterprise.marketplace.dto.request.GoogleAuthRequest;
import com.enterprise.marketplace.dto.request.GoogleRoleSelectionRequest;
import com.enterprise.marketplace.dto.response.AuthResponse;
import com.enterprise.marketplace.dto.response.GoogleAuthResponse;
import com.enterprise.marketplace.dto.response.UserProfileResponse;
import com.enterprise.marketplace.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/profiles/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profiles/freelancer/{id}")
    public ResponseEntity<UserProfileResponse> updateFreelancerProfile(
            @PathVariable Long id,
            @RequestBody UserProfileResponse request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.updateFreelancerProfile(id, request, userDetails.getUsername()));
    }

    @PutMapping("/profiles/client/{id}")
    public ResponseEntity<UserProfileResponse> updateClientProfile(
            @PathVariable Long id,
            @RequestBody UserProfileResponse request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.updateClientProfile(id, request, userDetails.getUsername()));
    }

    @PostMapping("/auth/google")
    public ResponseEntity<GoogleAuthResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(authService.authenticateGoogle(request));
    }

    @PostMapping("/auth/google/register")
    public ResponseEntity<AuthResponse> googleRegister(@Valid @RequestBody GoogleRoleSelectionRequest request) {
        return ResponseEntity.ok(authService.completeGoogleRegistration(request));
    }
}
