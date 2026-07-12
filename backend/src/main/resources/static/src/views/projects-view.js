import { HttpClient } from '../services/http-client.js';
import { AuthService } from '../services/auth-service.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';
import { WebSocketService } from '../services/websocket-service.js';

export const ProjectsView = {
    render() {
        const isClient = AuthService.isClient();
        return `
            <div class="container">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                    <div>
                        <h1 style="font-size: 2rem; font-weight: 700; color: var(--color-text-primary);">Browse Requirements / Briefs</h1>
                        <p style="color: var(--color-text-secondary);">Find high-value contracts or post new project requirements</p>
                    </div>
                    ${isClient ? `
                        <button class="btn btn-primary" id="btn-create-project">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            Post Work Requirement
                        </button>
                    ` : ''}
                </div>

                <!-- Filters & Search Bar -->
                <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Search Skills</label>
                            <input type="text" id="filter-skills" class="form-control" placeholder="e.g. Spring Boot, Figma">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Category</label>
                            <select id="filter-category" class="form-control">
                                <option value="">All Categories</option>
                                <option value="Software Development">Software Development</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Security">Security</option>
                                <option value="AI & Machine Learning">AI & Machine Learning</option>
                                <option value="Data Science & Analytics">Data Science & Analytics</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Min Budget (₹)</label>
                            <input type="number" id="filter-min-budget" class="form-control" placeholder="0">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label class="form-label">Max Budget (₹)</label>
                            <input type="number" id="filter-max-budget" class="form-control" placeholder="15000">
                        </div>
                        <div>
                            <button class="btn btn-primary" id="btn-apply-filters" style="width: 100%;">
                                Filter List
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Project List Container -->
                <div id="project-list" style="display: flex; flex-direction: column; gap: 1.25rem;">
                    <!-- Skeleton loaders inserted here during fetching -->
                </div>
            </div>

            <!-- Create Project Modal (Clients only) -->
            <div class="modal" id="modal-project">
                <div class="modal-content">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 700;">Post a Work Requirement</h3>
                        <span id="close-modal" style="cursor: pointer; font-size: 1.5rem; opacity: 0.7;">&times;</span>
                    </div>
                    <form id="create-project-form">
                        <div class="form-group">
                            <label class="form-label">Project Title</label>
                            <input type="text" id="proj-title" class="form-control" required placeholder="e.g. Build REST Gateway Client">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description Brief</label>
                            <textarea id="proj-desc" class="form-control" rows="4" required placeholder="Describe requirements, timelines, deliverables..."></textarea>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Category</label>
                                <select id="proj-cat" class="form-control" required>
                                    <option value="Software Development">Software Development</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                    <option value="DevOps">DevOps</option>
                                    <option value="Security">Security</option>
                                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Required Skills (Comma separated)</label>
                                <input type="text" id="proj-skills" class="form-control" placeholder="Java, Docker">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Min Budget (₹)</label>
                                <input type="number" id="proj-min" class="form-control" required placeholder="1000">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Budget (₹)</label>
                                <input type="number" id="proj-max" class="form-control" required placeholder="5000">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Deadline Date</label>
                            <input type="datetime-local" id="proj-deadline" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Post Requirement</button>
                    </form>
                </div>
            </div>
        `;
    },

    async afterRender() {
        const listContainer = document.getElementById('project-list');
        const modal = document.getElementById('modal-project');
        const createForm = document.getElementById('create-project-form');

        // Initial skeleton loaders
        this.renderSkeletons();

        // Load project entries
        await this.loadProjects();

        // Setup Create Project Modal event listeners
        if (AuthService.isClient()) {
            document.getElementById('btn-create-project').addEventListener('click', () => {
                modal.style.display = 'flex';
            });
            document.getElementById('close-modal').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            window.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });

            createForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const title = document.getElementById('proj-title').value;
                const description = document.getElementById('proj-desc').value;
                const category = document.getElementById('proj-cat').value;
                const requiredSkills = document.getElementById('proj-skills').value;
                const budgetMin = document.getElementById('proj-min').value;
                const budgetMax = document.getElementById('proj-max').value;
                let deadlineStr = document.getElementById('proj-deadline').value; // e.g. "2026-07-20T12:00"
                
                // Spring LocalDateTime expects YYYY-MM-DDTHH:mm:ss. Appending seconds if missing
                if (deadlineStr && deadlineStr.split(':').length === 2) {
                    deadlineStr += ':00';
                }

                try {
                    await HttpClient.post('/projects', {
                        title, description, category,
                        required_skills: requiredSkills,
                        budget_min: budgetMin,
                        budget_max: budgetMax,
                        deadline: deadlineStr
                    });
                    Toast.show('Project posted successfully!', 'success');
                    modal.style.display = 'none';
                    createForm.reset();
                    // Reload projects
                    this.renderSkeletons();
                    await this.loadProjects();
                } catch (error) {
                    Toast.show(error.message, 'error');
                }
            });
        }

        // Apply filters click handler
        document.getElementById('btn-apply-filters').addEventListener('click', async () => {
            this.renderSkeletons();
            await this.loadProjects();
        });

        // WebSocket subscription for new projects
        WebSocketService.subscribe('/topic/projects', (newProject) => {
            Toast.show(`New Project Posted: ${newProject.title}`, 'info');
            this.insertProjectItem(newProject, true); // Prepend to UI list with highlight
        });
    },

    renderSkeletons() {
        const listContainer = document.getElementById('project-list');
        listContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            listContainer.innerHTML += `
                <div class="card skeleton" style="height: 140px;"></div>
            `;
        }
    },

    async loadProjects() {
        const skills = document.getElementById('filter-skills').value;
        const category = document.getElementById('filter-category').value;
        const minBudget = document.getElementById('filter-min-budget').value;
        const maxBudget = document.getElementById('filter-max-budget').value;

        let query = '?page=0&size=20';
        if (skills) query += `&skills=${encodeURIComponent(skills)}`;
        if (category) query += `&category=${encodeURIComponent(category)}`;
        if (minBudget) query += `&minBudget=${minBudget}`;
        if (maxBudget) query += `&maxBudget=${maxBudget}`;

        try {
            const data = await HttpClient.get(`/projects${query}`);
            const listContainer = document.getElementById('project-list');
            listContainer.innerHTML = '';

            if (data.content.length === 0) {
                listContainer.innerHTML = `
                    <div class="card" style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                        No projects match your current filters.
                    </div>
                `;
                return;
            }

            data.content.forEach(project => {
                this.insertProjectItem(project, false);
            });
        } catch (error) {
            Toast.show('Failed to fetch projects', 'error');
        }
    },

    insertProjectItem(project, prepend = false) {
        const listContainer = document.getElementById('project-list');
        const itemHtml = `
            <div class="card project-item" id="project-card-${project.id}" style="transition: var(--transition-smooth); cursor: pointer;" onclick="window.location.hash = '#/project/${project.id}'">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem;">
                    <div>
                        <span class="badge badge-open" style="margin-bottom: 0.5rem;">${project.category}</span>
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary);">${project.title}</h3>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 1.2rem; font-weight: 700; color: var(--color-success);">₹${project.budget_min} - ₹${project.budget_max}</span>
                        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.25rem;">Est. Budget</div>
                    </div>
                </div>
                <p style="color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1rem;">
                    ${project.description}
                </p>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: var(--color-text-muted);">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${project.required_skills ? project.required_skills.split(',').map(skill => `<span style="background-color: var(--color-bg-base); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">${skill}</span>`).join('') : ''}
                    </div>
                    <div>Quotes submitted: <strong>${project.bid_count}</strong></div>
                </div>
            </div>
        `;

        if (prepend) {
            // Remove empty screen banner if present
            if (listContainer.innerHTML.includes('No projects match')) {
                listContainer.innerHTML = '';
            }
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = itemHtml;
            const newCard = tempDiv.firstElementChild;
            newCard.style.borderLeft = '4px solid var(--color-primary)';
            
            listContainer.prepend(newCard);
            
            // Revert left border color after 3 seconds
            setTimeout(() => {
                newCard.style.borderLeft = '1px solid var(--color-border)';
            }, 3000);
        } else {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = itemHtml;
            listContainer.appendChild(tempDiv.firstElementChild);
        }
    }
};
