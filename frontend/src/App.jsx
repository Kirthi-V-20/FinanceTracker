import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* If the URL is /login, show the LoginPage */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* If the user goes to the main URL, send them to login for now */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;