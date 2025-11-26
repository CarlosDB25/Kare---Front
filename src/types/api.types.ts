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

// Paginación (si se implementa después)
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: Pagination;
}
