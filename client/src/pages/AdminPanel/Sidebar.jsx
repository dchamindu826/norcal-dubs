import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, List, Users, Settings, LogOut, Package, MessageSquareQuote, Music } from 'lucide-react'; // <-- Music එකතු කළා

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('norcal_admin');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <Package size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <List size={20} /> },
    { name: 'Admins', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Gate Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquareQuote size={20} /> },
    { name: 'Music', path: '/admin/music', icon: <Music size={20} /> }, // <-- Music Link එක දැම්මා
  ];

  return (
    <div className={`w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="p-6 flex items-center gap-3 border-b border-white/10 hidden md:flex">
        <img src="/logo-nobg.png" className="w-10" />
        <span className="font-black text-white tracking-tighter text-xl">ADMIN</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4 md:mt-0 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen && setIsOpen(false)} // Close on mobile click
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