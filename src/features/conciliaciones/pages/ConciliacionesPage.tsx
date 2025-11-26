// src/features/conciliaciones/pages/ConciliacionesPage.tsx
// Página de gestión de conciliaciones para CONTA

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import type { Conciliacion, CreateConciliacionData } from '../../../api/services/conciliacionService';
import type { Incapacidad } from '../../incapacidades/types/incapacidad.types';

export default function ConciliacionesPage() {
  const queryClient = useQueryClient();
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
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

      {/* Dialog de detalles */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalle de Conciliación #{selectedConciliacion?.id}</DialogTitle>
        <DialogContent>
          {selectedConciliacion && (
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Colaborador</Typography>
                    <Typography variant="body1">{selectedConciliacion.colaborador_nombre}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Tipo Incapacidad</Typography>
                    <Typography variant="body1">{selectedConciliacion.incapacidad_tipo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Días Incapacidad</Typography>
                    <Typography variant="body1">{selectedConciliacion.dias_incapacidad}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Valor Día</Typography>
                    <Typography variant="body1">{formatCurrency(selectedConciliacion.valor_dia)}</Typography>
                  </Box>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Desglose de Pago</Typography>

              {selectedConciliacion.dias_empresa_67 > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Empleador (66.67%) - {selectedConciliacion.dias_empresa_67} días
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(selectedConciliacion.monto_empresa_67)}
                  </Typography>
                </Box>
              )}

              {selectedConciliacion.dias_eps_100 > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    EPS - {selectedConciliacion.dias_eps_100} días
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(selectedConciliacion.monto_eps_100)}
                  </Typography>
                </Box>
              )}

              {selectedConciliacion.dias_arl_100 > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    ARL (100%) - {selectedConciliacion.dias_arl_100} días
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(selectedConciliacion.monto_arl_100)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 1 }}>
                <Typography variant="h6" color="success.dark">
                  Total a Pagar: {formatCurrency(selectedConciliacion.total_a_pagar)}
                </Typography>
              </Box>

              {selectedConciliacion.observaciones && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">Observaciones</Typography>
                  <Typography variant="body1">{selectedConciliacion.observaciones}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Cerrar</Button>
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
