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
import AdminManager from './pages/AdminPanel/AdminManager'; // <--- Aluth Import Eka

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
    const session = sessionStorage.getItem('norcal_access');
    if (session) setIsUnlocked(true);
    setLoading(false);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('norcal_access', 'true');
  };

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
        
        {/* --- ADMIN ZONE --- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Navigate to="/admin/dashboard" replace />} />
           <Route path="dashboard" element={<Dashboard />} /> 
           <Route path="products" element={<ProductManager />} />
           <Route path="categories" element={<CategoryManager />} />
           <Route path="users" element={<AdminManager />} /> {/* <--- Aluth Route Eka */}
           <Route path="settings" element={<GateSettings />} />
        </Route>

        {/* --- PUBLIC ZONE --- */}
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

        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;