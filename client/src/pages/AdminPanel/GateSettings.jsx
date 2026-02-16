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
    <div className="max-w-xl">
      <h2 className="text-3xl font-bold mb-8">GATE <span className="text-[#39FF14]">SECURITY</span></h2>
      <div className="bg-[#111] p-8 rounded-2xl border border-white/10">
        <label className="block text-gray-400 mb-2 text-sm uppercase tracking-widest">New Access Code</label>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl px-6 py-4 text-2xl text-[#39FF14] outline-none focus:border-[#39FF14] mb-6" />
        <button onClick={handleSave} className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2"><Save size={20} /> UPDATE GATE CODE</button>
      </div>
    </div>
  );
};
export default GateSettings;