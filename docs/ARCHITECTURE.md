# Arquitectura del Sistema KARE Frontend

## Visión General

KARE Frontend está construido siguiendo una arquitectura moderna de aplicación React con separación clara de responsabilidades, enfocándose en escalabilidad, mantenibilidad y experiencia de desarrollo.

## Principios Arquitectónicos

### 1. Separación de Preocupaciones (Separation of Concerns)
- **UI Components**: Lógica de presentación
- **Business Logic**: Hooks personalizados y servicios
- **State Management**: Zustand para estado global, React Query para estado del servidor
- **API Layer**: Servicios dedicados para comunicación con backend

### 2. Feature-Based Organization
El código se organiza por características de negocio (auth, incapacidades, reemplazos) en lugar de por tipo de archivo

 (components, pages, etc.)

**Beneficios**:
- Mejor localización de código relacionado
- Facilita el desarrollo en equipo
- Reduce acoplamiento entre features

### 3. Composition over Inheritance
- Componentes pequeños y reutilizables
- Hooks personalizados para lógica compartida
- Higher Order Components solo cuando es necesario

## Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Components, Pages, Layouts)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│         Business Logic Layer            │
│  (Hooks, Utils, Validators)             │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│         Data Layer                      │
│  (Services, API Client, React Query)    │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│         State Layer                     │
│  (Zustand Stores, React Query Cache)    │
└─────────────────────────────────────────┘
```

## Detalles de Implementación

### 1. Gestión de Estado

#### Estado Global (Zustand)
```typescript
// Usado para estado de aplicación que persiste entre rutas
- authStore: Usuario autenticado, token JWT
- themeStore: Preferencia de tema (claro/oscuro)
```

#### Estado del Servidor (React Query)
```typescript
// Usado para datos que vienen del backend
- Caché automático
- Invalidación inteligente
- Reintento automático
- Sincronización en background
```

#### Estado Local (useState, useReducer)
```typescript
// Usado para estado específico de componente
- Valores de formularios
- UI temporal (modals abiertos/cerrados)
- Estados de carga locales
```

### 2. Gestión de Datos

#### React Query - Configuración
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});
```

#### Patrón de Servicios
```typescript
// Cada dominio tiene su servicio
class IncapacidadService {
  async getAll(): Promise<Incapacidad[]> { }
  async getById(id: number): Promise<Incapacidad> { }
  async create(data: CreateData): Promise<Incapacidad> { }
  async update(id: number, data: UpdateData): Promise<Incapacidad> { }
  async delete(id: number): Promise<void> { }
}
```

### 3. Comunicación con API

#### Axios Client Configurado
```typescript
// Interceptor de request - Agrega token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response - Manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout automático en 401
    }
    return Promise.reject(error);
  }
);
```

#### Centralización de Endpoints
```typescript
// /api/endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  INCAPACIDADES: {
    BASE: '/incapacidades',
    BY_ID: (id: number) => `/incapacidades/${id}`,
  },
};
```

### 4. Rutas y Navegación

#### Estructura de Rutas
```
/                        → Redirect to /dashboard
/login                   → Public
/register                → Public
/dashboard               → Protected
/incapacidades           → Protected (Colaborador, Lider, GH, Conta)
/reemplazos              → Protected (Lider, GH, Conta)
/notificaciones          → Protected (All)
/usuarios                → Protected (GH, Conta, Lider)
/conciliaciones          → Protected (Conta, GH)
```

#### Protected Routes
```typescript
<ProtectedRoute>
  <AppLayout />
</ProtectedRoute>
```

### 5. Formularios

