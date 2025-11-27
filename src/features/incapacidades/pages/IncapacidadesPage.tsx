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
} from '@mui/material';
import {
  Add,
  MoreVert,
  Visibility,
  Delete,
  Assessment,
  Edit,
  Calculate,
} from '@mui/icons-material';
import { incapacidadService } from '../../../api/services/incapacidadService';
import { conciliacionService } from '../../../api/services/conciliacionService';
import { usuarioService } from '../../../api/services/usuarioService';
import { useAuthStore } from '../../../store/authStore';
import type { Incapacidad, UpdateEstadoData } from '../types/incapacidad.types';
import type { EstadoIncapacidad } from '../../../types/enums';
import { CreateIncapacidadDialog, IncapacidadDetailDialog } from '../../../components/incapacidades';
import { EditIncapacidadDialog } from '../../../components/incapacidades/EditIncapacidadDialog';
import { formatDate } from '../../../utils';

const estadoColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  reportada: 'info',
  en_revision: 'warning',
  validada: 'success',
  rechazada: 'error',
  pagada: 'success',
  conciliada: 'info',
  archivada: 'default',
};

export const IncapacidadesPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIncap, setSelectedIncap] = useState<Incapacidad | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [estadoDialogOpen, setEstadoDialogOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const { data: incapacidades = [], isLoading, error } = useQuery({
    queryKey: ['incapacidades', user?.id],
    queryFn: incapacidadService.getAll,
    enabled: !!user?.id,
  });

  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuarioService.getAll,
    enabled: user?.rol === 'lider', // Solo cargar si es líder
  });

  // Filtrar incapacidades por área si es líder
  const incapacidadesFiltradas = user?.rol === 'lider' 
    ? incapacidades.filter(incap => {
        // Buscar el colaborador en la lista de usuarios usando usuario_id
        const colaborador = usuarios.find(u => u.id === incap.usuario_id);
        
        // Solo mostrar si el colaborador existe, tiene área y es la misma que el líder
        return colaborador && colaborador.area && user.area && colaborador.area === user.area;
      })
    : incapacidades;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => incapacidadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incapacidades'] });
      setDeleteDialogOpen(false);
      setAnchorEl(null);
    },
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEstadoData }) =>
      incapacidadService.updateEstado(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incapacidades'] });
      setEstadoDialogOpen(false);
      setAnchorEl(null);
      setNuevoEstado('');
      setObservaciones('');
    },
  });

  const crearConciliacionMutation = useMutation({
    mutationFn: (incapacidadId: number) => conciliacionService.create(incapacidadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incapacidades'] });
      queryClient.invalidateQueries({ queryKey: ['conciliaciones'] });
      setAnchorEl(null);
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, incap: Incapacidad) => {
    setAnchorEl(event.currentTarget);
    setSelectedIncap(incap);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    setDetailDialogOpen(true);
    handleMenuClose();
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleEstadoChange = () => {
    setEstadoDialogOpen(true);
  };

  const handleCrearConciliacion = () => {
    if (selectedIncap?.id) {
      crearConciliacionMutation.mutate(selectedIncap.id);
    }
  };

  const calculateDays = (inicio: string, fin: string) => {
    const start = new Date(inicio);
    const end = new Date(fin);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const canDelete = (incap: Incapacidad) => {
    if (user?.rol === 'gh' || user?.rol === 'conta') return true;
    return incap.colaborador_id === user?.id && incap.estado === 'reportada';
  };

  const canChangeEstado = () => {
    return user?.rol === 'gh' || user?.rol === 'conta';
  };

  // Obtener estados permitidos según el rol y estado actual
  const getEstadosPermitidos = (estadoActual: EstadoIncapacidad): EstadoIncapacidad[] => {
    // Transiciones válidas del backend (validationService.js):
    // reportada -> [en_revision, rechazada]
    // en_revision -> [validada, rechazada]
    // validada -> [pagada, rechazada]
    // rechazada -> [reportada]
    // pagada -> [conciliada]
    // conciliada -> [archivada]
    // archivada -> []
    
    if (user?.rol === 'gh') {
      // GH maneja: reportada -> en_revision -> validada/rechazada y archivamiento final
      switch (estadoActual) {
        case 'reportada':
          return ['en_revision', 'rechazada'];
        case 'en_revision':
          return ['validada', 'rechazada'];
        case 'validada':
          return ['rechazada']; // GH puede rechazar si encuentra error
        case 'conciliada':
          return ['archivada']; // Solo GH puede archivar
        default:
          return [];
      }
    } else if (user?.rol === 'conta') {
      // CONTA maneja: validada -> pagada -> conciliada
      switch (estadoActual) {
        case 'validada':
          return ['pagada'];
        case 'pagada':
          return ['conciliada'];
        default:
          return [];
      }
    }
    return [];
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">
          Error al cargar incapacidades: {error instanceof Error ? error.message : 'Error desconocido'}
        </Typography>
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
            Incapacidades
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona las incapacidades médicas del sistema
          </Typography>
        </Box>
        {user?.rol === 'colaborador' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ px: 3, py: 1.5, width: { xs: '100%', sm: 'auto' } }}
          >
            Nueva Incapacidad
          </Button>
        )}
      </Box>

      {/* Vista desktop - Tabla */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Colaborador</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Período</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Días</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Diagnóstico</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incapacidadesFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">
                          No hay incapacidades registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    incapacidadesFiltradas.map((incap) => (
                      <TableRow
                        key={incap.id}
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                            cursor: 'pointer',
                          },
                        }}
                        onClick={() => {
                          setSelectedIncap(incap);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {incap.usuario_nombre || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {incap.usuario_email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={incap.tipo}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(incap.fecha_inicio)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(incap.fecha_fin)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {calculateDays(incap.fecha_inicio, incap.fecha_fin)} días
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={incap.estado.replace('_', ' ')}
                            color={estadoColors[incap.estado]}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          />
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
                            {incap.diagnostico}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, incap)}
                          >
                            <MoreVert />
                          </IconButton>
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

      {/* Vista mobile - Cards */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {incapacidadesFiltradas.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No hay incapacidades registradas
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {incapacidadesFiltradas.map((incap) => (
              <Card 
                key={incap.id}
                onClick={() => {
                  setSelectedIncap(incap);
                  setDetailDialogOpen(true);
                }}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {incap.usuario_nombre || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {incap.usuario_email}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, incap);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={incap.tipo}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={incap.estado.replace('_', ' ')}
                        color={estadoColors[incap.estado]}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      />
                    </Stack>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Período
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(incap.fecha_inicio)} - {formatDate(incap.fecha_fin)}
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {calculateDays(incap.fecha_inicio, incap.fecha_fin)} días
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Diagnóstico
                      </Typography>
                      <Typography variant="body2" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {incap.diagnostico}
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
        <MenuItem onClick={handleView}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        {/* Opción de editar solo para colaboradores con incapacidades rechazadas */}
        {selectedIncap && 
         user?.rol === 'colaborador' && 
         selectedIncap.estado === 'rechazada' && 
         (selectedIncap.colaborador_id === user.id || selectedIncap.usuario_id === user.id) && (
          <MenuItem onClick={handleEdit}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Corregir y Reenviar
          </MenuItem>
        )}
        {canChangeEstado() && (
          <MenuItem onClick={handleEstadoChange}>
            <Assessment fontSize="small" sx={{ mr: 1 }} />
            Cambiar Estado
          </MenuItem>
        )}
        {/* Opción de crear conciliación para CONTA con incapacidades validadas */}
        {selectedIncap && 
         user?.rol === 'conta' && 
         selectedIncap.estado === 'validada' && (
          <MenuItem onClick={handleCrearConciliacion} disabled={crearConciliacionMutation.isPending}>
            <Calculate fontSize="small" sx={{ mr: 1 }} />
            {crearConciliacionMutation.isPending ? 'Creando...' : 'Crear Conciliación'}
          </MenuItem>
        )}
        {selectedIncap && canDelete(selectedIncap) && (
          <MenuItem onClick={handleDelete}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de crear */}
      <CreateIncapacidadDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      {/* Dialog de editar (solo para rechazadas) */}
      {selectedIncap && (
        <EditIncapacidadDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedIncap(null);
          }}
          incapacidad={selectedIncap}
        />
      )}

      {/* Dialog de detalle */}
      {selectedIncap && (
        <IncapacidadDetailDialog
          incapacidad={selectedIncap}
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedIncap(null);
          }}
        />
      )}

      {/* Dialog de eliminar */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Incapacidad</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta incapacidad? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => selectedIncap && deleteMutation.mutate(selectedIncap.id)}
            disabled={deleteMutation.isPending}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de cambiar estado */}
      <Dialog open={estadoDialogOpen} onClose={() => setEstadoDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Estado</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              select
              label="Nuevo Estado"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="">Seleccionar...</option>
              {selectedIncap && getEstadosPermitidos(selectedIncap.estado).map((estado) => (
                <option key={estado} value={estado}>
                  {estado.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </TextField>
            <TextField
              label={nuevoEstado === 'rechazada' ? 'Motivo del Rechazo (Obligatorio)' : 'Observaciones (Opcional)'}
              multiline
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              fullWidth
              required={nuevoEstado === 'rechazada'}
              placeholder={nuevoEstado === 'rechazada' ? 'Indica claramente qué debe corregir el colaborador...' : 'Agrega comentarios adicionales...'}
              helperText={nuevoEstado === 'rechazada' ? 'El colaborador verá este mensaje para saber qué corregir' : ''}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEstadoDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() =>
              selectedIncap &&
              updateEstadoMutation.mutate({
                id: selectedIncap.id,
                data: { estado: nuevoEstado as EstadoIncapacidad, observaciones },
              })
            }
            disabled={!nuevoEstado || updateEstadoMutation.isPending || (nuevoEstado === 'rechazada' && !observaciones.trim())}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
