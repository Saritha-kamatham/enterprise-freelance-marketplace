package com.enterprise.marketplace.web.controller;

import com.enterprise.marketplace.dto.request.MilestoneCreateRequest;
import com.enterprise.marketplace.dto.response.ContractResponse;
import com.enterprise.marketplace.dto.response.MilestoneResponse;
import com.enterprise.marketplace.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping("/my-contracts")
    public ResponseEntity<List<ContractResponse>> getMyContracts(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(contractService.getMyContracts(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContract(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(contractService.getContract(id, userDetails.getUsername()));
    }

    @GetMapping("/{id}/milestones")
    public ResponseEntity<List<MilestoneResponse>> getContractMilestones(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(contractService.getContractMilestones(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/milestones")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<MilestoneResponse> addMilestone(
            @PathVariable Long id,
            @Valid @RequestBody MilestoneCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(contractService.addMilestone(id, request, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/milestones/{milestoneId}/release")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<MilestoneResponse> releaseMilestone(
            @PathVariable Long id,
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(contractService.releaseMilestone(id, milestoneId, userDetails.getUsername()));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ContractResponse> completeContract(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(contractService.completeContract(id, userDetails.getUsername()));
    }
}
