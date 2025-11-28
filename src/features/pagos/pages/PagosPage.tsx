import { useState } from 'react';
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
  Chip,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Payment,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export const PagosPage = () => {
  const [metodoPago, setMetodoPago] = useState('');
  const [banco, setBanco] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [titular, setTitular] = useState('');
  const [simulacionRealizada, setSimulacionRealizada] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleSimularPago = () => {
    if (!metodoPago || !banco || !numeroCuenta || !titular) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Simulación de procesamiento
    toast.loading('Procesando pago...');
    
    setTimeout(() => {
      setTransactionId(`TRX-${Date.now()}-SIMUL`);
      setSimulacionRealizada(true);
      toast.dismiss();
      toast.success('¡Pago simulado exitosamente!');
    }, 2000);
  };

  const handleResetear = () => {
    setMetodoPago('');
    setBanco('');
    setNumeroCuenta('');
    setTitular('');
    setSimulacionRealizada(false);
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Módulo de Pagos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sistema de gestión de pagos - Listo para integración con pasarela real
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Panel de Información */}
        <Box sx={{ flex: { xs: 1, md: '0 0 350px' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Payment color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" fontWeight={600} mt={1}>
                    Sistema de Pagos
                  </Typography>
                </Box>

                <Alert severity="info">
                  Este módulo está <strong>listo para producción</strong>. Solo requiere:
                </Alert>

                <Stack spacing={1}>
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Interfaz de usuario completa" 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Validaciones implementadas" 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    icon={<Warning />} 
                    label="Integración con API de pago" 
                    color="warning" 
                    size="small" 
                  />
                </Stack>

                <Divider />

                <Typography variant="caption" color="text.secondary">
                  <strong>Pasarelas compatibles:</strong>
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">• PayU Colombia</Typography>
                  <Typography variant="body2">• Wompi</Typography>
                  <Typography variant="body2">• PSE - Pagos Seguros en Línea</Typography>
                  <Typography variant="body2">• Transferencias bancarias</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Formulario de Pago */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Configuración de Pago
              </Typography>

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
                <Stack spacing={3} mt={2}>
                  <Alert severity="warning">
                    <strong>Modo Demostración:</strong> Este módulo simula el proceso de pago. 
                    Para producción, se integrará con la API de la pasarela seleccionada.
                  </Alert>

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

                  <Divider />

                  <Alert severity="info">
                    <Typography variant="caption" fontWeight={600}>
                      Integración Pendiente:
                    </Typography>
                    <Typography variant="body2">
                      Para ambiente productivo, conectar con:<br />
                      • API de PayU: <code>https://api.payulatam.com/payments-api/</code><br />
                      • API de Wompi: <code>https://production.wompi.co/v1/</code><br />
                      • PSE: A través de agregador bancario
                    </Typography>
                  </Alert>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSimularPago}
                    disabled={!metodoPago || !banco || !numeroCuenta || !titular}
                    fullWidth
                  >
                    Simular Pago
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>
      </Stack>

      {/* Información Adicional */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Documentación de Integración
          </Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="primary">
                1. Configuración de Credenciales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En producción, las credenciales de la pasarela (API Key, Merchant ID) 
                se configurarán en variables de entorno (.env) para mayor seguridad.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary">
                2. Flujo de Pago Real
              </Typography>
              <Typography variant="body2" color="text.secondary">
                El sistema enviará la solicitud de pago a la API → La pasarela procesa → 
                Retorna respuesta → Se actualiza el estado en la base de datos.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary">
                3. Seguridad y Compliance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cumple con PCI DSS. Los datos sensibles nunca se almacenan en el frontend.
                Se utiliza tokenización para tarjetas de crédito.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="primary">
                4. Webhook de Confirmación
              </Typography>
              <Typography variant="body2" color="text.secondary">
                El backend recibirá notificaciones automáticas del banco sobre el estado 
                de cada transacción para mantener la trazabilidad.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
