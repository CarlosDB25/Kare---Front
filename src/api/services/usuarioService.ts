import { apiClient } from '../client';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'colaborador' | 'lider' | 'gh' | 'conta';
  area: string | null;
  cargo: string | null;
  ibc: number | null;
  salario: number | null;
  created_at?: string;
}

class UsuarioService {
  // GET /usuarios - Listar todos
  async getAll(): Promise<Usuario[]> {
    const response = await apiClient.get('/usuarios');
    return response.data.data;
  }

  // PUT /usuarios/:id/rol - Cambiar rol
  async updateRol(id: number, rol: string): Promise<Usuario> {
    const response = await apiClient.put(`/usuarios/${id}/rol`, { rol });
    return response.data.data;
  }

  // PUT /usuarios/:id/completar-datos - Completar datos del usuario
  async completarDatos(id: number, datos: {
    salario_base?: number;
    ibc?: number;
    area?: string;
    cargo?: string;
  }): Promise<Usuario> {
    const response = await apiClient.put(`/usuarios/${id}/completar-datos`, datos);
    return response.data.data;
  }
}

export const usuarioService = new UsuarioService();
