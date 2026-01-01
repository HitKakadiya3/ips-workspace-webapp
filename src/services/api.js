import axios from 'axios';
import store from '../store/store';
import { updateToken, logout } from '../store/slices/authSlice';

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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                store.dispatch(logout());
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await authApi.post('/refresh', { refreshToken });
                const { token, refreshToken: newRefreshToken } = response.data.data || response.data;

                store.dispatch(updateToken({ token, refreshToken: newRefreshToken }));

                processQueue(null, token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                store.dispatch(logout());
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
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
