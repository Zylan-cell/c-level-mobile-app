// Импорты должны быть в начале файла
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Моки для компонентов
const mockMetricsCardImpl = jest.fn();
const mockCLevelPerformanceCardImpl = jest.fn();
const mockLatestBriefsCardImpl = jest.fn();
const mockProblematicTasksCardImpl = jest.fn();

// Мокируем компоненты дашборда
jest.mock('@/components/dashboard/MetricsCard', () => ({
  MetricsCard: (props: any) => {
    mockMetricsCardImpl(props);
    return <div data-testid="metrics-card">Metrics Card</div>;
  }
}));

jest.mock('@/components/dashboard/CLevelPerformanceCard', () => ({
  CLevelPerformanceCard: (props: any) => {
    mockCLevelPerformanceCardImpl(props);
    return <div data-testid="performance-card">Performance Card</div>;
  }
}));

jest.mock('@/components/dashboard/LatestBriefsCard', () => ({
  LatestBriefsCard: (props: any) => {
    mockLatestBriefsCardImpl(props);
    return <div data-testid="briefs-card">Latest Briefs</div>;
  }
}));

jest.mock('@/components/dashboard/ProblematicTasksCard', () => ({
  ProblematicTasksCard: (props: any) => {
    mockProblematicTasksCardImpl(props);
    return <div data-testid="tasks-card">Problematic Tasks</div>;
  }
}));

// Мокируем модуль next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// Мокируем мок-данные
jest.mock('@/lib/mock-data', () => {
  // Определяем данные внутри мока
  const mockBusinessMetrics = {
    ltv: 1500,
    mrr: 50000,
    cashFlow: 20000
  };
  
  const mockCLevelPerformance = [
    {
      clevelType: 'COO',
      title: 'Chief Operating Officer',
      kpiScore: 7,
      totalKpis: 10,
      confidenceScore: 85
    },
    {
      clevelType: 'CMO',
      title: 'Chief Marketing Officer',
      kpiScore: 5,
      totalKpis: 8,
      confidenceScore: 75
    }
  ];
  
  return {
    mockBusinessMetrics,
    mockCLevelPerformance,
    mockBriefs: [],
    mockTasks: []
  };
});

// Импортируем после моков
import DashboardPage from '@/app/dashboard/page';

// Определяем тестовые данные для использования в тестах
const testBusinessMetrics = {
  ltv: 1500,
  mrr: 50000,
  cashFlow: 20000
};

const testCLevelPerformance = [
  {
    clevelType: 'COO',
    title: 'Chief Operating Officer',
    kpiScore: 7,
    totalKpis: 10,
    confidenceScore: 85
  },
  {
    clevelType: 'CMO',
    title: 'Chief Marketing Officer',
    kpiScore: 5,
    totalKpis: 8,
    confidenceScore: 75
  }
];

describe('Dashboard Page Interaction Tests', () => {
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
  });

  test('should render dashboard components', async () => {
    // Рендерим страницу дашборда
    render(<DashboardPage />);

    // Проверяем, что все компоненты были вызваны с правильными параметрами
    expect(mockMetricsCardImpl).toHaveBeenCalledWith(
      expect.objectContaining({
        metrics: expect.anything(),
        isLoading: false
      })
    );

    expect(mockCLevelPerformanceCardImpl).toHaveBeenCalledWith(
      expect.objectContaining({
        performances: expect.anything(),
        isLoading: false
      })
    );

    expect(mockLatestBriefsCardImpl).toHaveBeenCalled();
    expect(mockProblematicTasksCardImpl).toHaveBeenCalled();
  });
});

