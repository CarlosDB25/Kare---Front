import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Payment,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { incapacidadService } from '../../../api/services/incapacidadService';
import { useMutation } from '@tanstack/react-query';

interface PagoData {
  monto?: number;
  beneficiario?: string;
  concepto?: string;
  incapacidad_id?: string;
}

export const PagosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pagoData = (location.state as PagoData) || {};

  const [monto, setMonto] = useState(pagoData.monto?.toString() || '');
  const [beneficiario, setBeneficiario] = useState(pagoData.beneficiario || '');
  const [concepto, setConcepto] = useState(pagoData.concepto || '');
  const [metodoPago, setMetodoPago] = useState('');
  const [banco, setBanco] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [titular, setTitular] = useState('');
  const [simulacionRealizada, setSimulacionRealizada] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Recuperar id de incapacidad si viene de conciliación
  // Puede venir como string, pero updateEstado espera number
  const incapacidadId = pagoData.incapacidad_id ? Number(pagoData.incapacidad_id) : undefined;

  const updateEstadoMutation = useMutation({
    mutationFn: async () => {
      if (!incapacidadId) return;
      await incapacidadService.updateEstado(incapacidadId, { estado: 'conciliada' });
    },
    onSuccess: () => {
      toast.success('Estado actualizado a conciliada');
    }
  });

  useEffect(() => {
    if (pagoData.monto) {
      toast.success('Datos de conciliación cargados');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSimularPago = () => {
    if (!monto || !beneficiario || !metodoPago || !banco || !numeroCuenta || !titular) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    toast.loading('Procesando pago...');
    
    setTimeout(() => {
      setTransactionId(`TRX-${Date.now()}-SIMUL`);
      setSimulacionRealizada(true);
      toast.dismiss();
      toast.success('¡Pago simulado exitosamente!');
      if (incapacidadId) updateEstadoMutation.mutate();
    }, 2000);
  };

  const handleResetear = () => {
    setMonto('');
    setBeneficiario('');
    setConcepto('');
    setMetodoPago('');
    setBanco('');
    setNumeroCuenta('');
    setTitular('');
    setSimulacionRealizada(false);
  };

  return (
    <Box>
      <Box mb={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            variant="outlined"
          >
            Volver
          </Button>
          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Procesar Pago
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pagoData.monto ? 'Pago desde conciliación' : 'Pago manual'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Card>
        <CardContent>
          {simulacionRealizada ? (
            <Box textAlign="center" py={4}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} gutterBottom>
                ¡Pago Simulado Exitosamente!
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                En producción, aquí se mostraría la confirmación del banco
              </Typography>

              <Stack spacing={1} sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3 }}>
                <Typography variant="caption" color="text.secondary">Detalles de la transacción:</Typography>
                <Typography variant="body2"><strong>Monto:</strong> ${parseFloat(monto).toLocaleString('es-CO')}</Typography>
                <Typography variant="body2"><strong>Beneficiario:</strong> {beneficiario}</Typography>
                {concepto && <Typography variant="body2"><strong>Concepto:</strong> {concepto}</Typography>}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">Método: {metodoPago}</Typography>
                <Typography variant="body2">Banco: {banco}</Typography>
                <Typography variant="body2">Cuenta: ****{numeroCuenta.slice(-4)}</Typography>
                <Typography variant="body2">Titular: {titular}</Typography>
                <Typography variant="caption" color="text.secondary" mt={1}>
                  ID Transacción: {transactionId}
                </Typography>
              </Stack>

              <Button
                variant="outlined"
                onClick={handleResetear}
                size="large"
              >
                Nueva Simulación
              </Button>
            </Box>
          ) : (
            <Stack spacing={3}>
              <Alert severity="info">
                <strong>Modo Simulación:</strong> Para producción, se integrará con pasarela de pago real.
                Ver documentación en <code>/docs/PAYMENT_INTEGRATION.md</code>
              </Alert>

              <TextField
                label="Monto a Pagar"
                fullWidth
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />

              <TextField
                label="Beneficiario"
                fullWidth
                value={beneficiario}
                onChange={(e) => setBeneficiario(e.target.value)}
                placeholder="Nombre del colaborador o entidad"
              />

              <TextField
                label="Concepto"
                fullWidth
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                placeholder="Ej: Pago de incapacidad"
                multiline
                rows={2}
              />

              <Divider />

              <TextField
                select
                label="Método de Pago"
                fullWidth
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <MenuItem value="transferencia">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccountBalance fontSize="small" />
                    <span>Transferencia Bancaria</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="pse">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Payment fontSize="small" />
                    <span>PSE - Débito a Cuenta</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="tarjeta">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CreditCard fontSize="small" />
                    <span>Tarjeta de Crédito/Débito</span>
                  </Stack>
                </MenuItem>
              </TextField>

              <TextField
                select
                label="Banco"
                fullWidth
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                disabled={!metodoPago}
              >
                <MenuItem value="bancolombia">Bancolombia</MenuItem>
                <MenuItem value="davivienda">Davivienda</MenuItem>
                <MenuItem value="bbva">BBVA</MenuItem>
                <MenuItem value="banco_bogota">Banco de Bogotá</MenuItem>
                <MenuItem value="nequi">Nequi</MenuItem>
                <MenuItem value="daviplata">Daviplata</MenuItem>
              </TextField>

              <TextField
                label="Número de Cuenta / Tarjeta"
                fullWidth
                value={numeroCuenta}
                onChange={(e) => setNumeroCuenta(e.target.value)}
                disabled={!metodoPago}
                placeholder="Ej: 1234567890"
              />

              <TextField
                label="Titular de la Cuenta"
                fullWidth
                value={titular}
                onChange={(e) => setTitular(e.target.value)}
                disabled={!metodoPago}
                placeholder="Nombre completo del titular"
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleSimularPago}
                disabled={!monto || !beneficiario || !metodoPago || !banco || !numeroCuenta || !titular}
                fullWidth
              >
                Simular Pago
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
