import { api } from './baseApi';
import { InventoryResponse } from '../../types/inventory';

export const getInventories = async (page = 1): Promise<InventoryResponse> => {
  const response = await api.get<InventoryResponse>(`/features/inventory/inventory/?page=${page}`);
  return response.data;
};

export const openInventory = async (name: string) => {
  const formData = new FormData();
  formData.append('name', name);
  const response = await api.post('/features/inventory/inventory/', formData);
  return response.data;
};

export const closeInventory = async (id: number) => {
  const response = await api.post(`/features/inventory/inventory/${id}/close/`);
  return response.data;
};

export const exportInventory = async (inventoryId: number) => {
  const response = await api.get(`/features/inventory/export_inventory/${inventoryId}/`, {
    responseType: 'blob'
  });
  return response.data;
};