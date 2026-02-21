import React from 'react';
import { Users, Star, ShieldCheck } from 'lucide-react';

const StatsCounter = () => {
  const stats = [
    { icon: <Users size={24} className="text-[#39FF14]" />, value: '1500+', label: 'HAPPY CLIENTS' },
    { icon: <Star size={24} className="text-[#39FF14]" />, value: '4.9', label: '5 STAR RATINGS' },
    { icon: <ShieldCheck size={24} className="text-[#39FF14]" />, value: '100%', label: 'TRUSTED' },
  ];

  return (
    <div className="container mx-auto px-6 -mt-10 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <div key={index} className="bg-black/80 backdrop-blur-md border border-[#39FF14]/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(57,255,20,0.05)] hover:border-[#39FF14]/50 transition-colors">
            <div className="mb-2">{stat.icon}</div>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;