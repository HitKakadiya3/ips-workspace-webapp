import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (email, password) => api.post('/login', { email, password });
export const register = (name, password, email) => api.post('/register', { name, password, email });

export default api;
