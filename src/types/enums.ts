// Tipos de roles
export type UserRole = 'gh' | 'conta' | 'lider' | 'colaborador';

// Tipos de incapacidad
export type TipoIncapacidad =
  | 'EPS'
  | 'ARL'
  | 'Licencia_Maternidad'
  | 'Licencia_Paternidad';

// Estados de incapacidad
export type EstadoIncapacidad =
  | 'reportada'
  | 'en_revision'
  | 'validada'
  | 'rechazada'
  | 'conciliada'
  | 'pagada'
  | 'archivada';

// Tipos de notificación
export type TipoNotificacion = 'info' | 'success' | 'warning' | 'error';

// Estados de reemplazo
export type EstadoReemplazo = 'activo' | 'finalizado' | 'cancelado';
