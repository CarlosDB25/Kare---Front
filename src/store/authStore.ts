import { create } from 'zustand';
import { authService } from '../api/services/authService';
import type { User } from '../features/auth/types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    authService.saveToken(token);
    authService.saveUser(user);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    authService.clearAuth();
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = authService.getToken();
    const user = authService.getUser();

    if (token && user) {
      set({ user, token, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
