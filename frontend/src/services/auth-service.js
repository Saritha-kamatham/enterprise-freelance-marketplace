// Session and Authentication Service
export const AuthService = {
    saveSession(authResponse) {
        localStorage.setItem('jwt_token', authResponse.token);
        localStorage.setItem('user_id', authResponse.user_id);
        localStorage.setItem('user_email', authResponse.email);
        localStorage.setItem('user_role', authResponse.role);
        localStorage.setItem('user_name', authResponse.name || '');
    },

    clearSession() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
    },

    getToken() {
        return localStorage.getItem('jwt_token');
    },

    getUserId() {
        return localStorage.getItem('user_id');
    },

    getEmail() {
        return localStorage.getItem('user_email');
    },

    getRole() {
        return localStorage.getItem('user_role');
    },

    getName() {
        return localStorage.getItem('user_name') || (this.getEmail() ? this.getEmail().split('@')[0] : '');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    isClient() {
        return this.getRole() === 'CLIENT';
    },

    isFreelancer() {
        return this.getRole() === 'FREELANCER';
    }
};
