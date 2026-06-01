export interface InventoryProduct {
  id: number;

  name: string;

  barcode?: string;
}

export interface InventoryItem {
  id: number;

  product: InventoryProduct;

  quantity: string;

  low_stock_threshold: string;

  updated_at: string;
}

export interface InventoryMovement {
  id: number;

  product: InventoryProduct;

  movement_type: "IN" | "OUT";

  quantity: string;

  note: string;

  performed_by: string;

  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;

  next: string | null;

  previous: string | null;

  results: T[];
}

export interface StockAdjustmentPayload {
  product_id: number;

  quantity: number;

  note?: string;
}