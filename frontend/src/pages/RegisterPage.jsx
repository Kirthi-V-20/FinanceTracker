import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Coins, Heart, User, Mail, Lock, Loader2, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/register', { username: name, email, password });
      
      alert("Account created successfully! Please log in.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 font-sans flex flex-col items-center justify-center p-4">
      
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-4">
          <div className="relative">
            <div className="bg-violet-600 p-2.5 rounded-lg shadow-lg">
              <Coins className="text-white" size={24} />
            </div>
            <div className="absolute -top-1.5 -right-1.5 bg-white p-0.5 rounded-full shadow-sm border border-violet-50">
              <Heart className="text-rose-500 fill-rose-500" size={14} />
            </div>
          </div>
        </div>
   
        <h1 className="text-4xl font-serif font-bold tracking-tighter text-slate-900">
          Coin<span className="text-violet-600 italic font-medium">Care</span>
        </h1>
      </div>

      <div className="w-full max-w-[320px] bg-white rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-violet-100 px-8 py-10">
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-sm text-[10px] font-bold border border-rose-100 text-center mb-6 font-mono uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col space-y-5">
          <div>
            <label className="block text-base font-mono font-black text-slate-950 mb-2 ml-1 uppercase tracking-widest">
              Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={16} />
              <input
                type="text"
                required
                disabled={isLoading}
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-violet-600 focus:border-violet-600 outline-none text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-mono font-black text-slate-950 mb-2 ml-1 uppercase tracking-widest">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={16} />
              <input
                type="email"
                required
                disabled={isLoading}
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-violet-600 focus:border-violet-600 outline-none text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400"
                placeholder="coincare@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-mono font-black text-slate-950 mb-2 ml-1 uppercase tracking-widest">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={16} />
              <input
                type="password"
                required
                disabled={isLoading}
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-violet-600 focus:border-violet-600 outline-none text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-sm font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <UserPlus size={18} />
                Register
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest font-mono">
              Already a user?{' '}
              <Link to="/login" className="text-violet-600 font-black hover:underline underline-offset-4 transition-all">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;