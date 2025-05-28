import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '@/app/dashboard/page';
import { useDashboardStore } from '@/lib/store/dashboardStore';
import { useTaskStore } from '@/lib/store/taskStore';
import { useBriefStore } from '@/lib/store/briefStore';
import { CLevelType, TaskStatus, Brief, Task } from '@/types';

// Импортируем мок для Firebase
import '../__mocks__/firebase';

// Мокаем хранилища
jest.mock('@/lib/store/dashboardStore', () => ({
  useDashboardStore: jest.fn()
}));

jest.mock('@/lib/store/taskStore', () => ({
  useTaskStore: jest.fn()
}));

jest.mock('@/lib/store/briefStore', () => ({
  useBriefStore: jest.fn()
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Настраиваем моки для хранилищ
    const fetchBusinessMetricsMock = jest.fn().mockResolvedValue({
      ltv: 1200,
      mrr: 50000,
      cashFlow: 75000
    });
    
    const fetchCLevelPerformanceMock = jest.fn().mockResolvedValue([
      {
        clevelType: 'CEO' as CLevelType,
        completedKpis: 8,
        totalKpis: 10,
        confidenceScore: 85,
        positiveNotes: ['Excellent leadership', 'Strategic vision'],
        negativeNotes: ['Communication could be improved']
      },
      {
        clevelType: 'CTO' as CLevelType,
        completedKpis: 7,
        totalKpis: 10,
        confidenceScore: 75,
        positiveNotes: ['Technical expertise', 'Innovation'],
        negativeNotes: ['Project delays']
      }
    ]);
    
    (useDashboardStore as unknown as jest.Mock).mockReturnValue({
      businessMetrics: {
        ltv: 1200,
        mrr: 50000,
        cashFlow: 75000
      },
      clevelPerformance: [
        {
          clevelType: 'CEO' as CLevelType,
          completedKpis: 8,
          totalKpis: 10,
          confidenceScore: 85,
          positiveNotes: ['Excellent leadership', 'Strategic vision'],
          negativeNotes: ['Communication could be improved']
        },
        {
          clevelType: 'CTO' as CLevelType,
          completedKpis: 7,
          totalKpis: 10,
          confidenceScore: 75,
          positiveNotes: ['Technical expertise', 'Innovation'],
          negativeNotes: ['Project delays']
        }
      ],
      isLoading: false,
      error: null,
      fetchBusinessMetrics: fetchBusinessMetricsMock,
      fetchCLevelPerformance: fetchCLevelPerformanceMock
    });
    
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      getProblematicTasks: jest.fn().mockResolvedValue([
        {
          id: '1',
          title: 'Problematic Task 1',
          description: 'This task has issues',
          clevelType: 'COO' as CLevelType,
          status: 'failed' as TaskStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Task
      ])
    });
    
    (useBriefStore as unknown as jest.Mock).mockReturnValue({
      getLatestBriefs: jest.fn().mockResolvedValue([
        {
          id: '1',
          taskId: '101',
          content: 'Latest Brief 1',
          createdAt: new Date().toISOString(),
          recommendations: ['Recommendation 1', 'Recommendation 2']
        } as Brief
      ])
    });
    
    // Мокаем useEffect для вызова функций при монтировании компонента
    const originalUseEffect = React.useEffect;
    jest.spyOn(React, 'useEffect').mockImplementation((callback, deps) => {
      return originalUseEffect(() => {
        callback();
        return () => {};
      }, deps);
    });
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('renders dashboard components correctly', async () => {
    render(<Dashboard />);
    
    // Проверяем, что метрики бизнеса отображаются
    expect(screen.getByText('Key Business Metrics')).toBeInTheDocument();
    expect(screen.getByText('LTV')).toBeInTheDocument();
    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    
    // Проверяем, что производительность C-Level отображается
    expect(screen.getByText('C-Level Performance')).toBeInTheDocument();
    
    // Проверяем наличие COO в списке C-Level
    expect(screen.getByText(/COO/)).toBeInTheDocument();
  });
  
  it('renders dashboard components correctly', async () => {
    render(<Dashboard />);
    
    // Проверяем, что метрики бизнеса отображаются
    expect(screen.getByText('Key Business Metrics')).toBeInTheDocument();
    expect(screen.getByText('LTV')).toBeInTheDocument();
    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('Cash Flow')).toBeInTheDocument();
    
    // Проверяем, что производительность C-Level отображается
    expect(screen.getByText('C-Level Performance')).toBeInTheDocument();
    
    // Проверяем наличие COO в списке C-Level
    expect(screen.getByText(/COO/)).toBeInTheDocument();
  });
});
