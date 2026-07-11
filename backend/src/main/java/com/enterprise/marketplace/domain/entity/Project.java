package com.enterprise.marketplace.domain.entity;

import com.enterprise.marketplace.domain.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private ClientProfile client;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(name = "required_skills", length = 1000)
    private String requiredSkills;

    @Column(name = "budget_min", nullable = false)
    private BigDecimal budgetMin;

    @Column(name = "budget_max", nullable = false)
    private BigDecimal budgetMax;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.OPEN;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
