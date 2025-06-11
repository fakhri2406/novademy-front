import axios from 'axios';
import { clearTokens } from '../utils/auth';

const api = axios.create({
    baseURL: 'https://novademy-api.azurewebsites.net/api/v1',
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Handle 204 No Content responses
        if (response.status === 204) {
            return { ...response, data: [] };
        }
        return response;
    },
    async (error) => {
        if (error.response) {
            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(new Error('Your session has expired. Please log in again.'));
            }

            // Handle 404 Not Found
            if (error.response.status === 404) {
                return Promise.reject(new Error('The requested resource was not found.'));
            }

            // Handle 204 No Content
            if (error.response.status === 204) {
                return { data: [] };
            }

            // Handle other errors with messages from the server
            const errorMessage = error.response.data?.message || error.response.data || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
        }

        // Handle network errors
        if (error.request) {
            return Promise.reject(new Error('Network error. Please check your internet connection.'));
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

export default api;