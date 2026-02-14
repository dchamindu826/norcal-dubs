import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4 flex justify-between items-center bg-black/90 backdrop-blur-xl border-b border-[#39FF14]/20">
        
        {/* 1. BRANDING (Logo + Name) */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo-nobg.png" 
            alt="Norcal Budz" 
            className="h-8 md:h-14 w-auto object-contain group-hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.6)] transition-all"
          />
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black tracking-tighter text-white leading-none">
              NORCAL <span className="text-[#39FF14]">BUDZ</span>
            </span>
            <span className="text-[8px] md:text-[10px] tracking-[0.4em] text-gray-400 uppercase group-hover:text-[#39FF14] transition-colors hidden md:block">
              Premium Cannabis
            </span>
          </div>
        </Link>
        
        {/* 2. DESKTOP MENU (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/10">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Products</Link>
          <Link to="/terms" className="nav-link">Terms</Link>
        </div>

        {/* 3. RIGHT ICONS */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* --- MOBILE SEARCH BAR (Visible only on Mobile) --- */}
          <div className="md:hidden flex items-center bg-white/10 rounded-full px-3 py-1.5 border border-white/10 w-32 focus-within:w-40 focus-within:border-[#39FF14] transition-all">
            <Search size={14} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-white text-xs ml-2 w-full placeholder:text-gray-500"
            />
          </div>

          {/* --- DESKTOP SEARCH (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-[#39FF14] transition-colors">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-white text-sm ml-2 w-24 focus:w-40 transition-all placeholder:text-gray-600"
            />
          </div>

          {/* --- CART ICON (Hidden on Mobile as requested) --- */}
          <Link to="/cart" className="relative text-white hover:text-[#39FF14] transition-colors hidden md:flex">
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-[#39FF14] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-[#39FF14]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col gap-6 animate-fade-in">
          <Link to="/" className="text-2xl font-bold text-white hover:text-[#39FF14] border-b border-white/10 pb-4" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
          <Link to="/shop" className="text-2xl font-bold text-white hover:text-[#39FF14] border-b border-white/10 pb-4" onClick={() => setIsMobileMenuOpen(false)}>PRODUCTS</Link>
          <Link to="/terms" className="text-2xl font-bold text-white hover:text-[#39FF14] border-b border-white/10 pb-4" onClick={() => setIsMobileMenuOpen(false)}>TERMS & CONDITIONS</Link>
          <Link to="/cart" className="text-2xl font-bold text-[#39FF14] flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
             <ShoppingBag size={24} /> CART (0)
          </Link>
        </div>
      )}

      <style>{`
        .nav-link {
          @apply text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#39FF14] transition-colors;
        }
      `}</style>
    </>
  );
};

export default Navbar;