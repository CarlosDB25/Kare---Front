import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
  Autocomplete,
  Alert,
} from '@mui/material';
import {
  Add,
  MoreVert,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { reemplazoService, type Reemplazo, type CreateReemplazoData } from '../../../api/services/reemplazoService';
import { incapacidadService } from '../../../api/services/incapacidadService';
import type { Incapacidad } from '../../incapacidades/types/incapacidad.types';
import { usuarioService } from '../../../api/services/usuarioService';
import { useAuthStore } from '../../../store/authStore';
import { formatDate } from '../../../utils';

const estadoColors: Record<string, 'success' | 'default' | 'error'> = {
  activo: 'success',
  finalizado: 'default',
  cancelado: 'error',
};

export const ReemplazosPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReemplazo, setSelectedReemplazo] = useState<Reemplazo | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false);
  const [cancelarDialogOpen, setCancelarDialogOpen] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  const { data: reemplazos = [], isLoading } = useQuery({
    queryKey: ['reemplazos'],
    queryFn: () => reemplazoService.getAll(),
  });

  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuarioService.getAll(),
  });

  const { data: incapacidades = [] } = useQuery({
    queryKey: ['incapacidades'],
    queryFn: () => incapacidadService.getAll(),
  });

  const finalizarMutation = useMutation({
    mutationFn: ({ id, observaciones }: { id: number; observaciones?: string }) =>
      reemplazoService.finalizar(id, observaciones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reemplazos'] });
      setFinalizarDialogOpen(false);
      setAnchorEl(null);
      setObservaciones('');
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      reemplazoService.cancelar(id, motivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reemplazos'] });
      setCancelarDialogOpen(false);
      setAnchorEl(null);
      setObservaciones('');
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reemplazo: Reemplazo) => {
    setAnchorEl(event.currentTarget);
    setSelectedReemplazo(reemplazo);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFinalizar = () => {
    setFinalizarDialogOpen(true);
    handleMenuClose();
  };

  const handleCancelar = () => {
    setCancelarDialogOpen(true);
    handleMenuClose();
  };

  // Filtrar reemplazos por área para líderes
  const reemplazosVisibles = reemplazos.filter(reemplazo => {
    // GH y CONTA ven todos
    if (user?.rol !== 'lider') return true;
    
    // Líderes solo ven reemplazos de su área
    if (!user?.area || usuarios.length === 0 || incapacidades.length === 0) return true;
    
    const incapacidad = incapacidades.find(i => i.id === reemplazo.incapacidad_id);
    if (!incapacidad) return true;
    
    const colaborador = usuarios.find(u => u.id === incapacidad.usuario_id);
    return colaborador?.area === user.area;
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Reemplazos Temporales
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona los reemplazos por incapacidades
          </Typography>
        </Box>
        {user?.rol === 'lider' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ px: 3, py: 1.5, width: { xs: '100%', sm: 'auto' } }}
          >
            Nuevo Reemplazo
          </Button>
        )}
      </Box>

      {/* Vista Desktop - Tabla */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Colaborador Ausente</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Colaborador Reemplazo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Período</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Funciones</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reemplazosVisibles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">
                          No hay reemplazos registrados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    reemplazosVisibles.map((reemplazo) => (
                      <TableRow key={reemplazo.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {reemplazo.nombre_ausente}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {reemplazo.nombre_reemplazo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(reemplazo.fecha_inicio)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(reemplazo.fecha_fin)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {reemplazo.funciones_asignadas}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={reemplazo.estado.toUpperCase()}
                            color={estadoColors[reemplazo.estado]}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {reemplazo.estado === 'activo' && user?.rol === 'lider' && (
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, reemplazo)}
                            >
                              <MoreVert />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Vista Mobile - Cards */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {reemplazosVisibles.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No hay reemplazos registrados
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {reemplazosVisibles.map((reemplazo) => (
              <Card key={reemplazo.id}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          Ausente
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {reemplazo.nombre_ausente}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Reemplazo: {reemplazo.nombre_reemplazo}
                        </Typography>
                      </Box>
                      {reemplazo.estado === 'activo' && user?.rol === 'lider' && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, reemplazo)}
                        >
                          <MoreVert />
                        </IconButton>
                      )}
                    </Stack>

                    <Chip
                      label={reemplazo.estado.toUpperCase()}
                      color={estadoColors[reemplazo.estado]}
                      size="small"
                      sx={{ fontWeight: 600, width: 'fit-content' }}
                    />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Período
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(reemplazo.fecha_inicio)} - {formatDate(reemplazo.fecha_fin)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Funciones Asignadas
                      </Typography>
                      <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {reemplazo.funciones_asignadas}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Menu contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleFinalizar}>
          <CheckCircle fontSize="small" sx={{ mr: 1 }} />
          Finalizar Reemplazo
        </MenuItem>
        <MenuItem onClick={handleCancelar}>
          <Cancel fontSize="small" sx={{ mr: 1 }} />
          Cancelar Reemplazo
        </MenuItem>
      </Menu>

      {/* Dialog de crear - componente separado */}
      <CreateReemplazoDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      {/* Dialog finalizar */}
      <Dialog open={finalizarDialogOpen} onClose={() => setFinalizarDialogOpen(false)}>
        <DialogTitle>Finalizar Reemplazo</DialogTitle>
        <DialogContent>
          <TextField
            label="Observaciones (opcional)"
            multiline
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFinalizarDialogOpen(false)}>Cancelar</Button>
          <Button
            color="success"
            variant="contained"
            onClick={() =>
              selectedReemplazo &&
              finalizarMutation.mutate({
                id: selectedReemplazo.id,
                observaciones: observaciones || undefined,
              })
            }
            disabled={finalizarMutation.isPending}
          >
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog cancelar */}
      <Dialog open={cancelarDialogOpen} onClose={() => setCancelarDialogOpen(false)}>
        <DialogTitle>Cancelar Reemplazo</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, mt: 2 }}>
            El motivo de cancelación es obligatorio
          </Alert>
          <TextField
            label="Motivo de Cancelación *"
            multiline
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelarDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() =>
              selectedReemplazo &&
              observaciones &&
              cancelarMutation.mutate({ id: selectedReemplazo.id, motivo: observaciones })
            }
            disabled={!observaciones || cancelarMutation.isPending}
          >
            Cancelar Reemplazo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Componente para crear reemplazo
interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateReemplazoDialog = ({ open, onClose }: CreateDialogProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<CreateReemplazoData>>({
    fecha_inicio: '',
    fecha_fin: '',
    funciones_asignadas: '',
  });
  const [error, setError] = useState('');
  const [selectedIncapacidad, setSelectedIncapacidad] = useState<Incapacidad | null>(null);

  const { data: incapacidades = [] } = useQuery({
    queryKey: ['incapacidades'],
    queryFn: async () => {
      const todas = await incapacidadService.getAll();
      // Filtrar solo incapacidades activas que requieren reemplazo
      return todas.filter(i => 
        ['reportada', 'en_revision', 'validada', 'pagada'].includes(i.estado)
      );
    },
    enabled: open,
  });

  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuarioService.getAll(),
    enabled: open,
  });

  const { data: reemplazosActivos = [] } = useQuery({
    queryKey: ['reemplazos'],
    queryFn: async () => {
      const todos = await reemplazoService.getAll();
      // Solo reemplazos activos
      return todos.filter(r => r.estado === 'activo');
    },
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateReemplazoData) => reemplazoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reemplazos'] });
      handleClose();
    },
    onError: () => {
      setError('Error al crear el reemplazo');
    },
  });

  const handleClose = () => {
    setFormData({
      fecha_inicio: '',
      fecha_fin: '',
      funciones_asignadas: '',
    });
    setError('');
    setSelectedIncapacidad(null);
    onClose();
  };

  const handleSubmit = () => {
    if (
      !formData.incapacidad_id ||
      !formData.colaborador_reemplazo_id ||
      !formData.fecha_inicio ||
      !formData.fecha_fin ||
      !formData.funciones_asignadas
    ) {
      setError('Todos los campos son obligatorios');
      return;
    }

    createMutation.mutate(formData as CreateReemplazoData);
  };

  // Filtrar incapacidades que NO tienen un reemplazo activo asignado
  const incapacidadesDisponibles = incapacidades.filter(
    (inc) => {
      const tieneReemplazoActivo = reemplazosActivos.some(r => r.incapacidad_id === inc.id);
      return !tieneReemplazoActivo;
    }
  );

  // Filtrar colaboradores activos que NO están reemplazando actualmente
  // y que NO tienen una incapacidad activa
  const colaboradoresDisponibles = usuarios.filter((u) => {
    if (u.rol !== 'colaborador') return false;
    if (u.id === selectedIncapacidad?.usuario_id) return false;
    
    // Verificar que no esté reemplazando activamente
    const estaReemplazando = reemplazosActivos.some(r => r.colaborador_reemplazo_id === u.id);
    if (estaReemplazando) return false;
    
    // Verificar que no tenga una incapacidad activa
    const tieneIncapacidadActiva = incapacidades.some(inc => inc.usuario_id === u.id);
    if (tieneIncapacidadActiva) return false;
    
    return true;
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Nuevo Reemplazo Temporal
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Autocomplete
            options={incapacidadesDisponibles}
            getOptionLabel={(option) =>
              `${option.usuario_nombre} - ${option.tipo} (${new Date(
                option.fecha_inicio
              ).toLocaleDateString()} - ${new Date(option.fecha_fin).toLocaleDateString()}) [${option.estado}]`
            }
            onChange={(_, value) => {
              setSelectedIncapacidad(value);
              setFormData({ 
                ...formData, 
                incapacidad_id: value?.id,
                fecha_inicio: value?.fecha_inicio || '',
                fecha_fin: value?.fecha_fin || '',
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Incapacidad *" placeholder="Selecciona la incapacidad" />
            )}
            noOptionsText="No hay incapacidades disponibles para reemplazo"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          <Autocomplete
            options={colaboradoresDisponibles}
            getOptionLabel={(option) => `${option.nombre} (${option.cargo || 'Sin cargo'})`}
            onChange={(_, value) =>
              setFormData({ ...formData, colaborador_reemplazo_id: value?.id })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Colaborador Reemplazo *"
                placeholder="Selecciona quien reemplazará"
              />
            )}
            noOptionsText="No hay colaboradores disponibles"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

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
            label="Funciones Asignadas"
            multiline
            rows={3}
            value={formData.funciones_asignadas}
            onChange={(e) =>
              setFormData({ ...formData, funciones_asignadas: e.target.value })
            }
            fullWidth
            placeholder="Describe las funciones que asumirá el reemplazo..."
          />

          <TextField
            label="Observaciones (opcional)"
            multiline
            rows={2}
            value={formData.observaciones || ''}
            onChange={(e) =>
              setFormData({ ...formData, observaciones: e.target.value })
            }
            fullWidth
          />
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
          {createMutation.isPending ? 'Creando...' : 'Crear Reemplazo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
