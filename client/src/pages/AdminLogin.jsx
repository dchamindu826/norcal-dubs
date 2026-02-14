import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // --- AUTH LOGIC (Simple Check) ---
    // Passe api meka backend ekata connect karamu.
    // Danata Username: admin | Pass: admin123
    
    if (username === 'admin' && password === 'admin123') {
      // 1. Session ekak hadanawa
      sessionStorage.setItem('norcal_admin_auth', 'true');
      
      // 2. Dashboard ekata yawanawa
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Username or Password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#39FF14] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
            ADMIN <span className="text-[#39FF14]">ACCESS</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">Restricted Area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#39FF14] transition-colors" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#39FF14] outline-none transition-all placeholder:text-gray-700 font-medium"
                placeholder="Enter Username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#39FF14] transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#39FF14] outline-none transition-all placeholder:text-gray-700 font-medium"
                placeholder="Enter Password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl hover:bg-[#32cc12] transition-colors flex items-center justify-center gap-2 group"
          >
            LOGIN TO DASHBOARD <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
            <a href="/" className="text-gray-600 text-sm hover:text-white transition-colors">← Back to Site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;