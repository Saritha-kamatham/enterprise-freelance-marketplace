package com.enterprise.marketplace.web.controller;

import com.enterprise.marketplace.dto.request.MessageSendRequest;
import com.enterprise.marketplace.dto.response.MessageResponse;
import com.enterprise.marketplace.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(
            @Valid @RequestBody MessageSendRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.sendMessage(request, userDetails.getUsername()));
    }

    @GetMapping("/history/{otherUserId}")
    public ResponseEntity<List<MessageResponse>> getChatHistory(
            @PathVariable Long otherUserId,
            @RequestParam(required = false) Long contractId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getChatHistory(otherUserId, contractId, userDetails.getUsername()));
    }
}
