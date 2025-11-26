import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../api/services/authService';
import type { RegisterData } from '../types/auth.types';
import { toast } from 'react-hot-toast';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente. Por favor inicia sesión.');
      navigate('/login');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.mensaje || 'Error al crear la cuenta';
      toast.error(message);
    },
  });
};
