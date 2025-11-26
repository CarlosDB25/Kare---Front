// API Endpoints constants
export const API_ENDPOINTS = {
  // Auth (3 endpoints)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },

  // Incapacidades (8 endpoints)
  INCAPACIDADES: {
    BASE: '/incapacidades',
    BY_ID: (id: number) => `/incapacidades/${id}`,
    ESTADO: (id: number) => `/incapacidades/${id}/estado`,
    DOCUMENTO: (id: number) => `/incapacidades/${id}/documento`,
    VALIDAR_DOCUMENTO: '/incapacidades/validar-documento',
  },

  // Notificaciones (5 endpoints)
  NOTIFICACIONES: {
    BASE: '/notificaciones',
    BY_ID: (id: number) => `/notificaciones/${id}`,
    NO_LEIDAS_COUNT: '/notificaciones/no-leidas/count',
    LEER: (id: number) => `/notificaciones/${id}/leer`,
    LEER_TODAS: '/notificaciones/leer-todas',
  },

  // Conciliaciones (6 endpoints)
  CONCILIACIONES: {
    BASE: '/conciliaciones',
    BY_ID: (id: number) => `/conciliaciones/${id}`,
    BY_INCAPACIDAD: (incapacidadId: number) =>
      `/conciliaciones/incapacidad/${incapacidadId}`,
    ESTADISTICAS: '/conciliaciones/estadisticas',
  },

  // Reemplazos (8 endpoints)
  REEMPLAZOS: {
    BASE: '/reemplazos',
    BY_ID: (id: number) => `/reemplazos/${id}`,
    MIS_REEMPLAZOS: '/reemplazos/mis-reemplazos',
    BY_INCAPACIDAD: (incapacidadId: number) =>
      `/reemplazos/incapacidad/${incapacidadId}`,
    ESTADISTICAS: '/reemplazos/estadisticas',
    FINALIZAR: (id: number) => `/reemplazos/${id}/finalizar`,
    CANCELAR: (id: number) => `/reemplazos/${id}/cancelar`,
  },

  // Usuarios (2 endpoints)
  USUARIOS: {
    BASE: '/usuarios',
    BY_ID: (id: number) => `/usuarios/${id}`,
  },
} as const;
