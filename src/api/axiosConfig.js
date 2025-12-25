import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Log requests for debugging
api.interceptors.request.use((config) => {
    // eslint-disable-next-line no-console
    console.debug('[API Request]', config.method?.toUpperCase(), config.url, config.params || '', config.data || '');
    return config;
}, (error) => {
    
    console.error('[API Request Error]', error);
    return Promise.reject(error);
});

// Log responses for debugging
api.interceptors.response.use((response) => {
    // eslint-disable-next-line no-console
    console.debug('[API Response]', response.status, response.config.url, response.data);
    return response;
}, (error) => {
    // eslint-disable-next-line no-console
    if (error.response) {
        console.error('[API Response Error]', error.response.status, error.response.config.url, error.response.data);
    } else {
        console.error('[API Response Error]', error.message);
    }
    return Promise.reject(error);
});

export default api;