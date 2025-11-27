// Response genérico del backend
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Error del backend
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
