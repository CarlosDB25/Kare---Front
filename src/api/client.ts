import axios from 'axios';
import { env } from '../config/env';

// Crear instancia de Axios con configuración base
export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 60000, // 60 segundos (Render puede tardar en despertar)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Agregar token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    console.log('[API Client] Request:', {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Client] Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor: Manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Client] Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('[API Client] Response error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Manejar error 401 (token expirado)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
