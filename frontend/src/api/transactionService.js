import api from './axios';

export const getTransactions = async () => {
    const response = await api.get('/api/transactions');
    return response.data;
};

export const createTransaction = async (data) => {
    const response = await api.post('/api/transactions', data);
    return response.data;
};

export const importCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/transactions/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};


export const exportTransactionsCSV = async () => {
    try {
        const response = await api.get('/api/transactions/export', {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `transactions_${new Date().toLocaleDateString()}.csv`);
       
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error("Export failed:", error);
        alert("Could not export CSV. Check if you have transactions.");
    }
};

export const deleteTransaction = async (id) => {
    const response = await api.delete(`/api/transactions/${id}`); 
    return response.data;
};