/**
 * API клиент для взаимодействия с бэкендом
 */

import axios from 'axios';

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик запросов для добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Добавляем перехватчик ответов для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Если ошибка 401 (Unauthorized) и запрос еще не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Попытка обновить токен
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          
          // Сохраняем новые токены
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', newRefreshToken);
          
          // Обновляем заголовок и повторяем запрос
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Если не удалось обновить токен, перенаправляем на страницу входа
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
