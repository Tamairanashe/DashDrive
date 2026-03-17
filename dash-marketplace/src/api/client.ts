import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('dash_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
