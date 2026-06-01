import axios, {
  AxiosError,
  AxiosRequestConfig,
} from "axios";

const apiBaseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://kitchenpos.onrender.com/api";

type RetryableRequestConfig =
  AxiosRequestConfig & {
    __retryCount?: number;
  };

export const apiClient =
  axios.create({
    baseURL: apiBaseURL,
    timeout: 90000,

    headers: {
      "Content-Type":
        "application/json",
    },
  });

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config =
      error.config as
        | RetryableRequestConfig
        | undefined;

    const method =
      config?.method?.toLowerCase();

    const canRetry =
      Boolean(config) &&
      method === "get" &&
      ((error.code ===
        "ECONNABORTED") ||
        !error.response) &&
      (config?.__retryCount || 0) <
        1;

    if (config && canRetry) {
      config.__retryCount =
        (config.__retryCount || 0) +
        1;

      return apiClient(
        config
      );
    }

    return Promise.reject(
      error
    );
  }
);

export function getApiErrorMessage(
  error: unknown,
  fallback: string
) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (
    error.code === "ECONNABORTED" ||
    error.message
      ?.toLowerCase()
      .includes("timeout")
  ) {
    return `${fallback}: backend request timed out after 90 seconds. Render may still be starting up or the database may be slow.`;
  }

  if (!error.response) {
    return `${fallback}: cannot reach backend. Check internet connection, Render service status, API URL, or CORS/network blocking.`;
  }

  const detail =
    error.response.data?.detail ||
    error.response.data?.message ||
    error.response.data?.error;

  if (detail) {
    return `${fallback}: ${detail}`;
  }

  return `${fallback}: backend returned HTTP ${error.response.status}.`;
}

export default apiClient;
