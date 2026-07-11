package com.enterprise.marketplace.web.controller;

import com.enterprise.marketplace.domain.enums.BidStatus;
import com.enterprise.marketplace.dto.request.BidSubmitRequest;
import com.enterprise.marketplace.dto.response.BidResponse;
import com.enterprise.marketplace.service.BidService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<BidResponse> submitBid(
            @Valid @RequestBody BidSubmitRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bidService.submitBid(request, userDetails.getUsername()));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<BidResponse>> getBidsForProject(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bidService.getBidsForProject(projectId, userDetails.getUsername()));
    }

    @GetMapping("/my-bids")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<BidResponse>> getMyBids(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bidService.getMyBids(userDetails.getUsername()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BidResponse> updateBidStatus(
            @PathVariable Long id,
            @RequestParam BidStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bidService.updateBidStatus(id, status, userDetails.getUsername()));
    }
}
