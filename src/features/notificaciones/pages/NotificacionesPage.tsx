import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Chip,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Delete,
  CheckCircle,
  Info,
  Warning,
  Error as ErrorIcon,
  DoneAll,
} from '@mui/icons-material';
import { notificacionService } from '../../../api/services/notificacionService';
import { useAuthStore } from '../../../store/authStore';

const tipoIcons: Record<string, React.ReactNode> = {
  info: <Info color="info" />,
  success: <CheckCircle color="success" />,
  warning: <Warning color="warning" />,
  error: <ErrorIcon color="error" />,
};

export const NotificacionesPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: notificaciones = [], isLoading } = useQuery({
    queryKey: ['notificaciones', user?.id],
    queryFn: async () => {
      const result = await notificacionService.getAll();
      return result;
    },
    enabled: !!user?.id,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificacionService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'unread-count'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificacionService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'unread-count'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notificacionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'unread-count'] });
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = notificaciones.filter((n) => n.leida === 0).length;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Notificaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unreadCount > 0 ? `Tienes ${unreadCount} notificaciones sin leer` : 'No tienes notificaciones sin leer'}
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<DoneAll />}
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            Marcar todas como leídas
          </Button>
        )}
      </Box>

      {notificaciones.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No tienes notificaciones
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List sx={{ p: 0 }}>
            {notificaciones.map((notif, index) => (
              <Box key={notif.id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => deleteMutation.mutate(notif.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Delete />
                    </IconButton>
                  }
                  sx={{
                    bgcolor: notif.leida === 0 ? 'action.hover' : 'transparent',
                    '&:hover': {
                      bgcolor: notif.leida === 0 ? 'action.selected' : 'action.hover',
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => notif.leida === 0 && markAsReadMutation.mutate(notif.id)}
                    sx={{ flex: 1 }}
                  >
                    <Stack direction="row" spacing={2} sx={{ width: '100%' }} alignItems="flex-start">
                      <Box sx={{ mt: 0.5 }}>
                        {/* Detectar nivel de urgencia en el título */}
                        {notif.titulo.includes('ALTA') ? (
                          <ErrorIcon sx={{ color: '#f44336', fontSize: 28 }} />
                        ) : notif.titulo.includes('MODERADA') ? (
                          <Warning sx={{ color: '#ff9800', fontSize: 28 }} />
                        ) : notif.titulo.includes('LEVE') ? (
                          <Info sx={{ color: '#4caf50', fontSize: 28 }} />
                        ) : (
                          tipoIcons[notif.tipo] || <Info />
                        )}
                      </Box>
                      <Box flex={1}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                          <Typography variant="subtitle2" fontWeight={notif.leida === 0 ? 700 : 600}>
                            {notif.titulo}
                          </Typography>
                          {notif.leida === 0 && (
                            <Chip
                              label="Nueva"
                              size="small"
                              color="secondary"
                              sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {notif.mensaje}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {formatDate(notif.created_at)}
                        </Typography>
                      </Box>
                    </Stack>
                  </ListItemButton>
                </ListItem>
                {index < notificaciones.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
};
