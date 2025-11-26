import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  User,
} from '../../features/auth/types/auth.types';
import { AxiosError } from 'axios';

class AuthService {
  // POST /auth/login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('[AUTH] Intentando login con:', credentials.email);
    console.log('[AUTH] Endpoint:', API_ENDPOINTS.AUTH.LOGIN);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('[AUTH] Respuesta completa:', response);
      console.log('[AUTH] Data:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('[AUTH] Error en login:', error);
      if (error instanceof AxiosError) {
        console.error('[AUTH] Error response:', error.response);
      }
      throw error;
    }
  }

  // POST /auth/register
  async register(data: RegisterData): Promise<User> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data.data;
  }

  // GET /auth/profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data.data;
  }

  // Helpers locales
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();
