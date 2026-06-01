import apiClient
from "@/lib/api-client";

export async function getSaleDetail(
  saleId: number
) {
  const response =
    await apiClient.get(
      `/sales/${saleId}/receipt/`
    );

  return response.data;
}