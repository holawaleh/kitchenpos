import apiClient
from "../../../lib/api-client";

import {
  PaginatedResponse,
  PosProduct,
} from "../types/pos.types";

export async function getPosProducts(
  search = "",
  page = 1
): Promise<
  PaginatedResponse<PosProduct>
> {
  const response =
    await apiClient.get(
      "/products/pos/",
      {
        params: {
          search,
          page,
        },
      }
    );

  return response.data;
}