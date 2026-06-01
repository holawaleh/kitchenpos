import axios from "axios";

import { useAuthStore } from "@/store/auth.store";

const apiBaseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV ===
  "development"
    ? "http://127.0.0.1:8000/api"
    : undefined);

export const apiClient =
  axios.create({
    baseURL: apiBaseURL,

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
