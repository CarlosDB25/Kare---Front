import { apiClient } from '../client';

export interface OCRExtractionResult {
  tipo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  diagnostico?: string;
  confianza?: number;
  texto_completo?: string;
}

class OCRService {
  // POST /incapacidades/validar-documento - Validar documento con OCR
  async extractData(file: File): Promise<OCRExtractionResult> {
    const formData = new FormData();
    formData.append('documento', file);

    const response = await apiClient.post('/incapacidades/validar-documento', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  }
}

export const ocrService = new OCRService();
