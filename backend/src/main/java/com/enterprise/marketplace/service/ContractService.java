package com.enterprise.marketplace.service;

import com.enterprise.marketplace.dto.request.MilestoneCreateRequest;
import com.enterprise.marketplace.dto.response.ContractResponse;
import com.enterprise.marketplace.dto.response.MilestoneResponse;

import java.util.List;

public interface ContractService {
    List<ContractResponse> getMyContracts(String email);
    ContractResponse getContract(Long id, String email);
    MilestoneResponse addMilestone(Long contractId, MilestoneCreateRequest request, String email);
    MilestoneResponse releaseMilestone(Long contractId, Long milestoneId, String email);
    ContractResponse completeContract(Long id, String email);
    List<MilestoneResponse> getContractMilestones(Long contractId, String email);
}
