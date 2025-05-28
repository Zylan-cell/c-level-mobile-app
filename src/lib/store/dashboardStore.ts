/**
 * Dashboard store for managing dashboard state
 */

import { create } from 'zustand';
import { BusinessMetrics, CLevelPerformance, Brief, Task } from '@/types';
import { DashboardService } from '@/lib/api/services';

interface DashboardState {
  businessMetrics: BusinessMetrics | null;
  clevelPerformance: CLevelPerformance[];
  latestBriefs: Brief[];
  problematicTasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  fetchBusinessMetrics: () => Promise<void>;
  fetchCLevelPerformance: () => Promise<void>;
  fetchLatestBriefs: (limit?: number) => Promise<void>;
  fetchProblematicTasks: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  businessMetrics: null,
  clevelPerformance: [],
  latestBriefs: [],
  problematicTasks: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Fetch all dashboard data in parallel
      const [
        businessMetrics,
        clevelPerformance,
        latestBriefs,
        problematicTasks
      ] = await Promise.all([
        DashboardService.getBusinessMetrics(),
        DashboardService.getCLevelPerformance(),
        DashboardService.getLatestBriefs(),
        DashboardService.getProblematicTasks()
      ]);
      
      set({ 
        businessMetrics, 
        clevelPerformance, 
        latestBriefs, 
        problematicTasks,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data' 
      });
    }
  },
  
  fetchBusinessMetrics: async () => {
    try {
      set({ isLoading: true, error: null });
      const businessMetrics = await DashboardService.getBusinessMetrics();
      set({ businessMetrics, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch business metrics' 
      });
    }
  },
  
  fetchCLevelPerformance: async () => {
    try {
      set({ isLoading: true, error: null });
      const clevelPerformance = await DashboardService.getCLevelPerformance();
      set({ clevelPerformance, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch C-Level performance' 
      });
    }
  },
  
  fetchLatestBriefs: async (limit = 5) => {
    try {
      set({ isLoading: true, error: null });
      const latestBriefs = await DashboardService.getLatestBriefs(limit);
      set({ latestBriefs, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch latest briefs' 
      });
    }
  },
  
  fetchProblematicTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const problematicTasks = await DashboardService.getProblematicTasks();
      set({ problematicTasks, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch problematic tasks' 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
