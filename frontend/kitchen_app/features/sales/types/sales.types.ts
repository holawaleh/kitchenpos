export interface SaleItem {
  product_name: string;

  quantity: number;

  unit_price: number;

  subtotal: number;
}

export interface Payment {
  amount: number;

  payment_method: string;

  created_at: string;
}

export interface Sale {
  id: number;

  receipt_number: string;

  customer_name: string;

  payment_method: string;

  payment_status:
    | "PAID"
    | "PARTIAL"
    | "UNPAID";

  total_amount: number;

  amount_paid: number;

  balance: number;

  created_at: string;

  items: SaleItem[];

  payments: Payment[];
}

export interface RepaymentPayload {

  sale_id: number;

  payment_method: string;

  amount: number;

  reference?: string;

  note?: string;
}