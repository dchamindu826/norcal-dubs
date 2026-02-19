import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react'; 

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('norcal_admin_auth');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-4 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <img src="/logo-nobg.png" className="w-8" alt="Logo" />
            <span className="font-black text-white tracking-tighter text-lg">ADMIN</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#39FF14]">
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content Area - ADDED EXTRA TOP PADDING (pt-24 & pt-10) */}
      <div className="flex-1 md:ml-64 pt-24 md:pt-10 p-4 md:p-8 overflow-y-auto h-screen bg-gradient-to-br from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto mt-2 md:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;