import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        window.dispatchEvent(new Event('api-loading-start'));
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        window.dispatchEvent(new Event('api-loading-end'));
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        window.dispatchEvent(new Event('api-loading-end'));
        return response;
    },
    (error) => {
        window.dispatchEvent(new Event('api-loading-end'));
        return Promise.reject(error);
    }
);

export default api;
