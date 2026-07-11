package com.enterprise.marketplace.web.controller;

import com.enterprise.marketplace.dto.response.ClientAnalyticsResponse;
import com.enterprise.marketplace.dto.response.FreelancerAnalyticsResponse;
import com.enterprise.marketplace.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientAnalyticsResponse> getClientAnalytics(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getClientAnalytics(userDetails.getUsername()));
    }

    @GetMapping("/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<FreelancerAnalyticsResponse> getFreelancerAnalytics(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getFreelancerAnalytics(userDetails.getUsername()));
    }
}
