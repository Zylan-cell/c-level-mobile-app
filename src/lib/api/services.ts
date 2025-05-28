/**
 * API сервисы для работы с различными эндпоинтами
 */

import apiClient from './client';
import { Task, Brief, CLevelPerformance, BusinessMetrics, Feedback, CLevelStrategy, CLevelType } from '@/types';

/**
 * Сервис для работы с задачами
 */
export const TaskService = {
  // Получить все задачи с возможностью фильтрации
  getTasks: async (clevelType?: CLevelType, status?: string) => {
    const params = { clevelType, status };
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },
  
  // Получить конкретную задачу по ID
  getTask: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },
  
  // Создать новую задачу
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  },
  
  // Обновить задачу
  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const response = await apiClient.put(`/tasks/${taskId}`, updates);
    return response.data;
  },
  
  // Удалить задачу
  deleteTask: async (taskId: string) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  }
};

/**
 * Сервис для работы с брифами/отчетами
 */
export const BriefService = {
  // Получить бриф по ID задачи
  getBriefByTaskId: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}/brief`);
    return response.data;
  },
  
  // Получить бриф по ID брифа
  getBrief: async (briefId: string) => {
    const response = await apiClient.get(`/briefs/${briefId}`);
    return response.data;
  },
  
  // Получить все брифы
  getBriefs: async () => {
    const response = await apiClient.get('/briefs');
    return response.data;
  }
};

/**
 * Сервис для работы с дашбордом
 */
export const DashboardService = {
  // Получить бизнес-метрики
  getBusinessMetrics: async (): Promise<BusinessMetrics> => {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  },
  
  // Получить производительность C-Level
  getCLevelPerformance: async (): Promise<CLevelPerformance[]> => {
    const response = await apiClient.get('/dashboard/clevel-performance');
    return response.data;
  },
  
  // Получить последние брифы
  getLatestBriefs: async (limit: number = 5): Promise<Brief[]> => {
    const response = await apiClient.get('/dashboard/latest-briefs', { params: { limit } });
    return response.data;
  },
  
  // Получить проблемные задачи
  getProblematicTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/dashboard/problematic-tasks');
    return response.data;
  }
};

/**
 * Сервис для работы со стратегиями C-Level
 */
export const StrategyService = {
  // Получить стратегию для конкретного C-Level
  getStrategy: async (clevelType: CLevelType): Promise<CLevelStrategy> => {
    const response = await apiClient.get(`/strategies/${clevelType}`);
    return response.data;
  },
  
  // Получить все стратегии
  getAllStrategies: async (): Promise<CLevelStrategy[]> => {
    const response = await apiClient.get('/strategies');
    return response.data;
  }
};

/**
 * Сервис для работы с обратной связью
 */
export const FeedbackService = {
  // Отправить обратную связь
  sendFeedback: async (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const response = await apiClient.post('/feedback', feedback);
    return response.data;
  },
  
  // Получить обратную связь по задаче
  getTaskFeedback: async (taskId: string): Promise<Feedback[]> => {
    const response = await apiClient.get(`/feedback`, { params: { taskId } });
    return response.data;
  }
};

/**
 * Сервис для работы с аутентификацией
 */
export const AuthService = {
  // Вход в систему
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  // Выход из системы
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  
  // Получить текущего пользователя
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  // Обновить токен
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

/**
 * Сервис для интеграции с Telegram
 */
export const TelegramService = {
  // Привязать Telegram аккаунт
  linkTelegramAccount: async (telegramId: string) => {
    const response = await apiClient.post('/integrations/telegram/link', { telegramId });
    return response.data;
  },
  
  // Отвязать Telegram аккаунт
  unlinkTelegramAccount: async () => {
    const response = await apiClient.post('/integrations/telegram/unlink');
    return response.data;
  },
  
  // Отправить тестовое сообщение
  sendTestMessage: async () => {
    const response = await apiClient.post('/integrations/telegram/test-message');
    return response.data;
  }
};
