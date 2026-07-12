// Session and Authentication Service
export const AuthService = {
    saveSession(authResponse) {
        localStorage.setItem('jwt_token', authResponse.token);
        localStorage.setItem('user_id', authResponse.user_id);
        localStorage.setItem('user_email', authResponse.email);
        localStorage.setItem('user_role', authResponse.role);
    },

    clearSession() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
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
