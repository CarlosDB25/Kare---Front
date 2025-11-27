import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Paper,
  Grid,
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { incapacidadService } from '../../../api/services/incapacidadService';
import { conciliacionService } from '../../../api/services/conciliacionService';
import { usuarioService } from '../../../api/services/usuarioService';
import { useAuthStore } from '../../../store/authStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ReportesPage = () => {
  const { user } = useAuthStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoReporte, setTipoReporte] = useState(() => {
    // Tipo de reporte por defecto según el rol
    if (user?.rol === 'conta') return 'financiero';
    if (user?.rol === 'lider') return 'equipo';
    return 'general';
  });
  const [generando, setGenerando] = useState(false);

  // Cargar datos según el rol
  const { data: incapacidades = [] } = useQuery({
    queryKey: ['incapacidades'],
    queryFn: incapacidadService.getAll,
  });

  const { data: conciliaciones = [] } = useQuery({
    queryKey: ['conciliaciones'],
    queryFn: conciliacionService.getAll,
    enabled: user?.rol === 'conta',
  });

  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuarioService.getAll,
  });

  // Obtener nombre de la empresa del localStorage o usar default
  const nombreEmpresa = localStorage.getItem('nombreEmpresa') || 'KARE - Sistema de Gestión';

  // Filtrar datos por fecha y área (para líderes)
  const datosFiltrados = incapacidades.filter(incap => {
    const fechaIncap = new Date(incap.fecha_inicio);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    let cumpleFecha = true;
    if (inicio && fechaIncap < inicio) cumpleFecha = false;
    if (fin && fechaIncap > fin) cumpleFecha = false;

    // Filtrar por área para líderes (siempre, no solo cuando tipoReporte === 'equipo')
    if (user?.rol === 'lider' && user?.area && usuarios.length > 0) {
      const colaborador = usuarios.find(u => u.id === incap.usuario_id);
      if (!colaborador || colaborador.area !== user.area) {
        return false;
      }
    }

    return cumpleFecha;
  });

  // Calcular estadísticas
  const stats = {
    total: datosFiltrados.length,
    reportadas: datosFiltrados.filter(i => i.estado === 'reportada').length,
    en_revision: datosFiltrados.filter(i => i.estado === 'en_revision').length,
    validadas: datosFiltrados.filter(i => i.estado === 'validada').length,
    rechazadas: datosFiltrados.filter(i => i.estado === 'rechazada').length,
    pagadas: datosFiltrados.filter(i => i.estado === 'pagada').length,
    eps: datosFiltrados.filter(i => i.tipo === 'EPS').length,
    arl: datosFiltrados.filter(i => i.tipo === 'ARL').length,
  };

  const pieData = [
    { name: 'Reportadas', value: stats.reportadas, color: '#2196f3' },
    { name: 'En Revisión', value: stats.en_revision, color: '#ff9800' },
    { name: 'Validadas', value: stats.validadas, color: '#4caf50' },
    { name: 'Rechazadas', value: stats.rechazadas, color: '#f44336' },
    { name: 'Pagadas', value: stats.pagadas, color: '#9c27b0' },
  ].filter(d => d.value > 0);

  const tipoData = [
    { tipo: 'EPS', cantidad: stats.eps, color: '#2196f3' },
    { tipo: 'ARL', cantidad: stats.arl, color: '#f44336' },
  ].filter(d => d.cantidad > 0);

  // Estadísticas de conciliaciones (CONTA)
  const statsConta = user?.rol === 'conta' ? {
    totalConciliado: conciliaciones.reduce((sum, c) => sum + c.total_a_pagar, 0),
    totalEmpresa: conciliaciones.reduce((sum, c) => sum + c.monto_empresa_67, 0),
    totalEPS: conciliaciones.reduce((sum, c) => sum + c.monto_eps_100, 0),
    totalARL: conciliaciones.reduce((sum, c) => sum + c.monto_arl_100, 0),
  } : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const generarPDF = async () => {
    if (!reportRef.current) return;
    
    setGenerando(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      const fecha = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
      pdf.save(`Reporte_${tipoReporte}_${fecha}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Reportes y Estadísticas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Genera reportes detallados con gráficas y estadísticas
        </Typography>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Fecha Inicio"
                  type="date"
                  fullWidth
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Fecha Fin"
                  type="date"
                  fullWidth
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  select
                  label="Tipo de Reporte"
                  fullWidth
                  value={tipoReporte}
                  onChange={(e) => setTipoReporte(e.target.value)}
                >
                  {user?.rol === 'gh' && <MenuItem value="general">General</MenuItem>}
                  {user?.rol === 'conta' && <MenuItem value="financiero">Financiero</MenuItem>}
                  {user?.rol === 'lider' && <MenuItem value="equipo">Equipo</MenuItem>}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={generando ? <CircularProgress size={20} /> : <PictureAsPdf />}
                  onClick={generarPDF}
                  disabled={generando}
                  sx={{ height: '56px' }}
                >
                  {generando ? 'Generando...' : 'Generar PDF'}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Reporte para imprimir */}
      <Paper ref={reportRef} sx={{ p: 4, bgcolor: 'white', color: '#000' }}>
        {/* Encabezado */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#1976d2' }} gutterBottom>
            {nombreEmpresa}
          </Typography>
          <Typography variant="h5" fontWeight={600} sx={{ color: '#000' }} gutterBottom>
            Reporte de {tipoReporte === 'general' ? 'Incapacidades' : tipoReporte === 'financiero' ? 'Análisis Financiero' : `Equipo - Área ${user?.area || ''}`}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Generado el {new Date().toLocaleDateString('es-CO', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
          {user?.rol === 'lider' && user?.area && (
            <Typography variant="body2" sx={{ color: '#666' }}>
              Área: {user.area}
            </Typography>
          )}
          {fechaInicio && fechaFin && (
            <Typography variant="body2" sx={{ color: '#666' }}>
              Período: {new Date(fechaInicio).toLocaleDateString()} - {new Date(fechaFin).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Reporte General (GH) o Equipo (Lider) */}
        {(tipoReporte === 'general' || tipoReporte === 'equipo') && (
          <>
            {/* Estadísticas Generales */}
            <Typography variant="h6" fontWeight={600} sx={{ color: '#000' }} gutterBottom>
              Resumen Ejecutivo
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#1976d2' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>Total Incapacidades</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#4caf50' }}>
                    {stats.validadas}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>Validadas</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#ff9800' }}>
                    {stats.en_revision}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>En Revisión</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#f44336' }}>
                    {stats.rechazadas}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>Rechazadas</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Gráficas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#000' }} gutterBottom>
                  Distribución por Estado
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={(entry) => entry.name}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', color: '#000' }} />
                    <Legend wrapperStyle={{ color: '#000' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#000' }} gutterBottom>
                  Incapacidades por Tipo
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tipoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" tick={{ fill: '#000' }} />
                    <YAxis tick={{ fill: '#000' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', color: '#000' }} />
                    <Bar dataKey="cantidad">
                      {tipoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </>
        )}

        {/* Reporte Financiero (CONTA) */}
        {tipoReporte === 'financiero' && user?.rol === 'conta' && statsConta && (
          <>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#000' }} gutterBottom>
              Análisis Financiero
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#1976d2' }}>
                    {formatCurrency(statsConta.totalConciliado)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>Total Conciliado</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#ff9800' }}>
                    {formatCurrency(statsConta.totalEmpresa)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>Pagado Empresa</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#0288d1' }}>
                    {formatCurrency(statsConta.totalEPS)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>Pagado EPS</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#f44336' }}>
                    {formatCurrency(statsConta.totalARL)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#000' }}>Pagado ARL</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Gráficas Financieras */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#000' }} gutterBottom>
                  Distribución de Pagos
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Empresa (67%)', value: statsConta.totalEmpresa, color: '#ff9800' },
                        { name: 'EPS (100%)', value: statsConta.totalEPS, color: '#0288d1' },
                        { name: 'ARL (100%)', value: statsConta.totalARL, color: '#f44336' },
                      ].filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={(entry) => entry.name}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {[
                        { name: 'Empresa (67%)', value: statsConta.totalEmpresa, color: '#ff9800' },
                        { name: 'EPS (100%)', value: statsConta.totalEPS, color: '#0288d1' },
                        { name: 'ARL (100%)', value: statsConta.totalARL, color: '#f44336' },
                      ].filter(d => d.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', color: '#000' }} />
                    <Legend wrapperStyle={{ color: '#000' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#000' }} gutterBottom>
                  Montos por Categoría
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { categoria: 'Empresa', monto: statsConta.totalEmpresa, color: '#ff9800' },
                    { categoria: 'EPS', monto: statsConta.totalEPS, color: '#0288d1' },
                    { categoria: 'ARL', monto: statsConta.totalARL, color: '#f44336' },
                  ].filter(d => d.monto > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" tick={{ fill: '#000' }} />
                    <YAxis tick={{ fill: '#000' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', color: '#000' }} />
                    <Bar dataKey="monto">
                      {[
                        { categoria: 'Empresa', monto: statsConta.totalEmpresa, color: '#ff9800' },
                        { categoria: 'EPS', monto: statsConta.totalEPS, color: '#0288d1' },
                        { categoria: 'ARL', monto: statsConta.totalARL, color: '#f44336' },
                      ].filter(d => d.monto > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>

            <Typography variant="body2" sx={{ color: '#666', mt: 2 }}>
              Total de conciliaciones procesadas: {conciliaciones.length}
            </Typography>
          </>
        )}

        {/* Pie de página */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            Este reporte fue generado automáticamente por {nombreEmpresa}
          </Typography>
          <br />
          <Typography variant="caption" sx={{ color: '#666' }}>
            Usuario: {user?.nombre} ({user?.rol?.toUpperCase()})
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
