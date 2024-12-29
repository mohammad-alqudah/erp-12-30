export interface AssetsInventory {
  id: number;
  name: string;
  open_by: string;
  created_at: string;
  is_open: boolean;
}

export interface AssetsInventoryResponse {
  next: number | null;
  previous: number | null;
  count: number;
  data: AssetsInventory[];
  status: boolean;
  detail: string | null;
}

export interface OpenAssetsInventoryResponse {
  data: AssetsInventory;
  status: boolean;
  detail: string | null;
}