import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import HowToOrder from './components/HowToOrder';

// Pages
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage'; // <-- IMPORTANT: Make sure you have this file
import Gate from './pages/Gate';
import Cart from './pages/Cart';
import Terms from './pages/Terms'; // <-- New Terms Page

// Admin Imports
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminPanel/AdminLayout';
import Dashboard from './pages/AdminPanel/Dashboard';
import ProductManager from './pages/AdminPanel/ProductManager';
import CategoryManager from './pages/AdminPanel/CategoryManager';
import GateSettings from './pages/AdminPanel/GateSettings';
import AdminManager from './pages/AdminPanel/AdminManager';

// --- LAYOUT HELPER (Makes sure Navbar & HowToOrder appear everywhere) ---
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <HowToOrder /> {/* Floating Button on all main pages */}
  </>
);

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- AUTO LOCK LOGIC ---
  const idleTimer = useRef(null);

  const handleLock = () => {
    console.log("Auto-locking due to inactivity...");
    setIsUnlocked(false);
    sessionStorage.removeItem('norcal_access');
    if (idleTimer.current) clearTimeout(idleTimer.current);
  };

  const resetTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(handleLock, 300000); // 5 Minutes
  };

  useEffect(() => {
    const session = sessionStorage.getItem('norcal_access');
    if (session) {
        setIsUnlocked(true);
        resetTimer();
    }
    setLoading(false);

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
        if (sessionStorage.getItem('norcal_access')) {
            resetTimer();
        }
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    
    return () => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('norcal_access', 'true');
    resetTimer();
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
           <Route path="users" element={<AdminManager />} /> 
           <Route path="settings" element={<GateSettings />} />
        </Route>

        {/* --- PUBLIC ZONE --- */}
        
        {/* 1. HOME (Wrapped in MainLayout now) */}
        <Route path="/" element={
          <PublicGuard>
            <MainLayout>
              <Home />
            </MainLayout>
          </PublicGuard>
        } />

        {/* 2. CATEGORY PAGES (Flower, Edibles, Dispos) */}
        <Route path="/flower" element={
          <PublicGuard>
            <MainLayout>
              <CategoryPage pageType="Flower" />
            </MainLayout>
          </PublicGuard>
        } />

        <Route path="/edibles" element={
          <PublicGuard>
            <MainLayout>
              <CategoryPage pageType="Edibles" />
            </MainLayout>
          </PublicGuard>
        } />

        <Route path="/dispos" element={
          <PublicGuard>
            <MainLayout>
              <CategoryPage pageType="Dispos" />
            </MainLayout>
          </PublicGuard>
        } />

        {/* 3. CART & TERMS */}
        <Route path="/cart" element={
            <PublicGuard>
                <MainLayout>
                    <Cart />
                </MainLayout>
            </PublicGuard>
        } />

        <Route path="/terms" element={
          <PublicGuard>
            <MainLayout>
              <Terms />
            </MainLayout>
          </PublicGuard>
        } />

        {/* 4. CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;