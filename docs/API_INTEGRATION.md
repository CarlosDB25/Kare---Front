# Guía de Integración con API - KARE Backend

## Índice
1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Endpoints por Módulo](#endpoints-por-módulo)
4. [Manejo de Errores](#manejo-de-errores)
5. [Ejemplos de Integración](#ejemplos-de-integración)

---

## Información General

### URL Base
```
Desarrollo: http://localhost:3000/api
Producción: https://kare-oj4v.onrender.com/api
```

### Formato de Respuestas

**Éxito (200-201)**
```json
{
  "success": true,
  "data": { /* datos solicitados */ },
  "message": "Operación exitosa"
}
```

**Error (400-500)**
```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

---

## Autenticación

### 1. Registro de Usuario

**Endpoint**: `POST /auth/registro`

**Request Body**:
```json
{
  "nombre": "Juan Pérez",
  "documento": "1234567890",
  "email": "juan.perez@example.com",
  "password": "miPassword123",
  "rol": "colaborador"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "rol": "colaborador",
    "documento": "1234567890"
  },
  "message": "Usuario registrado exitosamente"
}
```

**Notas**:
- El rol por defecto es "colaborador"
- Se envía notificación automática a todos los usuarios GH
- El campo `documento` es obligatorio

---

### 2. Inicio de Sesión

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "juan.perez@example.com",
  "password": "miPassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 15,
      "nombre": "Juan Pérez",
      "email": "juan.perez@example.com",
      "rol": "colaborador",
      "documento": "1234567890",
      "area": "Tecnología",
      "cargo": "Desarrollador",
      "salario_base": 3500000,
      "ibc": 3500000
    }
  },
  "message": "Login exitoso"
}
```

**Uso del Token**:
```javascript
// Guardar token
localStorage.setItem('token', response.data.token);

// Incluir en headers
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

**Expiración**: 24 horas

---

### 3. Verificar Token

**Endpoint**: `GET /auth/verify`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "nombre": "Juan Pérez",
    "email": "juan.perez@example.com",
    "rol": "colaborador",
    "documento": "1234567890"
  }
}
```

---

## Endpoints por Módulo

### 📄 Incapacidades

#### Crear Incapacidad

**Endpoint**: `POST /incapacidades`  
**Requiere**: Token de colaborador  
**Content-Type**: `multipart/form-data`

**Form Data**:
```
tipo: "enfermedad_general" | "accidente_laboral"
fecha_inicio: "2024-11-15"
fecha_fin: "2024-11-17"
diagnostico: "Gripe viral"
documento: [File]
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 42,
    "usuario_id": 15,
    "tipo": "enfermedad_general",
    "fecha_inicio": "2024-11-15",
    "fecha_fin": "2024-11-17",
    "dias_incapacidad": 3,
    "diagnostico": "Gripe viral",
    "estado": "pendiente",
    "documento_url": "/uploads/incapacidades/incap_1731700000000.pdf"
  }
}
```

**Ejemplo con Axios**:
```javascript
const formData = new FormData();
formData.append('tipo', 'enfermedad_general');
formData.append('fecha_inicio', '2024-11-15');
formData.append('fecha_fin', '2024-11-17');
formData.append('diagnostico', 'Gripe viral');
formData.append('documento', fileInput.files[0]);

const response = await axios.post('/incapacidades', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

---

#### Listar Incapacidades

**Endpoint**: `GET /incapacidades`  
**Requiere**: Token  
**Permisos**:
- Colaborador: Solo las suyas
- Líder/GH/Conta: Todas

**Query Params** (opcionales):
```
estado=pendiente
fecha_inicio=2024-11-01
fecha_fin=2024-11-30
usuario_id=15
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "usuario_id": 15,
      "usuario_nombre": "Juan Pérez",
      "tipo": "enfermedad_general",
      "fecha_inicio": "2024-11-15",
      "fecha_fin": "2024-11-17",
      "dias_incapacidad": 3,
      "diagnostico": "Gripe viral",
      "estado": "pendiente",
      "documento_url": "/uploads/incapacidades/incap_1731700000000.pdf",
      "created_at": "2024-11-15T08:30:00.000Z"
    }
  ]
}
```

---

#### Actualizar Estado

**Endpoint**: `PUT /incapacidades/:id/estado`  
**Requiere**: Token GH o Conta

**Request Body**:
```json
{
  "nuevo_estado": "aprobada",
  "observacion": "Documento verificado y aprobado"
}
```

**Estados Válidos**:
- `pendiente` → `aprobada` (GH)
- `pendiente` → `rechazada` (GH)
- `aprobada` → `radicada` (GH)
- `radicada` → `pagada` (Conta)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 42,
    "estado": "aprobada"
  },
  "message": "Estado actualizado exitosamente"
}
```

---

#### Análisis OCR

