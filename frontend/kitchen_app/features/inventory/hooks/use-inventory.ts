"use client";

import {
  useEffect,
  useState,
} from "react";

import { getInventory }
from "../services/inventory.service";

import { InventoryItem }
from "../types/inventory.types";

export function useInventory(
  page = 1
) {
  const [
    inventory,
    setInventory,
  ] = useState<
    InventoryItem[]
  >([]);

  const [count, setCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  async function fetchInventory() {
    try {
      setLoading(true);

      const response =
        await getInventory(
          search,
          page
        );

      setInventory(
        response.results
      );

      setCount(
        response.count
      );

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Failed to load inventory"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, [search, page]);

  return {
    inventory,
    count,
    loading,
    error,
    search,
    setSearch,
    refresh: fetchInventory,
  };
}