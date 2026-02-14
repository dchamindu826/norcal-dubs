import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { getGatePassword } from '../utils/storage'; // Import meka

const Gate = ({ onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const currentPass = getGatePassword(); // Storage eken password ganna
    
    if (input === currentPass) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setInput('');
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      
      {/* --- FOG BACKGROUND --- */}
      <div className="fog-layer"></div>
      <div className="fog-layer fog-layer-2"></div>

      {/* --- CONTENT --- */}
      <div className="z-10 flex flex-col items-center w-full px-4">
        
        {/* LOGO (Clean & Breathing) */}
        <div className="mb-8 relative flex justify-center">
           <img 
             src="/logo-nobg.png" 
             alt="Norcal Budz" 
             // CHANGE: 'logo-breathe' class eka add kala. Kisima container ekak na.
             className="w-full h-auto object-contain logo-breathe"
             style={{ width: 'clamp(200px, 60vw, 380px)' }} 
           />
        </div>

        {/* TITLE */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white drop-shadow-lg">
                NORCAL <span className="text-[#39FF14]">BUDZ</span>
            </h1>
            <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.8em] uppercase mt-4 opacity-80">
                Premium Access Only
            </p>
        </div>

        {/* INPUT FORM (Capsule Style) */}
        <form onSubmit={handleLogin} className="w-full max-w-xs relative">
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-[#39FF14] transition-colors z-20" />

            <input 
              type="password" 
              placeholder="ACCESS CODE" 
              className={`w-full bg-black/40 backdrop-blur-md border border-white/10 ${error ? 'border-red-500 shake-animation' : 'focus:border-[#39FF14]'} rounded-full px-12 py-4 text-white text-center tracking-[0.3em] font-light outline-none transition-all duration-500 placeholder:text-gray-700`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />

            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#39FF14] transition-all duration-300 p-2"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 text-[10px] text-center mt-4 tracking-[0.2em] uppercase font-bold animate-pulse">
              Access Denied
            </p>
          )}
        </form>

        <div className="fixed bottom-6 text-gray-800 text-[9px] tracking-[0.3em] opacity-50">
          SECURE GATEWAY
        </div>
      </div>
    </div>
  );
};

export default Gate;