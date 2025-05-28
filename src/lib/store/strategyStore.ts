/**
 * Strategy store for managing C-Level strategies
 */

import { create } from 'zustand';
import { CLevelType, CLevelStrategy } from '@/types';
import {
  getAllStrategies,
  getStrategyByCLevelType,
  setStrategy as setFirebaseStrategy,
  updateStrategy as updateFirebaseStrategy
} from '@/lib/firebase/services/strategyService';

interface StrategyState {
  strategies: CLevelStrategy[];
  currentStrategy: CLevelStrategy | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchStrategies: () => Promise<void>;
  fetchStrategyByType: (clevelType: CLevelType) => Promise<void>;
  updateStrategy: (clevelType: CLevelType, strategyData: Partial<CLevelStrategy>) => Promise<void>;
  createStrategy: (strategy: Omit<CLevelStrategy, 'id' | 'updatedAt'>) => Promise<CLevelStrategy>;
  clearError: () => void;
}

export const useStrategyStore = create<StrategyState>((set, get) => ({
  strategies: [],
  currentStrategy: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchStrategies: async () => {
    try {
      set({ isLoading: true, error: null });
      const strategiesRecord = await getAllStrategies();
      
      // Преобразуем Record в массив для совместимости с существующим кодом
      const strategiesArray = Object.values(strategiesRecord);
      
      set({ strategies: strategiesArray, isLoading: false });
    } catch (error) {
      console.error('Error fetching strategies:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch strategies' 
      });
    }
  },
  
  fetchStrategyByType: async (clevelType: CLevelType) => {
    try {
      set({ isLoading: true, error: null });
      const strategy = await getStrategyByCLevelType(clevelType);
      set({ currentStrategy: strategy, isLoading: false });
    } catch (error) {
      console.error('Error fetching strategy by type:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch strategy' 
      });
    }
  },
  
  createStrategy: async (strategy: Omit<CLevelStrategy, 'id' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newStrategy = await setFirebaseStrategy(strategy);
      
      set(state => ({
        strategies: [...state.strategies, newStrategy],
        isLoading: false
      }));
      
      return newStrategy;
    } catch (error) {
      console.error('Error creating strategy:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create strategy' 
      });
      throw error;
    }
  },
  
  updateStrategy: async (clevelType: CLevelType, strategyData: Partial<CLevelStrategy>) => {
    try {
      set({ isLoading: true, error: null });
      await updateFirebaseStrategy(clevelType, strategyData);
      
      set(state => {
        // Обновляем стратегию в массиве стратегий
        const updatedStrategies = state.strategies.map(strategy => 
          strategy.clevelType === clevelType 
            ? { ...strategy, ...strategyData } 
            : strategy
        );
        
        // Обновляем текущую стратегию, если она соответствует обновляемому типу
        const updatedCurrentStrategy = state.currentStrategy?.clevelType === clevelType 
          ? { ...state.currentStrategy, ...strategyData } 
          : state.currentStrategy;
        
        return {
          strategies: updatedStrategies,
          currentStrategy: updatedCurrentStrategy,
          isLoading: false
        };
      });
    } catch (error) {
      console.error('Error updating strategy:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update strategy' 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
