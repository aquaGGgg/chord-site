import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: 'https://a34433-cd5b.k.d-f.pw/api',
});

// Добавляем access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor для обработки 401 и автоматического обновления access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await authService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // повторяем оригинальный запрос
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // перенаправляем на логин
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
