# 🚀 EliteMarket – Enterprise Freelance Marketplace Platform

EliteMarket is a modern **Java Full Stack Freelance Marketplace** inspired by platforms like **Upwork, Fiverr, Freelancer, and Toptal**. It enables **Clients** to post projects, hire freelancers, manage contracts, and track project progress, while **Freelancers** can showcase their skills, submit bids, collaborate in real time, and complete projects through a secure workflow.

The application is built using **Spring Boot 3**, **Spring Security**, **Spring Data JPA**, **MySQL**, **HTML5**, **CSS3**, **JavaScript**, **REST APIs**, **JWT Authentication**, **Google OAuth2**, and **STOMP WebSockets**, following enterprise-level architecture and best development practices.

## 🌐 Live Demo

**Application:** https://enterprise-freelance-marketplace.onrender.com

---

# ✨ Features

### 🔐 Authentication & Security
- Traditional Login & Registration
- Google OAuth2 Sign-In
- JWT Authentication
- BCrypt Password Encryption
- Role-Based Authorization (Admin, Client, Freelancer)

### 👨‍💻 Freelancer Module
- Professional Profile Management
- Browse & Search Projects
- Submit Bids
- Track Active Contracts
- Live Chat with Clients
- Dashboard with Earnings Analytics

### 🏢 Client Module
- Company Profile Management
- Post & Manage Projects
- Accept or Reject Bids
- Automatic Contract Creation
- Escrow Payment Simulation
- Dashboard Analytics

### 💬 Real-Time Collaboration
- STOMP WebSocket Chat
- Instant Messaging
- File Sharing
- PDF & Image Preview

### 📊 Dashboard
- Interactive Charts using Chart.js
- Earnings & Spending Statistics
- Active Projects
- Contract Tracking
- Review & Rating System

---

# 🏗️ System Architecture

```
Frontend (HTML, CSS, JavaScript)
            │
   REST APIs & WebSockets
            │
 Spring Boot Application
            │
Spring Security + JWT
            │
 Spring Data JPA (Hibernate)
            │
      MySQL Database
```

---

# 🔄 Application Workflow

1. Users register or log in using traditional authentication or Google OAuth2.
2. After successful login, a JWT token is generated for secure access.
3. Clients post work requirements with budget and deadline.
4. Freelancers browse projects and submit proposals.
5. Clients review and accept or reject bids.
6. Accepted bids automatically create contracts and milestones.
7. Clients and freelancers collaborate through real-time chat.
8. Escrow payments are released after milestone completion.
9. Clients provide ratings and reviews once the project is completed.

---

# 🛠️ Technology Stack

## Backend
- Java 17+
- Spring Boot 3.x
- Spring MVC
- Spring Security 6
- Spring Data JPA (Hibernate)
- JWT Authentication
- Google OAuth2
- STOMP WebSockets
- REST APIs

## Frontend
- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Fetch API
- Chart.js

## Database
- MySQL 8 (Production)
- H2 Database (Development)

---

# 📂 Project Structure

```
EliteMarket
│
├── backend
│   ├── config
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── security
│   ├── service
│   ├── exception
│   └── resources
│
├── frontend
│   ├── assets
│   ├── css
│   ├── js
│   └── index.html
│
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

---

# 🚀 Deployment

The application is deployed on **Render** with a production **MySQL (Aiven Cloud)** database.

### Deployment Features
- Production Deployment on Render
- Cloud MySQL Database
- Secure JWT Authentication
- Google OAuth2 Login
- REST API Integration
- WebSocket-Based Real-Time Messaging

---

# ⭐ Project Highlights

- Enterprise-Level Java Full Stack Architecture
- Secure JWT & Google OAuth2 Authentication
- Real-Time Chat using STOMP WebSockets
- Escrow-Based Contract & Milestone Workflow
- Responsive Glassmorphism UI
- Interactive Dashboard Analytics
- Optimized Database Performance
- Clean Layered Spring Boot Architecture

---

# 🔮 Future Enhancements

- AI-Based Project Recommendations
- Video Meetings
- Email Notifications
- Payment Gateway Integration
- Mobile Application
- Advanced Admin Analytics
- Multi-Language Support

---

# 👩‍💻 Developer

**Saritha Kamatham**

**B.Tech – Computer Science & Engineering (Artificial Intelligence)**

**Java Full Stack Major Project**

Built using **Spring Boot, Spring Security, MySQL, HTML5, CSS3, JavaScript, REST APIs, JWT Authentication, Google OAuth2, and WebSockets.**
