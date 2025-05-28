"use client";

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StrategyDetail } from '@/components/c-level/StrategyDetail';
import { Strategy } from '@/types';

// Импортируем мок для Firebase
import '../__mocks__/firebase';

// Мокируем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  })
}));

describe('CLevelStrategy Interaction', () => {
  const mockStrategy: Strategy = {
    title: 'CEO Strategy 2025',
    description: 'Strategic vision and roadmap for the company in 2025',
    objectives: [
      {
        title: 'Market Expansion',
        description: 'Expand into new markets in Europe and Asia',
        kpis: [
          { title: 'New markets entered', target: '5 countries', current: '2 countries', status: 'in_progress' },
          { title: 'Market share in new regions', target: '10%', current: '3%', status: 'in_progress' }
        ]
      },
      {
        title: 'Product Innovation',
        description: 'Launch 3 new innovative products',
        kpis: [
          { title: 'New products launched', target: '3', current: '1', status: 'in_progress' },
          { title: 'Revenue from new products', target: '$2M', current: '$500K', status: 'in_progress' }
        ]
      },
      {
        title: 'Operational Excellence',
        description: 'Improve operational efficiency across all departments',
        kpis: [
          { title: 'Cost reduction', target: '15%', current: '12%', status: 'in_progress' },
          { title: 'Process automation', target: '80%', current: '65%', status: 'in_progress' }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('renders strategy details correctly', () => {
    render(<StrategyDetail strategy={mockStrategy} isLoading={false} />);
    
    // Проверяем, что заголовок стратегии отображается
    expect(screen.getByText('CEO Strategy 2025')).toBeInTheDocument();
    
    // Проверяем, что описание стратегии отображается
    expect(screen.getByText('Strategic vision and roadmap for the company in 2025')).toBeInTheDocument();
    
    // Проверяем, что цели отображаются
    expect(screen.getByText('Market Expansion')).toBeInTheDocument();
    expect(screen.getByText('Product Innovation')).toBeInTheDocument();
    expect(screen.getByText('Operational Excellence')).toBeInTheDocument();
  });
  
  it('renders loading state correctly', () => {
    render(<StrategyDetail strategy={null} isLoading={true} />);
    
    // Проверяем, что отображается состояние загрузки
    const skeletons = screen.getAllByTestId('strategy-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
  
  it('renders empty state when no strategy', () => {
    render(<StrategyDetail strategy={null} isLoading={false} />);
    
    // Проверяем, что отображается сообщение о том, что стратегия не найдена
    expect(screen.getByText('No strategy found for this C-Level role')).toBeInTheDocument();
  });
  
  it('expands objective details when clicked', () => {
    render(<StrategyDetail strategy={mockStrategy} isLoading={false} />);
    
    // Проверяем, что изначально детали целей скрыты
    expect(screen.queryByText('New markets entered')).not.toBeInTheDocument();
    
    // Кликаем на цель, чтобы раскрыть детали
    const objectiveHeader = screen.getByText('Market Expansion');
    fireEvent.click(objectiveHeader);
    
    // Проверяем, что детали цели отображаются после клика
    expect(screen.getByText('New markets entered')).toBeInTheDocument();
    expect(screen.getByText('Market share in new regions')).toBeInTheDocument();
  });
  
  it('shows KPI progress correctly', () => {
    render(<StrategyDetail strategy={mockStrategy} isLoading={false} />);
    
    // Кликаем на цель, чтобы раскрыть детали
    const objectiveHeader = screen.getByText('Market Expansion');
    fireEvent.click(objectiveHeader);
    
    // Проверяем, что прогресс KPI отображается корректно
    expect(screen.getByText('2 countries')).toBeInTheDocument(); // current value
    expect(screen.getByText('5 countries')).toBeInTheDocument(); // target value
    
    // Проверяем, что статус KPI отображается
    const statusBadges = screen.getAllByText('In progress');
    expect(statusBadges.length).toBeGreaterThan(0);
  });
  
  it('allows printing the strategy', () => {
    // Мокируем window.print
    const mockPrint = jest.fn();
    window.print = mockPrint;
    
    render(<StrategyDetail strategy={mockStrategy} isLoading={false} />);
    
    // Находим и кликаем на кнопку печати
    const printButton = screen.getByText('Print Strategy');
    fireEvent.click(printButton);
    
    // Проверяем, что была вызвана функция window.print
    expect(mockPrint).toHaveBeenCalled();
  });
});
