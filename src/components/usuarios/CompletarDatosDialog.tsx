import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
} from '@mui/material';
import type { User } from '../../features/auth/types/auth.types';

const datosSchema = z.object({
  salario_base: z.number().min(0, 'El salario debe ser mayor a 0').optional(),
  ibc: z.number().min(0, 'El IBC debe ser mayor a 0').optional(),
  area: z.string().optional(),
  cargo: z.string().optional(),
});

type DatosFormData = z.infer<typeof datosSchema>;

interface CompletarDatosDialogProps {
  open: boolean;
  onClose: () => void;
  usuario: User;
  onSubmit: (data: DatosFormData) => void;
  isLoading?: boolean;
}

const areasDisponibles = [
  'Recursos Humanos',
  'Contabilidad',
  'Sistemas',
  'Ventas',
  'Producción',
  'Logística',
  'Administración',
  'Marketing',
  'Otro',
];

export const CompletarDatosDialog = ({
  open,
  onClose,
  usuario,
  onSubmit,
  isLoading = false,
}: CompletarDatosDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DatosFormData>({
    resolver: zodResolver(datosSchema),
  });

  // Resetear el formulario cuando cambia el usuario
  React.useEffect(() => {
    if (usuario) {
      reset({
        salario_base: usuario.salario_base || undefined,
        ibc: usuario.ibc || undefined,
        area: usuario.area || '',
        cargo: usuario.cargo || '',
      });
    }
  }, [usuario, reset]);

  const handleFormSubmit = (data: DatosFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar Información - {usuario.nombre}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={2.5}>
            <TextField
              label="Salario Base"
              type="number"
              fullWidth
              {...register('salario_base', { valueAsNumber: true })}
              error={!!errors.salario_base}
              helperText={errors.salario_base?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>$</span>,
              }}
            />

            <TextField
              label="IBC (Ingreso Base de Cotización)"
              type="number"
              fullWidth
              {...register('ibc', { valueAsNumber: true })}
              error={!!errors.ibc}
              helperText={errors.ibc?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>$</span>,
              }}
            />

            <TextField
              select
              label="Área"
              fullWidth
              {...register('area')}
              error={!!errors.area}
              helperText={errors.area?.message}
              disabled={isLoading}
              defaultValue={usuario.area || ''}
            >
              <MenuItem value="">Seleccione un área</MenuItem>
              {areasDisponibles.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Cargo"
              fullWidth
              {...register('cargo')}
              error={!!errors.cargo}
              helperText={errors.cargo?.message}
              disabled={isLoading}
              placeholder="Ej: Analista, Asistente, Coordinador..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
