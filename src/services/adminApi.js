import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance for admin API calls
const adminApi = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - logout
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH SERVICES ====================

export const adminAuthService = {
    login: async (username, password) => {
        const response = await adminApi.post('/login', { username, password });
        if (response.data.data.token) {
            localStorage.setItem('adminToken', response.data.data.token);
            localStorage.setItem('adminUser', JSON.stringify({
                username: response.data.data.username,
                email: response.data.data.email
            }));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
    },

    verifyToken: async () => {
        const response = await adminApi.get('/verify');
        return response.data;
    },

    changePassword: async (oldPassword, newPassword) => {
        const response = await adminApi.post('/change-password', {
            old_password: oldPassword,
            new_password: newPassword
        });
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('adminToken');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('adminUser');
        return user ? JSON.parse(user) : null;
    }
};

// ==================== DASHBOARD SERVICES ====================

export const dashboardService = {
    getStats: async (days = 7) => {
        const response = await adminApi.get(`/dashboard/stats?days=${days}`);
        return response.data;
    },

    getRecentLikes: async (limit = 50) => {
        const response = await adminApi.get(`/dashboard/recent-likes?limit=${limit}`);
        return response.data;
    }
};

// ==================== SERVER SERVICES ====================

export const serverService = {
    getAll: async () => {
        const response = await adminApi.get('/servers');
        return response.data;
    }
};

// ==================== ACCOUNT SERVICES ====================

export const accountService = {
    getAll: async (serverFilter = null) => {
        const url = serverFilter ? `/accounts?server=${serverFilter}` : '/accounts';
        const response = await adminApi.get(url);
        return response.data;
    },

    add: async (accountData) => {
        const response = await adminApi.post('/accounts', accountData);
        return response.data;
    },

    update: async (accountId, accountData) => {
        const response = await adminApi.put(`/accounts/${accountId}`, accountData);
        return response.data;
    },

    delete: async (accountId) => {
        const response = await adminApi.delete(`/accounts/${accountId}`);
        return response.data;
    }
};

// ==================== TOKEN SERVICES ====================

export const tokenService = {
    refresh: async (server = null) => {
        const response = await adminApi.post('/tokens/refresh', server ? { server } : {});
        return response.data;
    },

    getStatus: async () => {
        const response = await adminApi.get('/tokens/status');
        return response.data;
    }
};

export default adminApi;
