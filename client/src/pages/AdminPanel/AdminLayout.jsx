// src/pages/AdminPanel/AdminLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const isAdmin = sessionStorage.getItem('norcal_admin_auth');
  if (!isAdmin) {
    navigate('/admin/login'); // <--- Methanath '/admin' thibba eka '/admin/login' karanna
  }
}, [navigate]);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-gradient-to-br from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;