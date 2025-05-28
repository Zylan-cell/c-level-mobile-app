/**
 * Brief store for managing briefs/reports
 */

import { create } from 'zustand';
import { Brief } from '@/types';
import {
  getAllBriefs,
  getBriefById,
  getBriefByTaskId,
  createBrief as createFirebaseBrief,
  updateBrief as updateFirebaseBrief,
  deleteBrief as deleteFirebaseBrief,
  getLatestBriefs as getFirebaseLatestBriefs
} from '@/lib/firebase/services/briefService';

interface BriefState {
  briefs: Brief[];
  currentBrief: Brief | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBriefs: () => Promise<void>;
  fetchBriefByTaskId: (taskId: string) => Promise<void>;
  fetchBrief: (briefId: string) => Promise<void>;
  clearError: () => void;
}

export const useBriefStore = create<BriefState>((set) => ({
  briefs: [],
  currentBrief: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchBriefs: async () => {
    try {
      set({ isLoading: true, error: null });
      const briefs = await getAllBriefs();
      set({ briefs, isLoading: false });
    } catch (error) {
      console.error('Error fetching briefs:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch briefs' 
      });
    }
  },
  
  fetchBriefByTaskId: async (taskId: string) => {
    try {
      set({ isLoading: true, error: null });
      const brief = await getBriefByTaskId(taskId);
      set({ currentBrief: brief, isLoading: false });
    } catch (error) {
      console.error('Error fetching brief by task ID:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch brief' 
      });
    }
  },
  
  fetchBrief: async (briefId: string) => {
    try {
      set({ isLoading: true, error: null });
      const brief = await getBriefById(briefId);
      set({ currentBrief: brief, isLoading: false });
    } catch (error) {
      console.error('Error fetching brief:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch brief' 
      });
    }
  },
  
  getLatestBriefs: async (limit: number = 5) => {
    try {
      set({ isLoading: true, error: null });
      const briefs = await getFirebaseLatestBriefs(limit);
      return briefs;
    } catch (error) {
      console.error('Error fetching latest briefs:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch latest briefs' 
      });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  createBrief: async (brief: Omit<Brief, 'id' | 'createdAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newBrief = await createFirebaseBrief(brief);
      
      set(state => ({ 
        briefs: [...state.briefs, newBrief],
        isLoading: false 
      }));
      
      return newBrief;
    } catch (error) {
      console.error('Error creating brief:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create brief' 
      });
      throw error;
    }
  },
  
  updateBrief: async (briefId: string, updates: Partial<Brief>) => {
    try {
      set({ isLoading: true, error: null });
      await updateFirebaseBrief(briefId, updates);
      
      set(state => ({ 
        briefs: state.briefs.map(brief => 
          brief.id === briefId ? { ...brief, ...updates } : brief
        ),
        currentBrief: state.currentBrief?.id === briefId 
          ? { ...state.currentBrief, ...updates } 
          : state.currentBrief,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error updating brief:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update brief' 
      });
    }
  },
  
  deleteBrief: async (briefId: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteFirebaseBrief(briefId);
      
      set(state => ({ 
        briefs: state.briefs.filter(brief => brief.id !== briefId),
        currentBrief: state.currentBrief?.id === briefId ? null : state.currentBrief,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error deleting brief:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete brief' 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
