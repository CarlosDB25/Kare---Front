# KARE - Sistema de Gestión de Incapacidades Médicas

## 📋 Descripción

KARE es una aplicación web moderna para la gestión integral de incapacidades médicas, reemplazos de personal y conciliaciones. Permite a las organizaciones controlar de manera eficiente las ausencias laborales, gestionar reemplazos temporales y realizar el seguimiento financiero de las incapacidades.

## 🚀 Características Principales

### 👥 Gestión de Usuarios
- **Roles diferenciados**: Colaborador, Líder, Gestión Humana (GH), Contabilidad
- **Registro público**: Los usuarios pueden auto-registrarse como colaboradores
- **Gestión de perfiles**: Información completa de empleados (documento, área, cargo, salario, IBC)

### 📄 Incapacidades
- **Creación y seguimiento**: Los colaboradores pueden reportar incapacidades
- **Análisis con OCR**: Extracción automática de datos de documentos médicos
- **Estados del ciclo**: Pendiente → Aprobada → Radicada → Pagada
- **Validaciones automáticas**: Verificación de datos extraídos vs perfil del usuario
- **Adjuntos**: Soporte para documentos PDF e imágenes (JPG, PNG)

### 🔄 Reemplazos
- **Asignación inteligente**: Selección de reemplazos disponibles
- **Gestión de fechas**: Control de períodos de reemplazo
- **Extensiones**: Posibilidad de ampliar días de reemplazo
- **Notificaciones**: Alertas automáticas para todos los involucrados

### 💰 Conciliaciones
- **Gestión financiera**: Control de documentos bancarios
- **Estados**: Pendiente → En revisión → Conciliada → Rechazada
- **Observaciones**: Registro de comentarios y seguimiento

### 🔔 Notificaciones
- **Sistema en tiempo real**: Actualización cada 10 segundos
- **Tipos**: Info, Success, Warning, Error
- **Acciones directas**: Navegación a incapacidades desde notificaciones
- **Contador visual**: Badge con notificaciones no leídas

### 📊 Dashboard
- **Estadísticas en tiempo real**: Resumen de incapacidades por estado
- **Filtros por período**: Último mes, últimos 3 meses, último año
- **Visualización gráfica**: Gráficos de distribución y tendencias

## 🛠️ Tecnologías

### Core
- **React 18**: Biblioteca de UI con TypeScript
- **TypeScript**: Tipado estático para mayor seguridad
- **Vite**: Build tool ultra-rápido

### UI/UX
- **Material-UI (MUI) v6**: Componentes de diseño moderno
- **Emotion**: CSS-in-JS para estilos personalizados
- **React Router v6**: Navegación declarativa

### Estado y Data Fetching
- **Zustand**: Gestión de estado global minimalista
- **TanStack Query (React Query) v5**: Caché y sincronización de datos del servidor
- **Axios**: Cliente HTTP con interceptors

### Formularios y Validación
- **React Hook Form**: Gestión performante de formularios
- **Zod**: Validación de esquemas con TypeScript

### Utilidades
- **date-fns**: Manipulación de fechas
- **react-hot-toast**: Notificaciones toast elegantes

## 📁 Estructura del Proyecto

```
Kare-front/
├── src/
│   ├── api/                      # Capa de comunicación con backend
│   │   ├── client.ts            # Cliente Axios configurado
│   │   ├── endpoints.ts         # Definición centralizada de endpoints
│   │   └── services/            # Servicios por dominio
│   │       ├── authService.ts
│   │       ├── incapacidadService.ts
│   │       ├── reemplazoService.ts
│   │       ├── notificacionService.ts
│   │       ├── usuarioService.ts
│   │       ├── conciliacionService.ts
│   │       └── ocrService.ts
│   │
│   ├── components/               # Componentes reutilizables
│   │   ├── layout/
│   │   │   └── AppLayout.tsx    # Layout principal con navegación
│   │   ├── incapacidades/
│   │   │   ├── CreateIncapacidadDialog.tsx
│   │   │   ├── EditIncapacidadDialog.tsx
│   │   │   └── IncapacidadDetailDialog.tsx
│   │   └── usuarios/
│   │       └── CompletarDatosDialog.tsx
│   │
│   ├── features/                 # Módulos por funcionalidad
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.ts
│   │   │   │   └── useRegister.ts
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── dashboard/
│   │   │   └── pages/
│   │   │       └── DashboardPage.tsx
│   │   │
│   │   ├── incapacidades/
│   │   │   ├── pages/
│   │   │   │   └── IncapacidadesPage.tsx
│   │   │   └── types/
│   │   │       └── incapacidad.types.ts
│   │   │
│   │   ├── reemplazos/
│   │   │   └── pages/
│   │   │       └── ReemplazosPage.tsx
│   │   │
│   │   ├── notificaciones/
│   │   │   └── pages/
│   │   │       └── NotificacionesPage.tsx
│   │   │
│   │   ├── usuarios/
│   │   │   └── pages/
│   │   │       └── UsuariosPage.tsx
│   │   │
│   │   └── conciliaciones/
│   │       ├── pages/
│   │       │   └── ConciliacionesPage.tsx
│   │       ├── services/
│   │       │   └── conciliacionService.ts
│   │       └── types/
│   │           └── conciliacion.types.ts
│   │
│   ├── config/                   # Configuraciones globales
│   │   ├── env.ts               # Variables de entorno
│   │   └── queryClient.ts       # Configuración de React Query
│   │
│   ├── routes/                   # Configuración de rutas
│   │   └── AppRoutes.tsx
│   │
│   ├── store/                    # Estado global (Zustand)
│   │   ├── authStore.ts         # Estado de autenticación
│   │   └── themeStore.ts        # Estado de tema claro/oscuro
│   │
│   ├── styles/                   # Estilos globales
│   │   └── theme.ts             # Tema de Material-UI
│   │
│   ├── types/                    # Tipos compartidos
│   │   ├── enums.ts             # Enumeraciones (roles, estados)
│   │   └── api.types.ts         # Tipos de API
│   │
│   ├── App.tsx                   # Componente raíz
│   └── main.tsx                  # Punto de entrada
│
├── public/                       # Archivos estáticos
├── docs/                         # Documentación adicional
│   ├── ARCHITECTURE.md          # Arquitectura del sistema
│   ├── API_INTEGRATION.md       # Guía de integración con API
│   └── USER_MANUAL.md           # Manual de usuario
│
├── .env.example                  # Ejemplo de variables de entorno
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── vite.config.ts               # Configuración de Vite
└── README.md                     # Este archivo
```

