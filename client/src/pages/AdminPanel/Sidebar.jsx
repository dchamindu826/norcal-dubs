import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, List, Users, Settings, LogOut, Package } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('norcal_admin');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <Package size={20} /> }, // <--- NEW
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <List size={20} /> },
    { name: 'Admins', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Gate Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <img src="/logo-nobg.png" className="w-10" />
        <span className="font-black text-white tracking-tighter text-xl">ADMIN</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl w-full font-bold transition-all">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;