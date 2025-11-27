# KARE - Sistema de Gestión de Incapacidades Médicas

## 📋 Descripción

KARE es una aplicación web para la gestión integral de incapacidades médicas, reemplazos de personal y conciliaciones financieras. Permite a las organizaciones controlar de manera eficiente las ausencias laborales por motivos de salud, gestionar reemplazos temporales y realizar el cálculo automático de los costos asociados a las incapacidades según la normativa laboral colombiana.

## 🚀 Características Principales

### 👥 Gestión de Usuarios
- **Roles diferenciados**: Colaborador, Líder, Gestión Humana (GH), Contabilidad
- **Registro público**: Los usuarios pueden auto-registrarse como colaboradores
- **Gestión de perfiles**: Información completa de empleados (documento, área, cargo, salario, IBC)
- **Filtrado por área**: Líderes solo ven usuarios de su área asignada

### 📄 Incapacidades
- **Creación y seguimiento**: Los colaboradores pueden reportar incapacidades
- **Análisis con OCR**: Extracción automática de datos de documentos médicos
- **Estados del ciclo**: Reportada → En Revisión → Validada → Rechazada/Pagada → Conciliada → Archivada
- **Validaciones automáticas**: Verificación de datos extraídos vs perfil del usuario
- **Adjuntos**: Soporte para documentos PDF e imágenes (JPG, PNG)
- **Filtrado por área**: Líderes solo ven incapacidades de colaboradores de su área

### 🔄 Reemplazos
- **Asignación inteligente**: Selección de reemplazos disponibles (sin incapacidad activa, no reemplazando a nadie)
- **Gestión de fechas**: Control de períodos de reemplazo
- **Finalización y cancelación**: Control del ciclo de vida del reemplazo
- **Notificaciones**: Alertas automáticas para todos los involucrados
- **Filtrado por área**: Líderes solo gestionan reemplazos de su área
- **Disponibilidad automática**: Solo aparecen incapacidades y colaboradores disponibles

### 💰 Conciliaciones
- **Cálculo automático**: Genera el desglose financiero de cada incapacidad
- **Distribución de costos**: Calcula qué paga la empresa (días 1-2 al 66.67%) y qué paga la EPS (desde día 3 al 66.67%)
- **Estadísticas**: Visualización de totales conciliados y promedios
- **Seguimiento**: Registro histórico de todas las conciliaciones generadas

### 🔔 Notificaciones
- **Sistema en tiempo real**: Actualización cada 10 segundos
- **Tipos**: Info, Success, Warning, Error
- **Acciones directas**: Navegación a incapacidades desde notificaciones
- **Contador visual**: Badge con notificaciones no leídas

### 📊 Dashboard
- **Estadísticas en tiempo real**: Resumen de incapacidades por estado
- **Dashboards personalizados por rol**:
  - **Líderes**: Solo datos de su área + gráficas (estados, reemplazos por colaborador)
  - **Contabilidad**: Datos globales + gráficas financieras (distribución costos, conciliaciones/mes)
  - **GH**: Datos completos del sistema + gráficas generales
- **Visualización gráfica**: Gráficos de pastel y barras según rol

### 📊 Reportes
- **Generación de PDF**: Reportes exportables en formato PDF
- **Reportes por rol**:
  - **GH**: Reporte General (todo el sistema)
  - **Contabilidad**: Reporte Financiero (conciliaciones y costos)
  - **Líderes**: Reporte de Equipo (solo su área)
- **Filtros**: Por rango de fechas
- **Estadísticas y gráficas**: Cards resumen + gráficas visuales
- **Personalización**: Nombre de empresa configurable

### ⚙️ Configuración
- **Nombre de empresa**: Configurable por GH para reportes
- **Persistencia**: Guardado en localStorage

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
- **jsPDF**: Generación de documentos PDF
- **html2canvas**: Captura de elementos HTML para PDF
- **recharts**: Librería de gráficas para visualizaciones

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
│   │   ├── conciliaciones/
│   │   │   ├── pages/
│   │   │   │   └── ConciliacionesPage.tsx
│   │   │   └── types/
│   │   │       └── conciliacion.types.ts
│   │   │
│   │   ├── reportes/
│   │   │   └── pages/
│   │   │       └── ReportesPage.tsx
│   │   │
│   │   └── configuracion/
│   │       └── pages/
│   │           └── ConfiguracionPage.tsx
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
| **Líder** | `lider` | - Todo lo de Colaborador<br>- Ver incapacidades de su área<br>- Ver reemplazos de su área<br>- Crear/finalizar/cancelar reemplazos<br>- Ver usuarios de su área<br>- Dashboard y reportes de su área |
| **Gestión Humana** | `gh` | - Todo lo anterior (sin restricción de área)<br>- Aprobar/rechazar incapacidades<br>- Análisis OCR de documentos<br>- Gestionar todos los usuarios<br>- Editar información de usuarios<br>- Configurar sistema<br>- Dashboard y reportes globales |
| **Contabilidad** | `conta` | - Ver todas las incapacidades<br>- Gestionar conciliaciones<br>- Ver reemplazos<br>- Dashboard financiero<br>- Reportes financieros |

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
Estado: REPORTADA
    ↓
GH revisa → EN_REVISION
    ↓
GH valida → VALIDADA / RECHAZADA
    ↓
Conta verifica pago → PAGADA
    ↓
Sistema genera conciliación → CONCILIADA
    ↓
Opcional: ARCHIVADA (para historial)
```

### 2. Gestión de Reemplazos (con Filtrado por Área)

```
Líder identifica incapacidad de su área
    ↓
Selecciona incapacidad disponible (sin reemplazo activo)
    ↓
Selecciona colaborador disponible:
  - Sin incapacidad activa
  - No está reemplazando a nadie
  - Es colaborador activo
    ↓
Define fechas y funciones
    ↓
Crea reemplazo → Notificaciones enviadas
    ↓
Opciones:
  - Finalizar (cuando regresa el colaborador)
  - Cancelar (con motivo obligatorio)
```

### 3. Análisis OCR

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

### 4. Generación de Reportes

```
Usuario accede a Reportes
    ↓
Sistema asigna tipo según rol:
  - GH: Reporte General
  - Conta: Reporte Financiero
  - Líder: Reporte de Equipo (su área)
    ↓
Usuario selecciona filtros (fechas)
    ↓
Click en "Generar PDF"
    ↓
Sistema filtra datos:
  - Líder: Solo datos de su área
  - Otros: Según permisos
    ↓
Genera PDF con:
  - Cards estadísticas
  - Gráficas visuales
  - Nombre de empresa
    ↓
Descarga automática
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
  FINALIZAR: (id) => `/reemplazos/${id}/finalizar`,
  CANCELAR: (id) => `/reemplazos/${id}/cancelar`,
}

NOTIFICACIONES: {
  BASE: '/notificaciones',
  MARK_READ: (id) => `/notificaciones/${id}/marcar-leida`,
  MARK_ALL_READ: '/notificaciones/marcar-todas-leidas',
  UNREAD_COUNT: '/notificaciones/no-leidas/cantidad',
}

USUARIOS: {
  BASE: '/usuarios',
  BY_ID: (id) => `/usuarios/${id}`,
  UPDATE_DATA: (id) => `/usuarios/${id}/completar-datos`,
  CHANGE_ROLE: (id) => `/usuarios/${id}/cambiar-rol`,
}

CONCILIACIONES: {
  BASE: '/conciliaciones',
  BY_ID: (id) => `/conciliaciones/${id}`,
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
