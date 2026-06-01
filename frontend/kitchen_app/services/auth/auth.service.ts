import { apiClient } from "../api/client";

import {
  LoginPayload,
  LoginResponse,
} from "@/types/auth";

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response =
    await apiClient.post<LoginResponse>(
      "/accounts/login/",
      payload
    );

  return response.data;
}