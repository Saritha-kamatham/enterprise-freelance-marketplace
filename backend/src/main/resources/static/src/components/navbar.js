import { AuthService } from '../services/auth-service.js';
import { Router } from '../router.js';

export const Navbar = {
    render() {
        const authenticated = AuthService.isAuthenticated();
        const email = AuthService.getEmail();
        const role = AuthService.getRole();

        return `
            <div class="navbar-container">
                <a href="#/" class="brand">
                    <span>Elite</span>Market
                </a>
                
                <ul class="nav-links">
                    ${authenticated ? `
                        <li><a href="#/dashboard" class="nav-link">Dashboard</a></li>
                        <li><a href="#/projects" class="nav-link">Browse Briefs</a></li>
                        <li style="color: var(--color-text-muted); font-size: 0.85rem; padding-left: 1rem; border-left: 1px solid var(--color-border);">
                            ${email.split('@')[0]} (${role})
                        </li>
                        <li>
                            <button id="nav-btn-logout" class="btn btn-secondary btn-sm" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; height: auto;">
                                Logout
                            </button>
                        </li>
                    ` : `
                        <li><a href="#/login" class="nav-link">Access Platform</a></li>
                    `}
                </ul>
            </div>
        `;
    },

    init() {
        // Redraw on auth changes
        window.addEventListener('auth-changed', () => {
            const nav = document.getElementById('main-nav');
            if (nav) {
                nav.innerHTML = this.render();
                this.bindEvents();
            }
        });

        this.bindEvents();
    },

    bindEvents() {
        const logoutBtn = document.getElementById('nav-btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                AuthService.clearSession();
                Router.navigate('/login');
                window.dispatchEvent(new CustomEvent('auth-changed'));
            });
        }
    }
};
