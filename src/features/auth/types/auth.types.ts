import type { UserRole } from '../../../types/enums';

// Usuario completo
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  documento?: string;
  salario_base?: number;
  ibc?: number;
  area?: string;
  cargo?: string;
  created_at: string;
  updated_at?: string;
}

// Datos de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Datos de registro
export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  documento?: string;
  rol: UserRole;
}

// Respuesta de login
export interface LoginResponse {
  token: string;
  usuario: User;
}
