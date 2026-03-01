import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('satyam_user');
    if (stored) {
        const user = JSON.parse(stored);
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
            console.log(`[ApiDebug] Token attached to ${config.method.toUpperCase()} ${config.url}`);
        } else {
            console.log(`[ApiDebug] No token found in stored user object`);
        }
    } else {
        console.log(`[ApiDebug] No 'satyam_user' found in localStorage`);
    }
    return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('[ApiDebug] 401 Unauthorized detected. Clearing stale session...');
            localStorage.removeItem('satyam_user');
            // We don't force redirect here yet as the components will react to the user state change
            // or the ProtectedRoute will handle it on next navigation.
        }
        return Promise.reject(error);
    }
);

export default api;
