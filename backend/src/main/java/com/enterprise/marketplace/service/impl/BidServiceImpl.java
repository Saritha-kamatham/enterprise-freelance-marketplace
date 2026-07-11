package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.domain.entity.*;
import com.enterprise.marketplace.domain.enums.BidStatus;
import com.enterprise.marketplace.domain.enums.ContractStatus;
import com.enterprise.marketplace.domain.enums.MilestoneStatus;
import com.enterprise.marketplace.domain.enums.ProjectStatus;
import com.enterprise.marketplace.dto.request.BidSubmitRequest;
import com.enterprise.marketplace.dto.response.BidResponse;
import com.enterprise.marketplace.repository.*;
import com.enterprise.marketplace.service.BidService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BidServiceImpl implements BidService {

    private final BidRepository bidRepository;
    private final ProjectRepository projectRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public BidServiceImpl(BidRepository bidRepository,
                          ProjectRepository projectRepository,
                          FreelancerProfileRepository freelancerProfileRepository,
                          ClientProfileRepository clientProfileRepository,
                          ContractRepository contractRepository,
                          MilestoneRepository milestoneRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.bidRepository = bidRepository;
        this.projectRepository = projectRepository;
        this.freelancerProfileRepository = freelancerProfileRepository;
        this.clientProfileRepository = clientProfileRepository;
        this.contractRepository = contractRepository;
        this.milestoneRepository = milestoneRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public BidResponse submitBid(BidSubmitRequest request, String email) {
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new IllegalStateException("Project is not open for quotes");
        }

        FreelancerProfile freelancer = freelancerProfileRepository.findAll().stream()
                .filter(f -> f.getUser().getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Freelancer profile not found"));

        if (bidRepository.findByProjectIdAndFreelancerId(project.getId(), freelancer.getId()).isPresent()) {
            throw new IllegalArgumentException("You have already submitted a quote for this project");
        }

        Bid bid = new Bid();
        bid.setProject(project);
        bid.setFreelancer(freelancer);
        bid.setBidAmount(request.bidAmount());
        bid.setDeliveryDays(request.deliveryDays());
        bid.setProposalText(request.proposalText());
        bid.setStatus(BidStatus.PENDING);

        bid = bidRepository.save(bid);

        BidResponse response = mapToResponse(bid);

        // Notify client of live bid updates for this project
        messagingTemplate.convertAndSend("/topic/project/" + project.getId() + "/bids", response);

        // Send a private system notification to the client
        String clientEmail = project.getClient().getUser().getEmail();
        messagingTemplate.convertAndSendToUser(clientEmail, "/queue/notifications", 
                "New quote of ₹" + bid.getBidAmount() + " submitted on your project: " + project.getTitle());

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BidResponse> getBidsForProject(Long projectId, String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Check if the user is the owner client of the project
        if (!project.getClient().getUser().getEmail().equals(email)) {
            throw new SecurityException("Only the project owner can view its quotes");
        }

        return bidRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BidResponse> getMyBids(String email) {
        FreelancerProfile freelancer = freelancerProfileRepository.findAll().stream()
                .filter(f -> f.getUser().getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Freelancer profile not found"));

        return bidRepository.findByFreelancerId(freelancer.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BidResponse updateBidStatus(Long id, BidStatus status, String email) {
        Bid bid = bidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bid not found"));

        Project project = bid.getProject();
        if (!project.getClient().getUser().getEmail().equals(email)) {
            throw new SecurityException("Only the project owner can update quote status");
        }

        if (bid.getStatus() != BidStatus.PENDING && bid.getStatus() != BidStatus.SHORTLISTED) {
            throw new IllegalStateException("Quote is already finalized as: " + bid.getStatus());
        }

        bid.setStatus(status);

        if (status == BidStatus.ACCEPTED) {
            // Lock the project and verify it's still open
            if (project.getStatus() != ProjectStatus.OPEN) {
                throw new IllegalStateException("Project is already assigned or closed");
            }
            
            // 1. Transition project status
            project.setStatus(ProjectStatus.IN_PROGRESS);
            projectRepository.save(project);

            // 2. Reject other pending bids
            List<Bid> allBids = bidRepository.findByProjectId(project.getId());
            for (Bid otherBid : allBids) {
                if (!otherBid.getId().equals(bid.getId()) && 
                    (otherBid.getStatus() == BidStatus.PENDING || otherBid.getStatus() == BidStatus.SHORTLISTED)) {
                    otherBid.setStatus(BidStatus.REJECTED);
                    bidRepository.save(otherBid);
                    
                    // Notify other freelancers
                    messagingTemplate.convertAndSendToUser(otherBid.getFreelancer().getUser().getEmail(), 
                            "/queue/notifications", 
                            "Your quote on project '" + project.getTitle() + "' was rejected.");
                }
            }

            // 3. Create Contract
            Contract contract = new Contract();
            contract.setProject(project);
            contract.setClient(project.getClient());
            contract.setFreelancer(bid.getFreelancer());
            contract.setAgreedAmount(bid.getBidAmount());
            contract.setStartDate(LocalDateTime.now());
            contract.setEndDate(LocalDateTime.now().plusDays(bid.getDeliveryDays()));
            contract.setStatus(ContractStatus.ACTIVE);
            contract = contractRepository.save(contract);

            // 4. Create default funded Milestone (escrow simulation)
            Milestone milestone = new Milestone();
            milestone.setContract(contract);
            milestone.setTitle("Initial Payment Phase - " + project.getTitle());
            milestone.setAmount(bid.getBidAmount());
            milestone.setDueDate(contract.getEndDate());
            milestone.setStatus(MilestoneStatus.FUNDED);
            milestoneRepository.save(milestone);

            // Notify accepted freelancer
            messagingTemplate.convertAndSendToUser(bid.getFreelancer().getUser().getEmail(), 
                    "/queue/notifications", 
                    "Congratulations! Your quote on '" + project.getTitle() + "' was ACCEPTED. Agreement is now active.");
        } else {
            // Notify status update (shortlisted or rejected)
            messagingTemplate.convertAndSendToUser(bid.getFreelancer().getUser().getEmail(), 
                    "/queue/notifications", 
                    "Your quote on '" + project.getTitle() + "' is now: " + status);
        }

        bid = bidRepository.save(bid);
        return mapToResponse(bid);
    }

    private BidResponse mapToResponse(Bid bid) {
        return new BidResponse(
                bid.getId(),
                bid.getProject().getId(),
                bid.getProject().getTitle(),
                bid.getFreelancer().getId(),
                bid.getFreelancer().getFullName(),
                bid.getBidAmount(),
                bid.getDeliveryDays(),
                bid.getProposalText(),
                bid.getStatus(),
                bid.getSubmittedAt()
        );
    }
}
