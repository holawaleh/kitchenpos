export interface Product {
  id: number;

  name: string;

  barcode: string;

  image: string | null;

  default_price: number;

  product_type:
    | "COUNTABLE"
    | "FLEXIBLE";

  status:
    | "AVAILABLE"
    | "FINISHED";

  is_active?: boolean;

  created_at?: string;

  menu?: {
    id: number;

    name: string;
  } | null;
}

export interface CreateProductPayload {
  name: string;

  barcode: string;

  default_price: number;

  product_type:
    | "COUNTABLE"
    | "FLEXIBLE";

  status:
    | "AVAILABLE"
    | "FINISHED";

  menu_id?: number;
}

export interface PaginatedResponse<T> {
  count: number;

  next: string | null;

  previous: string | null;

  results: T[];
}