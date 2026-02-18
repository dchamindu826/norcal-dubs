import React, { useEffect, useState } from 'react';
import { getStats, getOrders } from '../../utils/api';
import { Users, ShoppingBag, Eye, DollarSign, Package, Clock, XCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, admins: 0, views: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setStats(await getStats());
      setOrders(await getOrders());
    };
    fetchData();
  }, []);

  // Calculate Order Stats
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + parseFloat(curr.total), 0);
  
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  return (
    <div className="pb-20">
      <h1 className="text-4xl font-black text-white mb-2">DASHBOARD</h1>
      <p className="text-gray-500 mb-8">Welcome back, Admin</p>

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign />} color="text-[#39FF14]" />
        <StatCard title="Total Orders" value={orders.length} icon={<Package />} color="text-blue-400" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={<Clock />} color="text-yellow-400" />
        <StatCard title="Total Views" value={stats.views} icon={<Eye />} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. REVENUE CHART (Simple CSS Bar Chart) */}
        <div className="lg:col-span-2 bg-[#111] p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Order Status Overview</h3>
            <div className="flex items-end justify-between h-48 gap-4 px-4">
                <Bar label="Pending" count={pendingOrders} total={orders.length} color="bg-yellow-500" />
                <Bar label="Processing" count={orders.filter(o => o.status === 'Processing').length} total={orders.length} color="bg-blue-500" />
                <Bar label="Shipped" count={orders.filter(o => o.status === 'Shipped').length} total={orders.length} color="bg-purple-500" />
                <Bar label="Completed" count={completedOrders} total={orders.length} color="bg-[#39FF14]" />
                <Bar label="Cancelled" count={orders.filter(o => o.status === 'Cancelled').length} total={orders.length} color="bg-red-500" />
            </div>
        </div>

        {/* 3. INVENTORY STATS */}
        <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Inventory</h3>
            
            <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg text-white"><ShoppingBag size={20}/></div>
                    <span className="text-gray-400">Products</span>
                </div>
                <span className="text-2xl font-bold text-white">{stats.products}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg text-white"><Users size={20}/></div>
                    <span className="text-gray-400">Admins</span>
                </div>
                <span className="text-2xl font-bold text-white">{stats.admins}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-[#111] p-6 rounded-2xl border border-white/10 flex items-center justify-between hover:border-white/20 transition-colors">
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-white/5 ${color}`}>{icon}</div>
  </div>
);

const Bar = ({ label, count, total, color }) => {
    const height = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <div className="w-full bg-white/5 rounded-t-lg relative h-32 flex items-end">
                <div style={{ height: `${height}%` }} className={`w-full ${color} rounded-t-lg transition-all duration-1000 opacity-80 hover:opacity-100 relative group`}>
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                </div>
            </div>
            <span className="text-[10px] text-gray-500 uppercase font-bold">{label}</span>
        </div>
    );
};

export default Dashboard;