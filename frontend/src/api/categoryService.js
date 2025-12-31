import api from './axios';

export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/api/categories', categoryData);
  return response.data;
};