"use client";

import {
  useEffect,
  useState,
} from "react";

import { getProducts } from "../services/product.service";

import {
  getApiErrorMessage,
} from "@/services/api/client";

import { Product } from "../types/product.types";

export function useProducts(
  page = 1
) {
  const [products, setProducts] =
    useState<Product[]>([]);

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
        await getProducts(
          search,
          page
        );

      setProducts(
        response.results
      );

      setCount(response.count);

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
