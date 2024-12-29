import { api } from './baseApi';
import { CategoryResponse } from '../../types/asset';

// Get all categories
export const getCategories = async (): Promise<CategoryResponse> => {
  const response = await api.get('/asset/categories/');
  return response.data;
};

// Add main category
export const addCategory = async (data: FormData) => {
  const response = await api.post('/asset/categories/', data);
  return response.data;
};

// Add sub category
export const addSubCategory = async (data: FormData) => {
  const response = await api.post('/asset/subcategories/', data);
  return response.data;
};

// Update main category
export const updateCategory = async (id: number, data: FormData) => {
  const response = await api.put(`/asset/categories/${id}/`, data);
  return response.data;
};

// Update sub category
export const updateSubCategory = async (id: number, data: FormData) => {
  const response = await api.put(`/asset/subcategories/${id}/`, data);
  return response.data;
};