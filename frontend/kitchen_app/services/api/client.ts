import axios from "axios";

import { useAuthStore } from "@/store/auth.store";

const apiBaseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://kitchenpos.onrender.com/api";

export const apiClient =
  axios.create({
    baseURL: apiBaseURL,
    timeout: 30000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

apiClient.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState()
        .accessToken;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default apiClient;
