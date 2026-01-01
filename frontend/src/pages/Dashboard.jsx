import React, { useEffect, useState } from 'react';
import { getSummary } from '../api/reportService';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { 
    Wallet, ArrowUpCircle, ArrowDownCircle, Loader2, 
    PieChart as PieChartIcon, AlertCircle, Calendar 
} from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e'];

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const months = [
        { val: 1, name: "January" }, { val: 2, name: "February" }, { val: 3, name: "March" },
        { val: 4, name: "April" }, { val: 5, name: "May" }, { val: 6, name: "June" },
        { val: 7, name: "July" }, { val: 8, name: "August" }, { val: 9, name: "September" },
        { val: 10, name: "October" }, { val: 11, name: "November" }, { val: 12, name: "December" }
    ];

    const years = [2024, 2025, 2026];

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const data = await getSummary(selectedMonth, selectedYear);
            setSummary(data);
        } catch (err) {
            console.error("Error fetching summary:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [selectedMonth, selectedYear]);

    const chartData = summary?.category_reports || [];
    const overBudgetCats = chartData.filter(
        cat => cat.budget_limit > 0 && cat.total_spent > cat.budget_limit
    );
    const overBudgetCount = overBudgetCats.length;
    if (loading && !summary) return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="animate-spin text-[#22C55E]" size={48} />
        </div>
    );
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Spend Analytics</h1>
                    <p className="text-slate-500 text-sm">Reviewing {months.find(m => m.val === selectedMonth).name} {selectedYear}</p>
                </div>

                <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="bg-transparent text-sm font-bold text-slate-600 outline-none px-2 cursor-pointer"
                    >
                        {months.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
                    </select>
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="bg-transparent text-sm font-bold text-slate-600 outline-none px-2 cursor-pointer border-l border-slate-100"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

           

            {overBudgetCount > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl animate-pulse shadow-sm">
                    <div className="flex items-center gap-4">
                        <AlertCircle className="text-red-600" size={28} />
                        <div>
                            <h4 className="text-sm font-black text-red-800 uppercase tracking-widest">Budget Alert</h4>
                            <p className="text-base font-bold text-red-700">
                                You have exceeded your limit in {overBudgetCount} {overBudgetCount === 1 ? 'category' : 'categories'} this month!
                            </p>
                        </div>
                    </div>
                </div>
            )}
            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Income</p>
                    <h3 className="text-3xl font-black text-emerald-500">${summary?.total_income?.toFixed(2) || "0.00"}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Expense</p>
                    <h3 className="text-3xl font-black text-rose-500">${summary?.total_expense?.toFixed(2) || "0.00"}</h3>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Net Balance</p>
                    <h3 className="text-3xl font-black text-slate-900">${summary?.net_savings?.toFixed(2) || "0.00"}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Spending Distribution</h3>
                    <div className="h-[350px] w-full relative">
                        {loading ? <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-violet-600" /></div> : 
                        chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="total_spent" nameKey="category_name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} stroke="none">
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col h-full items-center justify-center text-slate-300 gap-2 italic">
                                <PieChartIcon size={40} className="opacity-20" />
                                <p>No data for this period</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Category Breakdown</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {chartData.length > 0 ? chartData.sort((a,b) => b.total_spent - a.total_spent).map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{cat.category_name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Category</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">${cat.total_spent.toFixed(2)}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Total Spent</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400 text-sm mt-10">Add transactions to see breakdown</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;