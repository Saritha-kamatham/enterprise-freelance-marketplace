import { HttpClient } from '../services/http-client.js';
import { AuthService } from '../services/auth-service.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';
import { WebSocketService } from '../services/websocket-service.js';

export const ContractView = {
    render(contractId) {
        return `
            <div class="container">
                <div style="margin-bottom: 1.5rem;">
                    <a href="#/dashboard" style="color: var(--color-primary); text-decoration: none; font-size: 0.9rem; display: flex; align-items: center; gap: 0.25rem;">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        Back to dashboard
                    </a>
                </div>

                <div class="dashboard-grid">
                    <!-- Contract & Escrow Milestones -->
                    <div class="span-8">
                        <div class="card" id="contract-detail-card" style="margin-bottom: 1.5rem;">
                            <!-- Load contract info -->
                            <div class="skeleton" style="height: 120px;"></div>
                        </div>

                        <div class="card" style="margin-bottom: 1.5rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                                <h3 style="font-size: 1.2rem; font-weight: 700;">Payment Phases</h3>
                                ${AuthService.isClient() ? `
                                    <button class="btn btn-primary btn-sm" id="btn-add-milestone">Add Payment Phase</button>
                                ` : ''}
                            </div>
                            <div style="overflow-x: auto;">
                                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                                    <thead>
                                        <tr style="border-bottom: 1px solid var(--color-border); color: var(--color-text-muted);">
                                            <th style="padding: 0.75rem 0.5rem;">Phase Title</th>
                                            <th style="padding: 0.75rem 0.5rem;">Amount (₹)</th>
                                            <th style="padding: 0.75rem 0.5rem;">Due Date</th>
                                            <th style="padding: 0.75rem 0.5rem;">Status</th>
                                            ${AuthService.isClient() ? `<th style="padding: 0.75rem 0.5rem; text-align: right;">Actions</th>` : ''}
                                        </tr>
                                    </thead>
                                    <tbody id="milestones-table-body">
                                        <!-- Dynamic milestones -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Workroom Chat Drawer -->
                    <div class="span-4">
                        <div class="card" style="height: 600px; display: flex; flex-direction: column;">
                            <h3 style="font-size: 1.1rem; font-weight: 700; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1rem;">Workroom Chat</h3>
                            
                            <div class="chat-messages" id="chat-box" style="flex: 1; min-height: 0;">
                                <!-- Bubbles -->
                            </div>

                            <!-- Deliverable Uploader & Chat input -->
                            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 0.5rem;">
                                <form id="chat-file-form" style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <input type="file" id="chat-file" style="display: none;">
                                    <button type="button" class="btn btn-secondary btn-sm" id="btn-upload-file" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.25rem;">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                                        Attach File
                                    </button>
                                    <span id="uploaded-file-name" style="font-size: 0.8rem; color: var(--color-success); font-weight: 500;"></span>
                                </form>
                                <form id="chat-input-form" style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="chat-input" class="form-control" placeholder="Type message or paste link..." required style="flex: 1;">
                                    <button type="submit" class="btn btn-primary" style="padding: 0.6rem 1rem;">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Milestone Modal (Clients only) -->
            <div class="modal" id="modal-milestone">
                <div class="modal-content">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 700;">Create Payment Phase</h3>
                        <span id="close-milestone-modal" style="cursor: pointer; font-size: 1.5rem; opacity: 0.7;">&times;</span>
                    </div>
                    <form id="create-milestone-form">
                        <div class="form-group">
                            <label class="form-label">Phase Title</label>
                            <input type="text" id="m-title" class="form-control" required placeholder="e.g. Complete Phase 1 API Setup">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Amount (₹)</label>
                            <input type="number" id="m-amount" class="form-control" required placeholder="15000">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Due Date</label>
                            <input type="datetime-local" id="m-due" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Fund Payment Phase</button>
                    </form>
                </div>
            </div>

            <!-- Review/Completion Modal (Clients only) -->
            <div class="modal" id="modal-review">
                <div class="modal-content">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0;">Complete Contract & Leave Review</h3>
                        <span id="close-review-modal" style="cursor: pointer; font-size: 1.5rem; opacity: 0.7;">&times;</span>
                    </div>
                    <form id="review-form">
                        <div class="form-group">
                            <label class="form-label">Score (1 - 5 stars)</label>
                            <select id="review-score" class="form-control" required>
                                <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                <option value="4">⭐⭐⭐⭐ (Very Good)</option>
                                <option value="3">⭐⭐⭐ (Average)</option>
                                <option value="2">⭐⭐ (Poor)</option>
                                <option value="1">⭐ (Unacceptable)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Public Feedback Comment</label>
                            <textarea id="review-comment" class="form-control" rows="4" required placeholder="Share your experience working with this freelancer..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-success" style="width: 100%; margin-top: 1rem;">Submit Completion</button>
                    </form>
                </div>
            </div>
        `;
    },

    async afterRender(contractId) {
        const contractCard = document.getElementById('contract-detail-card');
        const milestoneModal = document.getElementById('modal-milestone');
        const reviewModal = document.getElementById('modal-review');
        const milestoneForm = document.getElementById('create-milestone-form');
        const reviewForm = document.getElementById('review-form');
        const uploadBtn = document.getElementById('btn-upload-file');
        const fileInput = document.getElementById('chat-file');
        const chatForm = document.getElementById('chat-input-form');
        const chatInput = document.getElementById('chat-input');
        const chatBox = document.getElementById('chat-box');
        const uploadedFileName = document.getElementById('uploaded-file-name');

        let contract = null;
        let otherPartyId = null;

        try {
            // 1. Fetch Contract Info
            contract = await HttpClient.get(`/contracts/${contractId}`);
            otherPartyId = AuthService.isClient() ? contract.freelancer_id : contract.client_id;
            this.renderContractDetail(contract);

            // 2. Fetch Milestones
            await this.loadMilestones(contractId);

            // 3. Fetch Chat History
            await this.loadChatHistory(otherPartyId, contractId);

            // 4. Register client UI triggers
            if (AuthService.isClient()) {
                document.getElementById('btn-add-milestone').addEventListener('click', () => {
                    milestoneModal.style.display = 'flex';
                });
                document.getElementById('close-milestone-modal').addEventListener('click', () => {
                    milestoneModal.style.display = 'none';
                });
                document.getElementById('close-review-modal').addEventListener('click', () => {
                    reviewModal.style.display = 'none';
                });

                milestoneForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const title = document.getElementById('m-title').value;
                    const amount = document.getElementById('m-amount').value;
                    let dueStr = document.getElementById('m-due').value;
                    if (dueStr && dueStr.split(':').length === 2) {
                        dueStr += ':00';
                    }

                    try {
                        await HttpClient.post(`/contracts/${contractId}/milestones`, { title, amount, due_date: dueStr });
                        Toast.show('Payment phase added and funded!', 'success');
                        milestoneModal.style.display = 'none';
                        milestoneForm.reset();
                        await this.loadMilestones(contractId);
                    } catch (err) {
                        Toast.show(err.message, 'error');
                    }
                });
            }

            // 5. File upload attachment handler
            uploadBtn.addEventListener('click', () => fileInput.click());
            
            let uploadedFileUrl = null;
            let originalName = null;

            fileInput.addEventListener('change', async () => {
                if (fileInput.files.length === 0) return;
                const file = fileInput.files[0];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('project_id', contract.project_id);

                try {
                    uploadedFileName.innerText = 'Uploading...';
                    const data = await HttpClient.request('/files/upload', {
                        method: 'POST',
                        body: formData
                    });
                    uploadedFileUrl = data.download_url;
                    originalName = data.original_name;
                    uploadedFileName.innerText = `📎 ${file.name} ready!`;
                    Toast.show('Attachment uploaded successfully!', 'success');
                } catch (err) {
                    uploadedFileName.innerText = '';
                    Toast.show(err.message, 'error');
                }
            });

            // 6. Chat form message send handler
            chatForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                let content = chatInput.value;
                if (uploadedFileUrl) {
                    content += `\n\nDeliverable Attachment: [${originalName}](${uploadedFileUrl})`;
                }

                try {
                    // Send message via REST API (which automatically broadcasts on socket)
                    await HttpClient.post('/chat/send', {
                        receiver_id: otherPartyId,
                        contract_id: contractId,
                        content: content
                    });
                    
                    chatInput.value = '';
                    uploadedFileUrl = null;
                    originalName = null;
                    uploadedFileName.innerText = '';
                    fileInput.value = '';
                } catch (err) {
                    Toast.show(err.message, 'error');
                }
            });

            // 7. Subscribe to WebSocket Chat topic
            WebSocketService.subscribe('/user/queue/chat', (message) => {
                // If message matches current contract conversation, append it
                if (message.contract_id === Number(contractId)) {
                    this.appendChatBubble(message);
                }
            });

        } catch (error) {
            Toast.show(error.message, 'error');
        }
    },

    renderContractDetail(contract) {
        const container = document.getElementById('contract-detail-card');
        const statusBadge = `<span class="badge badge-${contract.status.toLowerCase()}">${contract.status}</span>`;
        const showCompleteBtn = AuthService.isClient() && contract.status === 'ACTIVE';

        container.innerHTML = `
            <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem;">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--color-text-primary);">${contract.project_title}</h2>
                    <div style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.25rem;">
                        Client: <strong>${contract.company_name}</strong> &nbsp;|&nbsp; 
                        Freelancer: <strong>${contract.freelancer_name}</strong>
                    </div>
                </div>
                ${showCompleteBtn ? `
                    <button class="btn btn-success btn-sm" id="btn-complete-contract">Complete Contract</button>
                ` : ''}
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; border-top: 1px solid var(--color-border); padding-top: 0.75rem; font-size: 0.9rem; margin-top: 1rem;">
                <div><span style="color: var(--color-text-muted);">Contract Value:</span> <strong style="display:block; color: var(--color-success); font-size: 1.05rem;">₹${contract.agreed_amount}</strong></div>
                <div><span style="color: var(--color-text-muted);">End Date:</span> <strong style="display:block;">${new Date(contract.end_date).toLocaleDateString()}</strong></div>
                <div><span style="color: var(--color-text-muted);">Status:</span> <div style="margin-top: 0.15rem;">${statusBadge}</div></div>
            </div>
        `;

        if (showCompleteBtn) {
            document.getElementById('btn-complete-contract').addEventListener('click', () => {
                const reviewModal = document.getElementById('modal-review');
                reviewModal.style.display = 'flex';
                
                document.getElementById('review-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const score = document.getElementById('review-score').value;
                    const comment = document.getElementById('review-comment').value;

                    try {
                        // Complete contract first
                        await HttpClient.post(`/contracts/${contract.id}/complete`);
                        // Submit review
                        await HttpClient.post('/reviews', { contract_id: contract.id, score, comment });
                        Toast.show('Contract completed and review submitted!', 'success');
                        reviewModal.style.display = 'none';
                        this.afterRender(contract.id);
                    } catch (err) {
                        Toast.show(err.message, 'error');
                    }
                });
            });
        }
    },

    async loadMilestones(contractId) {
        const tbody = document.getElementById('milestones-table-body');
        tbody.innerHTML = `<tr><td colspan="5"><div class="skeleton" style="height: 50px;"></div></td></tr>`;

        try {
            const milestones = await HttpClient.get(`/contracts/${contractId}/milestones`);
            tbody.innerHTML = '';

            if (milestones.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 1.5rem; color: var(--color-text-muted);">No payment phases configured.</td></tr>`;
                return;
            }

            milestones.forEach(m => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--color-border)';
                
                const actionButton = m.status !== 'RELEASED' && AuthService.isClient()
                    ? `<button class="btn btn-success btn-xs" id="btn-release-${m.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Release</button>`
                    : '-';

                tr.innerHTML = `
                    <td style="padding: 0.75rem 0.5rem; font-weight: 500;">${m.title}</td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--color-success); font-weight: 600;">₹${m.amount}</td>
                    <td style="padding: 0.75rem 0.5rem;">${new Date(m.due_date).toLocaleDateString()}</td>
                    <td style="padding: 0.75rem 0.5rem;"><span class="badge badge-${m.status.toLowerCase()}">${m.status}</span></td>
                    ${AuthService.isClient() ? `<td style="padding: 0.75rem 0.5rem; text-align: right;">${actionButton}</td>` : ''}
                `;

                tbody.appendChild(tr);

                if (m.status !== 'RELEASED' && AuthService.isClient()) {
                    document.getElementById(`btn-release-${m.id}`).addEventListener('click', async () => {
                        try {
                            await HttpClient.patch(`/contracts/${contractId}/milestones/${m.id}/release`);
                            Toast.show('Payment phase funds released!', 'success');
                            await this.loadMilestones(contractId);
                        } catch (err) {
                            Toast.show(err.message, 'error');
                        }
                    });
                }
            });
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="5" style="color: var(--color-danger);">${error.message}</td></tr>`;
        }
    },

    async loadChatHistory(otherUserId, contractId) {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '<div style="text-align: center; color: var(--color-text-muted);">Loading chat history...</div>';

        try {
            const history = await HttpClient.get(`/chat/history/${otherUserId}?contractId=${contractId}`);
            chatBox.innerHTML = '';
            
            history.forEach(msg => {
                this.appendChatBubble(msg);
            });
        } catch (error) {
            chatBox.innerHTML = `<div style="color: var(--color-danger); text-align: center;">${error.message}</div>`;
        }
    },

    appendChatBubble(msg) {
        const chatBox = document.getElementById('chat-box');
        const isMe = msg.sender_email === AuthService.getEmail();
        
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isMe ? 'sent' : 'received'}`;
        
        // Parse simple markdown link syntax for attachments
        let textContent = msg.content;
        const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        textContent = textContent.replace(mdLinkRegex, '<a href="$2" target="_blank" style="color: inherit; text-decoration: underline; font-weight: bold;">$1</a>');

        // Parse UTC timestamp and adjust to user's local timezone (e.g. IST)
        let displayTime = '';
        if (msg.timestamp) {
            const timeStr = typeof msg.timestamp === 'string' && !msg.timestamp.endsWith('Z') ? msg.timestamp + 'Z' : msg.timestamp;
            displayTime = new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        bubble.innerHTML = `
            <div style="font-size: 0.7rem; opacity: 0.8; margin-bottom: 0.25rem; font-weight: bold;">
                ${isMe ? 'You' : msg.sender_email.split('@')[0]}
            </div>
            <div style="word-break: break-word; white-space: pre-line;">${textContent}</div>
            <div style="font-size: 0.65rem; text-align: right; opacity: 0.6; margin-top: 0.25rem;">
                ${displayTime}
            </div>
        `;

        chatBox.appendChild(bubble);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
};
