import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { updateBudget } from '../api/budgetService';
import { Target, Plus, Loader2, Pencil, X } from 'lucide-react';

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const loadData = async () => {
        try {
            const [bRes, cRes] = await Promise.all([
                api.get('/api/budgets'),
                api.get('/api/categories')
            ]);
            setBudgets(bRes.data || []);
            setCategories(cRes.data || []);
        } catch (err) {
            console.error("Failed to load budgets", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
   
    const payload = {
        category_id: parseInt(categoryId),
        amount: parseFloat(amount),
        month: now.getMonth() + 1, 
        year: now.getFullYear()   
    };

    try {
        if (editingId) {
            await updateBudget(editingId, payload);
            alert("Budget updated successfully!");
        } else {
            await api.post('/api/budgets', payload);
            alert("Budget set successfully!");
        }
        setAmount('');
        setEditingId(null);
        loadData(); 
    } catch (err) {
        const serverMessage = err.response?.data?.error || "Unknown Error";
        alert("Action failed: " + serverMessage);
    }
};

    const startEdit = (b) => {
    const catId = b.category_id || b.CategoryID;
    const amount = b.amount || b.Amount;
    const id = b.id || b.ID;

    if (id && catId) {
        setEditingId(id);
        setAmount(amount.toString());
        setCategoryId(catId.toString()); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        alert("Could not load budget data for editing.");
    }
};
    

    if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Monthly Budgets</h2>

            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${editingId ? 'border-violet-500' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase">{editingId ? 'Edit Limit' : 'Set New Limit'}</h3>
                    {editingId && <button onClick={() => {setEditingId(null); setAmount('');}} className="text-xs text-red-500 flex items-center gap-1"><X size={14}/> Cancel</button>}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                        <select className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required disabled={!!editingId}>
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.id || cat.ID} value={cat.id || cat.ID}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Limit Amount ($)</label>
                        <input type="number" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500" placeholder="e.g. 2000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>
                    <button type="submit" className="bg-violet-600 text-white p-2.5 rounded-lg font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        {editingId ? "Update Limit" : "Set Budget"}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((b) => (
                    <div key={b.id || b.ID} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-800 text-lg">{b.category_name}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(b)} className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"><Pencil size={16}/></button>
                                <span className="text-sm font-bold text-slate-600">${b.amount}</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">Month: {b.month}/{b.year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BudgetsPage;