#### React Hook Form + Zod
```typescript
const schema = z.object({
  nombre: z.string().min(3),
  email: z.string().email(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

**Beneficios**:
- Validación tipada
- Performance optimizada
- Menos re-renders
- Integración perfecta con TypeScript

### 6. Notificaciones

#### Sistema de Toast
```typescript
toast.success('Operación exitosa');
toast.error('Error al procesar');
toast.loading('Procesando...');
```

#### Sistema de Notificaciones del Backend
```typescript
// Polling cada 10 segundos
useQuery({
  queryKey: ['notificaciones', 'unread-count'],
  queryFn: () => notificacionService.getUnreadCount(),
  refetchInterval: 10000,
});
```

## Patrones de Diseño Utilizados

### 1. Container/Presentational Pattern
```typescript
// Container - Lógica
const IncapacidadesPage = () => {
  const { data, isLoading } = useIncapacidades();
  return <IncapacidadesList data={data} isLoading={isLoading} />;
};

// Presentational - UI
const IncapacidadesList = ({ data, isLoading }) => {
  if (isLoading) return <Loader />;
  return <Table data={data} />;
};
```

### 2. Custom Hooks Pattern
```typescript
// Encapsula lógica reutilizable
const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.usuario, data.token);
      navigate('/dashboard');
    },
  });
};
```

### 3. Service Layer Pattern
```typescript
// Abstrae la comunicación con API
class AuthService {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  }
}
```

## Flujo de Datos

### Lectura (Read)
```
Component
  ↓ useQuery
React Query
  ↓ fetch
Service
  ↓ HTTP
API Backend
  ↓ Response
Service
  ↓ Transform
React Query Cache
  ↓ Re-render
Component
```

### Escritura (Write)
```
Component
  ↓ useMutation
React Query
  ↓ mutate
Service
  ↓ HTTP POST/PUT/DELETE
API Backend
  ↓ Response
Service
  ↓ invalidateQueries
React Query
  ↓ Refetch
Component (updated)
```

## Optimizaciones

### 1. Code Splitting
```typescript
// Lazy loading de rutas
const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
```

### 2. Memoization
```typescript
// Evita re-renders innecesarios
const filteredData = useMemo(
  () => data.filter(item => item.estado === filter),
  [data, filter]
);
```

### 3. React Query Cache
- Datos cacheados por 5 minutos
- Revalidación en background
- Deduplicación de requests

## Seguridad

### 1. Autenticación JWT
- Token en localStorage
- Validación en cada request
- Logout automático en 401

### 2. Protección de Rutas
- ProtectedRoute wrapper
- Verificación de autenticación
- Redirección a login si no autenticado

### 3. Validación de Datos
- Zod schemas en formularios
- Validación en backend también
- Sanitización de inputs

## Testing Strategy

### Unit Tests
- Hooks personalizados
- Utilidades
- Validadores

### Integration Tests
- Flujos completos de usuario
- Interacción entre componentes

### E2E Tests
- Flujos críticos de negocio
- Autenticación
- Creación de incapacidades

## Escalabilidad

### Vertical (Más features)
- Agregar nuevas features en `/features`
- Nuevos servicios en `/api/services`
- Mantener separación de concerns

### Horizontal (Más complejidad)
- Code splitting por feature
- Lazy loading de componentes pesados
- Optimización de bundle size

## Mantenibilidad

### 1. TypeScript
- Tipado estricto
- Interfaces bien definidas
- Menos errores en runtime

### 2. Estructura Consistente
- Convenciones de naming
- Organización predecible
- Fácil onboarding

### 3. Documentación
- JSDoc en funciones complejas
- README por feature
- Comentarios explicativos

## Dependencias Clave

```json
{
  "react": "^18.3.1",
  "typescript": "~5.6.2",
  "@tanstack/react-query": "^5.62.7",
  "zustand": "^5.0.2",
  "@mui/material": "^6.1.9",
  "react-router-dom": "^6.28.0",
  "axios": "^1.7.9",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1"
}
```

## Conclusión

La arquitectura de KARE Frontend está diseñada para ser:
- **Escalable**: Fácil agregar nuevas features
- **Mantenible**: Código organizado y predecible
- **Performante**: Optimizaciones en caché y renders
- **Segura**: Validación y autenticación robustas
- **Type-safe**: TypeScript en toda la aplicación
