// src/pages/AdminPanel/GateSettings.jsx
import React, { useState, useEffect } from 'react';
import { getGatePassword, saveGatePassword } from '../../utils/storage';
import { Save, Eye, EyeOff } from 'lucide-react';

const GateSettings = () => {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => { setPassword(getGatePassword()); }, []);

  const handleSave = () => {
    saveGatePassword(password);
    alert('Gate Password Updated!');
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-3xl font-bold mb-8">GATE <span className="text-[#39FF14]">SECURITY</span></h2>
      
      <div className="bg-[#111] p-8 rounded-2xl border border-white/10">
        <label className="block text-gray-400 mb-2 text-sm uppercase tracking-widest">Current Access Code</label>
        <div className="relative mb-6">
          <input 
            type={show ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl px-6 py-4 text-2xl text-[#39FF14] font-mono tracking-widest outline-none focus:border-[#39FF14]"
          />
          <button onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            {show ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button onClick={handleSave} className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
          <Save size={20} /> UPDATE GATE CODE
        </button>
      </div>
    </div>
  );
};

export default GateSettings;