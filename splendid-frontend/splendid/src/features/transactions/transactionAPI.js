import api from "../../api/axios";

// CREATE transaction
export const createTransaction = async (transactionData) => {
  const response = await api.post("/transactions/create", transactionData);
  return response.data;
};

// GET all transactions (user-specific from backend)
export const getAllTransactions = async () => {
  const response = await api.get("/transactions/all");
  return response.data;
};

// GET transaction by ID
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