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

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ 
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'background.default',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'divider',
              borderRadius: 4,
            },
          }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>Área</TableCell>
                  <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>Cargo</TableCell>
                  <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>Salario</TableCell>
                  <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>IBC</TableCell>
                  {canEdit && <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>Rol</TableCell>}
                  {canEdit && <TableCell sx={{ fontWeight: 700, px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }} align="right">Acciones</TableCell>}
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
                    <TableCell sx={{ px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {user.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: { xs: 1, sm: 2 } }}>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                      <Typography variant="body2">
                        {user.area || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                      <Typography variant="body2">
                        {user.cargo || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {user.salario ? formatCurrency(user.salario) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {user.ibc ? formatCurrency(user.ibc) : '-'}
                      </Typography>
                    </TableCell>
                    {canEdit && (
                      <TableCell sx={{ px: { xs: 1, sm: 2 }, whiteSpace: 'nowrap' }}>
                        <Chip
                          label={rolLabels[user.rol]}
                          color={rolColors[user.rol]}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    )}
                    {canEdit && (
                      <TableCell align="right" sx={{ px: { xs: 1, sm: 2 } }}>
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
