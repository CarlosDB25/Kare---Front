import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Box,
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
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  MoreVert,
  AdminPanelSettings,
  Edit,
} from '@mui/icons-material';
import { usuarioService } from '../../../api/services/usuarioService';
import type { Usuario } from '../../../api/services/usuarioService';
import { CompletarDatosDialog } from '../../../components/usuarios/CompletarDatosDialog';
import type { User } from '../../auth/types/auth.types';
import { useAuthStore } from '../../../store/authStore';
import { formatCurrency } from '../../../utils';

const rolColors: Record<string, 'default' | 'primary' | 'secondary' | 'success'> = {
  colaborador: 'default',
  lider: 'primary',
  gh: 'secondary',
  conta: 'success',
};

const rolLabels: Record<string, string> = {
  colaborador: 'Colaborador',
  lider: 'Líder',
  gh: 'Gestión Humana',
  conta: 'Contabilidad',
};

export const UsuariosPage = () => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [datosDialogOpen, setDatosDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuarioService.getAll(),
  });

  // Determinar si el usuario tiene permisos de edición
  const canEdit = currentUser?.rol === 'gh';

  // Filtrar usuarios según el rol
  const usuariosFiltrados = currentUser?.rol === 'lider'
    ? usuarios.filter(usuario => 
        // Para líderes: solo mostrar colaboradores de su misma área
        usuario.rol === 'colaborador' && 
        usuario.area && 
        currentUser.area && 
        usuario.area === currentUser.area
      )
    : currentUser?.rol === 'conta'
    ? usuarios.filter(usuario => 
        // Para CONTA: solo mostrar colaboradores (todos)
        usuario.rol === 'colaborador'
      )
    : usuarios; // GH ve todos

  const updateRolMutation = useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: string }) => usuarioService.updateRol(id, rol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setRoleDialogOpen(false);
      setAnchorEl(null);
      setNewRole('');
      toast.success('Rol actualizado exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar el rol');
    },
  });

  const completarDatosMutation = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: any }) => 
      usuarioService.completarDatos(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setDatosDialogOpen(false);
      setAnchorEl(null);
      toast.success('Datos actualizados exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar los datos');
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: Usuario) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeRole = () => {
    setNewRole(selectedUser?.rol || '');
    setRoleDialogOpen(true);
    handleMenuClose();
  };

  const handleCompletarDatos = () => {
    setDatosDialogOpen(true);
    handleMenuClose();
  };

  const handleSubmitRoleChange = () => {
    if (selectedUser && newRole) {
      updateRolMutation.mutate({ id: selectedUser.id, rol: newRole });
    }
  };

  const handleSubmitDatos = (datos: any) => {
    if (selectedUser) {
      completarDatosMutation.mutate({ id: selectedUser.id, datos });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {currentUser?.rol === 'lider' 
            ? 'Mis Colaboradores' 
            : currentUser?.rol === 'conta'
            ? 'Colaboradores - Información Contable'
            : 'Gestión de Usuarios'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentUser?.rol === 'lider' 
            ? `Colaboradores del área de ${currentUser.area || 'tu área'}`
            : currentUser?.rol === 'conta'
            ? 'Información salarial y contable de todos los colaboradores'
            : 'Administra los usuarios y sus roles en el sistema'}
        </Typography>
      </Box>

      {/* Vista Desktop - Tabla */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Área</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Cargo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Salario</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>IBC</TableCell>
                    {canEdit && <TableCell sx={{ fontWeight: 700 }}>Rol</TableCell>}
                    {canEdit && <TableCell sx={{ fontWeight: 700 }} align="right">Acciones</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canEdit ? 8 : 6} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">
                          {currentUser?.rol === 'lider' 
                            ? 'No hay colaboradores en tu área'
                            : currentUser?.rol === 'conta'
                            ? 'No hay colaboradores registrados'
                            : 'No hay usuarios registrados'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuariosFiltrados.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {user.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.area || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.cargo || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            {user.salario ? formatCurrency(user.salario) : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {user.ibc ? formatCurrency(user.ibc) : '-'}
                          </Typography>
                        </TableCell>
                        {canEdit && (
                          <TableCell>
                            <Chip
                              label={rolLabels[user.rol]}
                              color={rolColors[user.rol]}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        )}
                        {canEdit && (
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, user)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Vista Mobile - Cards */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {usuariosFiltrados.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {currentUser?.rol === 'lider' 
                  ? 'No hay colaboradores en tu área'
                  : currentUser?.rol === 'conta'
                  ? 'No hay colaboradores registrados'
                  : 'No hay usuarios registrados'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {usuariosFiltrados.map((user) => (
              <Card key={user.id}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {user.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                      {canEdit && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreVert />
                        </IconButton>
                      )}
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {user.area && (
                        <Chip
                          label={user.area}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                      {canEdit && (
                        <Chip
                          label={rolLabels[user.rol]}
                          color={rolColors[user.rol]}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Stack>

                    {user.cargo && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Cargo
                        </Typography>
                        <Typography variant="body2">
                          {user.cargo}
                        </Typography>
                      </Box>
                    )}

                    <Stack direction="row" spacing={2}>
                      {user.salario && (
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary">
                            Salario
                          </Typography>
                          <Typography variant="body2" fontWeight={600} color="primary.main">
                            {formatCurrency(user.salario)}
                          </Typography>
                        </Box>
                      )}
                      {user.ibc && (
                        <Box flex={1}>
                          <Typography variant="caption" color="text.secondary">
                            IBC
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatCurrency(user.ibc)}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
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
        {canEdit ? (
          <>
            <MenuItem onClick={handleChangeRole}>
              <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} />
              Cambiar Rol
            </MenuItem>
            <MenuItem onClick={handleCompletarDatos}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Editar Información
            </MenuItem>
          </>
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Solo vista de consulta
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Dialog cambiar rol */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cambiar Rol de Usuario
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Cambiando rol de: <strong>{selectedUser.nombre}</strong>
              </Alert>
              <TextField
                select
                label="Nuevo Rol"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="">Seleccionar...</option>
                <option value="colaborador">Colaborador</option>
                <option value="lider">Líder</option>
                <option value="gh">Gestión Humana</option>
                <option value="conta">Contabilidad</option>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmitRoleChange}
            disabled={!newRole || updateRolMutation.isPending}
          >
            Actualizar Rol
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog completar datos */}
      {selectedUser && (
        <CompletarDatosDialog
          open={datosDialogOpen}
          onClose={() => setDatosDialogOpen(false)}
          usuario={selectedUser as unknown as User}
          onSubmit={handleSubmitDatos}
          isLoading={completarDatosMutation.isPending}
        />
      )}
    </Box>
  );
};
