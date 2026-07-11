import { Router } from './router.js';
import { Navbar } from './components/navbar.js';
import { AuthService } from './services/auth-service.js';
import { WebSocketService } from './services/websocket-service.js';

// Bootstrap application on page load
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize navigation bar
    const navbarElement = document.getElementById('main-nav');
    if (navbarElement) {
        navbarElement.innerHTML = Navbar.render();
        Navbar.init();
    }

    // 2. Resilient WebSocket connection for returning sessions
    if (AuthService.isAuthenticated()) {
        WebSocketService.connect();
    }

    // 3. Boot SPA router
    Router.init();
});
