import apiClient
from "@/lib/api-client";

import {
  ApiResponse,
  PaginatedResponse,
} from "@/types/api.types";

import {
  Sale,
  RepaymentPayload,
} from "../types/sales.types";

export async function getSales(
  search = "",
  status = "",
  page = 1
): Promise<
  PaginatedResponse<Sale>
> {
  const response =
    await apiClient.get(
      "/sales/",
      {
        params: {
          search,
          payment_status:
            status,
          page,
        },
      }
    );

  return response.data;
}

export async function repaySale(
  payload: RepaymentPayload
) {
  const response =
    await apiClient.post<
      ApiResponse<Sale>
    >(
      "/payment/repay/",
      payload
    );

  return response.data;
}