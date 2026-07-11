package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.domain.entity.Contract;
import com.enterprise.marketplace.domain.entity.Message;
import com.enterprise.marketplace.domain.entity.User;
import com.enterprise.marketplace.dto.request.MessageSendRequest;
import com.enterprise.marketplace.dto.response.MessageResponse;
import com.enterprise.marketplace.repository.ContractRepository;
import com.enterprise.marketplace.repository.MessageRepository;
import com.enterprise.marketplace.repository.UserRepository;
import com.enterprise.marketplace.service.ChatService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatServiceImpl(MessageRepository messageRepository,
                           UserRepository userRepository,
                           ContractRepository contractRepository,
                           SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.contractRepository = contractRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public MessageResponse sendMessage(MessageSendRequest request, String senderEmail) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        User receiver = userRepository.findById(request.receiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Contract contract = null;
        if (request.contractId() != null) {
            contract = contractRepository.findById(request.contractId())
                    .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

            // Verify parties
            boolean isClient = contract.getClient().getUser().getId().equals(sender.getId()) || 
                               contract.getClient().getUser().getId().equals(receiver.getId());
            boolean isFreelancer = contract.getFreelancer().getUser().getId().equals(sender.getId()) || 
                                   contract.getFreelancer().getUser().getId().equals(receiver.getId());

            if (!isClient || !isFreelancer) {
                throw new SecurityException("Users must be parties to the contract to exchange messages");
            }
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContract(contract);
        message.setContent(request.content());
        message.setReadStatus(false);
        
        message = messageRepository.save(message);
        
        MessageResponse response = mapToResponse(message);

        // Send to receiver's private queue
        messagingTemplate.convertAndSendToUser(receiver.getEmail(), "/queue/chat", response);
        // Echo back to sender so other tabs/devices stay synced
        messagingTemplate.convertAndSendToUser(sender.getEmail(), "/queue/chat", response);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getChatHistory(Long otherUserId, Long contractId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new IllegalArgumentException("Recipient user not found"));

        // Load the chat logs
        List<Message> messages = messageRepository.findChatHistory(user.getId(), otherUser.getId(), contractId);

        // Mark messages received by the user as read
        messages.stream()
                .filter(m -> m.getReceiver().getId().equals(user.getId()) && !m.isReadStatus())
                .forEach(m -> {
                    m.setReadStatus(true);
                    messageRepository.save(m);
                });

        return messages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse mapToResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getEmail(),
                message.getReceiver().getId(),
                message.getReceiver().getEmail(),
                message.getContract() != null ? message.getContract().getId() : null,
                message.getContent(),
                message.isReadStatus(),
                message.getTimestamp()
        );
    }
}
