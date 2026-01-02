import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';

import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  



  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;