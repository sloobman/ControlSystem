import { apiClient } from './client';
import { Defect, CreateDefectRequest, UpdateDefectRequest, DashboardStats } from './types';

export const defectsApi = {
  getAll: async (): Promise<Defect[]> => {
    const response = await apiClient.get<Defect[]>('/defects');
    return response.data;
  },

  getById: async (id: string): Promise<Defect> => {
    const response = await apiClient.get<Defect>(`/defects/${id}`);
    return response.data;
  },

  create: async (data: CreateDefectRequest): Promise<Defect> => {
    const response = await apiClient.post<Defect>('/defects', data);
    return response.data;
  },

  update: async (id: string, data: UpdateDefectRequest): Promise<Defect> => {
    const response = await apiClient.patch<Defect>(`/defects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/defects/${id}`);
  },

  addComment: async (id: string, content: string): Promise<Defect> => {
    const response = await apiClient.post<Defect>(`/defects/${id}/comments`, { content });
    return response.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/defects/stats');
    return response.data;
  },
};
