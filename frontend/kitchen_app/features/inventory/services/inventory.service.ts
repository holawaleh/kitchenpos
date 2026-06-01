import apiClient
from "@/lib/api-client";

import {
  InventoryItem,
  StockAdjustmentPayload,
} from "../types/inventory.types";

import {
  PaginatedResponse,
} from "@/types/api.types";

export async function getInventory(
  search = "",
  page = 1
): Promise<
  PaginatedResponse<InventoryItem>
> {
  const response =
    await apiClient.get(
      "/inventory/",
      {
        params: {
          search,
          page,
        },
      }
    );

  return response.data;
}

export async function addStock(
  payload: StockAdjustmentPayload
) {
  const response =
    await apiClient.post(
      "/inventory/add-stock/",
      payload
    );

  return response.data;
}

export async function deductStock(
  payload: StockAdjustmentPayload
) {
  const response =
    await apiClient.post(
      "/inventory/deduct-stock/",
      payload
    );

  return response.data;
}