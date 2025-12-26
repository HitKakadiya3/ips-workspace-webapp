import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Create axios instance for auth endpoints
const authApi = axios.create({
    baseURL: `${BASE_URL}/api/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create axios instance for general API endpoints
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const login = (email, password) => authApi.post('/login', { email, password });
export const register = (name, password, email) => authApi.post('/register', { name, password, email });

// Dashboard endpoints
export const getDashboardData = (userId) => api.get(`/api/dashboard/${userId}`);

// Profile endpoints
export const getProfile = () => api.get('/api/users/me');
export const updateProfile = (userId, data) => api.patch(`/api/users/${userId}`, data);

export default api;
