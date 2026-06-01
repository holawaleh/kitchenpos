import axios from "axios";

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

export default apiClient;
