import React, { useEffect, useState } from 'react';
import { getStats, downloadBackup } from '../../utils/api';
import { Package, Layers, Users, TrendingUp, Download } from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color }) => (
  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}><Icon size={80} /></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color} bg-opacity-20`}><Icon size={24} className="text-white" /></div>
      <h3 className="text-4xl font-bold text-white mb-1">{count}</h3>
      <p className="text-gray-400 text-xs uppercase tracking-widest">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, admins: 0, views: 0 });

  useEffect(() => {
    const fetchStats = async () => setStats(await getStats());
    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">DASHBOARD <span className="text-[#39FF14]">OVERVIEW</span></h2>
        <button onClick={downloadBackup} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500"><Download size={20} /> BACKUP DATA</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" count={stats.products} icon={Package} color="bg-blue-500" />
        <StatCard title="Categories" count={stats.categories} icon={Layers} color="bg-purple-500" />
        <StatCard title="Active Admins" count={stats.admins} icon={Users} color="bg-yellow-500" />
        <StatCard title="Site Visits" count={stats.views} icon={TrendingUp} color="bg-[#39FF14]" />
      </div>
    </div>
  );
};
export default Dashboard;