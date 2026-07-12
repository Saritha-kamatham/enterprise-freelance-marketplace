import { AuthService } from './auth-service.js';
import { API_BASE } from '../config.js';
import { Toast } from '../components/toast.js';

export const HttpClient = {
    async request(path, options = {}) {
        const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
        
        options.headers = options.headers || {};
        const token = AuthService.getToken();
        
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (options.body && !(options.body instanceof FormData)) {
            options.headers['Content-Type'] = 'application/json';
            if (typeof options.body === 'object') {
                options.body = JSON.stringify(options.body);
            }
        }

        try {
            const response = await fetch(url, options);

            if (response.status === 401) {
                AuthService.clearSession();
                Toast.show('Session expired. Please log in again.', 'error');
                // Dispatch event to router to redirect
                window.dispatchEvent(new CustomEvent('auth-expired'));
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                let errorDetail = 'An unexpected error occurred';
                try {
                    const problemDetail = await response.json();
                    errorDetail = problemDetail.detail || problemDetail.title || errorDetail;
                    if (problemDetail.errors) {
                        // RFC 7807 field validation errors
                        const fieldErrors = Object.entries(problemDetail.errors)
                            .map(([field, msg]) => `${field}: ${msg}`)
                            .join(', ');
                        errorDetail += ` (${fieldErrors})`;
                    }
                } catch (ignored) {}
                throw new Error(errorDetail);
            }

            // Return empty object for 204/no content, otherwise parse json
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    get(path, options = {}) {
        return this.request(path, { ...options, method: 'GET' });
    },

    post(path, body, options = {}) {
        return this.request(path, { ...options, method: 'POST', body });
    },

    put(path, body, options = {}) {
        return this.request(path, { ...options, method: 'PUT', body });
    },

    patch(path, body, options = {}) {
        return this.request(path, { ...options, method: 'PATCH', body });
    },

    delete(path, options = {}) {
        return this.request(path, { ...options, method: 'DELETE' });
    }
};
