import axios from 'axios';

export const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:3001/api';
export const MOBILITY_API_URL = import.meta.env.VITE_MOBILITY_API_URL || 'http://localhost:3002/api';
export const LOGISTICS_API_URL = import.meta.env.VITE_LOGISTICS_API_URL || 'http://localhost:3000/api/v1';
export const FINTECH_API_URL = import.meta.env.VITE_FINTECH_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: ADMIN_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const createClient = (baseURL: string, tokenKey: string = 'admin_token') => {
    const instance = axios.create({
        baseURL,
        headers: { 'Content-Type': 'application/json' },
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem(tokenKey);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem(tokenKey);
                localStorage.removeItem('admin_user');
                window.location.href = '/';
            }
            return Promise.reject(error);
        }
    );
    return instance;
};

export const adminApiInstance = createClient(ADMIN_API_URL);
export const mobilityApiInstance = createClient(MOBILITY_API_URL);
export const logisticsApiInstance = createClient(LOGISTICS_API_URL);
export const platformApiInstance = createClient(import.meta.env.VITE_PLATFORM_API_URL || 'http://localhost:3004/api/v1');

export default adminApiInstance;
