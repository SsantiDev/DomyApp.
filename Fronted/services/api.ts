import axios from 'axios';
import { API_URL } from '../config/envConfig';
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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ── Skip token refresh for auth endpoints (login will always 401 on wrong password) ──
        const isAuthEndpoint = originalRequest.url?.includes('auth/token');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await authStorage.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh endpoint directly using axios to avoid original interceptors
                const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access, refresh } = response.data;
                await authStorage.saveTokens({ access, refresh });

                api.defaults.headers.common.Authorization = `Bearer ${access}`;
                originalRequest.headers.Authorization = `Bearer ${access}`;

                processQueue(null, access);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // On refresh failure, we might want to logout the user
                // await authStorage.removeTokens(); 
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const status = error.response ? error.response.status : 'NETWORK_ERROR';
        const url = originalRequest ? originalRequest.url : 'unknown';

        // Only log unexpected errors, not normal auth failures handled by the UI
        if (!isAuthEndpoint || status !== 401) {
            console.warn(`[API] [${status}] ${url}: ${error.message}`);
            if (error.response?.data) {
                console.warn('[API] Response data:', JSON.stringify(error.response.data));
            }
        }

        return Promise.reject(error);
    }
);

export default api;
