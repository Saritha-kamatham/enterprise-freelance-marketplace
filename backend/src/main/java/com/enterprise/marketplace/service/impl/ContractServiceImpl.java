package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.domain.entity.*;
import com.enterprise.marketplace.domain.enums.ContractStatus;
import com.enterprise.marketplace.domain.enums.MilestoneStatus;
import com.enterprise.marketplace.domain.enums.ProjectStatus;
import com.enterprise.marketplace.dto.request.MilestoneCreateRequest;
import com.enterprise.marketplace.dto.response.ContractResponse;
import com.enterprise.marketplace.dto.response.MilestoneResponse;
import com.enterprise.marketplace.repository.*;
import com.enterprise.marketplace.service.ContractService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ContractServiceImpl(ContractRepository contractRepository,
                               MilestoneRepository milestoneRepository,
                               ProjectRepository projectRepository,
                               FreelancerProfileRepository freelancerProfileRepository,
                               ClientProfileRepository clientProfileRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.contractRepository = contractRepository;
        this.milestoneRepository = milestoneRepository;
        this.projectRepository = projectRepository;
        this.freelancerProfileRepository = freelancerProfileRepository;
        this.clientProfileRepository = clientProfileRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContractResponse> getMyContracts(String email) {
        List<Contract> contracts = contractRepository.findAll().stream()
                .filter(c -> c.getClient().getUser().getEmail().equals(email) || 
                             c.getFreelancer().getUser().getEmail().equals(email))
                .collect(Collectors.toList());

        return contracts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ContractResponse getContract(Long id, String email) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUser().getEmail().equals(email) && 
            !contract.getFreelancer().getUser().getEmail().equals(email)) {
            throw new SecurityException("Unauthorized access to contract details");
        }

        return mapToResponse(contract);
    }

    @Override
    public MilestoneResponse addMilestone(Long contractId, MilestoneCreateRequest request, String email) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUser().getEmail().equals(email)) {
            throw new SecurityException("Only clients can add payment phases to a contract");
        }

        Milestone milestone = new Milestone();
        milestone.setContract(contract);
        milestone.setTitle(request.title());
        milestone.setAmount(request.amount());
        milestone.setDueDate(LocalDateTime.parse(request.dueDate(), DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        milestone.setStatus(MilestoneStatus.PENDING);

        milestone = milestoneRepository.save(milestone);

        // Notify freelancer
        messagingTemplate.convertAndSendToUser(contract.getFreelancer().getUser().getEmail(), 
                "/queue/notifications", 
                "New payment phase of ₹" + milestone.getAmount() + " created on: " + contract.getProject().getTitle());

        return mapToMilestoneResponse(milestone);
    }

    @Override
    public MilestoneResponse releaseMilestone(Long contractId, Long milestoneId, String email) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUser().getEmail().equals(email)) {
            throw new SecurityException("Only clients can release phase payments");
        }

        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));

        if (!milestone.getContract().getId().equals(contract.getId())) {
            throw new IllegalArgumentException("Milestone does not belong to this contract");
        }

        if (milestone.getStatus() != MilestoneStatus.FUNDED && milestone.getStatus() != MilestoneStatus.PENDING) {
            throw new IllegalStateException("Payment phase cannot be released (already released/refunded)");
        }

        milestone.setStatus(MilestoneStatus.RELEASED);
        milestone = milestoneRepository.save(milestone);

        // Notify freelancer
        messagingTemplate.convertAndSendToUser(contract.getFreelancer().getUser().getEmail(), 
                "/queue/notifications", 
                "Payment of ₹" + milestone.getAmount() + " released for phase: " + milestone.getTitle());

        return mapToMilestoneResponse(milestone);
    }

    @Override
    public ContractResponse completeContract(Long id, String email) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUser().getEmail().equals(email)) {
            throw new SecurityException("Only clients can mark a contract as completed");
        }

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new IllegalStateException("Contract is not active");
        }

        // Verify all milestones are released (or released/refunded, not funded or pending)
        List<Milestone> milestones = milestoneRepository.findByContractId(contract.getId());
        for (Milestone m : milestones) {
            if (m.getStatus() == MilestoneStatus.FUNDED || m.getStatus() == MilestoneStatus.PENDING) {
                throw new IllegalStateException("Cannot complete agreement. Some payment phases are still pending or funded. Release them first.");
            }
        }

        contract.setStatus(ContractStatus.COMPLETED);
        contract = contractRepository.save(contract);

        // Update project status to COMPLETED
        Project project = contract.getProject();
        project.setStatus(ProjectStatus.COMPLETED);
        projectRepository.save(project);

        // Update freelancer stats
        FreelancerProfile freelancer = contract.getFreelancer();
        freelancer.setCompletedProjectsCount(freelancer.getCompletedProjectsCount() + 1);
        freelancerProfileRepository.save(freelancer);

        // Notify freelancer
        messagingTemplate.convertAndSendToUser(freelancer.getUser().getEmail(), 
                "/queue/notifications", 
                "Agreement '" + project.getTitle() + "' was marked COMPLETED by the client. Leave a review!");

        return mapToResponse(contract);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MilestoneResponse> getContractMilestones(Long contractId, String email) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getClient().getUser().getEmail().equals(email) && 
            !contract.getFreelancer().getUser().getEmail().equals(email)) {
            throw new SecurityException("Unauthorized access to contract milestones");
        }

        return milestoneRepository.findByContractId(contractId).stream()
                .map(this::mapToMilestoneResponse)
                .collect(Collectors.toList());
    }

    private ContractResponse mapToResponse(Contract contract) {
        return new ContractResponse(
                contract.getId(),
                contract.getProject().getId(),
                contract.getProject().getTitle(),
                contract.getClient().getUser().getId(),
                contract.getClient().getCompanyName(),
                contract.getFreelancer().getUser().getId(),
                contract.getFreelancer().getFullName(),
                contract.getAgreedAmount(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getStatus(),
                contract.getVersion(),
                contract.getCreatedAt()
        );
    }

    private MilestoneResponse mapToMilestoneResponse(Milestone milestone) {
        return new MilestoneResponse(
                milestone.getId(),
                milestone.getContract().getId(),
                milestone.getTitle(),
                milestone.getAmount(),
                milestone.getDueDate(),
                milestone.getStatus(),
                milestone.getVersion()
        );
    }
}
