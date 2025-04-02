import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/refresh', { refresh_token: refreshToken });
        const { tokens } = response.data;

        localStorage.setItem('accessToken', tokens.access_token);
        localStorage.setItem('refreshToken', tokens.refresh_token);
        originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;

        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/signin';
      }
    }

    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/signin', credentials);
    const { tokens, user } = response.data;
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
    return { user, tokens };
  },

  register: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/signup', credentials);
    return response.data;
  },

  forgotPassword: async (data: { email: string; password: string }) => {
    const response = await api.put('/forget-password', data);
    return response.data;
  },

  deleteProfile: async (data: { email: string; password: string }) => {
    const response = await api.post('/delete-profile', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

export default api; 