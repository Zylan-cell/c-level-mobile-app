"use client";

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { Task, CLevelType, TaskStatus } from '@/types';

// Импортируем мок для Firebase
import '../__mocks__/firebase';

// Мокируем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  })
}));

// Мокируем хранилище брифов
jest.mock('@/lib/store', () => ({
  useBriefStore: jest.fn().mockReturnValue({
    currentBrief: {
      id: '201',
      taskId: '101',
      content: 'Test brief content',
      recommendations: ['Recommendation 1', 'Recommendation 2'],
      createdAt: new Date().toISOString()
    },
    isLoading: false,
    error: null
  })
}));

describe('TaskDetail Interaction', () => {
  const mockTask: Task = {
    id: '101',
    title: 'Test Task',
    description: 'This is a test task description',
    clevelType: 'CEO' as CLevelType,
    status: 'completed' as TaskStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    briefId: '201'
  };

  it('renders task details correctly', () => {
    render(<TaskDetail task={mockTask} isLoading={false} />);
    
    // Проверяем, что детали задачи отображаются
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(/This is a test task description/)).toBeInTheDocument();
    expect(screen.getByText(/Chief Executive Officer/)).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  
  it('renders loading state correctly', () => {
    render(<TaskDetail task={null} isLoading={true} />);
    
    // Проверяем, что отображается состояние загрузки
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });
  
  it('renders not found state when task is null', () => {
    render(<TaskDetail task={null} isLoading={false} />);
    
    // Проверяем, что отображается сообщение о том, что задача не найдена
    expect(screen.getByText('Task not found')).toBeInTheDocument();
    expect(screen.getByText('Back to Tasks')).toBeInTheDocument();
  });
  
  it('displays brief information when briefId is present', () => {
    render(<TaskDetail task={mockTask} isLoading={false} />);
    
    // Проверяем, что информация о брифе отображается
    expect(screen.getByText('Brief')).toBeInTheDocument();
    expect(screen.getByText('Test brief content')).toBeInTheDocument();
    expect(screen.getByText('Recommendations:')).toBeInTheDocument();
    expect(screen.getByText('Recommendation 1')).toBeInTheDocument();
    expect(screen.getByText('Recommendation 2')).toBeInTheDocument();
  });
  
  it('allows clicking on navigation buttons', () => {
    render(<TaskDetail task={mockTask} isLoading={false} />);
    
    // Проверяем, что кнопки навигации кликабельны
    const backButton = screen.getByText('Back to Tasks');
    fireEvent.click(backButton);
    
    const viewBriefButton = screen.getByText('View Full Brief');
    fireEvent.click(viewBriefButton);
  });
});
