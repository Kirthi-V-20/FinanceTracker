import React ,{ useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-violet-50 font-sans flex items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="bg-violet-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-violet-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Start tracking your money</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-xs border border-red-100 font-medium text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </span>
              <input
                id="name"
                type="text"
                required
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-900 text-sm transition-all placeholder:text-slate-400"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                id="email"
                type="email"
                required
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-900 text-sm transition-all placeholder:text-slate-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                required
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-900 text-sm transition-all placeholder:text-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-sm mt-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Create Account'
            )}
          </button>
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-600 font-bold hover:text-violet-700 underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;