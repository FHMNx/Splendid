import { toast } from "react-toastify";

export const showSuccess = (msg) => {
  toast.success(msg, {
    autoClose: 2500,
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    autoClose: 3000,
  });
};