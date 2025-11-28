import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { AppLayout } from '../components/layout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { IncapacidadesPage } from '../features/incapacidades/pages/IncapacidadesPage';
import { NotificacionesPage } from '../features/notificaciones/pages/NotificacionesPage';
import { UsuariosPage } from '../features/usuarios/pages/UsuariosPage';
import { ReemplazosPage } from '../features/reemplazos/pages/ReemplazosPage';
import ConciliacionesPage from '../features/conciliaciones/pages/ConciliacionesPage';
import { ReportesPage } from '../features/reportes/pages/ReportesPage';
import { ConfiguracionPage } from '../features/configuracion/pages/ConfiguracionPage';
import { PagosPage } from '../features/pagos/pages/PagosPage';

const UnauthorizedPage = () => <div>No autorizado</div>;

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="incapacidades" element={<IncapacidadesPage />} />
          <Route path="notificaciones" element={<NotificacionesPage />} />
          
          <Route
            path="reemplazos"
            element={
              <ProtectedRoute allowedRoles={['lider']}>
                <ReemplazosPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="conciliaciones"
            element={
              <ProtectedRoute allowedRoles={['conta']}>
                <ConciliacionesPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="pagos"
            element={
              <ProtectedRoute allowedRoles={['conta', 'gh']}>
                <PagosPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="usuarios"
            element={
              <ProtectedRoute allowedRoles={['gh', 'lider', 'conta']}>
                <UsuariosPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="reportes"
            element={
              <ProtectedRoute allowedRoles={['gh', 'lider', 'conta']}>
                <ReportesPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="configuracion"
            element={
              <ProtectedRoute allowedRoles={['gh']}>
                <ConfiguracionPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
