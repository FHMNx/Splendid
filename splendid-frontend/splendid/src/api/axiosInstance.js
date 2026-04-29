import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";

    if (error.response) {
      message = error.response.data || message;

      if (error.response.status === 401) {
        message = "Unauthorized. Please login again.";
      }
    } else if (error.request) {
      message = "Server not responding";
    }

    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;