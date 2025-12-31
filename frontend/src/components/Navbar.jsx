import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    // Why: This function clears the user's "session" and sends them back to Login
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Links */}
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-violet-600 mr-8 tracking-tight">
                            FinanceTracker
                        </span>
                        <div className="hidden md:flex space-x-4">
                            <Link to="/dashboard" className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition">
                                Dashboard
                            </Link>
                            <Link to="/categories" className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition">
                                Categories
                            </Link>
                            <Link to="/transactions" className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition">
                                Transactions
                            </Link>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;