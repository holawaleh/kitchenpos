export interface PosProduct {
  id: number;

  name: string;

  image: string | null;

  barcode: string | null;

  default_price: string;

  product_type: string;

  status: string;

  quantity: string;

  stock_status:
    | "IN_STOCK"
    | "LOW_STOCK"
    | "OUT_OF_STOCK";
}

export interface PaginatedResponse<T> {
  count: number;

  next: string | null;

  previous: string | null;

  results: T[];
}

export interface CartItem {
  product_id: number;

  name: string;

  price: number;

  quantity: number;

  subtotal: number;
}