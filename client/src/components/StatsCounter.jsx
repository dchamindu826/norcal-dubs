import React, { useEffect, useState } from 'react';
import { Star, ShieldCheck, Users, ShoppingBag } from 'lucide-react';

const StatItem = ({ icon: Icon, end, label, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="flex flex-col items-center p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl hover:border-[#39FF14] transition-all group">
      <div className="mb-2 text-gray-400 group-hover:text-[#39FF14] transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-black text-white">
        {count}{suffix}
      </h3>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
    </div>
  );
};

const StatsCounter = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 max-w-6xl mx-auto relative z-20 -mt-8">
      <StatItem icon={Users} end={1500} label="Happy Clients" suffix="+" />
      <StatItem icon={Star} end={4} label="5 Star Ratings" suffix=".9" />
      <StatItem icon={ShieldCheck} end={100} label="Trusted" suffix="%" />
      <StatItem icon={ShoppingBag} end={50} label="Products" suffix="+" />
    </div>
  );
};

export default StatsCounter;