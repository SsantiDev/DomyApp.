import axios from 'axios';
import { API_URL } from '../config/env';
import * as authStorage from './authStorage';

const api = axios.create({
    baseURL: `${API_URL}/api/`,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await authStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : 'NETWORK_ERROR';
        const url = error.config ? error.config.url : 'unknown';
        console.error(`[API Response Error] [${status}] ${url}:`, error.message);
        if (error.response?.data) {
            console.error('[API Error Data]', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;
