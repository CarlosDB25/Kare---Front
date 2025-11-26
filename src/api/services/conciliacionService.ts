import { apiClient } from '../client';

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

class ConciliacionService {
  // POST /conciliaciones - Crear
  async create(incapacidadId: number): Promise<Conciliacion> {
    const response = await apiClient.post('/conciliaciones', { incapacidad_id: incapacidadId });
    return response.data.data;
  }

  // POST /conciliaciones - Crear con datos completos
  async crear(data: CreateConciliacionData): Promise<Conciliacion> {
    const response = await apiClient.post('/conciliaciones', data);
    return response.data.data;
  }

  // GET /conciliaciones - Listar
  async getAll(): Promise<Conciliacion[]> {
    const response = await apiClient.get('/conciliaciones');
    return response.data.data;
  }

  // GET /conciliaciones - Listar con filtros
  async listar(filtros?: ConciliacionFiltros): Promise<Conciliacion[]> {
    const response = await apiClient.get('/conciliaciones', { params: filtros });
    return response.data.data;
  }

  // GET /conciliaciones/incapacidad/:id - Por incapacidad
  async getByIncapacidad(incapacidadId: number): Promise<Conciliacion> {
    const response = await apiClient.get(`/conciliaciones/incapacidad/${incapacidadId}`);
    return response.data.data;
  }

  // GET /conciliaciones/incapacidad/:id - Por incapacidad (puede retornar null)
  async obtenerPorIncapacidad(incapacidadId: number): Promise<Conciliacion | null> {
    try {
      const response = await apiClient.get(`/conciliaciones/incapacidad/${incapacidadId}`);
      return response.data.data;
    } catch {
      return null;
    }
  }

  // GET /conciliaciones/estadisticas - Estadísticas
  async getEstadisticas(): Promise<ConciliacionEstadisticas> {
    const response = await apiClient.get('/conciliaciones/estadisticas');
    return response.data.data;
  }

  // GET /conciliaciones/estadisticas - Estadísticas (alias)
  async obtenerEstadisticas(): Promise<ConciliacionEstadisticas> {
    return this.getEstadisticas();
  }

  // PUT /conciliaciones/:id - Actualizar
  async update(id: number, data: Partial<CreateConciliacionData>): Promise<Conciliacion> {
    const response = await apiClient.put(`/conciliaciones/${id}`, data);
    return response.data.data;
  }

  // PUT /conciliaciones/:id - Actualizar (alias)
  async actualizar(id: number, data: Partial<CreateConciliacionData>): Promise<void> {
    await apiClient.put(`/conciliaciones/${id}`, data);
  }
}

export const conciliacionService = new ConciliacionService();
