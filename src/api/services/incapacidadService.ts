import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  Incapacidad,
  CreateIncapacidadData,
  UpdateEstadoData,
  IncapacidadEstadisticas,
} from '../../features/incapacidades/types/incapacidad.types';

class IncapacidadService {
  // GET /incapacidades - Listar todas
  async getAll(): Promise<Incapacidad[]> {
    const response = await apiClient.get(API_ENDPOINTS.INCAPACIDADES.BASE);
    return response.data.data;
  }

  // GET /incapacidades/:id - Obtener por ID
  async getById(id: number): Promise<Incapacidad> {
    const response = await apiClient.get(API_ENDPOINTS.INCAPACIDADES.BY_ID(id));
    return response.data.data;
  }

  // POST /incapacidades - Crear nueva
  async create(data: CreateIncapacidadData): Promise<Incapacidad> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await apiClient.post(
      API_ENDPOINTS.INCAPACIDADES.BASE,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  }

  // PUT /incapacidades/:id - Actualizar
  async update(id: number, data: Partial<CreateIncapacidadData>): Promise<Incapacidad> {
    const response = await apiClient.put(
      API_ENDPOINTS.INCAPACIDADES.BY_ID(id),
      data
    );
    return response.data.data;
  }

  // DELETE /incapacidades/:id - Eliminar
  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.INCAPACIDADES.BY_ID(id));
  }

  // PUT /incapacidades/:id/estado - Cambiar estado
  async updateEstado(id: number, data: UpdateEstadoData): Promise<Incapacidad> {
    const response = await apiClient.put(
      API_ENDPOINTS.INCAPACIDADES.ESTADO(id),
      data
    );
    return response.data.data;
  }

  // GET /incapacidades/estadisticas - Obtener estadísticas
  async getEstadisticas(): Promise<IncapacidadEstadisticas> {
    const response = await apiClient.get(`${API_ENDPOINTS.INCAPACIDADES.BASE}/estadisticas`);
    return response.data.data;
  }

  // GET /incapacidades/:id/documento - Ver documento (con token)
  async downloadDocument(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const url = `${API_ENDPOINTS.INCAPACIDADES.BASE}/${id}/documento`;
    
    // Usar fetch con token en header
    const response = await fetch(`https://kare-back.onrender.com/api${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener el documento');
    }

    // Crear blob y abrir en nueva pestaña (no forzar descarga)
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    
    // Limpiar después de un tiempo
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  }

  // POST /incapacidades/validar-documento - Analizar documento con OCR
  async analyzeDocument(id: number): Promise<any> {
    // Primero obtener el documento
    const token = localStorage.getItem('token');
    const docUrl = `${API_ENDPOINTS.INCAPACIDADES.BASE}/${id}/documento`;
    
    const docResponse = await fetch(`https://kare-back.onrender.com/api${docUrl}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!docResponse.ok) {
      throw new Error('No se pudo obtener el documento para análisis');
    }

    const blob = await docResponse.blob();
    
    // Obtener el nombre del archivo desde el header Content-Disposition o usar extensión del tipo MIME
    let fileName = 'documento';
    const contentDisposition = docResponse.headers.get('Content-Disposition');
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
      }
    }
    
    // Si no hay nombre, usar extensión según tipo MIME
    if (fileName === 'documento') {
      const extension = blob.type === 'application/pdf' ? '.pdf' : 
                       blob.type === 'image/jpeg' ? '.jpg' :
                       blob.type === 'image/png' ? '.png' : '';
      fileName = `documento${extension}`;
    }
    
    const file = new File([blob], fileName, { type: blob.type });

    // Enviar a validar-documento con el ID de la incapacidad
    const formData = new FormData();
    formData.append('documento', file);
    formData.append('incapacidad_id', id.toString());

    const response = await apiClient.post('/incapacidades/validar-documento', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }
}

export const incapacidadService = new IncapacidadService();
