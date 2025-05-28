import { useBriefStore } from '@/lib/store/briefStore';
import * as briefService from '@/lib/firebase/services/briefService';
import { Brief } from '@/types';

// Мокаем Firebase сервисы
jest.mock('@/lib/firebase/services/briefService', () => ({
  getAllBriefs: jest.fn(),
  getBriefById: jest.fn(),
  getBriefByTaskId: jest.fn(),
  createBrief: jest.fn(),
  updateBrief: jest.fn(),
  deleteBrief: jest.fn(),
  getLatestBriefs: jest.fn()
}));

describe('Brief Store', () => {
  beforeEach(() => {
    // Очищаем состояние хранилища перед каждым тестом
    const { setState } = useBriefStore;
    setState({
      briefs: [],
      currentBrief: null,
      isLoading: false,
      error: null
    });
    
    // Очищаем моки
    jest.clearAllMocks();
  });
  
  describe('fetchBriefs', () => {
    it('should fetch briefs and update store state', async () => {
      // Подготавливаем моковые данные
      const mockBriefs = [
        {
          id: '1',
          taskId: '101',
          content: 'Test Brief Content 1',
          createdAt: new Date().toISOString(),
          recommendations: ['Recommendation 1', 'Recommendation 2']
        },
        {
          id: '2',
          taskId: '102',
          content: 'Test Brief Content 2',
          createdAt: new Date().toISOString(),
          recommendations: ['Recommendation 3', 'Recommendation 4']
        }
      ];
      
      // Настраиваем мок для getAllBriefs
      (briefService.getAllBriefs as jest.Mock).mockResolvedValue(mockBriefs);
      
      // Вызываем функцию fetchBriefs
      const { fetchBriefs } = useBriefStore.getState();
      await fetchBriefs();
      
      // Проверяем, что getAllBriefs был вызван
      expect(briefService.getAllBriefs).toHaveBeenCalled();
      
      // Проверяем, что состояние хранилища обновилось
      const { briefs, isLoading, error } = useBriefStore.getState();
      expect(briefs).toEqual(mockBriefs);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
    
    it('should handle errors when fetching briefs', async () => {
      // Настраиваем мок для getAllBriefs, чтобы он выбрасывал ошибку
      const errorMessage = 'Failed to fetch briefs';
      (briefService.getAllBriefs as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Вызываем функцию fetchBriefs
      const { fetchBriefs } = useBriefStore.getState();
      await fetchBriefs();
      
      // Проверяем, что getAllBriefs был вызван
      expect(briefService.getAllBriefs).toHaveBeenCalled();
      
      // Проверяем, что состояние хранилища обновилось с ошибкой
      const { briefs, isLoading, error } = useBriefStore.getState();
      expect(briefs).toEqual([]);
      expect(isLoading).toBe(false);
      expect(error).toBe(errorMessage);
    });
  });
  
  describe('fetchBrief', () => {
    it('should fetch a brief by ID and update store state', async () => {
      // Подготавливаем моковые данные
      const mockBrief = {
        id: '1',
        taskId: '101',
        content: 'Test Brief Content 1',
        createdAt: new Date().toISOString(),
        recommendations: ['Recommendation 1', 'Recommendation 2']
      };
      
      // Настраиваем мок для getBriefById
      (briefService.getBriefById as jest.Mock).mockResolvedValue(mockBrief);
      
      // Вызываем функцию fetchBrief
      const { fetchBrief } = useBriefStore.getState();
      await fetchBrief('1');
      
      // Проверяем, что getBriefById был вызван с правильным ID
      expect(briefService.getBriefById).toHaveBeenCalledWith('1');
      
      // Проверяем, что состояние хранилища обновилось
      const { currentBrief, isLoading, error } = useBriefStore.getState();
      expect(currentBrief).toEqual(mockBrief);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
  });
  
  // Проверяем, что методы createBrief и getLatestBriefs существуют в хранилище
  it('should have createBrief and getLatestBriefs methods', () => {
    const store = useBriefStore.getState();
    expect(typeof (store as any).createBrief).toBe('function');
    expect(typeof (store as any).getLatestBriefs).toBe('function');
  });
  
  // Тестируем методы createBrief и getLatestBriefs через приведение типов
  describe('extended methods', () => {
    it('should create a brief and update store state', async () => {
      // Подготавливаем моковые данные
      const newBrief = {
        taskId: '101',
        content: 'New Brief Content',
        recommendations: ['New Recommendation 1', 'New Recommendation 2']
      };
      
      const createdBrief: Brief = {
        id: '3',
        ...newBrief,
        createdAt: new Date().toISOString()
      };
      
      // Настраиваем мок для createBrief
      (briefService.createBrief as jest.Mock).mockResolvedValue(createdBrief);
      
      // Вызываем функцию createBrief через приведение типов
      const store = useBriefStore.getState() as any;
      const result = await store.createBrief(newBrief);
      
      // Проверяем, что createBrief был вызван с правильными данными
      expect(briefService.createBrief).toHaveBeenCalledWith(newBrief);
      
      // Проверяем, что функция вернула правильный результат
      expect(result).toEqual(createdBrief);
      
      // Проверяем, что состояние хранилища обновилось
      const { briefs, isLoading, error } = useBriefStore.getState();
      expect(briefs).toContainEqual(createdBrief);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
    
    it('should fetch latest briefs', async () => {
      // Подготавливаем моковые данные
      const mockBriefs: Brief[] = [
        {
          id: '1',
          taskId: '101',
          content: 'Test Brief Content 1',
          createdAt: new Date().toISOString(),
          recommendations: ['Recommendation 1', 'Recommendation 2']
        },
        {
          id: '2',
          taskId: '102',
          content: 'Test Brief Content 2',
          createdAt: new Date().toISOString(),
          recommendations: ['Recommendation 3', 'Recommendation 4']
        }
      ];
      
      // Настраиваем мок для getLatestBriefs
      (briefService.getLatestBriefs as jest.Mock).mockResolvedValue(mockBriefs);
      
      // Вызываем функцию getLatestBriefs через приведение типов
      const store = useBriefStore.getState() as any;
      const result = await store.getLatestBriefs(2);
      
      // Проверяем, что getLatestBriefs был вызван с правильным лимитом
      expect(briefService.getLatestBriefs).toHaveBeenCalledWith(2);
      
      // Проверяем, что функция вернула правильный результат
      expect(result).toEqual(mockBriefs);
    });
  });
});
