import { api } from './baseApi';
import { Product, ProductsResponse } from '../../types/product';
import { createFormData } from '../../utils/formData';
import { SortDirection } from '../../hooks/products/useProductsTable';

export const getProducts = async (
  page = 1, 
  search?: string, 
  inventoryId?: number,
  orderBy?: string,
  orderDirection?: SortDirection,
  notInventoryItems?: boolean
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (search) {
    params.append('search', search);
  }
  if (inventoryId) {
    params.append('inventory_id', inventoryId.toString());
    if (notInventoryItems) {
      params.append('not_inventory_items', 'True');
    }
  }
  if (orderBy) {
    params.append('order_by', orderBy);
    params.append('order_direction', orderDirection || 'desc');
  }
  const response = await api.get<ProductsResponse>(`/products/products/?${params.toString()}`);
  return response.data;
};

export const addProduct = async (product: Partial<Product>) => {
  const formData = createFormData(product);
  const response = await api.post('/products/products/', formData);
  return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const formData = createFormData(product);
  const response = await api.put(`/products/products/${id}/`, formData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/products/${id}/`);
  return response.data;
};