import { HttpClient } from '../services/http-client.js';
import { AuthService } from '../services/auth-service.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';

export const DashboardView = {
    render() {
        const isClient = AuthService.isClient();
        return `
            <div class="container">
                <div style="margin-bottom: 2rem;">
                    <h1 style="font-size: 2rem; font-weight: 700; color: var(--color-text-primary);">Dashboard Console</h1>
                    <p style="color: var(--color-text-secondary);">Welcome back, <strong>${AuthService.getEmail()}</strong> (${AuthService.getRole()})</p>
                </div>

                <!-- Aggregated Stats Row -->
                <div class="stats-container" id="stats-dashboard-container">
                    <div class="card skeleton" style="height: 100px;"></div>
                    <div class="card skeleton" style="height: 100px;"></div>
                    <div class="card skeleton" style="height: 100px;"></div>
                </div>

                <div class="dashboard-grid">
                    <!-- Left: Analytics Chart Card -->
                    <div class="span-8">
                        <div class="card" style="margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Performance Charts</h3>
                            <div style="position: relative; height: 320px; width: 100%;">
                                <canvas id="analytics-canvas"></canvas>
                            </div>
                        </div>

                        <!-- Active Contracts Listing -->
                        <div class="card">
                            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Active Agreements</h3>
                            <div id="contracts-list-body" style="display: flex; flex-direction: column; gap: 0.75rem;">
                                <!-- Load contracts -->
                                <div class="skeleton" style="height: 70px;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Quick Links / User Profile aggregates -->
                    <div class="span-4">
                        <div class="card">
                            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Workplace Options</h3>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                <a href="#/projects" class="btn btn-primary" style="text-decoration: none;">Browse Requirements / Briefs</a>
                                <button class="btn btn-secondary" id="btn-logout-dash" style="width: 100%;">Logout from Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async afterRender() {
        const statsContainer = document.getElementById('stats-dashboard-container');
        const contractsList = document.getElementById('contracts-list-body');
        const logoutBtn = document.getElementById('btn-logout-dash');

        // Logout listener
        logoutBtn.addEventListener('click', () => {
            AuthService.clearSession();
            Toast.show('Logged out successfully', 'info');
            Router.navigate('/login');
            window.dispatchEvent(new CustomEvent('auth-changed'));
        });

        try {
            const isClient = AuthService.isClient();

            // 1. Fetch Analytics & Render Chart.js
            if (isClient) {
                const analytics = await HttpClient.get('/analytics/client');
                
                // Render stats
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <div class="stat-label">Total Payments Spent</div>
                        <div class="stat-value" style="color: var(--color-success);">₹${analytics.total_spent}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Active Agreements</div>
                        <div class="stat-value">${analytics.active_projects}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Avg Completion (Days)</div>
                        <div class="stat-value">${analytics.average_completion_time ? analytics.average_completion_time.toFixed(1) : '-'}</div>
                    </div>
                `;

                this.renderClientChart(analytics);
            } else {
                const analytics = await HttpClient.get('/analytics/freelancer');
                
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <div class="stat-label">Total Earnings</div>
                        <div class="stat-value" style="color: var(--color-success);">₹${analytics.total_earnings}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Quote Success Rate</div>
                        <div class="stat-value">${analytics.win_rate ? analytics.win_rate.toFixed(1) : '0'}%</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Monthly Trend</div>
                        <div class="stat-value" style="font-size: 1.25rem; color: var(--color-text-secondary); margin-top: 0.5rem;">
                            Earnings tracked
                        </div>
                    </div>
                `;

                this.renderFreelancerChart(analytics.monthly_income);
            }

            // 2. Fetch Active/Past Contracts
            const contracts = await HttpClient.get('/contracts/my-contracts');
            contractsList.innerHTML = '';

            if (contracts.length === 0) {
                contractsList.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--color-text-muted);">
                        No active agreements at this time. Go browse briefs and submit quotes!
                    </div>
                `;
                return;
            }

            contracts.forEach(contract => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.cursor = 'pointer';
                card.style.padding = '1rem';
                card.style.transition = 'var(--transition-smooth)';
                card.addEventListener('click', () => {
                    Router.navigate(`/contract/${contract.id}`);
                });

                card.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h4 style="font-weight: bold; color: var(--color-text-primary);">${contract.project_title}</h4>
                            <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.25rem;">
                                Partner: <strong>${isClient ? contract.freelancer_name : contract.company_name}</strong>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <strong style="color: var(--color-success);">₹${contract.agreed_amount}</strong>
                            <div style="margin-top: 0.25rem;"><span class="badge badge-${contract.status.toLowerCase()}">${contract.status}</span></div>
                        </div>
                    </div>
                `;
                contractsList.appendChild(card);
            });

        } catch (error) {
            Toast.show(error.message, 'error');
        }
    },

    renderClientChart(analytics) {
        const ctx = document.getElementById('analytics-canvas').getContext('2d');
        // Render a doughnut/pie chart for spent vs active allocations
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Released Payments (₹)', 'Active Agreements (#)', 'Completed Cycles (#)'],
                datasets: [{
                    label: 'Client Portfolio Allocations',
                    data: [analytics.total_spent || 1, analytics.active_projects || 0, 5], // mock standard ratio fallback
                    backgroundColor: [
                        '#10b981', // emerald
                        '#6366f1', // indigo
                        '#f59e0b'  // amber
                    ],
                    borderColor: '#1e293b',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#f8fafc', font: { family: 'Inter' } }
                    }
                }
            }
        });
    },

    renderFreelancerChart(monthlyIncome) {
        const ctx = document.getElementById('analytics-canvas').getContext('2d');
        
        const labels = monthlyIncome.map(item => item.month);
        const data = monthlyIncome.map(item => item.income);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Earnings (₹)',
                    data: data,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: '#334155' },
                        ticks: { color: '#cbd5e1', font: { family: 'Inter' } }
                    },
                    y: {
                        grid: { color: '#334155' },
                        ticks: { color: '#cbd5e1', font: { family: 'Inter' } }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#f8fafc', font: { family: 'Inter' } }
                    }
                }
            }
        });
    }
};
