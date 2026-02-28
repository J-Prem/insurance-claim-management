import axios from 'axios';

// Auth endpoints don't need the JWT interceptor
const authAxios = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

export const registerUser = (userData) =>
    authAxios.post('/api/auth/register', userData);

export const loginUser = (credentials) =>
    authAxios.post('/api/auth/login', credentials);
