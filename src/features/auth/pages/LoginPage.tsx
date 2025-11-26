import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import type { LoginCredentials } from '../types/auth.types';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Panel izquierdo - Branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'secondary.main',
          color: 'white',
          p: 6,
        }}
      >
        <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
          KARE
        </Typography>
        <Typography variant="h6" fontWeight={300} textAlign="center" sx={{ maxWidth: 400 }}>
          Sistema Integral de Gestión de Incapacidades Médicas
        </Typography>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Control total de incapacidades, reemplazos y conciliaciones
          </Typography>
        </Box>
      </Box>

      {/* Panel derecho - Login */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 420, width: '100%' }}>
          <Stack spacing={4}>
            {/* Logo móvil */}
            <Box textAlign="center" sx={{ display: { md: 'none' } }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                KARE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestión de Incapacidades
              </Typography>
            </Box>

            {/* Título */}
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Iniciar Sesión
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresa tus credenciales para acceder
              </Typography>
            </Box>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <TextField
                  label="Correo Electrónico"
                  type="email"
                  fullWidth
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isPending}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isPending}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isPending}
                  sx={{ 
                    py: 1.75,
                    bgcolor: 'secondary.main',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 2,
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                      boxShadow: 4,
                    },
                  }}
                >
                  {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                <Typography variant="body2" textAlign="center" color="text.secondary">
                  ¿No tienes cuenta?{' '}
                  <MuiLink component={Link} to="/register" fontWeight={600} sx={{ color: 'secondary.main' }}>
                    Regístrate aquí
                  </MuiLink>
                </Typography>
              </Stack>
            </form>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
