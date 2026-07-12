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
                    <p style="color: var(--color-text-secondary);">Welcome back, <strong id="dash-welcome-name">${AuthService.getName()}</strong> (${AuthService.getRole()})</p>
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
                        <!-- Profile Details Card -->
                        <div class="card" style="margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">My Profile</h3>
                            <div id="profile-card-details">
                                <div class="skeleton" style="height: 100px;"></div>
                            </div>
                            <button class="btn btn-secondary btn-sm" id="btn-edit-profile" style="width: 100%; margin-top: 1rem;">Edit Profile Info</button>
                        </div>

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

            <!-- Edit Profile Modal -->
            <div id="profile-modal" class="modal" style="display: none; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000;">
                <div class="modal-content" style="max-width: 500px; background: var(--color-bg-secondary); padding: 2rem; border-radius: 12px; width: 90%;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; color: var(--color-text-primary);">Update Profile</h3>
                    
                    <form id="edit-profile-form">
                        <div id="profile-fields-container"></div>
                        
                        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                            <button type="button" id="cancel-profile-btn" class="btn btn-secondary" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">Save Changes</button>
                        </div>
                    </form>
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

            // 2. Fetch Profile Info & Render Card
            const profileData = await HttpClient.get('/profiles/me');
            const profileCard = document.getElementById('profile-card-details');

            this.renderProfileDetails(profileData, isClient);

            // 3. Edit Profile Interactions
            const editProfileBtn = document.getElementById('btn-edit-profile');
            const profileModal = document.getElementById('profile-modal');
            const profileForm = document.getElementById('edit-profile-form');
            const fieldsContainer = document.getElementById('profile-fields-container');
            const cancelProfileBtn = document.getElementById('cancel-profile-btn');

            editProfileBtn.onclick = () => {
                profileModal.style.display = 'flex';
                
                if (isClient) {
                    fieldsContainer.innerHTML = `
                        <div class="form-group">
                            <label class="form-label">Contact Person Name</label>
                            <input type="text" id="edit-contact-person" class="form-control" value="${profileData.contact_person || ''}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Company Name</label>
                            <input type="text" id="edit-company-name" class="form-control" value="${profileData.company_name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Location</label>
                            <input type="text" id="edit-location" class="form-control" value="${profileData.location || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Website URL</label>
                            <input type="url" id="edit-website" class="form-control" value="${profileData.website || ''}">
                        </div>
                    `;
                } else {
                    fieldsContainer.innerHTML = `
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" id="edit-full-name" class="form-control" value="${profileData.full_name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Headline / Title</label>
                            <input type="text" id="edit-headline" class="form-control" value="${profileData.headline || ''}" placeholder="e.g. Senior Backend Engineer">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Skills (comma separated)</label>
                            <input type="text" id="edit-skills" class="form-control" value="${profileData.skills || ''}" placeholder="e.g. Java, Docker, React">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Years of Experience</label>
                            <input type="number" id="edit-experience" class="form-control" value="${profileData.experience_years || 0}" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Hourly Rate (₹)</label>
                            <input type="number" id="edit-hourly-rate" class="form-control" value="${profileData.hourly_rate || 0}" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Professional Summary / Bio</label>
                            <textarea id="edit-bio" class="form-control" rows="3">${profileData.bio || ''}</textarea>
                        </div>
                    `;
                }
            };

            cancelProfileBtn.onclick = () => {
                profileModal.style.display = 'none';
            };

            profileForm.onsubmit = async (e) => {
                e.preventDefault();
                
                try {
                    let updatedProfile;
                    if (isClient) {
                        updatedProfile = {
                            id: profileData.id,
                            contact_person: document.getElementById('edit-contact-person').value,
                            company_name: document.getElementById('edit-company-name').value,
                            location: document.getElementById('edit-location').value,
                            website: document.getElementById('edit-website').value
                        };
                        await HttpClient.put(`/profiles/client/${profileData.id}`, updatedProfile);
                    } else {
                        updatedProfile = {
                            id: profileData.id,
                            full_name: document.getElementById('edit-full-name').value,
                            headline: document.getElementById('edit-headline').value,
                            skills: document.getElementById('edit-skills').value,
                            experience_years: Number(document.getElementById('edit-experience').value),
                            hourly_rate: Number(document.getElementById('edit-hourly-rate').value),
                            bio: document.getElementById('edit-bio').value
                        };
                        await HttpClient.put(`/profiles/freelancer/${profileData.id}`, updatedProfile);
                    }
                    
                    Toast.show('Profile updated successfully!', 'success');
                    profileModal.style.display = 'none';
                    
                    // Update local name in session if modified
                    const newName = isClient ? updatedProfile.company_name : updatedProfile.full_name;
                    localStorage.setItem('user_name', newName);
                    window.dispatchEvent(new CustomEvent('auth-changed'));
                    
                    // Rerender details directly without page refresh
                    const newProfileData = await HttpClient.get('/profiles/me');
                    this.renderProfileDetails(newProfileData, isClient);
                    document.getElementById('dash-welcome-name').innerText = AuthService.getName();
                } catch (err) {
                    Toast.show(err.message, 'error');
                }
            };

            // 4. Fetch Active/Past Contracts
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

    renderProfileDetails(profileData, isClient) {
        const profileCard = document.getElementById('profile-card-details');
        if (isClient) {
            profileCard.innerHTML = `
                <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-text-primary); margin-bottom: 0.25rem;">
                    👤 ${profileData.contact_person || 'Client Partner'}
                </div>
                <div style="font-size: 0.9rem; color: var(--color-primary); font-weight: 600; margin-bottom: 0.75rem;">
                    🏢 ${profileData.company_name || 'Client Company'}
                </div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    📍 <strong>Location:</strong> ${profileData.location || 'Not specified'}
                </div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    🌐 <strong>Website:</strong> ${profileData.website ? `<a href="${profileData.website}" target="_blank" style="color: inherit; text-decoration: underline;">Visit Website</a>` : 'Not specified'}
                </div>
            `;
        } else {
            profileCard.innerHTML = `
                <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-text-primary); margin-bottom: 0.25rem;">
                    👤 ${profileData.full_name || 'Service Provider'}
                </div>
                <div style="font-size: 0.9rem; color: var(--color-primary); font-weight: 600; margin-bottom: 0.75rem;">
                    💼 ${profileData.headline || 'Professional Freelancer'}
                </div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    🎓 <strong>Experience:</strong> ${profileData.experience_years} years
                </div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    🏷️ <strong>Skills:</strong> ${profileData.skills || 'Not specified'}
                </div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    💰 <strong>Hourly Rate:</strong> ₹${profileData.hourly_rate || '0'}/hr
                </div>
            `;
        }
    },

    renderClientChart(analytics) {
        const ctx = document.getElementById('analytics-canvas').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Released Payments (₹)', 'Active Agreements (#)', 'Completed Cycles (#)'],
                datasets: [{
                    label: 'Client Portfolio Allocations',
                    data: [analytics.total_spent || 1, analytics.active_projects || 0, 5],
                    backgroundColor: [
                        '#10b981',
                        '#6366f1',
                        '#f59e0b'
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
