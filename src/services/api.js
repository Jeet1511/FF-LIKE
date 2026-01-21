import axios from 'axios';

// Base URL - change for production
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API Methods
export const apiService = {
    // Get API status
    getStatus: async () => {
        const response = await api.get('/');
        return response.data;
    },

    // Send likes
    sendLikes: async (uid, serverName, likeCount = 10) => {
        const response = await api.get('/like', {
            params: { uid, server_name: serverName, like_count: likeCount }
        });
        return response.data;
    },

    // Get MongoDB stats
    getMongoStats: async () => {
        const response = await api.get('/mongodb-stats');
        return response.data;
    },

    // Force refresh tokens
    forceRefresh: async () => {
        const response = await api.get('/force-refresh');
        return response.data;
    },

    // Get daily stats for UID
    getDailyStats: async (uid) => {
        const response = await api.get(`/daily-stats/${uid}`);
        return response.data;
    },

    // Get token stats
    getTokenStats: async () => {
        const response = await api.get('/token-stats');
        return response.data;
    },

    // Debug request
    debugRequest: async (uid, serverName) => {
        const response = await api.get(`/debug-request/${uid}/${serverName}`);
        return response.data;
    }
};

export default api;