**Endpoint**: `POST /incapacidades/:id/ocr`  
**Requiere**: Token GH  
**Content-Type**: `multipart/form-data`

**Form Data**:
```
documento: [File JPG/PNG/PDF]
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "textoExtraido": "CERTIFICADO MÉDICO\nNombre: JUAN PEREZ\nCédula: 1234567890...",
    "validacion": {
      "nombre": {
        "esperado": "Juan Pérez",
        "encontrado": "JUAN PEREZ",
        "similitud": 95.5,
        "valido": true
      },
      "documento": {
        "esperado": "1234567890",
        "encontrado": "1234567890",
        "similitud": 100,
        "valido": true
      }
    },
    "esValido": true
  }
}
```

---

### 🔄 Reemplazos

#### Crear Reemplazo

**Endpoint**: `POST /reemplazos`  
**Requiere**: Token Líder o GH

**Request Body**:
```json
{
  "colaborador_ausente_id": 15,
  "colaborador_reemplazo_id": 8,
  "fecha_inicio": "2024-11-15",
  "fecha_fin": "2024-11-17"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 23,
    "colaborador_ausente_id": 15,
    "colaborador_reemplazo_id": 8,
    "fecha_inicio": "2024-11-15",
    "fecha_fin": "2024-11-17",
    "dias_reemplazo": 3,
    "estado": "activo"
  }
}
```

**Notificaciones automáticas**:
- Se envía a colaborador ausente
- Se envía a colaborador reemplazo

---

#### Extender Reemplazo

**Endpoint**: `PUT /reemplazos/:id/extender`  
**Requiere**: Token Líder o GH

**Request Body**:
```json
{
  "dias_adicionales": 5
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 23,
    "fecha_fin": "2024-11-22",
    "dias_reemplazo": 8
  },
  "message": "Reemplazo extendido exitosamente"
}
```

---

#### Listar Reemplazos

**Endpoint**: `GET /reemplazos`  
**Requiere**: Token

**Query Params**:
```
estado=activo
fecha_inicio=2024-11-01
colaborador_ausente_id=15
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 23,
      "colaborador_ausente_nombre": "Juan Pérez",
      "colaborador_reemplazo_nombre": "Ana García",
      "fecha_inicio": "2024-11-15",
      "fecha_fin": "2024-11-22",
      "dias_reemplazo": 8,
      "estado": "activo"
    }
  ]
}
```

---

### 👥 Usuarios

#### Listar Usuarios

**Endpoint**: `GET /usuarios`  
**Requiere**: Token GH, Líder o Conta

**Query Params**:
```
rol=colaborador
area=Tecnología
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "nombre": "Juan Pérez",
      "email": "juan.perez@example.com",
      "documento": "1234567890",
      "rol": "colaborador",
      "area": "Tecnología",
      "cargo": "Desarrollador"
    }
  ]
}
```

---

#### Completar Datos de Usuario

**Endpoint**: `PUT /usuarios/:id/completar-datos`  
**Requiere**: Token GH

**Request Body**:
```json
{
  "salario_base": 3500000,
  "ibc": 3500000,
  "area": "Tecnología",
  "cargo": "Desarrollador Senior"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "salario_base": 3500000,
    "ibc": 3500000,
    "area": "Tecnología",
    "cargo": "Desarrollador Senior"
  },
  "message": "Datos completados exitosamente"
}
```

---

#### Cambiar Rol

**Endpoint**: `PUT /usuarios/:id/rol`  
**Requiere**: Token GH

**Request Body**:
```json
{
  "nuevo_rol": "lider"
}
```

**Roles Válidos**: `colaborador`, `lider`, `gh`, `conta`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "rol": "lider"
  },
  "message": "Rol actualizado exitosamente"
}
```

---

### 🔔 Notificaciones

#### Listar Notificaciones del Usuario

**Endpoint**: `GET /notificaciones`  
**Requiere**: Token

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 87,
      "usuario_id": 1,
      "tipo": "info",
      "titulo": "Nuevo Registro",
      "mensaje": "El usuario Juan Pérez se ha registrado",
      "leida": false,
      "link": "/usuarios",
      "created_at": "2024-11-15T10:30:00.000Z"
    }
  ]
}
```

**Tipos**: `info`, `success`, `warning`, `error`

---

#### Marcar como Leída

