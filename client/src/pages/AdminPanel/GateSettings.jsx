import React, { useState } from 'react';
import { updateGate } from '../../utils/api';
import { Save } from 'lucide-react';

const GateSettings = () => {
  const [password, setPassword] = useState('');

  const handleSave = async () => {
    await updateGate(password);
    alert('Gate Password Updated!');
    setPassword('');
  };

  return (
    <div className="max-w-xl pb-20">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">GATE <span className="text-[#39FF14]">SECURITY</span></h2>
      <div className="bg-[#111] p-5 sm:p-8 rounded-3xl border border-white/10">
        <label className="block text-gray-400 mb-2 text-xs sm:text-sm uppercase tracking-widest font-bold">New Access Code</label>
        <input 
          type="text" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter new code..."
          className="w-full bg-black border border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl text-[#39FF14] outline-none focus:border-[#39FF14] mb-4 sm:mb-6 font-mono" 
        />
        <button 
          onClick={handleSave} 
          className="w-full bg-[#39FF14] text-black font-black py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Save size={18} className="sm:w-5 sm:h-5" /> UPDATE GATE CODE
        </button>
      </div>
    </div>
  );
};
export default GateSettings;