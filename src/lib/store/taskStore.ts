/**
 * Task store for managing tasks state
 */

import { create } from 'zustand';
import { Task, TaskStatus, CLevelType } from '@/types';
import { mockTasks } from '@/lib/mock-data';
import {
  getAllTasks,
  getTaskById,
  getTasksByCLevel,
  createTask as createFirebaseTask,
  updateTask as updateFirebaseTask,
  deleteTask as deleteFirebaseTask,
  getProblematicTasks as getFirebaseProblematicTasks
} from '@/lib/firebase/services/taskService';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  filteredTasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  clevelFilter: CLevelType | null;
  statusFilter: TaskStatus | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<Task | null>;
  fetchTasksByCLevel: (clevelType: CLevelType) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getProblematicTasks: () => Promise<Task[]>;
  setFilters: (clevel: CLevelType | null, status: TaskStatus | null) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  filteredTasks: [],
  isLoading: false,
  error: null,
  
  // Filters
  clevelFilter: null,
  statusFilter: null,
  
  // Actions
  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await getAllTasks();
      set({ 
        tasks, 
        filteredTasks: tasks,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks' 
      });
    }
  },
  
  fetchTaskById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const task = await getTaskById(id);
      set({ currentTask: task, isLoading: false });
      return task;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch task' 
      });
      return null;
    }
  },
  
  fetchTasksByCLevel: async (clevelType: CLevelType) => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await getTasksByCLevel(clevelType);
      set({ 
        tasks, 
        filteredTasks: tasks,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching tasks by C-Level:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks' 
      });
    }
  },
  
  createTask: async (task) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await createFirebaseTask(task);
      
      set(state => ({ 
        tasks: [newTask, ...state.tasks],
        filteredTasks: [newTask, ...state.filteredTasks],
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error creating task:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create task' 
      });
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      set({ isLoading: true, error: null });
      await updateFirebaseTask(id, taskData);
      
      // Обновляем локальное состояние
      set(state => {
        const updatedTasks = state.tasks.map(task => 
          task.id === id ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
        );
        const updatedFilteredTasks = state.filteredTasks.map(task => 
          task.id === id ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
        );
        
        return { 
          tasks: updatedTasks, 
          filteredTasks: updatedFilteredTasks,
          currentTask: state.currentTask?.id === id 
            ? { ...state.currentTask, ...taskData, updatedAt: new Date().toISOString() } 
            : state.currentTask,
          isLoading: false 
        };
      });
    } catch (error) {
      console.error('Error updating task:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update task' 
      });
    }
  },
  
  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteFirebaseTask(id);
      
      // Обновляем локальное состояние
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        filteredTasks: state.filteredTasks.filter(task => task.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete task' 
      });
    }
  },
  
  getProblematicTasks: async () => {
    try {
      return await getFirebaseProblematicTasks();
    } catch (error) {
      console.error('Error getting problematic tasks:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to get problematic tasks' });
      return [];
    }
  },
  
  setFilters: (clevel, status) => {
    set({ clevelFilter: clevel, statusFilter: status });
    
    // Apply filters
    const { tasks } = get();
    let filtered = [...tasks];
    
    if (clevel) {
      filtered = filtered.filter(task => task.clevelType === clevel);
    }
    
    if (status) {
      filtered = filtered.filter(task => task.status === status);
    }
    
    set({ filteredTasks: filtered });
  },
  
  clearFilters: () => {
    set(state => ({
      clevelFilter: null,
      statusFilter: null,
      filteredTasks: state.tasks
    }));
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
