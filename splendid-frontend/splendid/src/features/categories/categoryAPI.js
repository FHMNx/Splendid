import api from "../../api/axios";

// IMPORT categories by type (income/expense)
export const getCategoriesByType = async (type) => {
  try {
    const response = await api.get(`/categories/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
