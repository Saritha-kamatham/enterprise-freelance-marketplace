package com.enterprise.marketplace.dto.response;

import java.time.LocalDateTime;

public record AttachmentResponse(
    Long id,
    String fileName,
    String originalName,
    String contentType,
    Long fileSize,
    String downloadUrl,
    Long projectId,
    Long messageId,
    LocalDateTime uploadedAt
) {}
