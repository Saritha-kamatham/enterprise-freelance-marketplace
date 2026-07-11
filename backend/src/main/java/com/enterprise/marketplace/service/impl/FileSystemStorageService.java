package com.enterprise.marketplace.service.impl;

import com.enterprise.marketplace.service.StorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation;

    public FileSystemStorageService(@Value("${upload.dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
    }

    @Override
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Failed to store empty file " + originalFilename);
            }
            if (originalFilename.contains("..")) {
                // Security check
                throw new IllegalArgumentException("Cannot store file with relative path outside current directory " + originalFilename);
            }
            
            // Generate unique filename using UUID
            String extension = "";
            int extIndex = originalFilename.lastIndexOf('.');
            if (extIndex > 0) {
                extension = originalFilename.substring(extIndex);
            }
            String savedFilename = UUID.randomUUID().toString() + extension;

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(savedFilename), StandardCopyOption.REPLACE_EXISTING);
            }
            return savedFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + originalFilename, e);
        }
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    @Override
    public void delete(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file " + filename, e);
        }
    }
}
