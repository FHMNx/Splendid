import api from "./axios";

export const createTicket = async (data) => {
    const response = await api.post("/tickets", data);
    return response.data;
};

export const getMyTickets = async () => {
    const response = await api.get("/tickets");
    return response.data;
};

export const getAllTicketsAdmin = async (page = 0, size = 10) => {
    const response = await api.get(`/tickets/admin?page=${page}&size=${size}`);
    return response.data;
};

export const updateTicketStatusAdmin = async (ticketId, status) => {
    const response = await api.put(`/tickets/admin/${ticketId}/status`, { status });
    return response.data;
};

export const addTicketMessage = async (ticketId, data) => {
    const response = await api.post(`/tickets/${ticketId}/messages`, data);
    return response.data;
};

export const getTicketMessages = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/messages`);
    return response.data;
};
