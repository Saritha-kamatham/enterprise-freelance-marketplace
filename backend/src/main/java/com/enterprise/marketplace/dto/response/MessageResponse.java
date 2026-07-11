package com.enterprise.marketplace.dto.response;

import java.time.LocalDateTime;

public record MessageResponse(
    Long id,
    Long senderId,
    String senderEmail,
    Long receiverId,
    String receiverEmail,
    Long contractId,
    String content,
    boolean readStatus,
    LocalDateTime timestamp
) {}
