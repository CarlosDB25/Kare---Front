import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Description,
  Notifications,
  People,
  Logout,
  Brightness4,
  Brightness7,
  SwapHoriz,
  AccountBalance,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { notificacionService } from '../../api/services/notificacionService';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Incapacidades', icon: <Description />, path: '/incapacidades' },
  { text: 'Notificaciones', icon: <Notifications />, path: '/notificaciones' },
];

export const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();

  // Obtener contador de notificaciones no leídas
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notificaciones', 'unread-count', user?.id],
    queryFn: () => notificacionService.getUnreadCount(),
    refetchInterval: 10000, // Refrescar cada 10 segundos (antes 30s)
    refetchOnWindowFocus: true, // Actualizar cuando vuelve al tab
    enabled: !!user?.id,
  });

  console.log('🔔 AppLayout - Contador de notificaciones:', unreadCount);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} letterSpacing="-0.02em">
          KARE
        </Typography>
      </Toolbar>
      <List sx={{ flex: 1, px: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isNotifications = item.path === '/notificaciones';
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  py: 1.2,
                  bgcolor: isActive ? 'secondary.main' : 'transparent',
                  color: isActive ? '#fff' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'secondary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  {isNotifications && unreadCount > 0 ? (
                    <Badge badgeContent={unreadCount} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
        {user?.rol === 'gh' && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate('/usuarios')}
              sx={{
                borderRadius: 1,
                py: 1.2,
                bgcolor: location.pathname === '/usuarios' ? 'secondary.main' : 'transparent',
                color: location.pathname === '/usuarios' ? '#fff' : 'text.primary',
                '&:hover': {
                  bgcolor: location.pathname === '/usuarios' ? 'secondary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <People />
              </ListItemIcon>
              <ListItemText
                primary="Usuarios"
                primaryTypographyProps={{
                  fontWeight: location.pathname === '/usuarios' ? 600 : 400,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        {user?.rol === 'lider' && (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate('/usuarios')}
                sx={{
                  borderRadius: 1,
                  py: 1.2,
                  bgcolor: location.pathname === '/usuarios' ? 'secondary.main' : 'transparent',
                  color: location.pathname === '/usuarios' ? '#fff' : 'text.primary',
                  '&:hover': {
                    bgcolor: location.pathname === '/usuarios' ? 'secondary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  <People />
                </ListItemIcon>
                <ListItemText
                  primary="Colaboradores"
                  primaryTypographyProps={{
                    fontWeight: location.pathname === '/usuarios' ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate('/reemplazos')}
                sx={{
                  borderRadius: 1,
                  py: 1.2,
                  bgcolor: location.pathname === '/reemplazos' ? 'secondary.main' : 'transparent',
                  color: location.pathname === '/reemplazos' ? '#fff' : 'text.primary',
                  '&:hover': {
                    bgcolor: location.pathname === '/reemplazos' ? 'secondary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  <SwapHoriz />
                </ListItemIcon>
                <ListItemText
                  primary="Reemplazos"
                  primaryTypographyProps={{
                    fontWeight: location.pathname === '/reemplazos' ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {user?.rol === 'conta' && (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate('/usuarios')}
                sx={{
                  borderRadius: 1,
                  py: 1.2,
                  bgcolor: location.pathname === '/usuarios' ? 'secondary.main' : 'transparent',
                  color: location.pathname === '/usuarios' ? '#fff' : 'text.primary',
                  '&:hover': {
                    bgcolor: location.pathname === '/usuarios' ? 'secondary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  <People />
                </ListItemIcon>
                <ListItemText
                  primary="Colaboradores"
                  primaryTypographyProps={{
                    fontWeight: location.pathname === '/usuarios' ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate('/conciliaciones')}
                sx={{
                  borderRadius: 1,
                  py: 1.2,
                  bgcolor: location.pathname === '/conciliaciones' ? 'secondary.main' : 'transparent',
                  color: location.pathname === '/conciliaciones' ? '#fff' : 'text.primary',
                  '&:hover': {
                    bgcolor: location.pathname === '/conciliaciones' ? 'secondary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                  <AccountBalance />
                </ListItemIcon>
                <ListItemText
                  primary="Conciliaciones"
                  primaryTypographyProps={{
                    fontWeight: location.pathname === '/conciliaciones' ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
        
        {(user?.rol === 'gh' || user?.rol === 'lider' || user?.rol === 'conta') && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate('/reportes')}
              sx={{
                borderRadius: 1,
                py: 1.2,
                bgcolor: location.pathname === '/reportes' ? 'secondary.main' : 'transparent',
                color: location.pathname === '/reportes' ? '#fff' : 'text.primary',
                '&:hover': {
                  bgcolor: location.pathname === '/reportes' ? 'secondary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <Assessment />
              </ListItemIcon>
              <ListItemText
                primary="Reportes"
                primaryTypographyProps={{
                  fontWeight: location.pathname === '/reportes' ? 600 : 400,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        
        {user?.rol === 'gh' && (
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate('/configuracion')}
              sx={{
                borderRadius: 1,
                py: 1.2,
                bgcolor: location.pathname === '/configuracion' ? 'secondary.main' : 'transparent',
                color: location.pathname === '/configuracion' ? '#fff' : 'text.primary',
                '&:hover': {
                  bgcolor: location.pathname === '/configuracion' ? 'secondary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="Configuración"
                primaryTypographyProps={{
                  fontWeight: location.pathname === '/configuracion' ? 600 : 400,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block" fontWeight={500}>
          {user?.nombre}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {user?.rol?.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/incapacidades' && 'Incapacidades'}
            {location.pathname === '/notificaciones' && 'Notificaciones'}
            {location.pathname === '/usuarios' && (user?.rol === 'lider' || user?.rol === 'conta' ? 'Colaboradores' : 'Usuarios')}
            {location.pathname === '/reemplazos' && 'Reemplazos'}
            {location.pathname === '/conciliaciones' && 'Conciliaciones'}
            {location.pathname === '/reportes' && 'Reportes'}
            {location.pathname === '/configuracion' && 'Configuración'}
          </Typography>
          
          <Tooltip title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'claro'}`}>
            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>

          <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'secondary.main',
                width: 36,
                height: 36,
                fontSize: '0.9rem',
              }}
            >
              {user?.nombre.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 8,
              sx: { 
                mt: 1.5, 
                minWidth: 300,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            <Box sx={{ px: 3, py: 2.5, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                {user?.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {user?.email}
              </Typography>
              
              {user?.documento && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Documento: {user.documento}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                <Box
                  sx={{
                    bgcolor: user?.rol === 'gh' ? '#1976d2' : user?.rol === 'lider' ? '#f57c00' : user?.rol === 'conta' ? '#388e3c' : '#00897b',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {user?.rol}
                </Box>
                {user?.area && (
                  <Box
                    sx={{
                      bgcolor: '#f5f5f5',
                      color: '#424242',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: '1px solid',
                      borderColor: '#e0e0e0',
                    }}
                  >
                    {user.area}
                  </Box>
                )}
              </Box>

              {user?.cargo && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                  {user.cargo}
                </Typography>
              )}
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
