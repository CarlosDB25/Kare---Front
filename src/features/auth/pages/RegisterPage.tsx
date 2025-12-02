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
  Person,
  Badge,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import type { RegisterData } from '../types/auth.types';

const registerSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  documento: z.string().min(6, 'El documento debe tener al menos 6 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    const registerData: RegisterData = {
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      documento: data.documento,
      rol: 'colaborador', // Siempre colaborador por defecto
    };
    register(registerData);
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
        <img src="/kare blanco.svg" alt="KARE Logo" style={{ width: 300, marginBottom: 24 }} />
        <Typography variant="h6" fontWeight={300} textAlign="center" sx={{ maxWidth: 400 }}>
          Sistema Integral de Gestión de Incapacidades Médicas
        </Typography>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Crea tu cuenta como colaborador y comienza a gestionar tus incapacidades
          </Typography>
        </Box>
      </Box>

      {/* Panel derecho - Registro */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 460, width: '100%' }}>
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
                Crear Cuenta
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completa el formulario para registrarte como colaborador
              </Typography>
            </Box>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <TextField
                  label="Nombre Completo"
                  fullWidth
                  {...registerField('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
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
                        <Person sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Número de Documento"
                  fullWidth
                  {...registerField('documento')}
                  error={!!errors.documento}
                  helperText={errors.documento?.message}
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
                        <Badge sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Correo Electrónico"
                  type="email"
                  fullWidth
                  {...registerField('email')}
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
                  {...registerField('password')}
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

                <TextField
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  {...registerField('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  //variant="contained"
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
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                      boxShadow: 4,
                    },
                  }}
                >
                  {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>

                <Typography variant="body2" textAlign="center" color="text.secondary">
                  ¿Ya tienes cuenta?{' '}
                  <MuiLink component={Link} to="/login" fontWeight={600} sx={{ color: 'secondary.main' }}>
                    Iniciar Sesión
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
