# 🚀 EliteMarket: Real-Time Freelance Marketplace Platform

An enterprise-grade, real-time freelance marketplace platform localized for the Indian market, inspired by **Upwork, Fiverr, Freelancer, and Toptal**. This application enables clients to post work requirements (briefs), freelancers to submit quotes, clients to hire professionals, and both parties to manage active agreements through a responsive, real-time interface.

The project is built using **Spring Boot 3**, **Spring Security 6**, **Spring Data JPA**, **MySQL / H2**, **HTML5**, **CSS3 Custom variables (Glassmorphism design system)**, **STOMP WebSockets**, and **REST APIs**, following enterprise-level architecture and best coding practices.

---

# 📌 Features

## Service Provider (Freelancer) Module

- Register and Login
- Create and Update Professional Profile
- Add Skills and Professional Summary
- Browse Available Work Requirements / Briefs
- Search and Filter Briefs by Categories (including AI & Data Science)
- Submit Quotes (Rate, duration, and proposal text)
- Track Quote Status
- View Active Agreements
- Live Chat Workroom & File Attachments
- Dashboard with Earnings Statistics & Analytics charts

---

## Client (Employer) Module

- Register and Login
- Manage Company Profile
- Post New Work Requirements / Briefs (with ₹ budgets)
- Edit and Delete Briefs
- View Submitted Quotes
- Accept or Reject Quotes
- Automatic Agreement & Payment Phase Creation on Quote Acceptance
- Track Active Projects and Release Escrow Payments
- Dashboard Analytics showing Released Payments & Completed Cycles

---

## Bid & Contract Management

- **Escrow Simulation:** automated milestone-based payment processing. Funds are held as "Funded" and released to the freelancer in real-time.
- **Agreement Flow:** Quote Acceptance instantly activates contracts, starts payment phases, and sets up a live chat workroom.
- **Completion & Feedback:** Clients can mark contracts as completed and submit a 1 to 5-star review with comments.

---

## Real-Time Collaboration & Messaging

- **STOMP WebSocket Chat:** Real-time, peer-to-peer workspace chat.
- **File Uploads:** Secure work attachment delivery inside the chat workspace.
- **Resilient Connection:** WebSockets with exponential backoff reconnect capabilities.

---

## Security Features

- Spring Security 6 stateless authentication
- Custom JWT filter validating permissions for `ROLE_CLIENT`, `ROLE_FREELANCER`, and `ROLE_ADMIN`
- Role-based authorization and protected endpoints
- Password encryption using BCrypt

---

# 🛠 Technology Stack

## Backend

- Java 17+
- Spring Boot 3.x
- Spring MVC
- Spring Security 6
- Spring Data JPA (Hibernate)
- Flyway Migrations
- STOMP WebSockets
- REST APIs

---

## Frontend

- HTML5
- CSS3 (Vanilla Custom Properties - Premium Glassmorphism)
- JavaScript (ES6 Modules)
- SockJS & StompJS
- Chart.js (Dashboard Performance Analytics)

---

## Database

- H2 Database (Local development in-memory, auto-seeded)
- MySQL 8.0 (Production)

---

# 📂 Project Structure

```
enterprise-freelance-marketplace

├── backend
│   ├── src/main/java/com/enterprise/marketplace
│   │   ├── config
│   │   ├── domain (entities, enums)
│   │   ├── dto (requests, responses)
│   │   ├── repository
│   │   ├── security
│   │   ├── service
│   │   ├── web (controllers, exceptions)
│   │   └── MarketplaceApplication.java
│   ├── src/main/resources
│   │   ├── db/migration (Flyway SQL migrations)
│   │   └── application.yml
│   └── pom.xml
│
└── frontend
    ├── index.html
    ├── src/
    │   ├── components (navbar, toast)
    │   ├── services (auth, websocket)
    │   ├── views (home, projects, project-detail, contract, dashboard)
    │   ├── app.js
    │   ├── config.js
    │   └── router.js
    └── assets/
        └── css/ (design system, layouts)
```

---

# 🗄 Database

Database Name

```
freelance_db
```

Main Tables

- users
- freelancer_profiles
- client_profiles
- projects
- bids
- contracts
- milestones
- reviews
- messages
- attachments

---

# 🚀 Running the Application

## Running with Docker Compose
You can boot the database, backend services, and frontend proxy with:
```bash
docker-compose up --build
```
This serves the localized frontend on [http://localhost:3000](http://localhost:3000) and the backend API on [http://localhost:8080](http://localhost:8080).

---

## Running Locally for Development

### 1. Backend

Navigate to backend directory:

```bash
cd backend
```

Run the application (loads in-memory H2 database auto-seeded with 20 realistic Indian projects):

```cmd
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Backend URL: `http://localhost:8080`

---

### 2. Frontend

Navigate to frontend directory:

```bash
cd frontend
```

Serve using static server:

```bash
npx http-server -p 5000
```

Frontend URL: `http://localhost:5000` *(Ensure to open in **Incognito Mode** to bypass aggressively cached ES6 modules!)*

---

# 🛠 MySQL Configuration (Production)

Create Database:

```sql
CREATE DATABASE freelance_db;
```

Update your `application.yml` or environment variables:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/freelance_db
    username: root
    password: your_password
```

---

# 👨💻 Developed By

**Java Full Stack Major Project**

Enterprise Freelance Marketplace Platform

Developed using Spring Boot, MySQL, HTML, CSS, JavaScript, WebSockets, and REST APIs.
