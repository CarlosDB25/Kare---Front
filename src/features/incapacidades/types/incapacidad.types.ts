import type { TipoIncapacidad, EstadoIncapacidad } from '../../../types/enums';

export interface Incapacidad {
  id: number;
  colaborador_id: number;
  usuario_id: number;
  usuario_nombre?: string;
  usuario_email?: string;
  usuario_documento?: string;
  area?: string;
  tipo: TipoIncapacidad;
  fecha_inicio: string;
  fecha_fin: string;
  dias_totales: number;
  diagnostico: string;
  documento_path?: string;
  documento_url?: string;
  ibc: number;
  valor_dia: number;
  porcentaje_empresa: number;
  porcentaje_eps: number;
  valor_total_empresa: number;
  valor_total_eps: number;
  estado: EstadoIncapacidad;
  observaciones?: string;
  procesada_por?: number;
  procesada_por_nombre?: string;
  fecha_procesamiento?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateIncapacidadData {
  colaborador_id: number;
  tipo: TipoIncapacidad;
  fecha_inicio: string;
  fecha_fin: string;
  diagnostico: string;
  documento?: File;
  ibc?: number;
  observaciones?: string;
}

export interface UpdateEstadoData {
  estado: EstadoIncapacidad;
  observaciones?: string;
}

export interface IncapacidadEstadisticas {
  total: number;
  reportadas: number;
  en_revision: number;
  validadas: number;
  rechazadas: number;
  pagadas: number;
  valor_total: number;
}
