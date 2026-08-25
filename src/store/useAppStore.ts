import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  // Future state e.g. user, cart
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));
