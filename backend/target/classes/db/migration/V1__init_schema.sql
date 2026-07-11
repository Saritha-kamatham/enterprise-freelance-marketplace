-- V1__init_schema.sql
-- Database schema for Enterprise Freelance Marketplace

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- CLIENT, FREELANCER, ADMIN
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Freelancer Profiles Table
CREATE TABLE freelancer_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    headline VARCHAR(255),
    bio TEXT,
    skills VARCHAR(1000), -- Comma-separated list of skills
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
    rating_avg DECIMAL(3, 2) DEFAULT 0.00,
    completed_projects_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Client Profiles Table
CREATE TABLE client_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    verified_status BOOLEAN DEFAULT FALSE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Projects Table (with Optimistic Locking version column)
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    required_skills VARCHAR(1000),
    budget_min DECIMAL(10, 2) NOT NULL,
    budget_max DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- DRAFT, OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    deadline TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE
);

-- Bids Table
CREATE TABLE bids (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    freelancer_id BIGINT NOT NULL,
    bid_amount DECIMAL(10, 2) NOT NULL,
    delivery_days INT NOT NULL,
    proposal_text TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_project_freelancer UNIQUE (project_id, freelancer_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(id) ON DELETE CASCADE
);

-- Contracts Table (with Optimistic Locking version column)
CREATE TABLE contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    freelancer_id BIGINT NOT NULL,
    agreed_amount DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUBMITTED_FOR_REVIEW, COMPLETED, DISPUTED, TERMINATED
    version BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES freelancer_profiles(id) ON DELETE CASCADE
);

-- Milestones Table (with Optimistic Locking version column)
CREATE TABLE milestones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, FUNDED, RELEASED, REFUNDED
    version BIGINT DEFAULT 0 NOT NULL,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    contract_id BIGINT,
    content TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL
);

-- Reviews Table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id BIGINT NOT NULL UNIQUE,
    reviewer_id BIGINT NOT NULL,
    reviewee_id BIGINT NOT NULL,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Attachments Table
CREATE TABLE attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    project_id BIGINT,
    message_id BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE SET NULL
);

-- Indexing for Optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_bids_project ON bids(project_id);
CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_milestones_contract ON milestones(contract_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_attachments_project ON attachments(project_id);
CREATE INDEX idx_attachments_message ON attachments(message_id);
