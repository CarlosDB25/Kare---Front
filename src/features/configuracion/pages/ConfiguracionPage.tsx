import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import { Save, Business } from '@mui/icons-material';
import toast from 'react-hot-toast';

export const ConfiguracionPage = () => {
  const [nombreEmpresa, setNombreEmpresa] = useState(() => {
    return localStorage.getItem('nombreEmpresa') || '';
  });
  const [nit, setNit] = useState(() => {
    return localStorage.getItem('empresaNit') || '';
  });
  const [direccion, setDireccion] = useState(() => {
    return localStorage.getItem('empresaDireccion') || '';
  });
  const [telefono, setTelefono] = useState(() => {
    return localStorage.getItem('empresaTelefono') || '';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('empresaEmail') || '';
  });
  const [representanteLegal, setRepresentanteLegal] = useState(() => {
    return localStorage.getItem('empresaRepresentante') || '';
  });
  const [guardado, setGuardado] = useState(false);

  const handleGuardar = () => {
    if (!nombreEmpresa.trim()) {
      toast.error('El nombre de la empresa no puede estar vacío');
      return;
    }

    localStorage.setItem('nombreEmpresa', nombreEmpresa);
    localStorage.setItem('empresaNit', nit);
    localStorage.setItem('empresaDireccion', direccion);
    localStorage.setItem('empresaTelefono', telefono);
    localStorage.setItem('empresaEmail', email);
    localStorage.setItem('empresaRepresentante', representanteLegal);
    setGuardado(true);
    toast.success('Configuración guardada exitosamente');
    
    // Recargar la página para aplicar cambios
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Configuración del Sistema
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Personaliza la información de tu empresa
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <Business color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Información de la Empresa
                </Typography>
              </Stack>
              <Alert severity="info" sx={{ mb: 2 }}>
                El nombre de la empresa aparecerá en los reportes y documentos generados
              </Alert>
            </Box>

            <TextField
              label="Nombre de la Empresa"
              fullWidth
              value={nombreEmpresa}
              onChange={(e) => {
                setNombreEmpresa(e.target.value);
                setGuardado(false);
              }}
              placeholder="Ej: Mi Empresa S.A.S."
              helperText="Este nombre se mostrará en todos los reportes"
            />

            <TextField
              label="NIT"
              fullWidth
              value={nit}
              onChange={(e) => {
                setNit(e.target.value);
                setGuardado(false);
              }}
              placeholder="Ej: 900.123.456-7"
              helperText="Número de Identificación Tributaria"
            />

            <TextField
              label="Dirección"
              fullWidth
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value);
                setGuardado(false);
              }}
              placeholder="Ej: Calle 123 #45-67"
            />

            <TextField
              label="Teléfono"
              fullWidth
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                setGuardado(false);
              }}
              placeholder="Ej: +57 300 123 4567"
            />

            <TextField
              label="Email Corporativo"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setGuardado(false);
              }}
              placeholder="Ej: contacto@empresa.com"
            />

            <TextField
              label="Representante Legal"
              fullWidth
              value={representanteLegal}
              onChange={(e) => {
                setRepresentanteLegal(e.target.value);
                setGuardado(false);
              }}
              placeholder="Ej: Juan Pérez"
            />

            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleGuardar}
              disabled={guardado}
            >
              {guardado ? 'Configuración Guardada' : 'Guardar Configuración'}
            </Button>

            {guardado && (
              <Alert severity="success">
                La configuración se ha guardado correctamente. La página se recargará para aplicar los cambios.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
