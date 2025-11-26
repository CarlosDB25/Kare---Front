import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { incapacidadService } from '../../api/services/incapacidadService';
import { useAuthStore } from '../../store/authStore';
import type { CreateIncapacidadData } from '../../features/incapacidades/types/incapacidad.types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateIncapacidadDialog = ({ open, onClose }: Props) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<CreateIncapacidadData>>({
    tipo: 'EPS',
    fecha_inicio: '',
    fecha_fin: '',
    diagnostico: '',
  });
  const [documento, setDocumento] = useState<File | null>(null);
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: (data: CreateIncapacidadData) => incapacidadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incapacidades'] });
      queryClient.invalidateQueries({ queryKey: ['incapacidades', 'estadisticas'] });
      handleClose();
    },
    onError: (err: Error) => {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(errorResponse.response?.data?.message || 'Error al crear la incapacidad');
    },
  });

  const handleClose = () => {
    setFormData({
      tipo: 'EPS',
      fecha_inicio: '',
      fecha_fin: '',
      diagnostico: '',
    });
    setDocumento(null);
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    setError('');

    // Validar que colaboradores/líderes suban documento
    if ((user?.rol === 'colaborador' || user?.rol === 'lider') && !documento) {
      setError('Debes adjuntar el documento de soporte (PDF o imagen)');
      return;
    }

    if (!formData.fecha_inicio || !formData.fecha_fin || !formData.diagnostico) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!user?.id) {
      setError('No se pudo identificar al usuario');
      return;
    }

    const data: CreateIncapacidadData = {
      colaborador_id: user.id,
      tipo: formData.tipo!,
      fecha_inicio: formData.fecha_inicio!,
      fecha_fin: formData.fecha_fin!,
      diagnostico: formData.diagnostico!,
      documento: documento || undefined,
      observaciones: formData.observaciones,
    };

    createMutation.mutate(data);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={{ xs: true, sm: false }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Nueva Incapacidad
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && (
            <Alert severity={error.includes('Datos extraídos') ? 'success' : 'error'}>
              {error}
            </Alert>
          )}

          <TextField
            select
            label="Tipo de Incapacidad"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'EPS' | 'ARL' | 'Licencia_Maternidad' | 'Licencia_Paternidad' })}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="EPS">EPS - Enfermedad General</option>
            <option value="ARL">ARL - Accidente Laboral</option>
            <option value="Licencia_Maternidad">Licencia de Maternidad</option>
            <option value="Licencia_Paternidad">Licencia de Paternidad</option>
          </TextField>

          <TextField
            label="Fecha Inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Fecha Fin"
            type="date"
            value={formData.fecha_fin}
            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Diagnóstico"
            multiline
            rows={3}
            value={formData.diagnostico}
            onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
            fullWidth
          />

          <TextField
            label="Observaciones"
            multiline
            rows={2}
            value={formData.observaciones || ''}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            fullWidth
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {documento ? `Archivo: ${documento.name}` : 'Adjuntar Documento (PDF/Imagen)'}
              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDocumento(e.target.files?.[0] || null)}
              />
            </Button>
            
            {(user?.rol === 'colaborador' || user?.rol === 'lider') && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  * El documento es obligatorio
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={createMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creando...' : 'Crear Incapacidad'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
