import api from "../../api/axios";

export const registerUser = async (userDate) => {
  const response = await api.post("/auth/register", userDate);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post(`/auth/forgot-password?email=${email}`);
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(
    `/auth/reset-password?token=${token}&password=${password}`,
  );
  return response.data;
};

export const validateResetToken = async (token) => {
  const response = await api.get(`/auth/validate-reset-token?token=${token}`);
  return response.data;
};
