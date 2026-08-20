import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer Token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('findora_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g. 401 Unauthorized redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        localStorage.removeItem('findora_token');
        localStorage.removeItem('findora_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    } else {
      // Network errors
      console.error('Network Error / Server Unreachable:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
