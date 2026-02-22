import axios from 'axios';
import { API_URL } from '../config/env';
import * as authStorage from './authStorage';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await authStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
