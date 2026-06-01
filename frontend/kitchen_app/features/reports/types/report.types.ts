export interface DashboardSummary {
  today_sales: number;

  today_transactions: number;

  total_products: number;

  low_stock_count: number;

  unpaid_sales_count: number;

  outstanding_balance: number;
}

export interface DailySalesReport {
  date: string;

  transactions: number;

  total_sales: number;

  total_received_today: number;

  total_balance: number;
}

export interface DebtSummary {
  partial_sales: number;

  unpaid_sales: number;

  total_outstanding: number;
}

export interface PaymentSummary {
  cash?: number;

  transfer?: number;

  card?: number;
}

export interface TopProduct {
  product_name_snapshot: string;

  total_quantity: number;

  total_sales: number;

  transaction_count: number;
}

export interface RevenueSummary {
  today_revenue: number;

  total_revenue: number;

  paid_revenue: number;

  outstanding_debt: number;

  today_transactions: number;

  total_transactions: number;

  paid_sales: number;

  debt_sales: number;
}
