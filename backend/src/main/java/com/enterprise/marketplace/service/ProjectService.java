package com.enterprise.marketplace.service;

import com.enterprise.marketplace.dto.request.ProjectCreateRequest;
import com.enterprise.marketplace.dto.response.ProjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(ProjectCreateRequest request, String email);
    Page<ProjectResponse> getProjects(String category, BigDecimal minBudget, BigDecimal maxBudget, String skills, Pageable pageable);
    ProjectResponse getProject(Long id);
    List<ProjectResponse> getClientProjects(String email);
}
