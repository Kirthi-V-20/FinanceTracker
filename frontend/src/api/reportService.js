import api from './axios';

export const getSummary = async (month, year) => {
    const response = await api.get(`/api/reports/summary?month=${month}&year=${year}`);
    return response.data;
};