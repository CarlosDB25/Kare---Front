import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../api/services/authService';
import { useAuthStore } from '../../../store/authStore';
import type { LoginCredentials } from '../types/auth.types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      console.log('[useLogin] Iniciando mutación con:', credentials);
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      console.log('[useLogin] Login exitoso, data:', data);
      const { token, usuario } = data;
      setAuth(usuario, token);
      toast.success(`¡Bienvenido ${usuario.nombre}!`);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.error('[useLogin] Error completo:', error);
      console.error('[useLogin] Error response:', error.response);
      
      let message = 'Error al iniciar sesión';
      
      if (error.code === 'ECONNABORTED') {
        message = 'El servidor está despertando, intenta de nuevo en 10 segundos...';
      } else if (error.code === 'ERR_NETWORK') {
        message = 'No se puede conectar al servidor. Por favor espera unos segundos...';
      } else if (error.response?.status === 401) {
        message = 'Email o contraseña incorrectos';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message, { duration: 5000 });
    },
  });
};
