// src/features/conciliaciones/pages/ConciliacionesPage.tsx
// Página de gestión de conciliaciones para CONTA

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';
import { Visibility, Calculate } from '@mui/icons-material';
import { conciliacionService } from '../../../api/services/conciliacionService';
import { incapacidadService } from '../../../api/services/incapacidadService';
import { formatCurrency } from '../../../utils';
import type { Conciliacion, CreateConciliacionData } from '../../../api/services/conciliacionService';
import type { Incapacidad } from '../../incapacidades/types/incapacidad.types';

export default function ConciliacionesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedConciliacion, setSelectedConciliacion] = useState<Conciliacion | null>(null);
  const [calcDialogOpen, setCalcDialogOpen] = useState(false);
  const [selectedIncapacidad, setSelectedIncapacidad] = useState<Incapacidad | null>(null);

  // Query para conciliaciones
  const { data: conciliaciones = [], isLoading } = useQuery({
    queryKey: ['conciliaciones'],
    queryFn: () => conciliacionService.listar()
  });

  // Query para estadísticas
  const { data: stats } = useQuery({
    queryKey: ['conciliaciones', 'estadisticas'],
    queryFn: () => conciliacionService.obtenerEstadisticas()
  });

  // Query para incapacidades pagadas (para crear conciliaciones)
  const { data: incapacidadesPagadas = [] } = useQuery({
    queryKey: ['incapacidades', 'pagadas'],
    queryFn: async () => {
      const todas = await incapacidadService.getAll();
      return todas.filter((i: Incapacidad) => i.estado === 'pagada');
    }
  });

  // Mutation para crear conciliación
  const crearMutation = useMutation({
    mutationFn: (data: CreateConciliacionData) => conciliacionService.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conciliaciones'] });
      setCalcDialogOpen(false);
      setSelectedIncapacidad(null);
    }
  });

  const handleVerDetalle = (conciliacion: Conciliacion) => {
    setSelectedConciliacion(conciliacion);
    setDetailDialogOpen(true);
  };

  const handleCrearConciliacion = () => {
    if (!selectedIncapacidad) return;

    // Cálculo básico según normativa
    const dias = selectedIncapacidad.dias_totales || 0;
    const ibc = selectedIncapacidad.ibc || 0;
    const valorDia = ibc / 30;

    let diasEmpresa = 0;
    let montoEmpresa = 0;
    let diasEPS = 0;
    let montoEPS = 0;
    let diasARL = 0;
    let montoARL = 0;

    if (selectedIncapacidad.tipo === 'EPS') {
      // Día 1-2: Empleador 66.67%
      diasEmpresa = Math.min(dias, 2);
      montoEmpresa = valorDia * diasEmpresa * 0.6667;
      
      // Día 3+: EPS 66.67%
      if (dias > 2) {
        diasEPS = dias - 2;
        montoEPS = valorDia * diasEPS * 0.6667;
      }
    } else if (selectedIncapacidad.tipo === 'ARL') {
      // ARL 100% desde día 1
      diasARL = dias;
      montoARL = valorDia * dias;
    } else {
      // Licencias: 100% EPS
      diasEPS = dias;
      montoEPS = valorDia * dias;
    }

    const total = montoEmpresa + montoEPS + montoARL;

    const data = {
      incapacidad_id: selectedIncapacidad.id,
      dias_incapacidad: dias,
      salario_base: ibc, // Usar IBC como salario base
      ibc,
      valor_dia: Math.round(valorDia * 100) / 100,
      dias_empresa_67: diasEmpresa,
      monto_empresa_67: Math.round(montoEmpresa * 100) / 100,
      dias_eps_100: diasEPS,
      monto_eps_100: Math.round(montoEPS * 100) / 100,
      dias_arl_100: diasARL,
      monto_arl_100: Math.round(montoARL * 100) / 100,
      total_a_pagar: Math.round(total * 100) / 100,
      observaciones: 'Conciliación generada automáticamente'
    };

    crearMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Conciliaciones Financieras
      </Typography>

      {/* Estadísticas */}
      {stats && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Conciliaciones
              </Typography>
              <Typography variant="h5">{stats.total_conciliaciones || 0}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Valor Total
              </Typography>
              <Typography variant="h5">
                {formatCurrency(stats.valor_total_conciliado || 0)}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Promedio por Conciliación
              </Typography>
              <Typography variant="h5">
                {formatCurrency(stats.valor_promedio || 0)}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Promedio Días
              </Typography>
              <Typography variant="h5">
                {Math.round(stats.promedio_dias || 0)} días
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Incapacidades pagadas pendientes de conciliar */}
      {incapacidadesPagadas.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }} icon={<Calculate />}>
          Hay {incapacidadesPagadas.length} incapacidad(es) pagada(s) pendiente(s) de conciliar
        </Alert>
      )}

      {/* Vista Desktop - Tabla */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Paper sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Colaborador</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Días</TableCell>
                  <TableCell>IBC</TableCell>
                  <TableCell>Total a Pagar</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">Cargando...</TableCell>
                  </TableRow>
                ) : conciliaciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No hay conciliaciones registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  conciliaciones.map((conc) => (
                    <TableRow key={conc.id} hover>
                      <TableCell>{conc.id}</TableCell>
                      <TableCell>{conc.colaborador_nombre}</TableCell>
                      <TableCell>
                        <Chip
                          label={conc.incapacidad_tipo}
                          size="small"
                          color={conc.incapacidad_tipo === 'ARL' ? 'error' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>{conc.dias_incapacidad}</TableCell>
                      <TableCell>{formatCurrency(conc.ibc)}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {formatCurrency(conc.total_a_pagar)}
                      </TableCell>
                      <TableCell>
                        {new Date(conc.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleVerDetalle(conc)}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Vista Mobile - Cards */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {isLoading ? (
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography>Cargando...</Typography>
          </Paper>
        ) : conciliaciones.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No hay conciliaciones registradas
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {conciliaciones.map((conc) => (
              <Card key={conc.id} onClick={() => handleVerDetalle(conc)} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          #{conc.id}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {conc.colaborador_nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(conc.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalle(conc);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Stack>

                    <Chip
                      label={conc.incapacidad_tipo}
                      size="small"
                      color={conc.incapacidad_tipo === 'ARL' ? 'error' : 'primary'}
                      sx={{ width: 'fit-content' }}
                    />

                    <Stack direction="row" spacing={2}>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          Días
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {conc.dias_incapacidad}
                        </Typography>
                      </Box>
                      <Box flex={1}>
                        <Typography variant="caption" color="text.secondary">
                          IBC
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(conc.ibc)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box sx={{ bgcolor: 'success.light', p: 1.5, borderRadius: 1 }}>
                      <Typography variant="caption" color="success.dark">
                        Total a Pagar
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="success.dark">
                        {formatCurrency(conc.total_a_pagar)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Dialog de detalles - Mejorado */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              Detalle de Conciliación #{selectedConciliacion?.id}
            </Typography>
            <Chip 
              label={selectedConciliacion?.incapacidad_tipo} 
              color={selectedConciliacion?.incapacidad_tipo === 'ARL' ? 'error' : 'primary'}
              size="small"
            />
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedConciliacion && (
            <Box sx={{ pt: 2 }}>
              {/* Información del Colaborador */}
              <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    INFORMACIÓN DEL COLABORADOR
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedConciliacion.colaborador_nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fecha: {new Date(selectedConciliacion.created_at).toLocaleDateString('es-CO', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </CardContent>
              </Card>

              {/* Datos Base */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  DATOS BASE DE CÁLCULO
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Salario Base</Typography>
                      <Typography variant="h6" color="primary">{formatCurrency(selectedConciliacion.salario_base)}</Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">IBC</Typography>
                      <Typography variant="h6" color="primary">{formatCurrency(selectedConciliacion.ibc)}</Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Valor Día</Typography>
                      <Typography variant="h6" color="primary">{formatCurrency(selectedConciliacion.valor_dia)}</Typography>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">Días Incapacidad</Typography>
                      <Typography variant="h6" color="primary">{selectedConciliacion.dias_incapacidad}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Desglose de Pago */}
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                DESGLOSE DE RESPONSABILIDADES
              </Typography>

              <Stack spacing={2} sx={{ my: 2 }}>
                {selectedConciliacion.dias_empresa_67 > 0 && (
                  <Card sx={{ bgcolor: 'warning.light', borderLeft: '4px solid', borderColor: 'warning.main' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight={600}>Empleador (66.67%)</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedConciliacion.dias_empresa_67} días
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} color="warning.dark">
                          {formatCurrency(selectedConciliacion.monto_empresa_67)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {selectedConciliacion.dias_eps_100 > 0 && (
                  <Card sx={{ bgcolor: 'info.light', borderLeft: '4px solid', borderColor: 'info.main' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight={600}>EPS (100%)</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedConciliacion.dias_eps_100} días
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} color="info.dark">
                          {formatCurrency(selectedConciliacion.monto_eps_100)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {selectedConciliacion.dias_arl_100 > 0 && (
                  <Card sx={{ bgcolor: 'error.light', borderLeft: '4px solid', borderColor: 'error.main' }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight={600}>ARL (100%)</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedConciliacion.dias_arl_100} días
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} color="error.dark">
                          {formatCurrency(selectedConciliacion.monto_arl_100)}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Total */}
              <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      Total a Pagar al Colaborador
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {formatCurrency(selectedConciliacion.total_a_pagar)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {selectedConciliacion.observaciones && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="info">
                    <Typography variant="caption" fontWeight={600}>Observaciones:</Typography>
                    <Typography variant="body2">{selectedConciliacion.observaciones}</Typography>
                  </Alert>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)} size="large">
            Cerrar
          </Button>
          {selectedConciliacion && selectedConciliacion.monto_empresa_67 > 0 && (
            <Button 
              variant="contained" 
              size="large"
              onClick={() => {
                navigate('/pagos', {
                  state: {
                    monto: selectedConciliacion.monto_empresa_67,
                    beneficiario: selectedConciliacion.colaborador_nombre,
                    concepto: `Pago incapacidad - ${selectedConciliacion.dias_incapacidad} días`
                  }
                });
              }}
            >
              Procesar Pago
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog para calcular conciliación */}
      <Dialog
        open={calcDialogOpen}
        onClose={() => setCalcDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Calcular Conciliación</DialogTitle>
        <DialogContent>
          {selectedIncapacidad && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Se creará la conciliación financiera para la incapacidad de{' '}
                <strong>{selectedIncapacidad.usuario_nombre}</strong>
              </Alert>
              <Typography variant="body2">
                Tipo: {selectedIncapacidad.tipo}<br />
                Días: {selectedIncapacidad.dias_totales}<br />
                IBC: {formatCurrency(selectedIncapacidad.ibc || 0)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalcDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCrearConciliacion}
            disabled={crearMutation.isPending}
          >
            {crearMutation.isPending ? 'Creando...' : 'Crear Conciliación'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
