package com.enterprise.marketplace.service;

import com.enterprise.marketplace.dto.request.MessageSendRequest;
import com.enterprise.marketplace.dto.response.MessageResponse;

import java.util.List;

public interface ChatService {
    MessageResponse sendMessage(MessageSendRequest request, String senderEmail);
    List<MessageResponse> getChatHistory(Long otherUserId, Long contractId, String userEmail);
}
