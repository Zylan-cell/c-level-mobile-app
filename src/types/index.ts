// Типы данных для C-Level мобильного приложения

// Типы C-Level руководителей
export type CLevelType = 'COO' | 'CMO' | 'CCO' | 'CTO' | 'CFO' | 'CEO' | 'CHRO';

// Статус задачи
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

// Интерфейс для бизнес-метрик
export interface BusinessMetrics {
  ltv: number;
  mrr: number;
  cashFlow: number;
}

// Интерфейс для производительности C-Level
export interface CLevelPerformance {
  clevelType: CLevelType;
  completedKpis: number;
  totalKpis: number;
  confidenceScore: number; // 1-100
  positiveNotes: string[];
  negativeNotes: string[];
}

// Интерфейс для задачи
export interface Task {
  id: string;
  title: string;
  description: string;
  clevelType: CLevelType;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  briefId?: string;
}

// Интерфейс для брифа/отчета
export interface Brief {
  id: string;
  taskId: string;
  content: string;
  createdAt: string;
  recommendations?: string[];
}

// Интерфейс для обратной связи
export interface Feedback {
  id: string;
  taskId?: string;
  briefId?: string;
  content: string;
  rating: number; // 1-5
  createdAt: string;
}

// Интерфейс для пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  telegramId?: string;
  preferences?: UserPreferences;
}

// Интерфейс для пользовательских настроек
export interface UserPreferences {
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

// Интерфейс для стратегии C-Level
export interface CLevelStrategy {
  clevelType: CLevelType;
  title: string;
  description: string;
  objectives: string[];
  kpis: string[];
}

// Интерфейс для KPI в стратегии
export interface StrategyKPI {
  title: string;
  target: string;
  current: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

// Интерфейс для цели в стратегии
export interface StrategyObjective {
  title: string;
  description: string;
  kpis: StrategyKPI[];
}

// Расширенный интерфейс для стратегии
export interface Strategy {
  title: string;
  description: string;
  objectives: StrategyObjective[];
  createdAt: string;
  updatedAt: string;
}