**Endpoint**: `PUT /notificaciones/:id/leer`  
**Requiere**: Token

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 87,
    "leida": true
  }
}
```

---

#### Marcar Todas como Leídas

**Endpoint**: `PUT /notificaciones/leer-todas`  
**Requiere**: Token

**Response** (200):
```json
{
  "success": true,
  "message": "Todas las notificaciones marcadas como leídas"
}
```

---

### 💰 Conciliaciones

#### Crear Conciliación

**Endpoint**: `POST /conciliaciones`  
**Requiere**: Token GH o Conta

**Request Body**:
```json
{
  "incapacidad_id": 42
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 12,
    "incapacidad_id": 42,
    "dias_incapacidad": 3,
    "valor_dia": 116666.67,
    "dias_empresa": 2,
    "dias_eps": 1,
    "valor_empresa": 233333.34,
    "valor_eps": 116666.67,
    "valor_total": 350000.01
  }
}
```

**Cálculo Automático**:
- Días empresa: Primeros 2 días (66.67% del salario diario)
- Días EPS: Desde día 3 en adelante (66.67% del IBC diario)
- Valor día = Salario base / 30

---

#### Obtener Estadísticas

**Endpoint**: `GET /conciliaciones/estadisticas`  
**Requiere**: Token GH o Conta

**Response** (200):
```json
{
  "success": true,
  "data": {
    "total_conciliaciones": 45,
    "valor_empresa_total": 15000000,
    "valor_eps_total": 8500000,
    "valor_total_general": 23500000
  }
}
```

---

## Manejo de Errores

### Códigos de Estado HTTP

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK | Recurso obtenido exitosamente |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos o faltantes |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | Sin permisos para esta acción |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: email duplicado) |
| 500 | Server Error | Error interno del servidor |

### Ejemplos de Errores

**Token Inválido (401)**:
```json
{
  "success": false,
  "error": "Token no proporcionado"
}
```

**Permiso Denegado (403)**:
```json
{
  "success": false,
  "error": "No tienes permiso para realizar esta acción"
}
```

**Validación Fallida (400)**:
```json
{
  "success": false,
  "error": "El campo 'fecha_inicio' es obligatorio"
}
```

**Recurso No Encontrado (404)**:
```json
{
  "success": false,
  "error": "Incapacidad no encontrada"
}
```

---

## Ejemplos de Integración

### Cliente JavaScript/TypeScript

```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
```

### Servicio de Incapacidades

```typescript
// services/incapacidadService.ts
import { apiClient } from '../api/client';

export interface Incapacidad {
  id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  diagnostico: string;
  estado: string;
  documento_url: string;
}

class IncapacidadService {
  async crear(data: FormData): Promise<Incapacidad> {
    const response = await apiClient.post('/incapacidades', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  }

  async listar(): Promise<Incapacidad[]> {
    const response = await apiClient.get('/incapacidades');
    return response.data.data;
  }

  async cambiarEstado(id: number, nuevoEstado: string): Promise<void> {
    await apiClient.put(`/incapacidades/${id}/estado`, {
      nuevo_estado: nuevoEstado
    });
  }
}

export const incapacidadService = new IncapacidadService();
```

### Hook de React con React Query

```typescript
// hooks/useIncapacidades.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incapacidadService } from '../services/incapacidadService';

export const useIncapacidades = () => {
  return useQuery({
    queryKey: ['incapacidades'],
    queryFn: () => incapacidadService.listar()
  });
};

export const useCrearIncapacidad = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => incapacidadService.crear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incapacidades'] });
    }
  });
};
```

### Uso en Componente

```typescript
// components/IncapacidadesPage.tsx
import { useIncapacidades, useCrearIncapacidad } from '../hooks/useIncapacidades';

export const IncapacidadesPage = () => {
  const { data: incapacidades, isLoading } = useIncapacidades();
  const crearMutation = useCrearIncapacidad();

  const handleSubmit = async (formData: FormData) => {
    try {
      await crearMutation.mutateAsync(formData);
      toast.success('Incapacidad creada exitosamente');
    } catch (error) {
      toast.error('Error al crear incapacidad');
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      {incapacidades?.map(incap => (
        <IncapacidadCard key={incap.id} incapacidad={incap} />
      ))}
    </div>
  );
};
```

---

## Seguridad

### Headers Requeridos

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### CORS

El backend acepta requests desde:
- `http://localhost:5173` (desarrollo)
- `https://kare-front.onrender.com` (producción)

### Rate Limiting

- Máximo 100 requests por minuto por IP
- Después de 5 intentos fallidos de login: bloqueo de 15 minutos

---

## Testing

### Usuarios de Prueba

```javascript
// GH
{
  "email": "ghmaster@kare.com",
  "password": "gh123456"
}

// Líder
{
  "email": "lider@kare.com",
  "password": "lider123"
}

// Colaborador
{
  "email": "colaborador@kare.com",
  "password": "colab123"
}

// Contabilidad
{
  "email": "conta@kare.com",
  "password": "conta123"
}
```

---

## Recursos Adicionales

- **Postman Collection**: Disponible en `/docs/KARE-API.postman_collection.json`
- **Swagger/OpenAPI**: En desarrollo
- **WebSocket**: No implementado (usar polling para notificaciones)

---

*Última actualización: Noviembre 2024*
