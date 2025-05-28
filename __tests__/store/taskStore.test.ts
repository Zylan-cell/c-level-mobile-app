import { useTaskStore } from '@/lib/store/taskStore';
import * as taskService from '@/lib/firebase/services/taskService';
import { CLevelType, Task, TaskStatus } from '@/types';

// Мокаем Firebase сервисы
jest.mock('@/lib/firebase/services/taskService', () => ({
  getAllTasks: jest.fn(),
  getTaskById: jest.fn(),
  getTasksByCLevel: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  getProblematicTasks: jest.fn()
}));

describe('Task Store', () => {
  beforeEach(() => {
    // Очищаем состояние хранилища перед каждым тестом
    const { setState } = useTaskStore;
    setState({
      tasks: [],
      currentTask: null,
      filteredTasks: [],
      isLoading: false,
      error: null,
      clevelFilter: null,
      statusFilter: null
    });
    
    // Очищаем моки
    jest.clearAllMocks();
  });
  
  describe('fetchTasks', () => {
    it('should fetch tasks and update store state', async () => {
      // Подготавливаем моковые данные
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Test Description 1',
          clevelType: 'CEO' as CLevelType,
          status: 'pending' as TaskStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Test Description 2',
          clevelType: 'CTO' as CLevelType,
          status: 'in_progress' as TaskStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Настраиваем мок для getAllTasks
      (taskService.getAllTasks as jest.Mock).mockResolvedValue(mockTasks);
      
      // Вызываем функцию fetchTasks
      const { fetchTasks } = useTaskStore.getState();
      await fetchTasks();
      
      // Проверяем, что getAllTasks был вызван
      expect(taskService.getAllTasks).toHaveBeenCalled();
      
      // Проверяем, что состояние хранилища обновилось
      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(tasks).toEqual(mockTasks);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
    
    it('should handle errors when fetching tasks', async () => {
      // Настраиваем мок для getAllTasks, чтобы он выбрасывал ошибку
      const errorMessage = 'Failed to fetch tasks';
      (taskService.getAllTasks as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Вызываем функцию fetchTasks
      const { fetchTasks } = useTaskStore.getState();
      await fetchTasks();
      
      // Проверяем, что getAllTasks был вызван
      expect(taskService.getAllTasks).toHaveBeenCalled();
      
      // Проверяем, что состояние хранилища обновилось с ошибкой
      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(tasks).toEqual([]);
      expect(isLoading).toBe(false);
      expect(error).toBe(errorMessage);
    });
  });
  
  describe('fetchTaskById', () => {
    it('should fetch a task by ID and update store state', async () => {
      // Подготавливаем моковые данные
      const mockTask: Task = {
        id: '1',
        title: 'Test Task 1',
        description: 'Test Description 1',
        clevelType: 'CEO' as CLevelType,
        status: 'pending' as TaskStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Настраиваем мок для getTaskById
      (taskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      
      // Вызываем функцию fetchTaskById
      const { fetchTaskById } = useTaskStore.getState();
      const result = await fetchTaskById('1');
      
      // Проверяем, что getTaskById был вызван с правильным ID
      expect(taskService.getTaskById).toHaveBeenCalledWith('1');
      
      // Проверяем, что функция вернула правильный результат
      expect(result).toEqual(mockTask);
      
      // Проверяем, что состояние хранилища обновилось
      const { currentTask, isLoading, error } = useTaskStore.getState();
      expect(currentTask).toEqual(mockTask);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
  });
  
  describe('createTask', () => {
    it('should create a task and update store state', async () => {
      // Подготавливаем моковые данные
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        clevelType: 'CTO' as CLevelType,
        status: 'pending' as TaskStatus
      };
      
      const createdTask = {
        id: '3',
        ...newTask,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Настраиваем мок для createTask
      (taskService.createTask as jest.Mock).mockResolvedValue(createdTask);
      
      // Вызываем функцию createTask
      const { createTask } = useTaskStore.getState();
      await createTask(newTask);
      
      // Проверяем, что createTask был вызван с правильными данными
      expect(taskService.createTask).toHaveBeenCalledWith(newTask);
      
      // Проверяем, что состояние хранилища обновилось
      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(tasks).toContainEqual(createdTask);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
  });
});
