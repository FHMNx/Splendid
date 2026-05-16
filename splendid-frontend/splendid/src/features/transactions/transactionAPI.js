import api from "../../api/axios";

// CREATE transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post("/transactions/create", transactionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET all transactions (user-specific from backend)
export const getAllTransactions = async (page = 0, size = 10) => {
  const response = await api.get(`/transactions/all?page=${page}&size=${size}`);
  return response.data;
};

// GET transaction by transaction ID
export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

// UPDATE transaction
export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

// DELETE transaction
export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

//GET TRANSACTIONS SUMMARY
export const getTransactionsSummary = async () => {
  const response = await api.get("/transactions/summary");
  return response.data;
}


export const getTransactionTrend = async (range = "30d") => {
  const response = await api.get(`/transactions/trend?range=${range}`);
  return response.data;
};

export const getCategoryBreakdown = async () => {
  const response = await api.get(`/transactions/category-breakdown`);
  return response.data;
};