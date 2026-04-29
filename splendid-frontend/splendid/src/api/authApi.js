import api from "./axiosInstance";

// Register user
export const registerUser = async (userData) => {
  return await api.post("/auth/register", userData);
};

// Login user
export const loginUser = async (credentials) => {
  return await api.post("/auth/login", credentials);
};

// Validate reset token
export const validateResetToken = async (token) => {
  return await api.get(`/auth/validate-reset-token?token=${token}`);
};

// Reset password
export const resetPassword = async (data) => {
  return await api.post("/auth/reset-password", null, {
    params: { token: data.token, password: data.password },
  });
};

// Forgot password request
export const forgotPassword = async (email) => {
  return await api.post("/auth/forgot-password", null, {
    params: { email },
  });
};
