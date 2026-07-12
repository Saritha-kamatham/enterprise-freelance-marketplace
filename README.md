# 🚀 EliteMarket – Enterprise Freelance Marketplace Platform

EliteMarket is a modern **Enterprise Java Full Stack Freelance Marketplace** inspired by **Upwork, Fiverr, Freelancer, and Toptal**. The platform connects **Clients (Employers)** and **Freelancers (Service Providers)** through a secure and real-time environment where projects can be posted, bids can be submitted, contracts can be managed, and payments can be tracked efficiently.

Built with **Spring Boot 3**, **Spring Security 6**, **Spring Data JPA**, **MySQL**, **HTML5**, **CSS3**, **JavaScript**, **JWT Authentication**, **Google OAuth2**, **REST APIs**, and **STOMP WebSockets**, the application follows enterprise-level architecture and modern software development practices.

---

# 🌐 Live Demo

🔗 **Application:** https://enterprise-freelance-marketplace.onrender.com

---

# 📖 Overview

EliteMarket simplifies the freelance hiring process by providing a complete platform where:

- Clients can post work requirements.
- Freelancers can browse projects and submit proposals.
- Clients can review, accept, or reject bids.
- Contracts are automatically generated after bid approval.
- Milestone-based escrow payments are simulated.
- Both users collaborate through real-time messaging.
- Ratings and reviews help build trust within the platform.

The application focuses on **security, scalability, performance, and real-time collaboration**, making it suitable as an enterprise-level Java Full Stack project.

---

# ✨ Features

## 🔐 Authentication & Security

- Traditional Login & Registration
- Google OAuth2 Sign-In
- JWT Authentication
- BCrypt Password Encryption
- Role-Based Authorization (Admin, Client & Freelancer)
- Protected REST APIs
- Secure Session Management

---

## 👨‍💻 Freelancer Module

- Create and Manage Professional Profile
- Browse Available Projects
- Search & Filter Projects
- Submit Competitive Bids
- Track Proposal Status
- View Active Contracts
- Manage Completed Projects
- Real-Time Chat with Clients
- Earnings Dashboard with Analytics

---

## 🏢 Client Module

- Company Profile Management
- Post Work Requirements
- Edit & Delete Projects
- View Submitted Bids
- Accept or Reject Proposals
- Automatic Contract Generation
- Escrow Payment Simulation
- Spending Dashboard & Analytics

---

## 📂 Project Management

- Create Projects
- Update Projects
- Delete Projects
- Search Projects
- Category-Based Filtering
- Budget Management
- Deadline Tracking

---

## 💰 Bid & Contract Management

- Submit Project Proposals
- Proposal Tracking
- Accept or Reject Bids
- Automatic Contract Creation
- Milestone-Based Workflow
- Contract Status Tracking
- Escrow Payment Simulation

---

## 💬 Real-Time Collaboration

- STOMP WebSocket Messaging
- Instant Chat
- File Sharing
- PDF Preview
- Image Preview
- Auto Reconnect Support

---

## ⭐ Reviews & Ratings

- Client Reviews
- Freelancer Ratings
- Project Feedback
- Reputation Building

---

## 📊 Dashboard & Analytics

### Freelancer Dashboard

- Profile Summary
- Active Projects
- Pending Bids
- Earnings Statistics
- Performance Charts

### Client Dashboard

- Posted Projects
- Active Contracts
- Spending Statistics
- Proposal Analytics
- Project Reports

---

# 🏗️ System Architecture

EliteMarket follows a modern **Three-Tier Architecture** that separates the presentation layer, business logic, and data layer.

```text
                   Frontend
       (HTML5 • CSS3 • JavaScript)

                 REST APIs
                     │
                     ▼
           Spring Boot Backend
                     │
      Spring Security + JWT + OAuth2
                     │
             Business Logic Layer
                     │
         Spring Data JPA (Hibernate)
                     │
                     ▼
              MySQL Database

          ↕ Real-Time Messaging ↕

            STOMP WebSockets
```

---

# 🔄 Application Workflow

```text
User Registration / Google Login
              │
              ▼
      JWT Authentication
              │
              ▼
        User Dashboard
              │
     ┌────────┴────────┐
     │                 │
     ▼                 ▼
Client Posts      Freelancer Browses
New Project          Projects
     │                 │
     └────────┬────────┘
              ▼
      Freelancer Submits Bid
              │
              ▼
      Client Reviews Proposal
              │
      Accept / Reject Bid
              │
              ▼
   Automatic Contract Creation
              │
              ▼
  Milestone & Escrow Generation
              │
              ▼
     Real-Time Chat Workspace
              │
              ▼
      Project Completion
              │
              ▼
     Payment Release & Review
```

---

# 🛠️ Technology Stack

## Backend

- Java 17+
- Spring Boot 3.x
- Spring MVC
- Spring Security 6
- Spring Data JPA (Hibernate)
- REST APIs
- JWT Authentication
- Google OAuth2
- STOMP WebSockets
- Flyway Database Migration

---

## Frontend

- HTML5
- CSS3 (Glassmorphism UI)
- JavaScript (ES6)
- Bootstrap 5
- Fetch API
- SockJS
- STOMP.js
- Chart.js
- Font Awesome

---

## Database

