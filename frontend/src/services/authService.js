import api from '../utils/api';

// All authentication-related API calls
export const authService = {
    // Login user
    login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    },

    // Register new user
    register: async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        return data;
    },

    // Get all users (admin only)
    getAllUsers: async () => {
        const { data } = await api.get('/auth/users');
        return data;
    },

    // Get current user profile
    getProfile: async () => {
        const { data } = await api.get('/auth/profile');
        return data;
    }
};

export default authService;
