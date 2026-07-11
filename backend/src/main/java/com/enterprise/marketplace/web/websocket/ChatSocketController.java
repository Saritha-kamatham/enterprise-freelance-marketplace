package com.enterprise.marketplace.web.websocket;

import com.enterprise.marketplace.dto.request.MessageSendRequest;
import com.enterprise.marketplace.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatSocketController {

    private final ChatService chatService;

    public ChatSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.send")
    public void handleWebSocketMessage(MessageSendRequest request, Principal principal) {
        if (principal != null) {
            chatService.sendMessage(request, principal.getName());
        }
    }
}
