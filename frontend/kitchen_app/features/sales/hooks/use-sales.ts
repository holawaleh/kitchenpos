"use client";

import {
  useEffect,
  useState,
} from "react";

import { getSales }
from "../services/sales.service";

import { Sale }
from "../types/sales.types";

export function useSales(
  page = 1
) {
  const [sales, setSales] =
    useState<Sale[]>([]);

  const [count, setCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  async function fetchSales() {
    try {
      setLoading(true);

      const response =
        await getSales(
          search,
          status,
          page
        );

      setSales(
        response.results
      );

      setCount(
        response.count
      );

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load sales"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSales();
  }, [
    search,
    status,
    page,
  ]);

  return {
    sales,
    count,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    refresh:
      fetchSales,
  };
}