## 🚦 Instalación y Configuración

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Kare-front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con hot-reload

# Producción
npm run build        # Compila la aplicación para producción
npm run preview      # Previsualiza el build de producción

# Linting y formateo
npm run lint         # Ejecuta ESLint para verificar código
```

## 🔐 Autenticación y Roles

### Sistema de Roles

| Rol | Código | Permisos |
|-----|--------|----------|
| **Colaborador** | `colaborador` | - Crear incapacidades<br>- Ver sus propias incapacidades<br>- Ver notificaciones |
| **Líder** | `lider` | - Todo lo de Colaborador<br>- Ver reemplazos<br>- Crear reemplazos<br>- Ver usuarios |
| **Gestión Humana** | `gh` | - Todo lo anterior<br>- Aprobar/rechazar incapacidades<br>- Análisis OCR de documentos<br>- Gestionar usuarios<br>- Editar información de usuarios |
| **Contabilidad** | `conta` | - Ver incapacidades<br>- Gestionar conciliaciones<br>- Ver reemplazos |

### Flujo de Autenticación

1. **Login**: `/login`
   - Email y contraseña
   - JWT almacenado en localStorage
   - Redirección a dashboard

2. **Registro**: `/register`
   - Auto-registro como colaborador
   - Notificación automática a GH para completar datos

3. **Protección de rutas**:
   - Middleware de autenticación
   - Verificación de roles por endpoint

## 🔄 Flujos Principales

### 1. Gestión de Incapacidades

```
Colaborador crea incapacidad
    ↓
Estado: PENDIENTE
    ↓
GH revisa → APROBADA / RECHAZADA
    ↓
GH radica → RADICADA
    ↓
Conta verifica pago → PAGADA
```

### 2. Análisis OCR

```
GH selecciona incapacidad
    ↓
Carga documento (PDF/Imagen)
    ↓
Backend extrae datos con OCR
    ↓
Sistema compara con perfil del colaborador
    ↓
Muestra similitudes/diferencias
    ↓
GH valida y aprueba
```

### 3. Gestión de Reemplazos

```
Lider crea reemplazo
    ↓
Selecciona colaborador ausente
    ↓
Asigna reemplazo disponible
    ↓
Define fecha inicio/fin
    ↓
Notificaciones enviadas
    ↓
Opción de extender días
```

## 🎨 Temas y Personalización

El sistema soporta modo claro y oscuro:

```typescript
// Cambiar tema
const { mode, toggleTheme } = useThemeStore();

// mode: 'light' | 'dark'
toggleTheme(); // Alterna entre modos
```

### Colores por Rol

- **GH**: Azul (#1976d2)
- **Lider**: Naranja (#f57c00)
- **Conta**: Verde (#388e3c)
- **Colaborador**: Verde azulado (#00897b)

## 🔌 Integración con Backend

### URL Base
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### Endpoints Principales

```typescript
AUTH: {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
}

INCAPACIDADES: {
  BASE: '/incapacidades',
  BY_ID: (id) => `/incapacidades/${id}`,
  ANALYZE: (id) => `/incapacidades/${id}/validar-documento`,
}

REEMPLAZOS: {
  BASE: '/reemplazos',
  BY_ID: (id) => `/reemplazos/${id}`,
  EXTEND: (id) => `/reemplazos/${id}/extender`,
}

NOTIFICACIONES: {
  BASE: '/notificaciones',
  MARK_READ: (id) => `/notificaciones/${id}/marcar-leida`,
  UNREAD_COUNT: '/notificaciones/no-leidas/cantidad',
}

USUARIOS: {
  BASE: '/usuarios',
  BY_ID: (id) => `/usuarios/${id}`,
  UPDATE_DATA: (id) => `/usuarios/${id}/completar-datos`,
}
```

## 🧪 Testing

### Usuarios de Prueba

```
GH:
Email: gh@kare.com
Password: 123456

Colaborador:
Email: colab1@kare.com
Password: 123456
```

## 📚 Documentación Adicional

- [Arquitectura del Sistema](./docs/ARCHITECTURE.md)
- [Integración con API](./docs/API_INTEGRATION.md)
- [Manual de Usuario](./docs/USER_MANUAL.md)

## 🤝 Contribuciones

### Estándares de Código

- **TypeScript**: Tipado estricto, evitar `any`
- **Naming**: camelCase para variables, PascalCase para componentes
- **Imports**: Orden alfabético, paths absolutos cuando sea posible
- **Componentes**: Un componente por archivo
- **Hooks personalizados**: Prefijo `use`

### Estructura de Commits

```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Formateo, sin cambios de código
refactor: Refactorización de código
test: Añadir o modificar tests
chore: Mantenimiento
```

## 📝 Licencia

Proyecto académico - Universidad

## 👨‍💻 Autor

Desarrollado por Carlos DB
