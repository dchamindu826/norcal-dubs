// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { getProducts } from '../utils/storage';
import { Send, Phone, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StatsCounter from '../components/StatsCounter';
import { Link } from 'react-router-dom';

const Home = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // 1. Products Load (Reverse karala mul 4 gannawa)
    const all = getProducts();
    setRecentProducts(all.reverse().slice(0, 4));

    // 2. View Count Logic (Add this part)
    // Kalin thiyena gana gannawa, nattam 1250 kiyala boru ganak denawa start ekata
    let currentViews = parseInt(localStorage.getItem('norcal_site_views') || '1250');
    
    // Gana 1kin wadi karanawa
    currentViews += 1;
    
    // Ayeth save karanawa
    localStorage.setItem('norcal_site_views', currentViews.toString());
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white pb-20">
      <Navbar />
      <Hero />
      <StatsCounter />

      {/* Action Bar */}
      <div className="container mx-auto px-6 mt-16 mb-16">
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Telegram */}
          <a href="https://t.me/NorCalBudz707" target="_blank" rel="noreferrer" className="flex-1 group">
            <div className="bg-[#0088cc]/10 border border-[#0088cc]/30 p-6 rounded-2xl flex items-center justify-between hover:bg-[#0088cc] transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-[#0088cc] text-white p-3 rounded-full group-hover:bg-white group-hover:text-[#0088cc] transition-colors">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Join Telegram</h3>
                  <p className="text-[#0088cc] text-xs uppercase tracking-widest font-bold group-hover:text-white/80">Exclusive Drops</p>
                </div>
              </div>
              <ArrowRight className="text-[#0088cc] group-hover:text-white transform group-hover:translate-x-2 transition-transform" />
            </div>
          </a>

          {/* Phone */}
          <a href="tel:+17074526706" className="flex-1 group">
            <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 p-6 rounded-2xl flex items-center justify-between hover:bg-[#39FF14] transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-[#39FF14] text-black p-3 rounded-full group-hover:bg-black group-hover:text-[#39FF14] transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-black">Call Now</h3>
                  <p className="text-[#39FF14] text-xs uppercase tracking-widest font-bold group-hover:text-black/70">+1 (707) 4526706</p>
                </div>
              </div>
              <ArrowRight className="text-[#39FF14] group-hover:text-black transform group-hover:translate-x-2 transition-transform" />
            </div>
          </a>
        </div>
      </div>

      {/* RECENT PRODUCTS */}
      <div className="container mx-auto px-6">
        
        {/* --- HEADING FIX (Mobile Center) --- */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 border-b border-white/10 pb-6 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tighter mb-2">
              FRESH <span className="text-[#39FF14]">DROPS</span>
            </h2>
            <p className="text-gray-400 text-sm tracking-wide">Latest arrivals in stock</p>
          </div>
          
          <Link to="/shop" className="flex items-center gap-2 text-xs font-bold bg-[#39FF14] text-black px-6 py-3 rounded-full hover:bg-white transition-all uppercase tracking-widest hover:scale-105">
            View Collection <ArrowRight size={14}/>
          </Link>
        </div>

        {recentProducts.length === 0 ? (
           <div className="text-center py-10 text-gray-600 border border-dashed border-white/10 rounded-2xl">
              <p>No products added yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((item) => (
              <div key={item.id} className="group bg-[#111] rounded-2xl p-4 border border-white/5 hover:border-[#39FF14] transition-all duration-300 relative">
                
                {/* Image Area */}
                <div className="h-64 bg-black rounded-xl mb-4 overflow-hidden relative">
                  <img src={item.images[0] || '/logo-nobg.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Link to="/shop" className="bg-[#39FF14] text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye size={14} /> VIEW DETAILS
                     </Link>
                  </div>

                  {item.specialOffer && <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">SALE</span>}
                </div>
                
                <div className="px-1">
                  <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold">{item.category}</p>
                  
                  <div className="flex justify-between items-end border-t border-white/10 pt-3">
                    <div className="flex flex-col">
                        {item.specialOffer ? (
                            <>
                              <span className="text-gray-500 line-through text-[10px]">${item.price}</span>
                              <span className="text-[#39FF14] font-black text-xl">${item.offerPrice}</span>
                            </>
                        ) : (
                            <span className="text-white font-black text-xl">${item.price}</span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;