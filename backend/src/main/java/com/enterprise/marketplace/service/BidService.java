package com.enterprise.marketplace.service;

import com.enterprise.marketplace.domain.enums.BidStatus;
import com.enterprise.marketplace.dto.request.BidSubmitRequest;
import com.enterprise.marketplace.dto.response.BidResponse;

import java.util.List;

public interface BidService {
    BidResponse submitBid(BidSubmitRequest request, String email);
    List<BidResponse> getBidsForProject(Long projectId, String email);
    List<BidResponse> getMyBids(String email);
    BidResponse updateBidStatus(Long id, BidStatus status, String email);
}
