import { 
  getAllTasks, 
  getTaskById, 
  getTasksByCLevel,
  createTask,
  updateTask,
  deleteTask,
  getProblematicTasks
} from '@/lib/firebase/services/taskService';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CLevelType, Task, TaskStatus } from '@/types';

// Мокаем Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => new Date())
}));

jest.mock('@/lib/firebase/config', () => ({
  db: {}
}));

describe('Task Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getAllTasks', () => {
    it('should fetch all tasks from Firestore', async () => {
      // Подготавливаем моковые данные
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Test Description 1',
          clevelType: 'CEO',
          status: 'pending',
          createdAt: { toDate: () => new Date() },
          updatedAt: { toDate: () => new Date() }
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Test Description 2',
          clevelType: 'CTO',
          status: 'in_progress',
          createdAt: { toDate: () => new Date() },
          updatedAt: { toDate: () => new Date() }
        }
      ];
      
      // Настраиваем моки
      (collection as jest.Mock).mockReturnValue('tasks-collection');
      (query as jest.Mock).mockReturnValue('tasks-query');
      (orderBy as jest.Mock).mockReturnValue('createdAt-desc');
      (getDocs as jest.Mock).mockResolvedValue({
        docs: mockTasks.map(task => ({
          id: task.id,
          data: () => task
        }))
      });
      
      // Вызываем функцию getAllTasks
      const result = await getAllTasks();
      
      // Проверяем, что функции Firestore были вызваны с правильными параметрами
      expect(collection).toHaveBeenCalledWith(db, 'tasks');
      expect(query).toHaveBeenCalledWith('tasks-collection', 'createdAt-desc');
      expect(getDocs).toHaveBeenCalledWith('tasks-query');
      
      // Проверяем, что результат содержит правильные данные
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
    
    it('should handle errors when fetching tasks', async () => {
      // Настраиваем мок для getDocs, чтобы он выбрасывал ошибку
      const errorMessage = 'Failed to fetch tasks';
      (collection as jest.Mock).mockReturnValue('tasks-collection');
      (query as jest.Mock).mockReturnValue('tasks-query');
      (orderBy as jest.Mock).mockReturnValue('createdAt-desc');
      (getDocs as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Проверяем, что функция выбрасывает ошибку
      await expect(getAllTasks()).rejects.toThrow();
    });
  });
  
  describe('getTaskById', () => {
    it('should fetch a task by ID from Firestore', async () => {
      // Подготавливаем моковые данные
      const mockTask = {
        id: '1',
        title: 'Test Task 1',
        description: 'Test Description 1',
        clevelType: 'CEO',
        status: 'pending',
        createdAt: { toDate: () => new Date() },
        updatedAt: { toDate: () => new Date() }
      };
      
      // Настраиваем моки
      (doc as jest.Mock).mockReturnValue('task-doc');
      (getDoc as jest.Mock).mockResolvedValue({
        id: mockTask.id,
        exists: () => true,
        data: () => mockTask
      });
      
      // Вызываем функцию getTaskById
      const result = await getTaskById('1');
      
      // Проверяем, что функции Firestore были вызваны с правильными параметрами
      expect(doc).toHaveBeenCalledWith(db, 'tasks', '1');
      expect(getDoc).toHaveBeenCalledWith('task-doc');
      
      // Проверяем, что результат содержит правильные данные
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
      expect(result?.title).toBe('Test Task 1');
    });
    
    it('should return null if task does not exist', async () => {
      // Настраиваем моки
      (doc as jest.Mock).mockReturnValue('task-doc');
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false
      });
      
      // Вызываем функцию getTaskById
      const result = await getTaskById('non-existent-id');
      
      // Проверяем, что функции Firestore были вызваны с правильными параметрами
      expect(doc).toHaveBeenCalledWith(db, 'tasks', 'non-existent-id');
      expect(getDoc).toHaveBeenCalledWith('task-doc');
      
      // Проверяем, что результат равен null
      expect(result).toBeNull();
    });
  });
  
  describe('createTask', () => {
    it('should create a task in Firestore', async () => {
      // Подготавливаем моковые данные
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        clevelType: 'CTO' as CLevelType,
        status: 'pending' as TaskStatus
      };
      
      // Настраиваем моки
      (collection as jest.Mock).mockReturnValue('tasks-collection');
      (addDoc as jest.Mock).mockResolvedValue({
        id: 'new-task-id'
      });
      
      // Вызываем функцию createTask
      const result = await createTask(newTask);
      
      // Проверяем, что функции Firestore были вызваны с правильными параметрами
      expect(collection).toHaveBeenCalledWith(db, 'tasks');
      expect(addDoc).toHaveBeenCalledWith('tasks-collection', expect.objectContaining({
        title: 'New Task',
        description: 'New Description',
        clevelType: 'CTO',
        status: 'pending'
      }));
      
      // Проверяем, что результат содержит правильные данные
      expect(result.id).toBe('new-task-id');
      expect(result.title).toBe('New Task');
      expect(result.description).toBe('New Description');
      expect(result.clevelType).toBe('CTO');
      expect(result.status).toBe('pending');
    });
  });
});
