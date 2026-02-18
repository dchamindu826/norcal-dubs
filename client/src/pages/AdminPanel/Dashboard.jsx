import React, { useEffect, useState } from 'react';
import { getStats, getOrders } from '../../utils/api';
import { Users, ShoppingBag, Eye, DollarSign, Package, Clock, TrendingUp, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, admins: 0, views: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getStats();
        const ordersData = await getOrders();
        setStats(statsData);
        setOrders(ordersData || []);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      }
    };
    fetchData();
  }, []);

  // --- 1. CALCULATE ORDER STATS ---
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0);
  
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  // --- 2. PREPARE CHART DATA ---
  
  // Data for Pie Chart
  const pieData = [
    { name: 'Pending', value: pendingOrders, color: '#FACC15' }, // Yellow
    { name: 'Processing', value: processingOrders, color: '#3B82F6' }, // Blue
    { name: 'Shipped', value: shippedOrders, color: '#A855F7' }, // Purple
    { name: 'Completed', value: completedOrders, color: '#39FF14' }, // Green
    { name: 'Cancelled', value: cancelledOrders, color: '#EF4444' }, // Red
  ].filter(item => item.value > 0);

  // Data for Revenue Chart (Group by Date)
  // Note: This logic groups orders by date to show trend
  const revenueMap = {};
  orders.forEach(order => {
      if(order.status !== 'Cancelled') {
          const date = order.date.split(',')[0]; // Extract date part
          if(!revenueMap[date]) revenueMap[date] = 0;
          revenueMap[date] += parseFloat(order.total || 0);
      }
  });
  
  const areaData = Object.keys(revenueMap).map(date => ({
      name: date,
      income: revenueMap[date]
  })).slice(-7); // Show last 7 active days

  return (
    <div className="pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-4xl font-black text-white mb-2">DASHBOARD</h1>
            <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Live Status</p>
            <div className="flex items-center gap-2 text-[#39FF14]">
                <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></div>
                <span className="font-bold text-sm">System Online</span>
            </div>
        </div>
      </div>

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign />} color="text-[#39FF14]" bg="bg-[#39FF14]/10" />
        <StatCard title="Total Orders" value={orders.length} icon={<Package />} color="text-blue-400" bg="bg-blue-400/10" />
        <StatCard title="Pending" value={pendingOrders} icon={<Clock />} color="text-yellow-400" bg="bg-yellow-400/10" />
        <StatCard title="Total Views" value={stats.views} icon={<Eye />} color="text-purple-400" bg="bg-purple-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. REVENUE TREND (AREA CHART) */}
        <div className="lg:col-span-2 bg-[#111] p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#39FF14]"/> Revenue Trend
                </h3>
            </div>
            
            <div className="h-[300px] w-full relative z-10">
                {areaData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#555" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                            <YAxis stroke="#555" tick={{fontSize: 10}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#39FF14' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#39FF14" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600">
                        <p>No revenue data yet.</p>
                    </div>
                )}
            </div>
        </div>

        {/* 3. ORDER STATUS (PIE CHART) */}
        <div className="bg-[#111] p-6 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <PieChart size={20} className="text-blue-400"/> Order Distribution
            </h3>
            
            <div className="h-[250px] w-full relative">
                {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RePie>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </RePie>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-600">No orders yet.</div>
                )}
                {/* Center Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <div className="text-center">
                        <span className="text-3xl font-black text-white">{orders.length}</span>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. INVENTORY STATS ROW */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex items-center justify-between p-6 bg-[#111] rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-3 rounded-xl text-white"><ShoppingBag size={24}/></div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Products</p>
                        <h4 className="text-2xl font-black text-white">{stats.products}</h4>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-[#111] rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-3 rounded-xl text-white"><Users size={24}/></div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">System Admins</p>
                        <h4 className="text-2xl font-black text-white">{stats.admins}</h4>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-[#111] p-6 rounded-3xl border border-white/10 flex items-center justify-between hover:border-white/30 transition-all hover:scale-[1.02] cursor-default shadow-lg">
    <div>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className={`text-4xl font-black ${color} tracking-tighter`}>{value}</h3>
    </div>
    <div className={`p-4 rounded-2xl ${bg} ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;