import React, { useState, useEffect } from 'react';
import { getTransactions, createTransaction, importCSV, exportTransactionsCSV, deleteTransaction } from '../api/transactionService';
import { getCategories } from '../api/categoryService';
import { Plus, Upload, Loader2, ArrowUpCircle, ArrowDownCircle, Download, Trash2 } from 'lucide-react';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');

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
            if (catData && catData.length > 0) {
                const firstId = catData[0].ID || catData[0].id;
                setCategoryId(firstId.toString());
            }
        } catch (err) {
            console.error("Error loading data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createTransaction({
                amount: parseFloat(amount),
                description,
                type,
                category_id: parseInt(categoryId),
                date: new Date().toISOString()
            });
            setAmount('');
            setDescription('');
            loadData(); 
        } catch (err) {
            alert("Failed to add transaction");
        }
    };

    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await importCSV(file);
            alert("CSV Imported Successfully!");
            loadData();
        } catch (err) {
            alert("Error importing CSV");
        }
    };

    const handleDelete = async (id) => {
        console.log("Delete button clicked for ID:", id);
        
        if (!id) {
            alert("Error: Transaction ID is missing");
            return;
        }

        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await deleteTransaction(id);
                loadData(); 
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Delete failed! Check the console.");
            }
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Transactions</h2>
                <div className="flex gap-3">
                    <button 
                        onClick={() => exportTransactionsCSV()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm"
                    >
                        <Download size={18} /> Export CSV
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-black cursor-pointer shadow-sm">
                        <Upload size={18} /> Import CSV
                        <input type="file" className="hidden" accept=".csv" onChange={handleCSVUpload} />
                    </label>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                        <input 
                            type="text" 
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="Lunch, Salary..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount</label>
                        <input 
                            type="number" 
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                        <select 
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.ID || cat.id} value={cat.ID || cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
                        <select 
                            className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-slate-900 text-white p-2.5 rounded-lg font-bold hover:bg-black transition-all">
                        Add
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Description</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Amount</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((t) => (
                            <tr key={t.id || t.ID} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-sm text-slate-600">
                                    {new Date(t.date || t.Date).toLocaleDateString()}
                                </td>
                                <td className="p-4 font-medium text-slate-900">{t.description}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-violet-50 text-violet-600 rounded text-xs font-medium">
                                        {t.category_name || (t.Category && t.Category.Name)}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleDelete(t.id || t.ID)}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && !loading && (
                    <div className="p-10 text-center text-slate-400">No transactions found.</div>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;