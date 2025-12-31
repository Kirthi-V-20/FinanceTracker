import React from 'react';
import Navbar from './Navbar'; // This imports the Navbar you already made

/**
 * WHY: This is a "Wrapper" component.
 * It puts the Navbar at the top of every page so you don't 
 * have to copy-paste the Navbar code into every single page.
 */
const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* The Navbar stays at the top */}
            <Navbar />
            
            {/* The 'children' is the actual page (Dashboard, Transactions, etc.) */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;