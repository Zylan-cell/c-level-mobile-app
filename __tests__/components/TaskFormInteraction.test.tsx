import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '@/components/tasks/TaskForm';

// Создаем мок для хранилища задач
const mockCreateTask = jest.fn();
const mockClearError = jest.fn();

// Мокируем хранилище Zustand
jest.mock('@/lib/store', () => ({
  useTaskStore: () => ({
    createTask: mockCreateTask,
    error: null,
    clearError: mockClearError
  })
}));

// Мокируем модуль next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  })
}));

describe('TaskForm User Interaction Tests', () => {
  // Настройка моков перед каждым тестом
  beforeEach(() => {
    // Сбрасываем моки
    jest.clearAllMocks();
    mockCreateTask.mockResolvedValue({});
  });

  test('should allow user to fill out and submit the form', async () => {
    // Рендерим компонент
    render(<TaskForm />);

    // Проверяем, что форма отображается корректно
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    
    // Заполняем поля формы
    const titleInput = screen.getByLabelText('Task Title');
    const descriptionInput = screen.getByLabelText('Task Description');
    const clevelSelect = screen.getByLabelText('Assign to C-Level');
    const statusSelect = screen.getByLabelText('Task Status');
    
    // Используем userEvent для более реалистичного взаимодействия
    await userEvent.type(titleInput, 'New Marketing Campaign');
    await userEvent.type(descriptionInput, 'Create a comprehensive marketing campaign for Q3');
    
    // Выбираем значения из выпадающих списков
    await userEvent.selectOptions(clevelSelect, 'CMO');
    await userEvent.selectOptions(statusSelect, 'pending');
    
    // Отправляем форму
    const submitButton = screen.getByText('Delegate to AI');
    await userEvent.click(submitButton);
    
    // Проверяем, что функция создания задачи была вызвана с правильными параметрами
    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'New Marketing Campaign',
        description: 'Create a comprehensive marketing campaign for Q3',
        clevelType: 'CMO',
        status: 'pending'
      });
    });
  });

  test('should handle form validation', async () => {
    // Рендерим компонент
    render(<TaskForm />);
    
    // Пытаемся отправить форму без заполнения обязательных полей
    const submitButton = screen.getByText('Delegate to AI');
    await userEvent.click(submitButton);
    
    // Проверяем, что функция создания задачи не была вызвана
    expect(mockCreateTask).not.toHaveBeenCalled();
    
    // Заполняем только одно поле
    const titleInput = screen.getByLabelText('Task Title');
    await userEvent.type(titleInput, 'New Marketing Campaign');
    
    // Пытаемся отправить форму снова
    await userEvent.click(submitButton);
    
    // Проверяем, что функция создания задачи все еще не была вызвана
    expect(mockCreateTask).not.toHaveBeenCalled();
  });
});
