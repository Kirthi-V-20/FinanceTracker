import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coins, Heart, LayoutDashboard, Tag, ArrowLeftRight, Target, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Categories', path: '/categories', icon: <Tag size={18} /> },
        { name: 'Transactions', path: '/transactions', icon: <ArrowLeftRight size={18} /> },
        { name: 'Budgets', path: '/budgets', icon: <Target size={18} /> },
    ];

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center mr-8 md:mr-10 group">
                            <div className="relative mr-2">
                                <div className="bg-violet-600 p-1.5 rounded-lg">
                                    <Coins className="text-white" size={20} />
                                </div>
                                <div className="absolute -top-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                                    <Heart className="text-rose-500 fill-rose-500" size={10} />
                                </div>
                            </div>
                            <span className="text-2xl font-serif font-black tracking-tighter text-slate-900">
                                Coin<span className="text-violet-600 italic">Care</span>
                            </span>
                        </Link>
                   
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 text-sm font-mono font-black uppercase tracking-widest transition-colors duration-200
                                        ${isActive(link.path) 
                                            ? 'text-violet-600' 
                                            : 'text-slate-400 hover:text-violet-600'
                                        }`}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button 
                            onClick={handleLogout} 
                            className="hidden md:flex items-center gap-2 text-sm font-mono font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors"
                        >
                            <LogOut size={18} /> Logout
                        </button>
  
                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-900">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-mono font-black uppercase tracking-widest 
                                ${isActive(link.path) ? 'text-violet-600 bg-violet-50' : 'text-slate-500'}`}
                        >
                            {link.icon} {link.name}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-mono font-black uppercase text-rose-600 bg-rose-50">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
