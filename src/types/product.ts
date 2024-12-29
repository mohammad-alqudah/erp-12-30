export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: string;
  total_quantity: number;
  total_inventory_quantity: number;
}

export interface ProductsResponse {
  next: number | null;
  previous: number | null;
  count: number;
  data: Product[];
  status: boolean;
  detail: null | string;
}