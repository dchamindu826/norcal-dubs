// src/pages/AdminPanel/Sidebar.jsx
import React from 'react';
import { LayoutDashboard, ShoppingBag, List, Users, Lock, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
    { icon: List, label: 'Categories', path: '/admin/categories' },
    { icon: Users, label: 'Admins', path: '/admin/users' },
    { icon: Lock, label: 'Gate Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
  sessionStorage.removeItem('norcal_admin_auth'); 
  navigate('/admin/login'); // <--- Methana '/admin' thibba eka '/admin/login' karanna
};

  return (
    <div className="w-64 h-screen bg-[#050505] border-r border-white/10 flex flex-col p-4 fixed left-0 top-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-[#39FF14] rounded-md shadow-[0_0_15px_rgba(57,255,20,0.5)]"></div>
        <h1 className="text-white font-bold tracking-widest text-lg">ADMIN <span className="text-[#39FF14]">PANEL</span></h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/50' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? "drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]" : ""} />
              <span className="font-medium tracking-wide text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
      >
        <LogOut size={20} />
        <span className="font-bold text-sm tracking-wide">LOGOUT</span>
      </button>
    </div>
  );
};

export default Sidebar;