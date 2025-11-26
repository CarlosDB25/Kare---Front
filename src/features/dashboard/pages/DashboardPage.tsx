import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Fade,
  Grow,
} from '@mui/material';
import {
  Assessment,
  Description,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  BarChart,
  TrendingUp,
  SwapHoriz,
  PersonAdd,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { incapacidadService } from '../../../api/services/incapacidadService';
import { reemplazoService } from '../../../api/services/reemplazoService';
import { useAuthStore } from '../../../store/authStore';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}

const StatsCard = ({ title, value, icon, bgColor }: StatsCardProps) => (
  <Grow in timeout={800}>
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(10deg) scale(1.1)',
              }
            }}
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  </Grow>
);

export const DashboardPage = () => {
  const { user } = useAuthStore();

  // Cargar incapacidades y calcular estadísticas del lado del cliente
  const { data: incapacidades = [], isLoading } = useQuery({
    queryKey: ['incapacidades', user?.id],
    queryFn: () => incapacidadService.getAll(),
    enabled: !!user?.id,
  });

  // Cargar reemplazos para colaboradores y líderes
  const { data: misReemplazos = [] } = useQuery({
    queryKey: ['reemplazos', 'mis-reemplazos', user?.id],
    queryFn: () => reemplazoService.getMisReemplazos(),
    enabled: !!user?.id && (user?.rol === 'colaborador' || user?.rol === 'lider'),
  });

  // Cargar todos los reemplazos para líderes
  const { data: todosReemplazos = [] } = useQuery({
    queryKey: ['reemplazos', user?.id],
    queryFn: () => reemplazoService.getAll(),
    enabled: !!user?.id && user?.rol === 'lider',
  });

  // Calcular estadísticas con useMemo para optimizar rendimiento
  const stats = useMemo(() => ({
    total: incapacidades.length,
    reportadas: incapacidades.filter(i => i.estado === 'reportada').length,
    en_revision: incapacidades.filter(i => i.estado === 'en_revision').length,
    validadas: incapacidades.filter(i => i.estado === 'validada').length,
    rechazadas: incapacidades.filter(i => i.estado === 'rechazada').length,
    pagadas: incapacidades.filter(i => i.estado === 'pagada').length,
    conciliadas: incapacidades.filter(i => i.estado === 'conciliada').length,
    archivadas: incapacidades.filter(i => i.estado === 'archivada').length,
    // Excluir archivadas del cálculo de IBC (ya están finalizadas)
    valor_total: incapacidades.filter(i => i.estado !== 'archivada').reduce((sum, i) => sum + (i.ibc || 0), 0),
  }), [incapacidades]);

  // Datos para gráfica de pastel (estados) - memoizados con colores unificados
  const pieData = useMemo(() => [
    { name: 'Reportadas', value: stats.reportadas, color: '#2196f3' }, // Azul (info)
    { name: 'En Revisión', value: stats.en_revision, color: '#ff9800' }, // Naranja (warning)
    { name: 'Validadas', value: stats.validadas, color: '#4caf50' }, // Verde (success)
    { name: 'Rechazadas', value: stats.rechazadas, color: '#f44336' }, // Rojo (error)
    { name: 'Pagadas', value: stats.pagadas, color: '#9c27b0' }, // Morado (secondary)
    { name: 'Conciliadas', value: stats.conciliadas, color: '#00bcd4' }, // Cyan (info)
  ].filter(d => d.value > 0), [stats]);

  // Datos para gráfica de barras (tipos de incapacidad) - memoizados con colores
  const tipoData = useMemo(() => [
    { tipo: 'EPS', cantidad: incapacidades.filter(i => i.tipo === 'EPS').length, color: '#2196f3' },
    { tipo: 'ARL', cantidad: incapacidades.filter(i => i.tipo === 'ARL').length, color: '#f44336' },
    { tipo: 'Maternidad', cantidad: incapacidades.filter(i => i.tipo === 'Licencia_Maternidad').length, color: '#e91e63' },
    { tipo: 'Paternidad', cantidad: incapacidades.filter(i => i.tipo === 'Licencia_Paternidad').length, color: '#00bcd4' },
  ].filter(d => d.cantidad > 0), [incapacidades]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = ['gh', 'conta'].includes(user?.rol || '');
  const isLider = user?.rol === 'lider';
  const isColaborador = user?.rol === 'colaborador';

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Bienvenido, {user?.nombre}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isColaborador ? 'Resumen de tus incapacidades' : 
           isLider ? 'Resumen de incapacidades de tu equipo' : 
           'Resumen global de incapacidades'}
        </Typography>
      </Box>

      {/* Gráficas - Solo para GH/CONTA */}
      {stats.total > 0 && isAdmin && (
        <Fade in timeout={800}>
          <Box 
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 3,
            }}
          >
            {/* Gráfica de Pastel - Estados */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <BarChart color="secondary" />
                  <Typography variant="h6" fontWeight={600}>
                    Distribución por Estado
                  </Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={75}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfica de Barras - Tipos */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Assessment color="secondary" />
                  <Typography variant="h6" fontWeight={600}>
                    Incapacidades por Tipo
                  </Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsBarChart data={tipoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="cantidad" animationBegin={0} animationDuration={800}>
                      {tipoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      )}

      {/* Cards de estadísticas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {/* Card Total - Para todos - Morado */}
        <StatsCard
          title="Total Incapacidades"
          value={stats.total}
          icon={<Description sx={{ fontSize: 28, color: '#fff' }} />}
          bgColor="#9c27b0"
        />

        {/* Card Reportadas - Para todos - Azul */}
        <StatsCard
          title="Reportadas"
          value={stats.reportadas}
          icon={<Assessment sx={{ fontSize: 28, color: '#fff' }} />}
          bgColor="#2196f3"
        />

        {/* Card En Revisión - Para todos - Naranja */}
        <StatsCard
          title="En Revisión"
          value={stats.en_revision}
          icon={<HourglassEmpty sx={{ fontSize: 28, color: '#fff' }} />}
          bgColor="#ff9800"
        />

        {/* Card Rechazadas - Para todos - Rojo */}
        <StatsCard
          title="Rechazadas"
          value={stats.rechazadas}
          icon={<Cancel sx={{ fontSize: 28, color: '#fff' }} />}
          bgColor="#f44336"
        />

        {/* Card Reemplazo Activo - Solo para Colaboradores */}
        {isColaborador && (
          <StatsCard
            title="Reemplazo Activo"
            value={misReemplazos.filter(r => r.estado === 'activo').length > 0 ? 'Sí' : 'No'}
            icon={<SwapHoriz sx={{ fontSize: 28, color: '#fff' }} />}
            bgColor={misReemplazos.filter(r => r.estado === 'activo').length > 0 ? '#00bcd4' : '#9e9e9e'}
          />
        )}

        {/* Cards solo para GH/CONTA/Lider */}
        {(isAdmin || isLider) && (
          <>
            <StatsCard
              title="Validadas"
              value={stats.validadas}
              icon={<CheckCircle sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#4caf50"
            />

            <StatsCard
              title="Pagadas"
              value={stats.pagadas}
              icon={<TrendingUp sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#9c27b0"
            />

            <StatsCard
              title="Conciliadas"
              value={stats.conciliadas}
              icon={<CheckCircle sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#00bcd4"
            />

            <StatsCard
              title="Archivadas"
              value={stats.archivadas}
              icon={<Description sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#757575"
            />
          </>
        )}

        {/* Card Reemplazos Asignados - Solo para Líderes */}
        {isLider && (
          <StatsCard
            title="Reemplazos Asignados"
            value={todosReemplazos.filter(r => r.estado === 'activo').length}
            icon={<PersonAdd sx={{ fontSize: 28, color: '#fff' }} />}
            bgColor="#673ab7"
          />
        )}
      </Box>
    </Box>
  );
};
