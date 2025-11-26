import { useState, useEffect } from 'react';
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
  Chip,
} from '@mui/material';
import { Edit, CloudUpload } from '@mui/icons-material';
import { incapacidadService } from '../../api/services/incapacidadService';
import { useAuthStore } from '../../store/authStore';
import type { Incapacidad } from '../../features/incapacidades/types/incapacidad.types';

interface Props {
  open: boolean;
  onClose: () => void;
  incapacidad: Incapacidad | null;
}

export const EditIncapacidadDialog = ({ open, onClose, incapacidad }: Props) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Inicializar formData con los valores de incapacidad o valores por defecto
  const initialFormData = {
    tipo: incapacidad?.tipo || 'EPS',
    fecha_inicio: incapacidad?.fecha_inicio || '',
    fecha_fin: incapacidad?.fecha_fin || '',
    diagnostico: incapacidad?.diagnostico || '',
    observaciones: incapacidad?.observaciones || '',
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [documento, setDocumento] = useState<File | null>(null);
  const [error, setError] = useState('');

  // Resetear formulario cuando cambia la incapacidad
  useEffect(() => {
    if (incapacidad && open) {
      setFormData({
        tipo: incapacidad.tipo || 'EPS',
        fecha_inicio: incapacidad.fecha_inicio || '',
        fecha_fin: incapacidad.fecha_fin || '',
        diagnostico: incapacidad.diagnostico || '',
        observaciones: incapacidad.observaciones || '',
      });
      setDocumento(null);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incapacidad?.id, open]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!incapacidad?.id) throw new Error('No hay incapacidad para actualizar');
      
      // Actualizar datos completos de la incapacidad rechazada
      await incapacidadService.update(incapacidad.id, {
        tipo: formData.tipo as 'EPS' | 'ARL' | 'Licencia_Maternidad' | 'Licencia_Paternidad',
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        diagnostico: formData.diagnostico,
        observaciones: formData.observaciones,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incapacidades'] });
      queryClient.invalidateQueries({ queryKey: ['incapacidades', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['incapacidades', 'estadisticas'] });
      handleClose();
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al actualizar la incapacidad');
    },
  });

  const handleClose = () => {
    setFormData({
      tipo: 'EPS',
      fecha_inicio: '',
      fecha_fin: '',
      diagnostico: '',
      observaciones: '',
    });
    setDocumento(null);
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    setError('');

    if (!formData.fecha_inicio || !formData.fecha_fin || !formData.diagnostico) {
      setError('Los campos Fecha Inicio, Fecha Fin y Diagnóstico son obligatorios');
      return;
    }

    updateMutation.mutate();
  };

  if (!incapacidad) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Edit color="primary" />
        Corregir Incapacidad Rechazada
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Mostrar observaciones de rechazo */}
          {incapacidad.observaciones && (
            <Alert severity="warning">
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Motivo del Rechazo:
              </Typography>
              <Typography variant="body2">
                {incapacidad.observaciones}
              </Typography>
            </Alert>
          )}

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Box>
            <Chip 
              label={`Estado: ${incapacidad.estado.toUpperCase()}`} 
              color="error" 
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Al guardar los cambios, la incapacidad volverá a estado <strong>REPORTADA</strong> para nueva revisión.
            </Typography>
          </Box>

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
            label="Observaciones (Opcional)"
            multiline
            rows={2}
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            fullWidth
            placeholder="Agrega comentarios sobre las correcciones realizadas..."
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {documento ? `Nuevo Archivo: ${documento.name}` : 'Actualizar Documento (Opcional)'}
              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDocumento(e.target.files?.[0] || null)}
              />
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * Si no adjuntas un nuevo documento, se mantendrá el anterior
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={updateMutation.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Guardando...' : 'Guardar y Reenviar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
