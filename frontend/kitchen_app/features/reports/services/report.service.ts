import apiClient
from "@/lib/api-client";

import {
  DashboardSummary,
  DailySalesReport,
  RevenueSummary,
  DebtSummary,
  PaymentSummary,
  TopProduct,
} from "../types/report.types";

export async function getDashboardSummary():
Promise<DashboardSummary> {
  const response =
    await apiClient.get(
      "/reports/dashboard-summary/"
    );

  return response.data;
}

export async function getDailySales():
Promise<DailySalesReport> {
  const response =
    await apiClient.get(
      "/reports/daily-sales/"
    );

  return response.data;
}

export async function getDebtSummary():
Promise<DebtSummary> {
  const response =
    await apiClient.get(
      "/reports/debt-summary/"
    );

  return response.data;
}

export async function getPaymentSummary():
Promise<PaymentSummary> {
  const response =
    await apiClient.get(
      "/reports/payment-summary/"
    );

  return response.data;
}

export async function getTopProducts():
Promise<TopProduct[]> {
  const response =
    await apiClient.get(
      "/reports/top-products/"
    );

  return response.data;
}

export async function getRevenueSummary():
Promise<RevenueSummary> {
  const response =
    await apiClient.get(
      "/reports/revenue-summary/"
    );

  return response.data;
}
