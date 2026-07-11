# Enterprise Real-Time Freelance Marketplace

An enterprise-grade, real-time freelance marketplace platform featuring robust identity and access management, a real-time matching and bidding engine, automated contract and milestone-based payment processing, direct peer-to-peer messaging, and live analytics dashboards.

## Technology Stack
- **Backend:** Java 17+, Spring Boot 3.x, Spring Security 6, Spring Data JPA, STOMP WebSockets, Flyway migrations.
- **Database:** H2 (Local Development), MySQL 8.0 (Production).
- **Frontend:** Vanilla HTML5, CSS3 Custom Properties, Vanilla JS (ES6 Modules), SockJS, StompJS, Chart.js.
- **DevOps:** Docker, Docker Compose, Nginx.

## Architecture Highlights
1. **Optimistic Locking:** Prevents double-spending and bidding race conditions using `@Version` fields in Hibernate.
2. **Stateless Authentication:** Custom JWT filter validating permissions for `ROLE_CLIENT`, `ROLE_FREELANCER`, and `ROLE_ADMIN`.
3. **Escrow Simulation:** Simulates milestone payments and escrow fund release flow.
4. **RFC 7807 Exception Design:** Native Spring Boot 3 `ProblemDetail` responses for standardized REST error responses.
5. **Robust Real-Time Client:** Exponential backoff reconnect capabilities for WebSockets.
6. **Nginx SPA Routing:** Standard Nginx redirection mapping dynamic routes to SPA index.html.

## Running the Application

### Running with Docker Compose
You can boot the database, backend services, and frontend proxy with:
```bash
docker-compose up --build
```
This serves the localized frontend on [http://localhost:3000](http://localhost:3000) and the backend API on [http://localhost:8080](http://localhost:8080).

### Running Locally for Development
1. **Backend:**
   Ensure Java 17+ is installed. Navigate to the backend directory and run:
   ```bash
   cd backend
   mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
   ```
   This bootstrapper runs the server on `8080` with an in-memory H2 database, preloaded with 20 realistic Indian projects/briefs, and auto-seeding.

2. **Frontend:**
   You can serve the `frontend` folder using `npx http-server` on port `5000`:
   ```bash
   cd frontend
   npx http-server -p 5000
   ```
   Then open [http://localhost:5000](http://localhost:5000) in your browser. Ensure you clear the browser cache or open in **Incognito Mode** to bypass aggressively cached ES6 modules!
