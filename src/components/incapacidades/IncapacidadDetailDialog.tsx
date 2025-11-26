import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Chip,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CalendarToday,
  Description,
  Person,
  BusinessCenter,
  Psychology,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { Incapacidad } from '../../features/incapacidades/types/incapacidad.types';
import { incapacidadService } from '../../api/services/incapacidadService';

interface Props {
  incapacidad: Incapacidad;
  open: boolean;
  onClose: () => void;
}

const estadoColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  reportada: 'info',
  en_revision: 'warning',
  validada: 'success',
  rechazada: 'error',
  conciliada: 'info',
  pagada: 'success',
  archivada: 'default',
};

// Componente fuera del render
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <Box>
    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
      <Box sx={{ color: 'secondary.main' }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
    <Typography variant="body1" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);

export const IncapacidadDetailDialog = ({ incapacidad, open, onClose }: Props) => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [ocrError, setOcrError] = useState('');
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDays = () => {
    const start = new Date(incapacidad.fecha_inicio);
    const end = new Date(incapacidad.fecha_fin);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAnalyzeOCR = async () => {
    if (!incapacidad.id) return;
    
    setOcrLoading(true);
    setOcrError('');
    setOcrResult(null);

    try {
      const result = await incapacidadService.analyzeDocument(incapacidad.id);
      setOcrResult(result);
    } catch (error: any) {
      setOcrError(error.response?.data?.message || 'Error al analizar documento');
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Detalle de Incapacidad #{incapacidad.id}
          </Typography>
          <Chip
            label={incapacidad.estado.replace('_', ' ')}
            color={estadoColors[incapacidad.estado]}
            sx={{
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {/* Información del colaborador */}
          <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={700}>
              COLABORADOR
            </Typography>
            <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
              <InfoItem
                icon={<Person fontSize="small" />}
                label="Nombre"
                value={incapacidad.usuario_nombre || 'N/A'}
              />
              <InfoItem
                icon={<BusinessCenter fontSize="small" />}
                label="Documento"
                value={incapacidad.usuario_documento || 'N/A'}
              />
              <InfoItem
                icon={<BusinessCenter fontSize="small" />}
                label="Email"
                value={incapacidad.usuario_email || 'N/A'}
              />
            </Box>
          </Paper>

          {/* Información de la incapacidad */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={700}>
              DETALLES DE LA INCAPACIDAD
            </Typography>
            <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <InfoItem
                icon={<Description fontSize="small" />}
                label="Tipo"
                value={incapacidad.tipo}
              />
              <InfoItem
                icon={<CalendarToday fontSize="small" />}
                label="Duración"
                value={`${calculateDays()} días`}
              />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
                  Fecha Inicio
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(incapacidad.fecha_inicio)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
                  Fecha Fin
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(incapacidad.fecha_fin)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Diagnóstico */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={700}>
              DIAGNÓSTICO
            </Typography>
            <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mt: 1 }}>
              <Typography variant="body2">
                {incapacidad.diagnostico}
              </Typography>
            </Paper>
          </Box>

          {/* IBC y Observaciones */}
          {(incapacidad.ibc || incapacidad.observaciones) && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              {incapacidad.ibc && (
                <InfoItem
                  icon={<BusinessCenter fontSize="small" />}
                  label="IBC"
                  value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(incapacidad.ibc)}
                />
              )}
              {incapacidad.observaciones && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block">
                    Observaciones
                  </Typography>
                  <Typography variant="body2">
                    {incapacidad.observaciones}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Documento */}
          {incapacidad.documento_url && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={700}>
                DOCUMENTO ADJUNTO
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'secondary.light',
                  p: 2,
                  borderRadius: 2,
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Description sx={{ color: 'secondary.main' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {incapacidad.documento_url}
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={async () => {
                    try {
                      await incapacidadService.downloadDocument(incapacidad.id);
                    } catch (error) {
                      console.error('Error abriendo documento:', error);
                    }
                  }}
                >
                  Ver Documento
                </Button>
              </Paper>
              
              {/* Botón OCR para GH */}
              {user?.rol === 'gh' && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={ocrLoading ? <CircularProgress size={20} /> : <Psychology />}
                    onClick={handleAnalyzeOCR}
                    disabled={ocrLoading}
                    fullWidth
                  >
                    {ocrLoading ? 'Analizando documento...' : 'Analizar con OCR'}
                  </Button>
                </Box>
              )}
              
              {/* Resultados OCR */}
              {ocrError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {ocrError}
                </Alert>
              )}
              
              {ocrResult && (
                <Paper elevation={0} sx={{ bgcolor: 'info.lighter', p: 2, borderRadius: 2, mt: 2 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                        RESULTADO ANÁLISIS OCR
                      </Typography>
                    </Box>
                    
                    {ocrResult.sugerencia_para_gh && (
                      <Alert 
                        severity={
                          ocrResult.sugerencia_para_gh.accion === 'APROBAR' ? 'success' :
                          ocrResult.sugerencia_para_gh.accion === 'RECHAZAR' ? 'error' : 'warning'
                        }
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {ocrResult.sugerencia_para_gh.accion}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {ocrResult.sugerencia_para_gh.justificacion}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                          Confianza: {ocrResult.sugerencia_para_gh.confianza_sugerencia}%
                        </Typography>
                      </Alert>
                    )}
                    
                    {ocrResult.campos_extraidos && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Campos detectados:
                        </Typography>
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          {ocrResult.campos_extraidos.tipo_detectado && (
                            <Typography variant="body2">
                              <strong>Tipo:</strong> {ocrResult.campos_extraidos.tipo_detectado}
                            </Typography>
                          )}
                          {ocrResult.campos_extraidos.nombre && (
                            <Typography variant="body2">
                              <strong>Nombre:</strong> {ocrResult.campos_extraidos.nombre}
                            </Typography>
                          )}
                          {ocrResult.campos_extraidos.documento && (
                            <Typography variant="body2">
                              <strong>Documento:</strong> {ocrResult.campos_extraidos.documento}
                            </Typography>
                          )}
                          {ocrResult.campos_extraidos.fecha_inicio && (
                            <Typography variant="body2">
                              <strong>Fecha inicio:</strong> {ocrResult.campos_extraidos.fecha_inicio}
                            </Typography>
                          )}
                          {ocrResult.campos_extraidos.fecha_fin && (
                            <Typography variant="body2">
                              <strong>Fecha fin:</strong> {ocrResult.campos_extraidos.fecha_fin}
                            </Typography>
                          )}
                          {ocrResult.campos_extraidos.diagnostico && (
                            <Typography variant="body2">
                              <strong>Diagnóstico:</strong> {ocrResult.campos_extraidos.diagnostico}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    )}
                    
                    {ocrResult.analisis_validacion?.advertencias && ocrResult.analisis_validacion.advertencias.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Advertencias:
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                          {ocrResult.analisis_validacion.advertencias.map((adv: any, idx: number) => (
                            <Typography key={idx} variant="caption" color="warning.main">
                              • {adv.mensaje}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}
            </Box>
          )}

          {/* Fechas de registro */}
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Creada el
                </Typography>
                <Typography variant="body2">
                  {formatDate(incapacidad.created_at)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Última actualización
                </Typography>
                <Typography variant="body2">
                  {incapacidad.updated_at ? formatDate(incapacidad.updated_at) : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
