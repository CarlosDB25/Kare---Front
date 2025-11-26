import { apiClient } from '../client';

export interface Reemplazo {
  id: number;
  incapacidad_id: number;
  colaborador_reemplazo_id: number;
  nombre_ausente: string;
  nombre_reemplazo: string;
  fecha_inicio: string;
  fecha_fin: string;
  funciones_asignadas: string;
  estado: 'activo' | 'finalizado' | 'cancelado';
  observaciones?: string;
}

export interface CreateReemplazoData {
  incapacidad_id: number;
  colaborador_reemplazo_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  funciones_asignadas: string;
  observaciones?: string;
}

export interface ReemplazoEstadisticas {
  total: number;
  activos: number;
  finalizados: number;
  cancelados: number;
}

class ReemplazoService {
  // POST /reemplazos - Crear
  async create(data: CreateReemplazoData): Promise<Reemplazo> {
    const response = await apiClient.post('/reemplazos', data);
    return response.data.data;
  }

  // GET /reemplazos - Listar
  async getAll(): Promise<Reemplazo[]> {
    const response = await apiClient.get('/reemplazos');
    return response.data.data;
  }

  // GET /reemplazos/:id - Por ID
  async getById(id: number): Promise<Reemplazo> {
    const response = await apiClient.get(`/reemplazos/${id}`);
    return response.data.data;
  }

  // GET /reemplazos/mis-reemplazos - Mis reemplazos activos
  async getMisReemplazos(): Promise<Reemplazo[]> {
    const response = await apiClient.get('/reemplazos/mis-reemplazos');
    return response.data.data;
  }

  // GET /reemplazos/incapacidad/:id - Por incapacidad
  async getByIncapacidad(incapacidadId: number): Promise<Reemplazo[]> {
    const response = await apiClient.get(`/reemplazos/incapacidad/${incapacidadId}`);
    return response.data.data;
  }

  // GET /reemplazos/estadisticas - Estadísticas
  async getEstadisticas(): Promise<ReemplazoEstadisticas> {
    const response = await apiClient.get('/reemplazos/estadisticas');
    return response.data.data;
  }

  // PUT /reemplazos/:id/finalizar - Finalizar
  async finalizar(id: number, observaciones?: string): Promise<Reemplazo> {
    const response = await apiClient.put(`/reemplazos/${id}/finalizar`, { observaciones });
    return response.data.data;
  }

  // PUT /reemplazos/:id/cancelar - Cancelar
  async cancelar(id: number, motivo: string): Promise<Reemplazo> {
    const response = await apiClient.put(`/reemplazos/${id}/cancelar`, { motivo });
    return response.data.data;
  }
}

export const reemplazoService = new ReemplazoService();
