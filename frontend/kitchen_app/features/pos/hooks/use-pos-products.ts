"use client";

import {
  useEffect,
  useState,
} from "react";

import { getPosProducts }
from "../services/pos.service";

import {
  getApiErrorMessage,
} from "@/services/api/client";

import { PosProduct }
from "../types/pos.types";

export function usePosProducts(
  page = 1
) {
  const [
    products,
    setProducts,
  ] = useState<
    PosProduct[]
  >([]);

  const [count, setCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  async function fetchProducts() {
    try {
      setLoading(true);

      const response =
        await getPosProducts(
          search,
          page
        );

      setProducts(
        response.results
      );

      setCount(
        response.count
      );

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        getApiErrorMessage(
          err,
          "Failed to load products"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  return {
    products,
    count,
    loading,
    error,
    search,
    setSearch,
    refresh: fetchProducts,
  };
}
