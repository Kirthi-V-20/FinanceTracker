import api from './axios';

export const getBudgets = async () => {
    const response = await api.get('/api/budgets');
    return response.data;
};

export const createBudget = async (data) => {
    const response = await api.post('/api/budgets', data);
    return response.data;
};

export const updateBudget = async (id, data) => {
    const response = await api.put(`/api/budgets/${id}`, data);
    return response.data;
};