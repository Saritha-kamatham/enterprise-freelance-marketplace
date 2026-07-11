package com.enterprise.marketplace.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "freelancer_profiles")
@Getter
@Setter
public class FreelancerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    private String headline;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 1000)
    private String skills;

    @Column(name = "experience_years")
    private int experienceYears = 0;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate = BigDecimal.ZERO;

    @Column(name = "rating_avg")
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    @Column(name = "completed_projects_count")
    private int completedProjectsCount = 0;
}