- MySQL 8 (Production)
- Aiven Cloud MySQL
- H2 Database (Development)

---

# 🚀 Core Highlights

- Enterprise-Level Java Full Stack Architecture
- JWT & Google OAuth2 Authentication
- Secure Role-Based Access Control
- Real-Time Chat using STOMP WebSockets
- Escrow-Based Contract Workflow
- Milestone Payment Simulation
- Dashboard Analytics using Chart.js
- Responsive Glassmorphism User Interface
- Optimized Database Queries
- Clean Layered Spring Boot Architecture
- Production Deployment on Render
- Cloud Database Integration
---

# 📂 Project Structure

```text
EliteMarket
│
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── elitemarket
│   │   │   │           ├── config
│   │   │   │           ├── controller
│   │   │   │           ├── dto
│   │   │   │           ├── entity
│   │   │   │           ├── repository
│   │   │   │           ├── security
│   │   │   │           ├── service
│   │   │   │           ├── serviceimpl
│   │   │   │           ├── exception
│   │   │   │           ├── websocket
│   │   │   │           ├── util
│   │   │   │           └── EliteMarketApplication.java
│   │   │
│   │   ├── resources
│   │   │   ├── static
│   │   │   ├── templates
│   │   │   ├── db
│   │   │   │   └── migration
│   │   │   ├── application.yml
│   │   │   ├── application-local.yml
│   │   │   └── application-prod.yml
│   │   │
│   │   └── test
│   │
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend
│   ├── assets
│   │   ├── css
│   │   ├── js
│   │   ├── images
│   │   ├── icons
│   │   └── fonts
│   │
│   ├── pages
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── projects.html
│   │   ├── bids.html
│   │   ├── contracts.html
│   │   ├── profile.html
│   │   └── chat.html
│   │
│   ├── index.html
│   └── favicon.ico
│
├── docker-compose.yml
├── nginx.conf
├── README.md
└── .gitignore
```

---

# 🗄️ Database

The application uses **MySQL** as the primary production database and **H2** for local development.

### Main Tables

- Users
- Freelancer Profiles
- Client Profiles
- Projects
- Bids
- Contracts
- Milestones
- Reviews
- Messages
- Attachments

---

# 🔐 Security Features

- JWT-Based Authentication
- Google OAuth2 Login
- BCrypt Password Encryption
- Spring Security 6
- Role-Based Authorization
- Protected REST APIs
- Secure File Access
- Exception Handling using Spring Boot

---

# 📡 REST API Modules

The backend exposes RESTful APIs for all core modules.

### Authentication
- Register User
- Login User
- Google OAuth2 Login

### Freelancer
- Create Profile
- Update Profile
- View Profile

### Client
- Company Profile
- Update Company Details

### Projects
- Create Project
- Update Project
- Delete Project
- View Projects

### Bids
- Submit Proposal
- Accept Proposal
- Reject Proposal
- View Proposals

### Contracts
- Create Contract
- Active Contracts
- Completed Contracts

### Reviews
- Submit Rating
- View Reviews

### Dashboard
- Freelancer Dashboard
- Client Dashboard
- Analytics

---

# 💬 Real-Time Communication

EliteMarket uses **STOMP WebSockets** for instant collaboration.

### Supported Features

- Live Chat
- Instant Notifications
- File Sharing
- PDF Preview
- Image Preview
- Automatic Reconnection

---

# 📊 Performance Optimizations

- Layered Spring Boot Architecture
- Optimized JPA Queries
- Reduced Database Calls
- Efficient Repository Design
- Responsive UI
- Cloud Database Integration
- Real-Time WebSocket Communication

---

# 🚀 Deployment

The application is successfully deployed on **Render** with **Aiven Cloud MySQL**.

### Deployment Includes

- Spring Boot Backend
- Responsive Frontend
- MySQL Cloud Database
- REST APIs
- JWT Authentication
- Google OAuth2
- WebSocket Support
- Production Environment Configuration

---

# 🎯 Learning Outcomes

This project demonstrates practical implementation of:

- Enterprise Java Full Stack Development
- REST API Development
- Spring Boot & Spring Security
- JWT Authentication
- Google OAuth2 Integration
- Hibernate & JPA
- MySQL Database Design
- Real-Time WebSockets
- Responsive Frontend Development
- MVC Architecture
- Layered Architecture
- Production Deployment

---

# 🔮 Future Enhancements

- AI-Based Freelancer Recommendation
- AI Project Matching
- Video Meeting Integration
- Online Payment Gateway
- Email Notifications
- Push Notifications
- Mobile Application
- Admin Analytics Dashboard
- Multi-Language Support
- Dark & Light Theme Switching

---

# 👨‍💻 Developer

**Saritha Kamatham**

**B.Tech – Computer Science & Engineering (Artificial Intelligence)**

**Java Full Stack Major Project**

### Built With

- Java 17
- Spring Boot 3
- Spring Security 6
- Spring Data JPA
- MySQL
- HTML5
- CSS3
- JavaScript
- Bootstrap
- REST APIs
- JWT Authentication
- Google OAuth2
- STOMP WebSockets
- Chart.js

---

## ⭐ If you like this project, don't forget to give it a star!

**Thank you for visiting EliteMarket! 🚀**
