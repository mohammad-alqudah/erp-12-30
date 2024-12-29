import { api } from './baseApi';
import { AssetsInventoryResponse, OpenAssetsInventoryResponse } from '../../types/assetsInventory';

export const getAssetsInventories = async (page = 1): Promise<AssetsInventoryResponse> => {
  const response = await api.get(`/features/inventory/asset/inventory/?page=${page}`);
  return response.data;
};

export const openAssetsInventory = async (name: string): Promise<OpenAssetsInventoryResponse> => {
  const formData = new FormData();
  formData.append('name', name);
  const response = await api.post('/features/inventory/asset/inventory/', formData);
  return response.data;
};

export const closeAssetsInventory = async (id: number) => {
  const response = await api.post(`/features/inventory/asset/inventory/${id}/close/`);
  return response.data;
};

export const exportAssetsInventory = async (id: number): Promise<Blob> => {
  const response = await api.get(`/features/inventory/asset/export_inventory/${id}/`, {
    responseType: 'blob'
  });
  return response.data;
};