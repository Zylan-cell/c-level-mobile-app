/**
 * Telegram store for managing Telegram integration
 */

import { create } from 'zustand';
import { TelegramService } from '@/lib/api/services';

interface TelegramState {
  isLinked: boolean;
  telegramId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  linkTelegramAccount: (telegramId: string) => Promise<void>;
  unlinkTelegramAccount: () => Promise<void>;
  sendTestMessage: () => Promise<void>;
  clearError: () => void;
}

export const useTelegramStore = create<TelegramState>((set) => ({
  isLinked: false,
  telegramId: null,
  isLoading: false,
  error: null,
  
  // Actions
  linkTelegramAccount: async (telegramId: string) => {
    try {
      set({ isLoading: true, error: null });
      await TelegramService.linkTelegramAccount(telegramId);
      set({ isLinked: true, telegramId, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to link Telegram account' 
      });
    }
  },
  
  unlinkTelegramAccount: async () => {
    try {
      set({ isLoading: true, error: null });
      await TelegramService.unlinkTelegramAccount();
      set({ isLinked: false, telegramId: null, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to unlink Telegram account' 
      });
    }
  },
  
  sendTestMessage: async () => {
    try {
      set({ isLoading: true, error: null });
      await TelegramService.sendTestMessage();
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to send test message' 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));
