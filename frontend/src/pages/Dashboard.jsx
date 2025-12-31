import React, { useEffect, useState } from 'react';
import { getSummary } from '../api/reportService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2, PieChart as PieChartIcon } from 'lucide-react';
const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const now = new Date();
            const month = now.getMonth() + 1; 
            const year = now.getFullYear();

            try {
                const data = await getSummary(month, year);
                setSummary(data);
            } catch (err) {
                console.error("Error fetching summary:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-violet-600" size={40} />
        </div>
    );

    const COLORS = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', 
    '#8b5cf6', '#f43f5e', '#06b6d4', '#84cc16', '#a855f7',
    '#64748b', '#fb923c'
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Net Savings</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-1">
                                ${summary?.net_savings?.toFixed(2) || "0.00"}
                            </h3>
                        </div>
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                            <Wallet size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Income</p>
                            <h3 className="text-3xl font-bold text-emerald-600 mt-1">
                                ${summary?.total_income?.toFixed(2) || "0.00"}
                            
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <ArrowUpCircle size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Expense</p>
                            <h3 className="text-3xl font-bold text-red-500 mt-1">
                                ${summary?.total_expense?.toFixed(2) || "0.00"}
                            </h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                            <ArrowDownCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Spending by Category</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Breakdown</span>
            </div>

                <div className="h-[350px] w-full relative">
                    {summary?.category_reports?.length > 0 ? (
                        <>
                            {(() => {
                                const sortedData = [...summary.category_reports].sort((a, b) => b.total_spent - a.total_spent);
                                
                                return (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={sortedData}
                                                dataKey="total_spent"
                                                nameKey="category_name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={85}  
                                                outerRadius={110}
                                                paddingAngle={4}  
                                                stroke="none"      
                                            >
                                                {sortedData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={COLORS[index % COLORS.length]} 
                                                        className="hover:opacity-80 transition-opacity outline-none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                                formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
                                            />
                                            <Legend 
                                                layout="horizontal" 
                                                verticalAlign="bottom" 
                                                align="center"
                                                iconType="circle"
                                                wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                );
                            })()}

                            
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ marginTop: '-20px' }}>
                                <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                                <p className="text-2xl font-black text-slate-900">
                                    ${summary?.total_expense?.toFixed(0)}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col h-full items-center justify-center text-slate-400 gap-2">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <PieChartIcon size={24} className="opacity-20" />
                            </div>
                            <p className="text-sm italic">No spending recorded for this month.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;