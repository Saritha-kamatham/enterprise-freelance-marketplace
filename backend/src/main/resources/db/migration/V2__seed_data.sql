-- V2__seed_data.sql
-- Seed data for Enterprise Freelance Marketplace
-- All passwords are BCrypt hashes of 'Password@123'
-- Hash: $2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6

-- Insert Users (3 Clients, 5 Freelancers, 1 Admin)
INSERT INTO users (id, email, password_hash, role, is_active, created_at, updated_at) VALUES
(1, 'client1@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'CLIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'client2@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'CLIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'client3@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'CLIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'free1@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'FREELANCER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'free2@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'FREELANCER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'free3@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'FREELANCER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'free4@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'FREELANCER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'free5@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'FREELANCER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'admin@marketplace.com', '$2a$10$8.UnVuG9HHgffUDAlk8q2Ou5JLs814nYguzRTR5M5nQE4G1R1Sgb6', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Client Profiles
INSERT INTO client_profiles (id, user_id, company_name, contact_person, phone, location, website, verified_status) VALUES
(1, 1, 'Acme Corp', 'John Doe', '123-456-7890', 'New York, USA', 'https://acme.org', true),
(2, 2, 'Stark Industries', 'Pepper Potts', '987-654-3210', 'Los Angeles, USA', 'https://stark.com', true),
(3, 3, 'Wayne Enterprises', 'Lucius Fox', '555-019-9000', 'Gotham City, USA', 'https://wayne.com', false);

-- Insert Freelancer Profiles
INSERT INTO freelancer_profiles (id, user_id, full_name, phone, headline, bio, skills, experience_years, hourly_rate, rating_avg, completed_projects_count) VALUES
(1, 4, 'Alice Johnson', '111-222-3333', 'Senior Full Stack Java Engineer', 'Specialist in Spring Boot microservices, high-throughput REST APIs, and event-driven architectures. 8+ years building enterprise SaaS platforms.', 'Java,Spring Boot,Hibernate,MySQL,WebSockets,Docker', 8, 85.00, 4.9, 12),
(2, 5, 'Bob Smith', '444-555-6666', 'Creative UI/UX Designer', 'Passionate about crafting beautiful, usable interfaces. Specialized in wireframing, high-fidelity mockups, design tokens, and user experience strategy.', 'UI/UX,Figma,CSS,Design Systems,Wireframing,HTML5', 5, 60.00, 4.8, 8),
(3, 6, 'Charlie Brown', '777-888-9999', 'DevOps & Infrastructure Architect', 'Cloud deployment specialist with heavy experience in AWS, Kubernetes, GitHub Actions, CI/CD pipelines, and secure networking infrastructure.', 'AWS,Kubernetes,Docker,CI/CD,Linux,Nginx', 7, 95.00, 5.0, 15),
(4, 7, 'Diana Prince', '222-333-4444', 'Frontend React Developer', 'Expert at creating responsive, interactive web applications with modern JS architectures. Obsessed with clean CSS and fast loading times.', 'JavaScript,React,CSS3,TypeScript,HTML5', 4, 55.00, 4.7, 5),
(5, 8, 'Evan Wright', '888-999-0000', 'Python AI & Data Engineer', 'Experienced developer focusing on machine learning pipelines, LLM fine-tuning, web scraping, and database optimization workflows.', 'Python,Django,Pandas,SQL,Machine Learning,Postgres', 6, 75.00, 4.9, 9);

-- Insert Projects (20 realistic Indian projects)
-- Statuses: OPEN, IN_PROGRESS, COMPLETED, CANCELLED, DRAFT
INSERT INTO projects (id, client_id, title, description, category, required_skills, budget_min, budget_max, status, deadline, version, created_at) VALUES
(1, 1, 'Enterprise Java E-Commerce Platform', 'Looking for an experienced engineer to design and develop a multi-vendor e-commerce platform. Must support complex order management, payment integration, and inventory synchronization in real-time. Spring Boot backend, MySQL, and Docker setup required.', 'Software Development', 'Java,Spring Boot,MySQL,Docker', 150000.00, 300000.00, 'OPEN', '2026-09-30 00:00:00', 0, CURRENT_TIMESTAMP),
(2, 2, 'SaaS Analytics Dashboard Redesign', 'Our SaaS product needs a fresh visual aesthetic and improved user experience. Looking for a designer to create a complete UI design system, including interactive tables, live financial charts, and clean dark mode themes.', 'UI/UX Design', 'UI/UX,Figma,Design Systems', 75000.00, 150000.00, 'OPEN', '2026-08-15 00:00:00', 0, CURRENT_TIMESTAMP),
(3, 3, 'CI/CD Pipeline Optimization', 'Our build pipelines are running slowly and lack security scanning. Need a DevOps expert to rebuild our GitHub Actions pipelines, add automated lint/test stages, integrate sonar-cube, and optimize Docker build caching.', 'DevOps', 'CI/CD,Docker,Kubernetes', 25000.00, 60000.00, 'COMPLETED', '2026-06-30 00:00:00', 0, '2026-06-01 00:00:00'),
(4, 1, 'Spring Boot Microservices Architecture', 'Acme Corp is breaking down its monolith into microservices. We need a lead backend developer to setup Spring Cloud Gateway, Eureka Service Registry, and secure the communication using OAuth2/JWT.', 'Software Development', 'Java,Spring Boot,OAuth2', 250000.00, 500000.00, 'IN_PROGRESS', '2026-11-30 00:00:00', 0, '2026-07-01 00:00:00'),
(5, 2, 'Mobile App Wireframe Design', 'Looking for wireframes and user flow mapping for a new on-demand delivery application. Need 15 key screens designed in Figma with full prototyping interactions.', 'UI/UX Design', 'UI/UX,Figma,Wireframing', 30000.00, 80000.00, 'OPEN', '2026-08-31 00:00:00', 0, CURRENT_TIMESTAMP),
(6, 3, 'Production Kubernetes Cluster Setup', 'Need assistance configuring a production-ready AWS EKS cluster. The setup must include auto-scaling, Prometheus/Grafana monitoring, cert-manager for SSL, and Nginx ingress controllers.', 'DevOps', 'AWS,Kubernetes,Nginx', 120000.00, 250000.00, 'OPEN', '2026-10-15 00:00:00', 0, CURRENT_TIMESTAMP),
(7, 1, 'AI Chatbot Integration', 'Integrate a custom LLM model into our existing customer support panel. Frontend UI is built; need backend connection and message storage/caching in Redis.', 'AI & Machine Learning', 'Python,Django,Machine Learning', 90000.00, 180000.00, 'OPEN', '2026-09-15 00:00:00', 0, CURRENT_TIMESTAMP),
(8, 3, 'Web Application Penetration Testing', 'Conduct a full security review and black-box penetration test of our client portal. Identify OWASP Top 10 vulnerabilities and provide a comprehensive mitigation report.', 'Security', 'Linux,Security,Python', 80000.00, 160000.00, 'OPEN', '2026-09-01 00:00:00', 0, CURRENT_TIMESTAMP),
(9, 2, 'Brand Identity & Style Guide', 'Design a premium brand guidelines book, logo variations, typography definitions, and visual asset package for Stark Industries newly announced green energy initiative.', 'UI/UX Design', 'UI/UX,Design Systems', 45000.00, 95000.00, 'OPEN', '2026-08-01 00:00:00', 0, CURRENT_TIMESTAMP),
(10, 1, 'Database Performance Tuning', 'Our MySQL database is bottlenecked under high load. Need a DBA to optimize slow queries, configure appropriate database indexes, and adjust buffer pools.', 'Software Development', 'MySQL,SQL', 50000.00, 120000.00, 'OPEN', '2026-08-20 00:00:00', 0, CURRENT_TIMESTAMP),
(11, 2, 'GST Invoicing Portal & Ledger System', 'Build a compliant GST billing software for Indian small businesses. System should support IGST, CGST, SGST calculations, HSN/SAC code mapping, and auto-generation of PDF invoices for clients.', 'Software Development', 'Java,Spring Boot,React,SQL', 120000.00, 250000.00, 'OPEN', '2026-10-31 00:00:00', 0, CURRENT_TIMESTAMP),
(12, 1, 'FinTech Mobile App dark UI/UX design', 'Figma layout designs for a premium wealth management application targeting Indian retail investors. 20 high-fidelity screens including portfolios, mutual funds purchase flow, and real-time SIP trackers.', 'UI/UX Design', 'UI/UX,Figma,Design Systems', 60000.00, 120000.00, 'OPEN', '2026-09-15 00:00:00', 0, CURRENT_TIMESTAMP),
(13, 3, 'AWS Cost Optimization & Audit', 'Audit our current AWS resource footprint (EC2, RDS, ECS, S3) and suggest/implement cost-saving strategies (reserved instances, auto-scheduling, container sizing) to reduce monthly bills by 30%.', 'DevOps', 'AWS,CI/CD,Docker', 40000.00, 90000.00, 'OPEN', '2026-08-30 00:00:00', 0, CURRENT_TIMESTAMP),
(14, 2, 'Spring Boot GraphQL API Integration', 'Design and integrate a high-performance GraphQL endpoint layer over our existing JPA data models. Implement custom schema mapping, batch loaders, and query depth validation to prevent performance degradation.', 'Software Development', 'Java,Spring Boot,MySQL', 80000.00, 160000.00, 'OPEN', '2026-11-15 00:00:00', 0, CURRENT_TIMESTAMP),
(15, 3, 'Data Analytics Pipeline for E-Learning', 'Build a data pipeline to aggregate student test scores, watch times, and interaction logs. Output predictive analytics on student drop-out risks using Python/Pandas.', 'Data Science & Analytics', 'Python,Pandas,SQL,Data Science', 75000.00, 160000.00, 'OPEN', '2026-09-30 00:00:00', 0, CURRENT_TIMESTAMP),
(16, 1, 'Dockerization & Jenkins Pipeline Setup', 'Migrate our legacy build setup to a fully containerized Docker workflow and write robust Jenkinsfiles for automatic build, test, and container deployment on Staging servers.', 'DevOps', 'CI/CD,Docker,Linux', 30000.00, 75000.00, 'OPEN', '2026-08-30 00:00:00', 0, CURRENT_TIMESTAMP),
(17, 2, 'Log4j Vulnerability Mitigation Audit', 'Perform a codebase scan of our Java enterprise repositories, identify nested transitive vulnerable dependencies, upgrade classpath configurations, and submit a security report.', 'Security', 'Security,Java,Linux', 50000.00, 100000.00, 'OPEN', '2026-09-15 00:00:00', 0, CURRENT_TIMESTAMP),
(18, 3, 'Hotel Booking Engine REST Integration', 'Develop a backend microservice to connect with third-party Indian travel agency APIs (flight, room inventories). Spring Boot, Redis caching, and circuit-breakers using Resilience4j.', 'Software Development', 'Java,Spring Boot,Redis', 110000.00, 220000.00, 'OPEN', '2026-11-30 00:00:00', 0, CURRENT_TIMESTAMP),
(19, 1, 'E-Commerce Figma UI Kit Creation', 'Create a complete UI design system kit in Figma for mobile e-commerce templates. Must include color palettes, typography tokens, inputs, buttons, sliders, and product card variations.', 'UI/UX Design', 'UI/UX,Figma', 40000.00, 85000.00, 'OPEN', '2026-09-10 00:00:00', 0, CURRENT_TIMESTAMP),
(20, 2, 'Security Hardening of Cloud Infrastructure', 'Set up AWS IAM roles, configure security groups, enable VPC flow logs, and audit our S3 bucket permissions to enforce least privilege access.', 'Security', 'AWS,Security,Linux', 70000.00, 150000.00, 'OPEN', '2026-10-30 00:00:00', 0, CURRENT_TIMESTAMP);

-- Insert Bids
-- Bids on Open Projects (Project 1 & 2)
INSERT INTO bids (id, project_id, freelancer_id, bid_amount, delivery_days, proposal_text, status, submitted_at) VALUES
(1, 1, 1, 225000.00, 30, 'I have extensive experience building Java Spring Boot e-commerce backends. I can deliver a clean, secured, and containerized solution.', 'PENDING', CURRENT_TIMESTAMP),
(2, 1, 5, 246000.00, 45, 'I will build your backend with Django REST framework and PostgreSQL. Although the request specifies Java, I highly recommend Python for chatbot integrations.', 'PENDING', CURRENT_TIMESTAMP),
(3, 2, 2, 105000.00, 20, 'Figma specialist here. I have designed three other SaaS dashboards with complete dark modes. I can begin work immediately.', 'PENDING', CURRENT_TIMESTAMP),
(4, 2, 4, 84000.00, 25, 'I will build out clean UI design system wireframes. I am a frontend developer, so my designs will be highly component-focused.', 'PENDING', CURRENT_TIMESTAMP),
-- Bids on Completed Project (Project 3)
(5, 3, 3, 45000.00, 14, 'DevOps is my specialty. I will reorganize your pipelines to achieve sub-5 minute build times.', 'ACCEPTED', '2026-06-02 00:00:00'),
-- Bids on In Progress Project (Project 4)
(6, 4, 1, 350000.00, 60, 'Perfect fit. I have built three different microservices setups using Spring Cloud and JWT authentication.', 'ACCEPTED', '2026-07-02 00:00:00'),
(7, 4, 3, 420000.00, 40, 'I can setup the Kubernetes infrastructure for your Spring microservices to ensure auto-scaling.', 'REJECTED', '2026-07-03 00:00:00');

-- Insert Contracts
-- Contract for Project 3 (Completed)
INSERT INTO contracts (id, project_id, client_id, freelancer_id, agreed_amount, start_date, end_date, status, version, created_at) VALUES
(1, 3, 3, 3, 45000.00, '2026-06-03 00:00:00', '2026-06-17 00:00:00', 'COMPLETED', 0, '2026-06-03 00:00:00'),
-- Contract for Project 4 (Active/In Progress)
(2, 4, 1, 1, 350000.00, '2026-07-04 00:00:00', '2026-09-04 00:00:00', 'ACTIVE', 0, '2026-07-04 00:00:00');

-- Insert Milestones
-- Milestones for Contract 1 (Released)
INSERT INTO milestones (id, contract_id, title, amount, due_date, status, version) VALUES
(1, 1, 'Setup pipelines & caching', 18000.00, '2026-06-10 00:00:00', 'RELEASED', 0),
(2, 1, 'Add security scans & test automation', 27000.00, '2026-06-17 00:00:00', 'RELEASED', 0),
-- Milestones for Contract 2 (Active/Funded/Pending)
(3, 2, 'Setup Gateway & Eureka Registry', 110000.00, '2026-07-20 00:00:00', 'FUNDED', 0),
(4, 2, 'Implement security filter & JWT', 130000.00, '2026-08-15 00:00:00', 'FUNDED', 0),
(5, 2, 'Performance testing & final delivery', 110000.00, '2026-09-04 00:00:00', 'PENDING', 0);

-- Insert Reviews
INSERT INTO reviews (id, contract_id, reviewer_id, reviewee_id, score, comment, created_at) VALUES
(1, 1, 3, 6, 5, 'Charlie restructured our build pipeline perfectly. Build times decreased by 60%. Highly recommend!', '2026-06-29 00:00:00');

-- Insert Messages (Chat history for active contract 2)
INSERT INTO messages (id, sender_id, receiver_id, contract_id, content, read_status, timestamp) VALUES
(1, 1, 4, 2, 'Hello Alice, welcome to the project! Are you ready to get started on the gateway configuration?', true, '2026-07-04 09:00:00'),
(2, 4, 1, 2, 'Hi John! Yes, I am setting up the initial git repository and configuring the gateway routing now. I will push it by this afternoon.', true, '2026-07-04 09:15:00'),
(3, 4, 1, 2, 'I have completed the gateway skeleton. You can find the source link. I have funded the first milestone as well.', true, '2026-07-04 15:30:00'),
(4, 1, 4, 2, 'Excellent work! I reviewed it and it looks very clean. Let us proceed with testing the routing.', false, '2026-07-04 16:00:00');
