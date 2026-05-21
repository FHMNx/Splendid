import api from "../../api/axios";

export const getAdminStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

export const toggleUserVerification = async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-verification`);
    return response.data;
};

export const activateUserSubscription = async (userId, plan) => {
    const response = await api.put(`/admin/users/${userId}/subscription`, { plan });
    return response.data;
};

export const getAllTransactionsAdmin = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/transactions?page=${page}&size=${size}`);
    return response.data;
};


export const getPaymentSummary = async () => {
    const response = await api.get("/admin/payments/summary");
    return response.data;
};

export const getAllPayments = async () => {
    const response = await api.get("/admin/payments");
    return response.data;
};

export const recordPayment = async (data) => {
    const response = await api.post("/admin/payments", data);
    return response.data;
};