import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Gate from './pages/Gate';

// Admin Imports
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminPanel/AdminLayout';
import Dashboard from './pages/AdminPanel/Dashboard';
import ProductManager from './pages/AdminPanel/ProductManager';
import CategoryManager from './pages/AdminPanel/CategoryManager';
import GateSettings from './pages/AdminPanel/GateSettings';
import AdminManager from './pages/AdminPanel/AdminManager';

// 1. Layout Helper (Navbar thiyena pages walata)
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session eke gate pass thiyenawada balanawa
    const session = sessionStorage.getItem('norcal_access');
    if (session) setIsUnlocked(true);
    setLoading(false);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('norcal_access', 'true');
  };

  // 2. PUBLIC GUARD (Me component eken thama Public pages protect karanne)
  const PublicGuard = ({ children }) => {
    if (!isUnlocked) {
      return <Gate onUnlock={handleUnlock} />;
    }
    return children;
  };

  if (loading) return null;

  return (
    <Router>
      <Routes>
        
        {/* --- ADMIN ZONE (No Gate Required) --- */}
        {/* Admin Login eka Gate eken eliye thiyenne */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Panel (Auth check wenne AdminLayout athule) */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Navigate to="/admin/dashboard" replace />} />
           <Route path="dashboard" element={<Dashboard />} /> 
           <Route path="products" element={<ProductManager />} />
           <Route path="categories" element={<CategoryManager />} />
           <Route path="users" element={<AdminManager />} />
           <Route path="settings" element={<GateSettings />} />
        </Route>


        {/* --- PUBLIC ZONE (Protected by Gate) --- */}
        {/* Hama public page ekakma 'PublicGuard' eken wrap karanawa */}
        
        <Route path="/" element={
          <PublicGuard>
            <Home />
          </PublicGuard>
        } />

        <Route path="/shop" element={
          <PublicGuard>
            <MainLayout>
              <Shop />
            </MainLayout>
          </PublicGuard>
        } />

        <Route path="/terms" element={
          <PublicGuard>
            <MainLayout>
              <div className="text-white p-32 text-center">Terms & Conditions</div>
            </MainLayout>
          </PublicGuard>
        } />


        {/* CATCH ALL (Waradi link gahuwoth Home ekata) */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;