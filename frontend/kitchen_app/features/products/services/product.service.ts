import apiClient from "../../../lib/api-client";
import {
  CreateProductPayload,
  PaginatedResponse,
  Product,
} from "../types/product.types";

export async function getProducts(
  search = "",
  page = 1
): Promise<
  PaginatedResponse<Product>
> {
  const response =
    await apiClient.get(
      "/products/",
      {
        params: {
          search,
          page,
        },
      }
    );

  return response.data;
}

export async function createProduct(
  payload: CreateProductPayload
) {
  const response =
    await apiClient.post(
      "/products/",
      payload
    );

  return response.data;
}

export async function deleteProduct(
  productId: number
) {
  const response =
    await apiClient.delete(
      `/products/${productId}/`
    );

  return response.data;
}

export async function updateProduct(
  productId: number,
  payload: Partial<CreateProductPayload>
) {
  const response =
    await apiClient.patch(
      `/products/${productId}/`,
      payload
    );

  return response.data;
}