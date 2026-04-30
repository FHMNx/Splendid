import axios from "axios";
import { toast } from "react-toastify";
import { clearAuth } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

// Request interceptor: add authorization token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const raw = error.response?.data;
    const message =
      typeof raw === "string" && raw
        ? raw
        : raw?.message && typeof raw.message === "string"
          ? raw.message
          : "Something went wrong";

    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = "/login";
    }

    toast.error(message);
    return Promise.reject(error);
  },
);

export default api;
