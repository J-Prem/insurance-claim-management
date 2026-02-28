import axios from 'axios';
import { getToken, removeToken, isTokenExpired } from '../utils/jwtUtils';

const API_BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        // Check expiry before every request
        if (isTokenExpired()) {
            removeToken();
            window.location.href = '/login';
            return Promise.reject(new Error('Token expired'));
        }

        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401/403
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
