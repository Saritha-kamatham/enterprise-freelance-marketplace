import { HttpClient } from '../services/http-client.js';
import { AuthService } from '../services/auth-service.js';
import { Router } from '../router.js';
import { Toast } from '../components/toast.js';
import { WebSocketService } from '../services/websocket-service.js';
import { GOOGLE_CLIENT_ID } from '../config.js';

export const HomeView = {
    render() {
        return `
            <div class="container" style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
                <div class="dashboard-grid" style="width: 100%;">
                    <div class="span-8" style="padding-right: 2rem; display: flex; flex-direction: column; justify-content: center;">
                        <h1 style="font-size: 3rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem; background: linear-gradient(to right, var(--color-primary), var(--color-success)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            Build Enterprise Solutions with Elite Service Providers.
                        </h1>
                        <p style="font-size: 1.15rem; color: var(--color-text-secondary); margin-bottom: 2rem;">
                            Deploy highly secured order management, real-time tracking, contract compliance engines, and automated payment phases. Connect directly via secure WebSockets.
                        </p>
                        <div style="display: flex; gap: 1rem;">
                            <div class="stat-card" style="flex: 1; text-align: center;">
                                <div class="stat-value">12,000+</div>
                                <div class="stat-label">Agreements Completed</div>
                            </div>
                            <div class="stat-card" style="flex: 1; text-align: center;">
                                <div class="stat-value">4.9/5</div>
                                <div class="stat-label">Client Rating</div>
                            </div>
                            <div class="stat-card" style="flex: 1; text-align: center;">
                                <div class="stat-value">₹150 Cr+</div>
                                <div class="stat-label">Payments Released</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="span-4">
                        <div class="card" id="auth-card">
                            <h2 id="auth-title" style="margin-bottom: 1.5rem; text-align: center; color: var(--color-text-primary);">Access Platform</h2>
                            
                            <form id="login-form">
                                <div class="form-group">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" id="login-email" class="form-control" placeholder="client1@marketplace.com" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input type="password" id="login-password" class="form-control" placeholder="••••••••" required>
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Sign In</button>
                            </form>

                            <form id="register-form" style="display: none;">
                                <div class="form-group">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" id="reg-email" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Password</label>
                                    <input type="password" id="reg-password" class="form-control" placeholder="Min 6 characters" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Account Type</label>
                                    <select id="reg-role" class="form-control" required>
                                        <option value="CLIENT">Client / Employer (Hire Providers)</option>
                                        <option value="FREELANCER">Service Provider / Freelancer (Submit Quotes)</option>
                                    </select>
                                </div>
                                <div class="form-group" id="group-fullname" style="display: none;">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" id="reg-fullname" class="form-control">
                                </div>
                                <div class="form-group" id="group-company">
                                    <label class="form-label">Company Name</label>
                                    <input type="text" id="reg-company" class="form-control">
                                </div>
                                <button type="submit" class="btn btn-success" style="width: 100%; margin-top: 1rem;">Create Account</button>
                            </form>

                            <!-- Google Login Section -->
                            <div style="margin: 1.5rem 0; display: flex; align-items: center; justify-content: center; width: 100%;">
                                <span style="border-top: 1px solid var(--color-border); flex-grow: 1;"></span>
                                <span style="padding: 0 10px; color: var(--color-text-secondary); font-size: 0.85rem;">or</span>
                                <span style="border-top: 1px solid var(--color-border); flex-grow: 1;"></span>
                            </div>
                            <div id="google-btn" style="display: flex; justify-content: center; width: 100%;"></div>

                            <div style="margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: var(--color-text-secondary);">
                                <span id="toggle-text">Need an account?</span>
                                <a id="toggle-auth" style="color: var(--color-primary); cursor: pointer; font-weight: 600; margin-left: 0.25rem;">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Google Sign-Up Role Selection Modal -->
            <div id="role-modal" class="modal" style="display: none; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000;">
                <div class="modal-content" style="max-width: 450px; background: var(--color-bg-secondary); padding: 2rem; border-radius: 12px; width: 90%;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; color: var(--color-text-primary);">Complete Your Profile</h3>
                    
                    <div class="form-group">
                        <label class="form-label">Account Type</label>
                        <select id="google-reg-role" class="form-control" required>
                            <option value="CLIENT">Client / Employer (Hire Providers)</option>
                            <option value="FREELANCER">Service Provider / Freelancer (Submit Quotes)</option>
                        </select>
                    </div>
                    <div class="form-group" id="google-group-fullname" style="display: none;">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="google-reg-fullname" class="form-control">
                    </div>
                    <div class="form-group" id="google-group-company">
                        <label class="form-label">Company Name</label>
                        <input type="text" id="google-reg-company" class="form-control">
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button id="cancel-role-btn" class="btn btn-secondary" style="flex: 1;">Cancel</button>
                        <button id="submit-role-btn" class="btn btn-primary" style="flex: 1;">Submit</button>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const toggleAuth = document.getElementById('toggle-auth');
        const toggleText = document.getElementById('toggle-text');
        const authTitle = document.getElementById('auth-title');
        const regRole = document.getElementById('reg-role');
        const groupFullname = document.getElementById('group-fullname');
        const groupCompany = document.getElementById('group-company');

        let isLogin = true;

        toggleAuth.addEventListener('click', () => {
            isLogin = !isLogin;
            if (isLogin) {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                authTitle.innerText = 'Access Platform';
                toggleText.innerText = 'Need an account?';
                toggleAuth.innerText = 'Sign Up';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                authTitle.innerText = 'Create Account';
                toggleText.innerText = 'Already registered?';
                toggleAuth.innerText = 'Sign In';
            }
        });

        regRole.addEventListener('change', (e) => {
            if (e.target.value === 'CLIENT') {
                groupCompany.style.display = 'block';
                groupFullname.style.display = 'none';
            } else {
                groupCompany.style.display = 'none';
                groupFullname.style.display = 'block';
            }
        });

        // Initialize Google Sign-In Programmatically
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    await handleGoogleLogin(response.credential);
                }
            });
            window.google.accounts.id.renderButton(
                document.getElementById('google-btn'),
                { theme: 'outline', size: 'large', width: 280 }
            );
        }

        async function handleGoogleLogin(credential) {
            try {
                const response = await HttpClient.post('/auth/google', { credential });
                if (response.rolePending) {
                    // Show role selection modal
                    const roleModal = document.getElementById('role-modal');
                    roleModal.style.display = 'flex';
                    
                    const submitBtn = document.getElementById('submit-role-btn');
                    const cancelBtn = document.getElementById('cancel-role-btn');
                    const googleRole = document.getElementById('google-reg-role');
                    const googleFullnameGroup = document.getElementById('google-group-fullname');
                    const googleCompanyGroup = document.getElementById('google-group-company');
                    
                    googleRole.onchange = (e) => {
                        if (e.target.value === 'CLIENT') {
                            googleCompanyGroup.style.display = 'block';
                            googleFullnameGroup.style.display = 'none';
                        } else {
                            googleCompanyGroup.style.display = 'none';
                            googleFullnameGroup.style.display = 'block';
                        }
                    };
                    
                    cancelBtn.onclick = () => {
                        roleModal.style.display = 'none';
                    };
                    
                    submitBtn.onclick = async () => {
                        const selectedRole = googleRole.value;
                        const fullName = document.getElementById('google-reg-fullname').value;
                        const companyName = document.getElementById('google-reg-company').value;
                        
                        try {
                            const regResponse = await HttpClient.post('/auth/google/register', {
                                regToken: response.regToken,
                                role: selectedRole,
                                fullName: selectedRole === 'FREELANCER' ? fullName : null,
                                companyName: selectedRole === 'CLIENT' ? companyName : null
                            });
                            
                            roleModal.style.display = 'none';
                            AuthService.saveSession(regResponse);
                            Toast.show('Google Sign-Up successful!', 'success');
                            WebSocketService.connect();
                            Router.navigate('/dashboard');
                            window.dispatchEvent(new CustomEvent('auth-changed'));
                        } catch (err) {
                            Toast.show(err.message, 'error');
                        }
                    };
                } else {
                    // Direct login success
                    AuthService.saveSession(response.authResponse);
                    Toast.show('Google Login successful!', 'success');
                    WebSocketService.connect();
                    Router.navigate('/dashboard');
                    window.dispatchEvent(new CustomEvent('auth-changed'));
                }
            } catch (error) {
                Toast.show(error.message, 'error');
            }
        }

        // Submit handlers
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await HttpClient.post('/auth/login', { email, password });
                AuthService.saveSession(response);
                Toast.show('Login successful!', 'success');
                
                // Initialize web socket
                WebSocketService.connect();
                
                Router.navigate('/dashboard');
                // Refresh layout navigation
                window.dispatchEvent(new CustomEvent('auth-changed'));
            } catch (error) {
                Toast.show(error.message, 'error');
            }
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const role = regRole.value;
            const fullName = document.getElementById('reg-fullname').value;
            const companyName = document.getElementById('reg-company').value;

            try {
                const response = await HttpClient.post('/auth/register', {
                    email, password, role,
                    full_name: fullName,
                    company_name: companyName
                });
                AuthService.saveSession(response);
                Toast.show('Account created successfully!', 'success');
                
                // Initialize web socket
                WebSocketService.connect();
                
                Router.navigate('/dashboard');
                window.dispatchEvent(new CustomEvent('auth-changed'));
            } catch (error) {
                Toast.show(error.message, 'error');
            }
        });
    }
};
