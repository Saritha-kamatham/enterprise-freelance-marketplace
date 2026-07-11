package com.enterprise.marketplace.repository;

import com.enterprise.marketplace.domain.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByClientId(Long clientId);
    List<Contract> findByFreelancerId(Long freelancerId);
    List<Contract> findByClientIdOrFreelancerId(Long clientId, Long freelancerId);
}
