import { api } from './baseApi';
import { AssetsResponse, Asset } from '../../types/asset';

export const getAssets = async (page = 1, search = ''): Promise<AssetsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) {
    params.append('search', search);
  }
  const response = await api.get(`/asset/assets/?${params.toString()}`);
  return response.data;
};

export const addAsset = async (data: FormData) => {
  const response = await api.post('/asset/assets/', data);
  return response.data;
};

export const updateAsset = async (id: number, data: FormData) => {
  const response = await api.put(`/asset/assets/${id}/`, data);
  return response.data;
};

export const deleteAsset = async (id: number) => {
  const response = await api.delete(`/asset/assets/${id}/`);
  return response.data;
};

export const getAssetById = async (id: number): Promise<Asset> => {
  const response = await api.get(`/asset/assets/${id}/`);
  return response.data;
};