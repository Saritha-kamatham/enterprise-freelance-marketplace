package com.enterprise.marketplace.web.controller;

import com.enterprise.marketplace.domain.entity.Attachment;
import com.enterprise.marketplace.domain.entity.Message;
import com.enterprise.marketplace.domain.entity.Project;
import com.enterprise.marketplace.dto.response.AttachmentResponse;
import com.enterprise.marketplace.repository.AttachmentRepository;
import com.enterprise.marketplace.repository.MessageRepository;
import com.enterprise.marketplace.repository.ProjectRepository;
import com.enterprise.marketplace.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {

    private final StorageService storageService;
    private final AttachmentRepository attachmentRepository;
    private final ProjectRepository projectRepository;
    private final MessageRepository messageRepository;

    public FileController(StorageService storageService,
                          AttachmentRepository attachmentRepository,
                          ProjectRepository projectRepository,
                          MessageRepository messageRepository) {
        this.storageService = storageService;
        this.attachmentRepository = attachmentRepository;
        this.projectRepository = projectRepository;
        this.messageRepository = messageRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<AttachmentResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "project_id", required = false) Long projectId,
            @RequestParam(value = "message_id", required = false) Long messageId) {
        
        String savedFileName = storageService.store(file);
        
        Project project = null;
        if (projectId != null) {
            project = projectRepository.findById(projectId).orElse(null);
        }

        Message message = null;
        if (messageId != null) {
            message = messageRepository.findById(messageId).orElse(null);
        }

        Attachment attachment = new Attachment();
        attachment.setFileName(savedFileName);
        attachment.setOriginalName(file.getOriginalFilename());
        attachment.setContentType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setFilePath(savedFileName);
        attachment.setProject(project);
        attachment.setMessage(message);
        
        attachment = attachmentRepository.save(attachment);

        String downloadUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/files/download/")
                .path(savedFileName)
                .toUriString();

        AttachmentResponse response = new AttachmentResponse(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getOriginalName(),
                attachment.getContentType(),
                attachment.getFileSize(),
                downloadUrl,
                projectId,
                messageId,
                attachment.getUploadedAt()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Resource resource = storageService.loadAsResource(fileName);
        
        String contentType = "application/octet-stream";
        try {
            contentType = resource.getURL().openConnection().getContentType();
        } catch (Exception ignored) {}

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
