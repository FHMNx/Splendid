import api from "../../api/axios";

export const registerUser = async (userDate) => {
  const response = await api.post("/auth/register", userDate);
  return response.data;
};
