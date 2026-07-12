import { AuthService } from './services/auth-service.js';
import { HomeView } from './views/home-view.js';
import { ProjectsView } from './views/projects-view.js';
import { ProjectDetailView } from './views/project-detail-view.js';
import { ContractView } from './views/contract-view.js';
import { DashboardView } from './views/dashboard-view.js';

const routes = {
    '/': { view: HomeView, private: false },
    '/login': { view: HomeView, private: false }, // Home contains both marketing and Login/Register
    '/projects': { view: ProjectsView, private: true },
    '/project': { view: ProjectDetailView, private: true }, // handles dynamic /project/:id
    '/contract': { view: ContractView, private: true }, // handles dynamic /contract/:id
    '/dashboard': { view: DashboardView, private: true }
};

export const Router = {
    init() {
        window.addEventListener('hashchange', () => this.handleRouting());
        window.addEventListener('load', () => this.handleRouting());
        
        window.addEventListener('auth-expired', () => {
            window.location.hash = '#/login';
        });

        // Intercept standard anchor links that start with #/
        document.body.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (anchor && anchor.getAttribute('href') && anchor.getAttribute('href').startsWith('#/')) {
                // Let hash change handle routing
            }
        });
    },

    handleRouting() {
        const hash = window.location.hash || '#/';
        let path = hash.substring(1); // remove '#'
        
        // Parse dynamic params e.g. /project/42 -> path: /project, param: 42
        let param = null;
        const parts = path.split('/').filter(p => p !== '');
        
        if (parts.length > 1) {
            path = '/' + parts[0];
            param = parts[1];
        } else {
            path = '/' + (parts[0] || '');
        }

        const route = routes[path];

        if (!route) {
            console.error('Route not found:', path);
            this.navigate('/');
            return;
        }

        // Authentication checks
        if (route.private && !AuthService.isAuthenticated()) {
            this.navigate('/login');
            return;
        }

        // If authenticated and tries to go to login, send to dashboard
        if (path === '/login' && AuthService.isAuthenticated()) {
            this.navigate('/dashboard');
            return;
        }

        const appContainer = document.getElementById('app');
        if (appContainer) {
            // Render view layout
            appContainer.innerHTML = route.view.render(param);
            // Fire view lifecycle/hook
            if (route.view.afterRender) {
                route.view.afterRender(param);
            }
        }
    },

    navigate(path) {
        window.location.hash = `#${path}`;
    }
};
