package com.enterprise.marketplace.repository;

import com.enterprise.marketplace.domain.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {
    List<Project> findByClientId(Long clientId);
    List<Project> findByClientIdOrderByCreatedAtDesc(Long clientId);
}
