import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTaskStore } from '@/lib/store/taskStore';
import { CLevelType, TaskStatus } from '@/types';

// Импортируем специфичный мок для Firebase config
import './__mocks__/firebaseConfig';

// Мокируем Firebase модули
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn().mockReturnValue([])
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn().mockResolvedValue({ id: 'mock-id' }),
  serverTimestamp: jest.fn().mockReturnValue(new Date())
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { uid: 'mock-user-id' },
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback({ uid: 'mock-user-id' });
      return jest.fn();
    })
  })
}));

// Мокаем useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn()
  })
}));

// Мокаем хранилище задач
jest.mock('@/lib/store/taskStore', () => ({
  useTaskStore: jest.fn()
}));

describe('TaskForm Component', () => {
  // Настраиваем мок для useTaskStore перед каждым тестом
  beforeEach(() => {
    const mockCreateTask = jest.fn().mockResolvedValue({
      id: 'new-task-id',
      title: 'Test Task',
      description: 'Test Description',
      clevelType: 'CEO' as CLevelType,
      status: 'pending' as TaskStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const mockClearError = jest.fn();
    
    // Приводим useTaskStore к типу any перед мокированием
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      createTask: mockCreateTask,
      error: null,
      clearError: mockClearError
    });
  });
  
  it('renders the form correctly', () => {
    render(<TaskForm />);
    
    // Проверяем, что заголовок формы отображается
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    
    // Проверяем, что поля формы отображаются
    expect(screen.getByLabelText('Task Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Assign to C-Level')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Description')).toBeInTheDocument();
    
    // Проверяем, что кнопки отображаются
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delegate to AI')).toBeInTheDocument();
  });
  
  it('allows entering task details', () => {
    render(<TaskForm />);
    
    // Заполняем поля формы
    const titleInput = screen.getByLabelText('Task Title');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    expect(titleInput).toHaveValue('Test Task');
    
    const descriptionInput = screen.getByLabelText('Task Description');
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    expect(descriptionInput).toHaveValue('Test Description');
    
    const clevelSelect = screen.getByLabelText('Assign to C-Level');
    fireEvent.change(clevelSelect, { target: { value: 'CEO' } });
    expect(clevelSelect).toHaveValue('CEO');
    
    const statusSelect = screen.getByLabelText('Task Status');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    expect(statusSelect).toHaveValue('pending');
  });
  
  it('submits the form and creates a task', async () => {
    const mockOnSuccess = jest.fn();
    render(<TaskForm onSuccess={mockOnSuccess} />);
    
    // Заполняем поля формы
    fireEvent.change(screen.getByLabelText('Task Title'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText('Task Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Assign to C-Level'), { target: { value: 'CEO' } });
    fireEvent.change(screen.getByLabelText('Task Status'), { target: { value: 'pending' } });
    
    // Отправляем форму
    fireEvent.click(screen.getByText('Delegate to AI'));
    
    // Проверяем, что createTask был вызван с правильными данными
    await waitFor(() => {
      // Приводим useTaskStore к типу any перед обращением к его методам
      expect((useTaskStore() as any).createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        clevelType: 'CEO',
        status: 'pending'
      });
    });
    
    // Проверяем, что onSuccess был вызван
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
  
  it('displays error message when there is an error', () => {
    // Настраиваем мок для useTaskStore, чтобы он возвращал ошибку
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      createTask: jest.fn(),
      error: 'Failed to create task',
      clearError: jest.fn()
    });
    
    render(<TaskForm />);
    
    // Проверяем, что сообщение об ошибке отображается
    expect(screen.getByText('Failed to create task')).toBeInTheDocument();
    
    // Нажимаем на кнопку "Dismiss" для сброса ошибки
    fireEvent.click(screen.getByText('Dismiss'));
    
    // Проверяем, что clearError был вызван
    expect((useTaskStore() as any).clearError).toHaveBeenCalled();
  });
});
