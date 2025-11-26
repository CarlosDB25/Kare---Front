// src/features/conciliaciones/types/conciliacion.types.ts
// Tipos para conciliaciones financieras

export interface Conciliacion {
  id: number;
  incapacidad_id: number;
  dias_incapacidad: number;
  salario_base: number;
  ibc: number;
  valor_dia: number;
  dias_empresa_67: number;
  monto_empresa_67: number;
  dias_eps_100: number;
  monto_eps_100: number;
  dias_arl_100: number;
  monto_arl_100: number;
  total_a_pagar: number;
  observaciones?: string;
  created_at: string;
  updated_at?: string;
  
  // Datos relacionados (JOIN)
  incapacidad_tipo?: string;
  colaborador_nombre?: string;
}

export interface CreateConciliacionData {
  incapacidad_id: number;
  dias_incapacidad: number;
  salario_base: number;
  ibc: number;
  valor_dia: number;
  dias_empresa_67: number;
  monto_empresa_67: number;
  dias_eps_100: number;
  monto_eps_100: number;
  dias_arl_100: number;
  monto_arl_100: number;
  total_a_pagar: number;
  observaciones?: string;
}

export interface UpdateConciliacionData {
  observaciones?: string;
  valor_total?: number;
}

export interface ConciliacionEstadisticas {
  total_conciliaciones: number;
  valor_total_conciliado: number;
  valor_promedio: number;
  total_pagado_empresa: number;
  total_pagado_eps: number;
  promedio_dias: number;
}

export interface ConciliacionFiltros {
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface CalculoConciliacion {
  dias_incapacidad: number;
  salario_base: number;
  ibc: number;
  valor_dia: number;
  dias_empresa: number;
  porcentaje_empresa: number;
  valor_empresa: number;
  dias_eps: number;
  porcentaje_eps: number;
  valor_eps: number;
  dias_arl: number;
  valor_arl: number;
  valor_total: number;
  desglose_detallado: DesgloseTramo[];
  normativa_aplicada: string;
}

export interface DesgloseTramo {
  dias: string;
  cantidad_dias: number;
  porcentaje: number;
  quien_paga: string;
  valor: number;
  nota?: string;
}
