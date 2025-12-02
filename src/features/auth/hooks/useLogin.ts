import { useMutation } from '@tanstack/react-query';
import { authService } from '../../../api/services/authService';
import { useAuthStore } from '../../../store/authStore';
import type { LoginCredentials } from '../types/auth.types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      const { token, usuario } = data;
      setAuth(usuario, token);
      toast.success(`¡Bienvenido ${usuario.nombre}!`);
      navigate('/dashboard');
    },
    onError: (error: unknown) => {
      
      let message = 'Error al iniciar sesión';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          message = 'El servidor está despertando, intenta de nuevo en 10 segundos...';
        } else if (error.code === 'ERR_NETWORK') {
          message = 'No se puede conectar al servidor. Por favor espera unos segundos...';
        } else if (error.response?.status === 401) {
          message = 'Email o contraseña incorrectos';
        } else if ((error.response?.data as { message?: string })?.message) {
          message = (error.response?.data as { message?: string }).message ?? message;
        }
      } else if (error instanceof Error) {
        message = error.message || message;
      }
      
      toast.error(message, { duration: 5000 });
    },
  });
};
