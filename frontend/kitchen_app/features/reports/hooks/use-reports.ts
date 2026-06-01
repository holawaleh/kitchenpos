"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getDailySales,
  getDebtSummary,
  getPaymentSummary,
  getTopProducts,
} from "../services/report.service";

import {
  getApiErrorMessage,
} from "@/services/api/client";

import {
  DailySalesReport,
  DebtSummary,
  PaymentSummary,
  TopProduct,
} from "../types/report.types";

export function useReports() {
  const [
    dailySales,
    setDailySales,
  ] =
    useState<DailySalesReport | null>(
      null
    );

  const [
    debtSummary,
    setDebtSummary,
  ] =
    useState<DebtSummary | null>(
      null
    );

  const [
    paymentSummary,
    setPaymentSummary,
  ] =
    useState<PaymentSummary | null>(
      null
    );

  const [
    topProducts,
    setTopProducts,
  ] = useState<
    TopProduct[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function fetchReports() {
    try {
      setLoading(true);

      const [
        daily,
        debt,
        payment,
        products,
      ] = await Promise.all([
        getDailySales(),
        getDebtSummary(),
        getPaymentSummary(),
        getTopProducts(),
      ]);

      setDailySales(daily);

      setDebtSummary(debt);

      setPaymentSummary(
        payment
      );

      setTopProducts(
        products
      );

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          "Failed to load reports"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    dailySales,
    debtSummary,
    paymentSummary,
    topProducts,
    loading,
    error,
    refresh:
      fetchReports,
  };
}
