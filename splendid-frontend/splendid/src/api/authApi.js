import api from "./axiosInstance";

// Register user
export const registerUser = async (userData) =>
  api.post("/auth/register", userData);

// Login user
export const loginUser = async (credentials) =>
  api.post("/auth/login", credentials);

// Forgot password request
export const forgotPassword = async (email) =>
  api.post("/auth/forgot-password", { email });

// Validate reset token
export const validateResetToken = async (token) =>
  api.get("/auth/validate-reset-token", { params: { token } });

// Reset password
export const resetPassword = async ({ token, password }) =>
  api.post("/auth/reset-password", { token, password });

// Resend verification email
export const resendVerification = async (email) =>
  api.post("/auth/resend-verification", { email });
