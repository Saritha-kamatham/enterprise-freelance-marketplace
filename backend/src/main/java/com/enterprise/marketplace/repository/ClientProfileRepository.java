package com.enterprise.marketplace.repository;

import com.enterprise.marketplace.domain.entity.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    Optional<ClientProfile> findByUserId(Long userId);
}
