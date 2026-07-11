package com.enterprise.marketplace.web.controller;

import com.enterprise.marketplace.dto.request.ProjectCreateRequest;
import com.enterprise.marketplace.dto.response.ProjectResponse;
import com.enterprise.marketplace.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.createProject(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<Page<ProjectResponse>> getProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) String skills,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(projectService.getProjects(category, minBudget, maxBudget, skills, pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @GetMapping("/client/my-projects")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ProjectResponse>> getClientProjects(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getClientProjects(userDetails.getUsername()));
    }
}
