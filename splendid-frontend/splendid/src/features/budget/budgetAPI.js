import api from "../../api/axios";


//GET BUDGETS
export const getBudgets = async (month, year) => {
    const response = await api.get(`/budgets?month=${month}&year=${year}`);
    return response.data;
}


//CREATE OR UPDATE BUDGET
export const createOrUpdateBudget = async (data) => {
    const response = await api.post("/budgets", data);
    return response.data;
}

//DELETE BUDGET
export const deleteBudget = async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
}