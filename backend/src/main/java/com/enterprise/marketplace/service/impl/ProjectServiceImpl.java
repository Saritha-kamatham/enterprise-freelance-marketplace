package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.domain.entity.ClientProfile;
import com.enterprise.marketplace.domain.entity.Project;
import com.enterprise.marketplace.domain.enums.ProjectStatus;
import com.enterprise.marketplace.dto.request.ProjectCreateRequest;
import com.enterprise.marketplace.dto.response.ProjectResponse;
import com.enterprise.marketplace.repository.BidRepository;
import com.enterprise.marketplace.repository.ClientProfileRepository;
import com.enterprise.marketplace.repository.ProjectRepository;
import com.enterprise.marketplace.service.ProjectService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final BidRepository bidRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              ClientProfileRepository clientProfileRepository,
                              BidRepository bidRepository,
                              SimpMessagingTemplate messagingTemplate) {
        this.projectRepository = projectRepository;
        this.clientProfileRepository = clientProfileRepository;
        this.bidRepository = bidRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public ProjectResponse createProject(ProjectCreateRequest request, String email) {
        ClientProfile client = clientProfileRepository.findAll().stream()
                .filter(c -> c.getUser().getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Client profile not found"));

        Project project = new Project();
        project.setClient(client);
        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setCategory(request.category());
        project.setRequiredSkills(request.requiredSkills());
        project.setBudgetMin(request.budgetMin());
        project.setBudgetMax(request.budgetMax());
        project.setStatus(ProjectStatus.OPEN);
        project.setDeadline(LocalDateTime.parse(request.deadline(), DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        project = projectRepository.save(project);

        ProjectResponse response = mapToResponse(project, true);
        
        // Broadcast new project to all freelancers
        messagingTemplate.convertAndSend("/topic/projects", response);
        
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjects(String category, BigDecimal minBudget, BigDecimal maxBudget, String skills, Pageable pageable) {
        Specification<Project> spec = Specification.where(null);
        
        if (category != null && !category.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }
        if (minBudget != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("budgetMax"), minBudget));
        }
        if (maxBudget != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("budgetMin"), maxBudget));
        }
        if (skills != null && !skills.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("requiredSkills")), "%" + skills.toLowerCase() + "%"));
        }
        spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), ProjectStatus.OPEN));

        return projectRepository.findAll(spec, pageable).map(p -> mapToResponse(p, false));
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + id));
        return mapToResponse(project, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getClientProjects(String email) {
        ClientProfile client = clientProfileRepository.findAll().stream()
                .filter(c -> c.getUser().getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Client profile not found"));

        return projectRepository.findByClientIdOrderByCreatedAtDesc(client.getId()).stream()
                .map(p -> mapToResponse(p, false))
                .collect(Collectors.toList());
    }

    private ProjectResponse mapToResponse(Project project, boolean includeStats) {
        long bidCount = 0;
        BigDecimal minBid = BigDecimal.ZERO;
        BigDecimal maxBid = BigDecimal.ZERO;
        Double avgBid = 0.0;

        if (includeStats) {
            bidCount = bidRepository.countByProjectId(project.getId());
            minBid = bidRepository.findMinBidAmountByProjectId(project.getId());
            if (minBid == null) minBid = BigDecimal.ZERO;
            maxBid = bidRepository.findMaxBidAmountByProjectId(project.getId());
            if (maxBid == null) maxBid = BigDecimal.ZERO;
            avgBid = bidRepository.findAvgBidAmountByProjectId(project.getId());
            if (avgBid == null) avgBid = 0.0;
        } else {
            bidCount = bidRepository.countByProjectId(project.getId());
        }

        return new ProjectResponse(
                project.getId(),
                project.getClient().getId(),
                project.getClient().getCompanyName(),
                project.getTitle(),
                project.getDescription(),
                project.getCategory(),
                project.getRequiredSkills(),
                project.getBudgetMin(),
                project.getBudgetMax(),
                project.getStatus(),
                project.getDeadline(),
                project.getVersion(),
                project.getCreatedAt(),
                bidCount,
                minBid,
                maxBid,
                avgBid
        );
    }
}
