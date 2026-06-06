export interface SaleItem {
  product_name: string;

  quantity: number;

  unit_price: number;

  subtotal: number;
}

export interface Payment {
  id?: number;

  amount: number;

  payment_method: string;

  payment_type?: "INITIAL" | "REPAYMENT";

  sequence_number?: number;

  reference?: string | null;

  note?: string | null;

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

  receipt_printed?: boolean;

  total_amount: number;

  paid_amount?: number;

  amount_paid: number;

  balance: number;

  repayment_count?: number;

  remaining_repayment_slots?: number;

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
