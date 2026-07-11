package com.enterprise.marketplace.repository;

import com.enterprise.marketplace.domain.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    Optional<Attachment> findByFileName(String fileName);
    List<Attachment> findByProjectId(Long projectId);
    List<Attachment> findByMessageId(Long messageId);
}
