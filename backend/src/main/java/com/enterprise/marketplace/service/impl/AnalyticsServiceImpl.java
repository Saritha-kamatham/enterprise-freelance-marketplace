package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.domain.entity.*;
import com.enterprise.marketplace.domain.enums.BidStatus;
import com.enterprise.marketplace.domain.enums.ContractStatus;
import com.enterprise.marketplace.domain.enums.MilestoneStatus;
import com.enterprise.marketplace.domain.enums.ProjectStatus;
import com.enterprise.marketplace.dto.response.ClientAnalyticsResponse;
import com.enterprise.marketplace.dto.response.FreelancerAnalyticsResponse;
import com.enterprise.marketplace.dto.response.MonthlyIncomeResponse;
import com.enterprise.marketplace.repository.*;
import com.enterprise.marketplace.service.AnalyticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ClientProfileRepository clientProfileRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final BidRepository bidRepository;
    private final MilestoneRepository milestoneRepository;

    public AnalyticsServiceImpl(ClientProfileRepository clientProfileRepository,
                                FreelancerProfileRepository freelancerProfileRepository,
                                ProjectRepository projectRepository,
                                ContractRepository contractRepository,
                                BidRepository bidRepository,
                                MilestoneRepository milestoneRepository) {
        this.clientProfileRepository = clientProfileRepository;
        this.freelancerProfileRepository = freelancerProfileRepository;
        this.projectRepository = projectRepository;
        this.contractRepository = contractRepository;
        this.bidRepository = bidRepository;
        this.milestoneRepository = milestoneRepository;
    }

    @Override
    public ClientAnalyticsResponse getClientAnalytics(String email) {
        ClientProfile client = clientProfileRepository.findAll().stream()
                .filter(c -> c.getUser().getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Client profile not found"));

        List<Contract> contracts = contractRepository.findByClientId(client.getId());
        
        // Sum all released milestones
        BigDecimal totalSpent = BigDecimal.ZERO;
        for (Contract contract : contracts) {
            List<Milestone> milestones = milestoneRepository.findByContractId(contract.getId());
            for (Milestone m : milestones) {
                if (m.getStatus() == MilestoneStatus.RELEASED) {
                    totalSpent = totalSpent.add(m.getAmount());
                }
            }
        }

        // Active projects count
        long activeProjects = projectRepository.findByClientId(client.getId()).stream()
                .filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS)
                .count();

        // Average project completion time (in days)
        List<Contract> completedContracts = contracts.stream()
                .filter(c -> c.getStatus() == ContractStatus.COMPLETED)
                .collect(Collectors.toList());

        double avgCompletionTime = 0.0;
        if (!completedContracts.isEmpty()) {
            long totalDays = 0;
            for (Contract c : completedContracts) {
                totalDays += ChronoUnit.DAYS.between(c.getStartDate(), c.getEndDate());
            }
            avgCompletionTime = (double) totalDays / completedContracts.size();
        }

        return new ClientAnalyticsResponse(totalSpent, activeProjects, avgCompletionTime);
    }

    @Override
    public FreelancerAnalyticsResponse getFreelancerAnalytics(String email) {
        FreelancerProfile freelancer = freelancerProfileRepository.findAll().stream()
                .filter(f -> f.getUser().getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Freelancer profile not found"));

        List<Contract> contracts = contractRepository.findByFreelancerId(freelancer.getId());

        // Sum earnings (released milestones)
        BigDecimal totalEarnings = BigDecimal.ZERO;
        Map<String, BigDecimal> incomeMap = new LinkedHashMap<>();
        
        // Setup default months (past 3 months for display)
        for (int i = 2; i >= 0; i--) {
            String monthName = java.time.LocalDate.now().minusMonths(i).getMonth()
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            incomeMap.put(monthName, BigDecimal.ZERO);
        }

        for (Contract contract : contracts) {
            List<Milestone> milestones = milestoneRepository.findByContractId(contract.getId());
            for (Milestone m : milestones) {
                if (m.getStatus() == MilestoneStatus.RELEASED) {
                    totalEarnings = totalEarnings.add(m.getAmount());
                    
                    // Group by month
                    String monthName = m.getDueDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                    if (incomeMap.containsKey(monthName)) {
                        incomeMap.put(monthName, incomeMap.get(monthName).add(m.getAmount()));
                    } else {
                        incomeMap.put(monthName, m.getAmount());
                    }
                }
            }
        }

        // Win rate (accepted bids / total bids)
        List<Bid> bids = bidRepository.findByFreelancerId(freelancer.getId());
        double winRate = 0.0;
        if (!bids.isEmpty()) {
            long wins = bids.stream().filter(b -> b.getStatus() == BidStatus.ACCEPTED).count();
            winRate = ((double) wins / bids.size()) * 100.0;
        }

        List<MonthlyIncomeResponse> monthlyIncome = incomeMap.entrySet().stream()
                .map(entry -> new MonthlyIncomeResponse(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return new FreelancerAnalyticsResponse(totalEarnings, winRate, monthlyIncome);
    }
}
