import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';

export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: number;
  created_at: string; // Backend devuelve created_at con guion bajo
  incapacidad_id?: number;
  incapacidad_tipo?: string;
  incapacidad_estado?: string;
}

export interface CreateNotificacionData {
  usuario_id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  incapacidad_id?: number;
}

class NotificacionService {
  // GET /notificaciones - Ver mis notificaciones
  async getAll(): Promise<Notificacion[]> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICACIONES.BASE);
    return response.data.data;
  }

  // GET /notificaciones/no-leidas/count - Contador
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICACIONES.BASE}/no-leidas/count`);
    return response.data.data.count;
  }

  // PUT /notificaciones/:id/leer - Marcar como leída
  async markAsRead(id: number): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.NOTIFICACIONES.BASE}/${id}/leer`);
  }

  // PUT /notificaciones/leer-todas - Marcar todas como leídas
  async markAllAsRead(): Promise<number> {
    const response = await apiClient.put(`${API_ENDPOINTS.NOTIFICACIONES.BASE}/leer-todas`);
    return response.data.data.count;
  }

  // DELETE /notificaciones/:id - Eliminar
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.NOTIFICACIONES.BASE}/${id}`);
  }

  // POST /notificaciones - Crear notificación manual
  async create(data: CreateNotificacionData): Promise<Notificacion> {
    const response = await apiClient.post(API_ENDPOINTS.NOTIFICACIONES.BASE, data);
    return response.data.data;
  }
}

export const notificacionService = new NotificacionService();
