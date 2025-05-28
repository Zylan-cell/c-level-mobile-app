"use client";

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BriefDetail } from '@/components/briefs/BriefDetail';
import { Brief } from '@/types';

// Импортируем мок для Firebase
import '../__mocks__/firebase';

// Мокируем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  })
}));

// Мокируем хранилище задач
jest.mock('@/lib/store', () => ({
  useTaskStore: jest.fn().mockReturnValue({
    tasks: [
      {
        id: '101',
        title: 'Related Task',
        description: 'This is a related task',
        clevelType: 'CEO',
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    isLoading: false,
    error: null
  })
}));

// Мокируем navigator.share и navigator.clipboard
Object.defineProperty(global.navigator, 'share', {
  value: jest.fn().mockResolvedValue(true),
  configurable: true
});

Object.defineProperty(global.navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined)
  },
  configurable: true
});

describe('BriefDetail Interaction', () => {
  const mockBrief: Brief = {
    id: '201',
    taskId: '101',
    content: 'This is a test brief content with detailed information about the task.',
    recommendations: ['Implement feature A', 'Fix bug B', 'Improve performance of C'],
    createdAt: new Date().toISOString()
  };

  it('renders brief details correctly', () => {
    render(<BriefDetail brief={mockBrief} isLoading={false} />);
    
    // Проверяем, что детали брифа отображаются
    expect(screen.getByText('Related Task')).toBeInTheDocument();
    expect(screen.getByText(/This is a test brief content/)).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Implement feature A')).toBeInTheDocument();
    expect(screen.getByText('Fix bug B')).toBeInTheDocument();
    expect(screen.getByText('Improve performance of C')).toBeInTheDocument();
  });
  
  it('renders loading state correctly', () => {
    render(<BriefDetail brief={null} isLoading={true} />);
    
    // Проверяем, что отображается состояние загрузки
    const loadingElements = screen.getAllByTestId('loading-skeleton');
    expect(loadingElements.length).toBeGreaterThan(0);
  });
  
  it('renders not found state when brief is null', () => {
    render(<BriefDetail brief={null} isLoading={false} />);
    
    // Проверяем, что отображается сообщение о том, что бриф не найден
    expect(screen.getByText('Brief not found')).toBeInTheDocument();
    expect(screen.getByText('Back to Briefs')).toBeInTheDocument();
  });
  
  it('allows clicking on navigation buttons', () => {
    render(<BriefDetail brief={mockBrief} isLoading={false} />);
    
    // Проверяем, что кнопки навигации кликабельны
    const backButton = screen.getByText('Back to Briefs');
    fireEvent.click(backButton);
    
    const viewTaskButton = screen.getByText('View Related Task →');
    fireEvent.click(viewTaskButton);
  });
  
  it('allows sharing brief content', () => {
    render(<BriefDetail brief={mockBrief} isLoading={false} />);
    
    // Проверяем, что кнопка "Share Brief" кликабельна
    const shareButton = screen.getByText('Share Brief');
    fireEvent.click(shareButton);
    
    // Проверяем, что была вызвана функция navigator.share
    expect(navigator.share).toHaveBeenCalledWith({
      title: 'Related Task',
      text: mockBrief.content
    });
  });
  
  it('allows providing feedback', () => {
    render(<BriefDetail brief={mockBrief} isLoading={false} />);
    
    // Проверяем, что кнопка "Provide Feedback" кликабельна
    const feedbackButton = screen.getByText('Provide Feedback');
    fireEvent.click(feedbackButton);
  });
});
