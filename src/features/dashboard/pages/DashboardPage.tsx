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
import { conciliacionService } from '../../../api/services/conciliacionService';
import { usuarioService } from '../../../api/services/usuarioService';
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

  // Cargar usuarios para líderes (para filtrar por área)
  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuarioService.getAll(),
    enabled: !!user?.id && user?.rol === 'lider',
  });

  // Cargar conciliaciones para CONTA
  const { data: conciliaciones = [] } = useQuery({
    queryKey: ['conciliaciones'],
    queryFn: () => conciliacionService.getAll(),
    enabled: !!user?.id && user?.rol === 'conta',
  });

  // Cargar estadísticas de conciliaciones para CONTA
  const { data: statsConciliacion } = useQuery({
    queryKey: ['conciliaciones', 'estadisticas'],
    queryFn: () => conciliacionService.getEstadisticas(),
    enabled: !!user?.id && user?.rol === 'conta',
  });

  // Calcular estadísticas con useMemo para optimizar rendimiento
  const stats = useMemo(() => {
    let incapsFiltradas = incapacidades;
    
    // Si es líder, filtrar por área
    if (user?.rol === 'lider' && user?.area) {
      incapsFiltradas = incapacidades.filter(incap => {
        const colaborador = usuarios.find(u => u.id === incap.usuario_id);
        return colaborador && colaborador.area === user.area;
      });
    }

    return {
      total: incapsFiltradas.length,
      reportadas: incapsFiltradas.filter(i => i.estado === 'reportada').length,
      en_revision: incapsFiltradas.filter(i => i.estado === 'en_revision').length,
      validadas: incapsFiltradas.filter(i => i.estado === 'validada').length,
      rechazadas: incapsFiltradas.filter(i => i.estado === 'rechazada').length,
      pagadas: incapsFiltradas.filter(i => i.estado === 'pagada').length,
      conciliadas: incapsFiltradas.filter(i => i.estado === 'conciliada').length,
      archivadas: incapsFiltradas.filter(i => i.estado === 'archivada').length,
      valor_total: incapsFiltradas.filter(i => i.estado !== 'archivada').reduce((sum, i) => sum + (i.ibc || 0), 0),
    };
  }, [incapacidades, user, usuarios]);

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
  const tipoData = useMemo(() => {
    let incapsFiltradas = incapacidades;
    
    // Si es líder, filtrar por área
    if (user?.rol === 'lider' && user?.area) {
      incapsFiltradas = incapacidades.filter(incap => {
        const colaborador = usuarios.find(u => u.id === incap.usuario_id);
        return colaborador && colaborador.area === user.area;
      });
    }

    return [
      { tipo: 'EPS', cantidad: incapsFiltradas.filter(i => i.tipo === 'EPS').length, color: '#2196f3' },
      { tipo: 'ARL', cantidad: incapsFiltradas.filter(i => i.tipo === 'ARL').length, color: '#f44336' },
      { tipo: 'Maternidad', cantidad: incapsFiltradas.filter(i => i.tipo === 'Licencia_Maternidad').length, color: '#e91e63' },
      { tipo: 'Paternidad', cantidad: incapsFiltradas.filter(i => i.tipo === 'Licencia_Paternidad').length, color: '#00bcd4' },
    ].filter(d => d.cantidad > 0);
  }, [incapacidades, user, usuarios]);

  // Datos para gráficas de Líder - Reemplazos por colaborador
  const reemplazosData = useMemo(() => {
    console.log('📊 DASHBOARD - Calculando reemplazos data:', {
      rol: user?.rol,
      area: user?.area,
      totalReemplazos: todosReemplazos.length,
      totalUsuarios: usuarios.length,
      totalIncapacidades: incapacidades.length
    });
    
    if (user?.rol !== 'lider' || todosReemplazos.length === 0) return [];
    
    // Si no hay usuarios o incapacidades, mostrar todos los reemplazos sin filtrar
    // (cuando carguen, se actualizará automáticamente)
    let reemplazosParaMostrar = todosReemplazos;
    
    // Solo filtrar si tenemos todos los datos necesarios
    if (usuarios.length > 0 && incapacidades.length > 0 && user.area) {
      reemplazosParaMostrar = todosReemplazos.filter(reemplazo => {
        const incapacidad = incapacidades.find(i => i.id === reemplazo.incapacidad_id);
        if (!incapacidad) {
          console.log('⚠️ No se encontró incapacidad para reemplazo:', reemplazo.id);
          // Si no encontramos la incapacidad, incluir el reemplazo de todas formas
          return true;
        }
        const colaborador = usuarios.find(u => u.id === incapacidad.usuario_id);
        const coincide = colaborador && colaborador.area === user.area;
        console.log('🔍 Verificando reemplazo:', {
          reemplazoId: reemplazo.id,
          incapacidadId: incapacidad.id,
          colaborador: colaborador?.nombre,
          areaColaborador: colaborador?.area,
          areaLider: user.area,
          coincide
        });
        return coincide;
      });
    }
    
    console.log('✅ Reemplazos filtrados:', reemplazosParaMostrar.length);
    
    const colaboradoresConReemplazo = reemplazosParaMostrar.reduce((acc: any, reemplazo) => {
      const nombre = reemplazo.nombre_ausente;
      if (!acc[nombre]) {
        acc[nombre] = { nombre, activos: 0, finalizados: 0 };
      }
      if (reemplazo.estado === 'activo') acc[nombre].activos++;
      if (reemplazo.estado === 'finalizado') acc[nombre].finalizados++;
      return acc;
    }, {});
    
    return Object.values(colaboradoresConReemplazo).slice(0, 5); // Top 5
  }, [todosReemplazos, user, usuarios, incapacidades]);

  // Datos para gráficas de CONTA - Distribución de costos
  const costosData = useMemo(() => {
    if (user?.rol !== 'conta' || conciliaciones.length === 0) return [];
    
    const totalEmpresa = conciliaciones.reduce((sum, c) => sum + c.monto_empresa_67, 0);
    const totalEPS = conciliaciones.reduce((sum, c) => sum + c.monto_eps_100, 0);
    const totalARL = conciliaciones.reduce((sum, c) => sum + c.monto_arl_100, 0);
    
    return [
      { name: 'Empresa (66.67%)', value: totalEmpresa, color: '#ff9800' },
      { name: 'EPS', value: totalEPS, color: '#2196f3' },
      { name: 'ARL', value: totalARL, color: '#f44336' },
    ].filter(d => d.value > 0);
  }, [conciliaciones, user]);

  // Datos para gráfica de barras de CONTA - Conciliaciones por mes
  const conciliacionesPorMesData = useMemo(() => {
    if (user?.rol !== 'conta' || conciliaciones.length === 0) return [];
    
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const porMes = new Array(12).fill(0).map((_, i) => ({ mes: meses[i], total: 0 }));
    
    conciliaciones.forEach(c => {
      const mes = new Date(c.created_at).getMonth();
      porMes[mes].total += c.total_a_pagar;
    });
    
    return porMes.filter(m => m.total > 0);
  }, [conciliaciones, user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

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

      {/* Gráficas - Para GH/CONTA/Líder */}
      {stats.total > 0 && (isAdmin || isLider) && (
        <Fade in timeout={800}>
          <Box 
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 3,
            }}
          >
            {/* GRÁFICAS PARA GH */}
            {user?.rol === 'gh' && (
              <>
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
              </>
            )}

            {/* GRÁFICAS PARA LÍDER */}
            {user?.rol === 'lider' && (
              <>
                {/* Gráfica de Pastel - Estados de su área */}
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <BarChart color="secondary" />
                      <Typography variant="h6" fontWeight={600}>
                        Estados - {user.area}
                      </Typography>
                    </Stack>
                    {pieData.length > 0 ? (
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
                    ) : (
                      <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">No hay datos</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Gráfica de Reemplazos */}
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <SwapHoriz color="secondary" />
                      <Typography variant="h6" fontWeight={600}>
                        Reemplazos por Colaborador
                      </Typography>
                    </Stack>
                    {reemplazosData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <RechartsBarChart data={reemplazosData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nombre" angle={-15} textAnchor="end" height={80} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="activos" fill="#4caf50" name="Activos" />
                          <Bar dataKey="finalizados" fill="#9e9e9e" name="Finalizados" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">No hay reemplazos registrados</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* GRÁFICAS PARA CONTA */}
            {user?.rol === 'conta' && (
              <>
                {/* Gráfica de Pastel - Distribución de Costos */}
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <TrendingUp color="secondary" />
                      <Typography variant="h6" fontWeight={600}>
                        Distribución de Costos
                      </Typography>
                    </Stack>
                    {costosData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={costosData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                            outerRadius={75}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={800}
                          >
                            {costosData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">No hay conciliaciones</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Gráfica de Barras - Conciliaciones por Mes */}
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <Assessment color="secondary" />
                      <Typography variant="h6" fontWeight={600}>
                        Pagos por Mes
                      </Typography>
                    </Stack>
                    {conciliacionesPorMesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <RechartsBarChart data={conciliacionesPorMesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Bar dataKey="total" fill="#9c27b0" animationBegin={0} animationDuration={800} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">No hay datos de conciliaciones</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
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
        {/* Cards para CONTA - Estadísticas Contables */}
        {user?.rol === 'conta' && statsConciliacion && (
          <>
            <StatsCard
              title="Total Conciliado"
              value={formatCurrency(statsConciliacion.valor_total_conciliado || 0)}
              icon={<TrendingUp sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#9c27b0"
            />

            <StatsCard
              title="Pagado por Empresa"
              value={formatCurrency(statsConciliacion.total_pagado_empresa || 0)}
              icon={<Assessment sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#ff9800"
            />

            <StatsCard
              title="Pagado por EPS"
              value={formatCurrency(statsConciliacion.total_pagado_eps || 0)}
              icon={<CheckCircle sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#2196f3"
            />

            <StatsCard
              title="Promedio por Conciliación"
              value={formatCurrency(statsConciliacion.valor_promedio || 0)}
              icon={<BarChart sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#4caf50"
            />

            <StatsCard
              title="Total Conciliaciones"
              value={statsConciliacion.total_conciliaciones || 0}
              icon={<Description sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#00bcd4"
            />

            <StatsCard
              title="Promedio Días"
              value={`${Math.round(statsConciliacion.promedio_dias || 0)} días`}
              icon={<HourglassEmpty sx={{ fontSize: 28, color: '#fff' }} />}
              bgColor="#673ab7"
            />
          </>
        )}

        {/* Cards para otros roles */}
        {user?.rol !== 'conta' && (
          <>
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

            {/* Cards solo para GH/Lider */}
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
            {isLider && (() => {
              const reemplazosActivos = todosReemplazos.filter(r => {
                if (r.estado !== 'activo') return false;
                
                console.log('🔢 CARD - Verificando reemplazo activo:', {
                  reemplazoId: r.id,
                  estado: r.estado,
                  incapacidadId: r.incapacidad_id,
                  hayIncapacidades: incapacidades.length > 0,
                  hayUsuarios: usuarios.length > 0
                });
                
                // Si no hay datos suficientes, contar todos los activos
                if (incapacidades.length === 0 || usuarios.length === 0) {
                  console.log('⚠️ CARD - Sin datos suficientes, incluyendo reemplazo');
                  return true;
                }
                
                // Filtrar solo reemplazos donde el colaborador reemplazado es del área del líder
                const incapacidad = incapacidades.find(i => i.id === r.incapacidad_id);
                if (!incapacidad) {
                  console.log('⚠️ CARD - No se encontró incapacidad, incluyendo reemplazo');
                  return true; // Incluir si no encontramos la incapacidad
                }
                
                const colaborador = usuarios.find(u => u.id === incapacidad.usuario_id);
                const coincide = !colaborador || colaborador.area === user.area;
                console.log('🔍 CARD - Resultado:', {
                  colaborador: colaborador?.nombre,
                  areaColaborador: colaborador?.area,
                  areaLider: user.area,
                  coincide
                });
                return coincide;
              });
              
              console.log('✅ CARD - Total reemplazos activos del área:', reemplazosActivos.length);
              
              return (
                <StatsCard
                  title="Reemplazos Asignados"
                  value={reemplazosActivos.length}
                  icon={<PersonAdd sx={{ fontSize: 28, color: '#fff' }} />}
                  bgColor="#673ab7"
                />
              );
            })()}
          </>
        )}
      </Box>
    </Box>
  );
};
