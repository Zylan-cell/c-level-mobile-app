import { useStrategyStore } from '@/lib/store/strategyStore';
import * as strategyService from '@/lib/firebase/services/strategyService';
import { CLevelType } from '@/types';

// Мокаем Firebase сервисы
jest.mock('@/lib/firebase/services/strategyService', () => ({
  getAllStrategies: jest.fn(),
  getStrategyByCLevelType: jest.fn(),
  setStrategy: jest.fn(),
  updateStrategy: jest.fn()
}));

describe('Strategy Store', () => {
  beforeEach(() => {
    // Очищаем состояние хранилища перед каждым тестом
    const { setState } = useStrategyStore;
    setState({
      strategies: [],
      currentStrategy: null,
      isLoading: false,
      error: null
    });
    
    // Очищаем моки
    jest.clearAllMocks();
  });
  
  describe('fetchStrategies', () => {
    it('should fetch strategies and update store state', async () => {
      // Подготавливаем моковые данные
      const mockStrategiesRecord = {
        CEO: {
          clevelType: 'CEO' as CLevelType,
          title: 'CEO Strategy 2025',
          description: 'CEO Strategy Description',
          objectives: ['CEO Objective 1', 'CEO Objective 2'],
          kpis: ['CEO KPI 1', 'CEO KPI 2'],
          updatedAt: new Date().toISOString()
        },
        CTO: {
          clevelType: 'CTO' as CLevelType,
          title: 'CTO Strategy 2025',
          description: 'CTO Strategy Description',
          objectives: ['CTO Objective 1', 'CTO Objective 2'],
          kpis: ['CTO KPI 1', 'CTO KPI 2'],
          updatedAt: new Date().toISOString()
        }
      };
      
      // Настраиваем мок для getAllStrategies
      (strategyService.getAllStrategies as jest.Mock).mockResolvedValue(mockStrategiesRecord);
      
      // Вызываем функцию fetchStrategies
      const { fetchStrategies } = useStrategyStore.getState();
      await fetchStrategies();
      
      // Проверяем, что getAllStrategies был вызван
      expect(strategyService.getAllStrategies).toHaveBeenCalled();
      
      // Проверяем, что состояние хранилища обновилось
      const { strategies, isLoading, error } = useStrategyStore.getState();
      expect(strategies).toEqual(Object.values(mockStrategiesRecord));
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
    
    it('should handle errors when fetching strategies', async () => {
      // Настраиваем мок для getAllStrategies, чтобы он выбрасывал ошибку
      const errorMessage = 'Failed to fetch strategies';
      (strategyService.getAllStrategies as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Вызываем функцию fetchStrategies
      const { fetchStrategies } = useStrategyStore.getState();
      await fetchStrategies();
      
      // Проверяем, что getAllStrategies был вызван
      expect(strategyService.getAllStrategies).toHaveBeenCalled();
      
      // Проверяем, что состояние хранилища обновилось с ошибкой
      const { strategies, isLoading, error } = useStrategyStore.getState();
      expect(strategies).toEqual([]);
      expect(isLoading).toBe(false);
      expect(error).toBe(errorMessage);
    });
  });
  
  describe('fetchStrategyByType', () => {
    it('should fetch a strategy by type and update store state', async () => {
      // Подготавливаем моковые данные
      const mockStrategy = {
        clevelType: 'CEO' as CLevelType,
        title: 'CEO Strategy 2025',
        description: 'CEO Strategy Description',
        objectives: ['CEO Objective 1', 'CEO Objective 2'],
        kpis: ['CEO KPI 1', 'CEO KPI 2'],
        updatedAt: new Date().toISOString()
      };
      
      // Настраиваем мок для getStrategyByCLevelType
      (strategyService.getStrategyByCLevelType as jest.Mock).mockResolvedValue(mockStrategy);
      
      // Вызываем функцию fetchStrategyByType
      const { fetchStrategyByType } = useStrategyStore.getState();
      await fetchStrategyByType('CEO');
      
      // Проверяем, что getStrategyByCLevelType был вызван с правильным типом
      expect(strategyService.getStrategyByCLevelType).toHaveBeenCalledWith('CEO');
      
      // Проверяем, что состояние хранилища обновилось
      const { currentStrategy, isLoading, error } = useStrategyStore.getState();
      expect(currentStrategy).toEqual(mockStrategy);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
  });
  
  describe('createStrategy', () => {
    it('should create a strategy and update store state', async () => {
      // Подготавливаем моковые данные
      const newStrategy = {
        clevelType: 'CFO' as CLevelType,
        title: 'CFO Strategy 2025',
        description: 'CFO Strategy Description',
        objectives: ['CFO Objective 1', 'CFO Objective 2'],
        kpis: ['CFO KPI 1', 'CFO KPI 2']
      };
      
      const createdStrategy = {
        id: '3',
        ...newStrategy,
        updatedAt: new Date().toISOString()
      };
      
      // Настраиваем мок для setStrategy
      (strategyService.setStrategy as jest.Mock).mockResolvedValue(createdStrategy);
      
      // Вызываем функцию createStrategy
      const { createStrategy } = useStrategyStore.getState();
      const result = await createStrategy(newStrategy);
      
      // Проверяем, что setStrategy был вызван с правильными данными
      expect(strategyService.setStrategy).toHaveBeenCalledWith(newStrategy);
      
      // Проверяем, что функция вернула правильный результат
      expect(result).toEqual(createdStrategy);
      
      // Проверяем, что состояние хранилища обновилось
      const { strategies, isLoading, error } = useStrategyStore.getState();
      expect(strategies).toContainEqual(createdStrategy);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
  });
  
  describe('updateStrategy', () => {
    it('should update a strategy and update store state', async () => {
      // Подготавливаем моковые данные
      const clevelType = 'CEO' as CLevelType;
      const strategyUpdates = {
        title: 'Updated CEO Strategy 2025',
        objectives: ['Updated CEO Objective 1', 'Updated CEO Objective 2']
      };
      
      // Настраиваем начальное состояние хранилища
      const initialStrategy = {
        clevelType,
        title: 'CEO Strategy 2025',
        description: 'CEO Strategy Description',
        objectives: ['CEO Objective 1', 'CEO Objective 2'],
        kpis: ['CEO KPI 1', 'CEO KPI 2'],
        updatedAt: new Date().toISOString()
      };
      
      useStrategyStore.setState({
        strategies: [initialStrategy],
        currentStrategy: initialStrategy,
        isLoading: false,
        error: null
      });
      
      // Настраиваем мок для updateStrategy
      (strategyService.updateStrategy as jest.Mock).mockResolvedValue(undefined);
      
      // Вызываем функцию updateStrategy
      const { updateStrategy } = useStrategyStore.getState();
      await updateStrategy(clevelType, strategyUpdates);
      
      // Проверяем, что updateStrategy был вызван с правильными данными
      expect(strategyService.updateStrategy).toHaveBeenCalledWith(clevelType, strategyUpdates);
      
      // Проверяем, что состояние хранилища обновилось
      const { strategies, currentStrategy, isLoading, error } = useStrategyStore.getState();
      
      // Проверяем, что стратегия в массиве стратегий обновилась
      const updatedStrategy = strategies.find(s => s.clevelType === clevelType);
      expect(updatedStrategy?.title).toBe(strategyUpdates.title);
      expect(updatedStrategy?.objectives).toEqual(strategyUpdates.objectives);
      
      // Проверяем, что текущая стратегия обновилась
      expect(currentStrategy?.title).toBe(strategyUpdates.title);
      expect(currentStrategy?.objectives).toEqual(strategyUpdates.objectives);
      
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });
  });
});
