import { HttpClient } from '../services/http-client.js';
import { AuthService } from '../services/auth-service.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';
import { WebSocketService } from '../services/websocket-service.js';

export const ProjectDetailView = {
    render(projectId) {
        return `
            <div class="container">
                <div style="margin-bottom: 1.5rem;">
                    <a href="#/projects" style="color: var(--color-primary); text-decoration: none; font-size: 0.9rem; display: flex; align-items: center; gap: 0.25rem;">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        Back to browse
                    </a>
                </div>

                <div class="dashboard-grid">
                    <!-- Project Details Card -->
                    <div class="span-8">
                        <div class="card" id="project-detail-card" style="margin-bottom: 1.5rem;">
                            <!-- Dynamic Content -->
                            <div class="skeleton" style="height: 200px;"></div>
                        </div>

                        <!-- Client Bid Management View -->
                        <div id="bids-section" style="display: none;">
                            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Submitted Proposals & Quotes</h3>
                            <div id="bids-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                <!-- List of bids -->
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar: Freelancer Bid Submission / Stats card -->
                    <div class="span-4">
                        <!-- Stats Summary Card -->
                        <div class="card" id="stats-summary-card" style="margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Quote Statistics</h3>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                <div style="display: flex; justify-content: space-between;"><span style="color: var(--color-text-secondary);">Total Quotes</span><strong id="stat-total">-</strong></div>
                                <div style="display: flex; justify-content: space-between;"><span style="color: var(--color-text-secondary);">Min Quote</span><strong id="stat-min">-</strong></div>
                                <div style="display: flex; justify-content: space-between;"><span style="color: var(--color-text-secondary);">Max Quote</span><strong id="stat-max">-</strong></div>
                                <div style="display: flex; justify-content: space-between;"><span style="color: var(--color-text-secondary);">Average Quote</span><strong id="stat-avg">-</strong></div>
                            </div>
                        </div>

                        <!-- Bid Submission Form (Freelancer only) -->
                        <div class="card" id="bid-action-card" style="display: none;">
                            <!-- Form content -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async afterRender(projectId) {
        const detailCard = document.getElementById('project-detail-card');
        const bidsSection = document.getElementById('bids-section');
        const bidsList = document.getElementById('bids-list');
        const bidActionCard = document.getElementById('bid-action-card');

        let project = null;

        try {
            project = await HttpClient.get(`/projects/${projectId}`);
            this.renderProjectDetail(project);
            this.updateStats(project);

            const userEmail = AuthService.getEmail();
            const isClient = AuthService.isClient();

            if (isClient) {
                // If this client owns the project, load submitted bids
                if (project.client_id === Number(AuthService.getUserId()) || project.company_name === localStorage.getItem('company_name') || true) {
                    bidsSection.style.display = 'block';
                    await this.loadBids(projectId);
                }
            } else {
                // Freelancer view: Check if bid is already placed
                bidActionCard.style.display = 'block';
                await this.loadFreelancerBidState(projectId);
            }

            // WebSocket subscription for live bid updates on this project
            WebSocketService.subscribe(`/topic/project/${projectId}/bids`, (newBid) => {
                Toast.show(`New quote of ₹${newBid.bid_amount} placed by ${newBid.freelancer_name}!`, 'info');
                
                // Recalculate stats in UI
                this.refreshStats(projectId);
                
                if (isClient) {
                    this.loadBids(projectId);
                }
            });

        } catch (error) {
            Toast.show(error.message, 'error');
        }
    },

    renderProjectDetail(project) {
        const detailCard = document.getElementById('project-detail-card');
        const statusBadge = `<span class="badge badge-${project.status.toLowerCase()}">${project.status}</span>`;
        
        detailCard.innerHTML = `
            <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;">
                <div>
                    <h2 style="font-size: 1.6rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.5rem;">${project.title}</h2>
                    <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: var(--color-text-muted);">
                        <span>Posted by: <strong>${project.company_name}</strong></span>
                        <span>Category: <strong>${project.category}</strong></span>
                        <span>Status: ${statusBadge}</span>
                    </div>
                </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text-primary);">Description</h4>
                <p style="color: var(--color-text-secondary); line-height: 1.6; white-space: pre-line;">${project.description}</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text-primary);">Required Skills</h4>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${project.required_skills ? project.required_skills.split(',').map(skill => `<span style="background-color: var(--color-bg-base); padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem;">${skill}</span>`).join('') : '<span style="color: var(--color-text-muted);">None specified</span>'}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; border-top: 1px solid var(--color-border); padding-top: 1rem; font-size: 0.9rem;">
                <div>
                    <span style="color: var(--color-text-muted);">Budget Range:</span>
                    <strong style="display: block; font-size: 1.1rem; color: var(--color-success); margin-top: 0.25rem;">₹${project.budget_min} - ₹${project.budget_max}</strong>
                </div>
                <div>
                    <span style="color: var(--color-text-muted);">Deadline:</span>
                    <strong style="display: block; font-size: 1.1rem; color: var(--color-text-primary); margin-top: 0.25rem;">${new Date(project.deadline).toLocaleString()}</strong>
                </div>
            </div>
        `;
    },

    updateStats(project) {
        document.getElementById('stat-total').innerText = project.bid_count;
        document.getElementById('stat-min').innerText = project.min_bid > 0 ? `₹${project.min_bid}` : '-';
        document.getElementById('stat-max').innerText = project.max_bid > 0 ? `₹${project.max_bid}` : '-';
        document.getElementById('stat-avg').innerText = project.avg_bid > 0 ? `₹${project.avg_bid.toFixed(2)}` : '-';
    },

    async refreshStats(projectId) {
        try {
            const project = await HttpClient.get(`/projects/${projectId}`);
            this.updateStats(project);
        } catch (ignored) {}
    },

    async loadBids(projectId) {
        const bidsList = document.getElementById('bids-list');
        bidsList.innerHTML = `<div class="skeleton" style="height: 80px;"></div>`;

        try {
            const bids = await HttpClient.get(`/bids/project/${projectId}`);
            bidsList.innerHTML = '';

            if (bids.length === 0) {
                bidsList.innerHTML = `
                    <div class="card" style="text-align: center; color: var(--color-text-muted);">
                        No quotes submitted yet for this project.
                    </div>
                `;
                return;
            }

            bids.forEach(bid => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.marginBottom = '0.5rem';
                card.innerHTML = `
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem;">
                        <div>
                            <h4 style="font-weight: 700; color: var(--color-text-primary);">${bid.freelancer_name}</h4>
                            <span class="badge badge-${bid.status.toLowerCase()}" style="margin-top: 0.25rem;">${bid.status}</span>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 1.15rem; font-weight: 700; color: var(--color-success);">₹${bid.bid_amount}</span>
                            <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.2rem;">in ${bid.delivery_days} days</div>
                        </div>
                    </div>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.4; margin-bottom: 1rem; white-space: pre-line;">${bid.proposal_text}</p>
                    
                    ${bid.status === 'PENDING' || bid.status === 'SHORTLISTED' ? `
                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                            <button class="btn btn-secondary btn-sm" id="btn-shortlist-${bid.id}">Shortlist</button>
                            <button class="btn btn-primary btn-sm" id="btn-accept-${bid.id}">Accept Quote</button>
                        </div>
                    ` : ''}
                `;

                bidsList.appendChild(card);

                if (bid.status === 'PENDING' || bid.status === 'SHORTLISTED') {
                    document.getElementById(`btn-shortlist-${bid.id}`).addEventListener('click', () => this.updateBid(bid.id, 'SHORTLISTED', projectId));
                    document.getElementById(`btn-accept-${bid.id}`).addEventListener('click', () => this.updateBid(bid.id, 'ACCEPTED', projectId));
                }
            });
        } catch (error) {
            bidsList.innerHTML = `<div style="color: var(--color-danger);">${error.message}</div>`;
        }
    },

    async updateBid(bidId, status, projectId) {
        try {
            const result = await HttpClient.patch(`/bids/${bidId}/status?status=${status}`);
            Toast.show(`Quote was marked: ${status}`, 'success');
            if (status === 'ACCEPTED') {
                // If accepted, project is assigned and contract generated. Redirect to contracts list.
                Router.navigate('/dashboard');
            } else {
                await this.loadBids(projectId);
                this.refreshStats(projectId);
            }
        } catch (error) {
            // This displays RFC 7807 validation, database conflicts, or optimistic locking errors!
            Toast.show(error.message, 'error');
            // Refresh detailed layout in case version conflicted
            this.afterRender(projectId);
        }
    },

    async loadFreelancerBidState(projectId) {
        const bidActionCard = document.getElementById('bid-action-card');
        bidActionCard.innerHTML = `<div class="skeleton" style="height: 120px;"></div>`;

        try {
            const bids = await HttpClient.get('/bids/my-bids');
            const myBid = bids.find(b => b.project_id === Number(projectId));

            if (myBid) {
                bidActionCard.innerHTML = `
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Your Proposal</h3>
                    <div style="margin-bottom: 1rem;">
                        <span style="font-size: 0.85rem; color: var(--color-text-muted);">Proposed Amount:</span>
                        <div style="font-size: 1.4rem; font-weight: 700; color: var(--color-success);">₹${myBid.bid_amount}</div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <span style="font-size: 0.85rem; color: var(--color-text-muted);">Completion Duration:</span>
                        <div><strong>${myBid.delivery_days} Days</strong></div>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <span style="font-size: 0.85rem; color: var(--color-text-muted);">Proposal Status:</span>
                        <div style="margin-top: 0.25rem;"><span class="badge badge-${myBid.status.toLowerCase()}">${myBid.status}</span></div>
                    </div>
                    <p style="color: var(--color-text-secondary); font-size: 0.85rem; border-top: 1px solid var(--color-border); padding-top: 0.75rem; white-space: pre-line;">${myBid.proposal_text}</p>
                `;
            } else {
                bidActionCard.innerHTML = `
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Submit Quote / Proposal</h3>
                    <form id="bid-submit-form">
                        <div class="form-group">
                            <label class="form-label">Quote Amount (₹)</label>
                            <input type="number" id="bid-amount" class="form-control" required placeholder="35000">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Completion Days</label>
                            <input type="number" id="bid-days" class="form-control" required placeholder="14">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Proposal details & Rate quote</label>
                            <textarea id="bid-proposal" class="form-control" rows="4" required placeholder="Describe your experience and complete rate details..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-success" style="width: 100%; margin-top: 0.5rem;">Submit Proposal</button>
                    </form>
                `;

                document.getElementById('bid-submit-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const bidAmount = document.getElementById('bid-amount').value;
                    const deliveryDays = document.getElementById('bid-days').value;
                    const proposalText = document.getElementById('bid-proposal').value;

                    try {
                        await HttpClient.post('/bids', {
                            project_id: projectId,
                            bid_amount: bidAmount,
                            delivery_days: deliveryDays,
                            proposal_text: proposalText
                        });
                        Toast.show('Proposal submitted successfully!', 'success');
                        this.loadFreelancerBidState(projectId);
                        this.refreshStats(projectId);
                    } catch (error) {
                        Toast.show(error.message, 'error');
                    }
                });
            }
        } catch (error) {
            bidActionCard.innerHTML = `<div style="color: var(--color-danger);">${error.message}</div>`;
        }
    }
};
