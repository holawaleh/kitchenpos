import apiClient
from "@/lib/api-client";

export async function markReceiptPrinted(
  saleId: number
) {
  const response =
    await apiClient.post(
      `/sales/${saleId}/mark-receipt-printed/`
    );

  return response.data;
}