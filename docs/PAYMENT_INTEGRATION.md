# Integración de Pasarela de Pagos

## Descripción General

El módulo de pagos está diseñado para integrarse con pasarelas de pago colombianas. Actualmente funciona en modo simulación y está listo para conectarse con APIs reales.

## Pasarelas Compatibles

### 1. PayU Colombia

**API Endpoint:** `https://api.payulatam.com/payments-api/`

**Configuración necesaria:**
- API Key
- Merchant ID
- Account ID

**Métodos soportados:**
- Tarjetas de crédito/débito
- PSE (Pagos Seguros en Línea)
- Efectivo (Baloto, Efecty, etc.)

**Documentación oficial:** https://developers.payulatam.com/

### 2. Wompi

**API Endpoint:** `https://production.wompi.co/v1/`

**Configuración necesaria:**
- Public Key
- Private Key
- Event Secret (para webhooks)

**Métodos soportados:**
- Tarjetas de crédito/débito
- PSE
- Nequi
- Bancolombia (Transferencias)

**Documentación oficial:** https://docs.wompi.co/

### 3. PSE Directo

**Integración mediante agregadores bancarios:**
- ACH Colombia
- Redeban

**Bancos soportados:**
- Bancolombia
- Davivienda
- BBVA
- Banco de Bogotá
- Nequi
- Daviplata

## Flujo de Integración

### 1. Configuración de Credenciales

Las credenciales de la pasarela deben configurarse en variables de entorno:

```env
# PayU
VITE_PAYU_API_KEY=your_api_key
VITE_PAYU_MERCHANT_ID=your_merchant_id
VITE_PAYU_ACCOUNT_ID=your_account_id

# Wompi
VITE_WOMPI_PUBLIC_KEY=pub_prod_xxxxx
VITE_WOMPI_PRIVATE_KEY=prv_prod_xxxxx
VITE_WOMPI_EVENT_SECRET=xxxxx
```

### 2. Flujo de Pago Real

1. **Usuario selecciona método de pago** → Formulario en PagosPage
2. **Frontend envía solicitud** → API del backend
3. **Backend procesa con pasarela** → Validación y tokenización
4. **Pasarela procesa pago** → Banco/Entidad financiera
5. **Respuesta a backend** → Actualización de estado
6. **Notificación a frontend** → Confirmación al usuario

### 3. Ejemplo de Integración con PayU

```typescript
// src/api/services/paymentService.ts
import { apiClient } from '../client';

interface PaymentData {
  amount: number;
  description: string;
  payerEmail: string;
  paymentMethod: 'card' | 'pse' | 'cash';
  bankCode?: string;
  accountNumber?: string;
}

export const paymentService = {
  processPayment: async (data: PaymentData) => {
    const response = await apiClient.post('/payments/process', {
      merchantId: import.meta.env.VITE_PAYU_MERCHANT_ID,
      accountId: import.meta.env.VITE_PAYU_ACCOUNT_ID,
      ...data
    });
    return response.data;
  },

  getPaymentStatus: async (transactionId: string) => {
    const response = await apiClient.get(`/payments/${transactionId}/status`);
    return response.data;
  }
};
```

### 4. Webhook de Confirmación

El backend debe implementar un endpoint para recibir notificaciones de la pasarela:

```typescript
// Backend - Express.js ejemplo
app.post('/api/webhooks/payment-confirmation', async (req, res) => {
  const { transactionId, status, amount } = req.body;
  
  // Verificar firma del webhook
  const isValid = verifyWebhookSignature(req);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Actualizar estado en base de datos
  await updatePaymentStatus(transactionId, status);
  
  res.status(200).json({ received: true });
});
```

## Seguridad y Compliance

### PCI DSS Compliance

- **Nunca almacenar datos sensibles** en el frontend
- Usar **tokenización** para tarjetas de crédito
- Las transacciones se procesan mediante **HTTPS/TLS**
- Implementar **rate limiting** en el backend

### Mejores Prácticas

1. **Validación en frontend y backend**: Nunca confiar solo en validaciones del cliente
2. **Logs de auditoría**: Registrar todas las transacciones
3. **Manejo de errores**: Nunca exponer detalles técnicos al usuario
4. **Timeouts**: Configurar timeouts apropiados (30-60 segundos)
5. **Reintentos**: Implementar lógica de reintentos con backoff exponencial

## Estados de Transacción

| Estado | Descripción |
|--------|-------------|
| `pending` | Pago iniciado, esperando confirmación |
| `processing` | Pago en proceso por la pasarela |
| `approved` | Pago aprobado exitosamente |
| `declined` | Pago rechazado por el banco |
| `failed` | Error en el procesamiento |
| `refunded` | Pago reembolsado |

## Testing

### Modo Sandbox

Todas las pasarelas proveen ambientes de prueba:

**PayU Sandbox:**
- Endpoint: `https://sandbox.api.payulatam.com/`
- Tarjetas de prueba disponibles en documentación

**Wompi Sandbox:**
- Endpoint: `https://sandbox.wompi.co/v1/`
- Public Key de prueba: `pub_test_xxxxx`

### Tarjetas de Prueba

```
Visa Aprobada: 4111 1111 1111 1111
Mastercard Aprobada: 5500 0000 0000 0004
Visa Rechazada: 4111 1111 1111 1112
CVV: 123
Fecha: Cualquier fecha futura
```

## Próximos Pasos

1. Seleccionar pasarela de pago (recomendación: Wompi por facilidad de integración)
2. Crear cuenta y obtener credenciales
3. Implementar servicio de backend para procesar pagos
4. Configurar webhooks
5. Realizar pruebas en ambiente sandbox
6. Migrar a producción

## Soporte

Para dudas sobre integración:
- PayU: soporte@payulatam.com
- Wompi: soporte@wompi.co
