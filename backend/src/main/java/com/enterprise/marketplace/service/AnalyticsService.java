package com.enterprise.marketplace.service;

import com.enterprise.marketplace.dto.response.ClientAnalyticsResponse;
import com.enterprise.marketplace.dto.response.FreelancerAnalyticsResponse;

public interface AnalyticsService {
    ClientAnalyticsResponse getClientAnalytics(String email);
    FreelancerAnalyticsResponse getFreelancerAnalytics(String email);
}
