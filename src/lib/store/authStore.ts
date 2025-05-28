/**
 * Auth store for managing authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { AuthService } from '@/lib/api/services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await AuthService.login(email, password);
          
          // Store tokens in localStorage
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('refresh_token', response.refreshToken);
          
          // Fetch user data
          await get().fetchUser();
          
          set({ isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to login' 
          });
        }
      },
      
      logout: async () => {
        try {
          set({ isLoading: true });
          await AuthService.logout();
          
          // Clear tokens from localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to logout' 
          });
        }
      },
      
      fetchUser: async () => {
        try {
          set({ isLoading: true, error: null });
          const user = await AuthService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            isAuthenticated: false,
            error: error instanceof Error ? error.message : 'Failed to fetch user' 
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
