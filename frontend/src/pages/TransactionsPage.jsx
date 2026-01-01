import React, { useState, useEffect } from 'react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactionService';
import { getCategories } from '../api/categoryService';
import { Loader2, Trash2, Pencil, X, Calendar } from 'lucide-react';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense'); 
    const [categoryId, setCategoryId] = useState(''); // This starts empty
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [transData, catData] = await Promise.all([
                getTransactions(),
                getCategories()
            ]);
            setTransactions(transData || []);
            setCategories(catData || []);
 
            if (catData && catData.length > 0 && !editingId) {
                const firstId = catData[0].ID || catData[0].id;
                setCategoryId(firstId.toString());
            }
        } catch (err) {
            console.error("Error loading data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numericCatId = parseInt(categoryId);

        if (!numericCatId || isNaN(numericCatId)) {
            alert("Please select a category. If the list is empty, create one in the Categories page first!");
            return;
        }

        const payload = {
            amount: parseFloat(amount),
            description: description,
            type: type,
            category_id: numericCatId,
            date: new Date(date).toISOString() 
        };

        try {
            if (editingId) {
                await updateTransaction(editingId, payload);
                alert("Transaction updated!");
            } else {
                await createTransaction(payload);
                alert("Transaction added!");
            }
            resetForm();
            loadData(); 
        } catch (err) {
            const msg = err.response?.data?.error || "Action failed";
            alert("Error: " + msg);
        }
    };

    const startEdit = (t) => {
        const id = t.id || t.ID;
        const amt = t.amount || t.Amount;
        const catId = t.category_id || t.CategoryID;
        const desc = t.description || t.Description;
        const typeVal = t.type || t.Type;
        const dateVal = t.date || t.Date;

        if (id !== undefined) {
            setEditingId(id);
            setAmount(amt?.toString() ?? "");
            setDescription(desc ?? "");
            setType(typeVal ?? "expense");
            
            if (catId) {
                setCategoryId(catId.toString());
            }

            if (dateVal) {
                setDate(new Date(dateVal).toISOString().split('T')[0]);
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setAmount('');
        setDescription('');
        setType('expense');
        setDate(new Date().toISOString().split('T')[0]);
        if (categories.length > 0) {
            setCategoryId((categories[0].ID || categories[0].id).toString());
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteTransaction(id);
                loadData(); 
            } catch (err) {
                alert("Delete failed!");
            }
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-violet-600" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transactions</h2>

            {/* FORM */}
            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${editingId ? 'border-violet-500 ring-1 ring-violet-500' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {editingId ? "Edit Entry" : "New Entry"}
                    </h3>
                    {editingId && (
                        <button onClick={resetForm} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-xs font-bold">
                            <X size={14} /> Cancel Edit
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Date</label>
                        <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Description</label>
                        <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm" placeholder="Ex: Dinner" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Type</label>
                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-bold" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Amount</label>
                        <input type="number" step="0.01" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm font-bold" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Category</label>
                        <select 
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm" 
                            value={categoryId} 
                            onChange={(e) => setCategoryId(e.target.value)} 
                            required
                        >
                            <option value="">Select...</option>
                            {categories.map(cat => (
                                <option key={cat.ID || cat.id} value={cat.ID || cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={`p-2.5 rounded-xl font-bold text-white transition-all shadow-sm ${editingId ? 'bg-violet-600 hover:bg-violet-700' : 'bg-slate-900 hover:bg-black'}`}>
                        {editingId ? "Update" : "Add"}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Description</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Category</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Amount</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transactions.map((t) => (
                            <tr key={t.id || t.ID} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-sm text-slate-500">{new Date(t.date || t.Date).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-slate-900">{t.description}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        {t.category_name || (t.Category && t.Category.Name)}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => startEdit(t)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"><Pencil size={16} /></button>
                                        <button onClick={() => handleDelete(t.id || t.ID)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsPage;