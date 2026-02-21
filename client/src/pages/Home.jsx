import React, { useEffect, useState } from 'react';
import { getProducts, incrementView } from '../utils/api';
import { Send, Phone, ArrowRight, Eye, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import StatsCounter from '../components/StatsCounter';
import Testimonials from '../components/Testimonials';
import MusicPlayer from '../components/MusicPlayer'; // <-- Music Player eka
import { Link } from 'react-router-dom';

const Home = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getProducts();
        setRecentProducts(all.reverse().slice(0, 4));
        await incrementView();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getProductLink = (product) => {
      if (product.pageType === 'Edibles') return '/edibles';
      if (product.pageType === 'Dispos') return '/dispos';
      return '/flower'; 
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white pb-20 overflow-x-hidden">
      
      <Hero />

      {/* --- HIGHLIGHTED TAGLINE --- */}
      {/* මෙතන -mt-4 වෙනුවට mt-16 දාලා උඩින් ලොකු space එකක් දුන්නා */}
      <div className="container mx-auto px-4 mt-16 mb-12 relative z-20 text-center">
          <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-md border border-[#39FF14]/50 px-6 md:px-10 py-3 md:py-4 rounded-full shadow-[0_0_30px_rgba(57,255,20,0.3)] animate-fade-in">
              <Sparkles size={20} className="text-[#39FF14] animate-pulse" />
              <p className="text-white text-xs md:text-base font-black tracking-widest uppercase text-shadow-glow">
                  Flower From The Emerald Triangle In Northern California
              </p>
              <Sparkles size={20} className="text-[#39FF14] animate-pulse" />
          </div>
      </div>

      <StatsCounter />
      
      {/* Action Bar (Cards) */}
      {/* Cards ටික මැදට වෙන්න max-w-5xl දාලා, gap එක gap-8 කළා */}
      <div className="container mx-auto px-6 mb-24 mt-16 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <a href="https://t.me/NorCalBudz707" target="_blank" rel="noreferrer" className="flex-1 group">
            <div className="bg-[#0088cc]/10 border border-[#0088cc]/30 p-6 md:p-8 rounded-2xl flex items-center justify-between hover:bg-[#0088cc] transition-all cursor-pointer shadow-lg hover:shadow-[#0088cc]/50">
              <div className="flex items-center gap-5">
                <div className="bg-[#0088cc] text-white p-4 rounded-full group-hover:bg-white group-hover:text-[#0088cc] transition-colors"><Send size={28} /></div>
                <div><h3 className="text-2xl font-bold text-white">Join Telegram</h3><p className="text-[#0088cc] text-sm uppercase font-bold group-hover:text-white/80 mt-1">Exclusive Drops</p></div>
              </div>
              <ArrowRight className="text-[#0088cc] group-hover:text-white transform group-hover:translate-x-3 transition-transform" size={28} />
            </div>
          </a>
          
          <a href="tel:+17074526706" className="flex-1 group">
            <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 p-6 md:p-8 rounded-2xl flex items-center justify-between hover:bg-[#39FF14] transition-all cursor-pointer shadow-lg hover:shadow-[#39FF14]/50">
              <div className="flex items-center gap-5">
                <div className="bg-[#39FF14] text-black p-4 rounded-full group-hover:bg-black group-hover:text-[#39FF14] transition-colors"><Phone size={28} /></div>
                <div><h3 className="text-2xl font-bold text-white group-hover:text-black">Call Now</h3><p className="text-[#39FF14] text-sm uppercase font-bold group-hover:text-black/70 mt-1">+1 (707) 452-6706</p></div>
              </div>
              <ArrowRight className="text-[#39FF14] group-hover:text-black transform group-hover:translate-x-3 transition-transform" size={28} />
            </div>
          </a>
        </div>
      </div>

      {/* RECENT DROPS */}
      <div className="container mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 border-b border-white/10 pb-6 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tighter mb-2">FRESH <span className="text-[#39FF14]">DROPS</span></h2>
            <p className="text-gray-400 text-sm tracking-wide">Latest arrivals in stock</p>
          </div>
          <Link to="/flower" className="flex items-center gap-2 text-xs font-bold bg-[#39FF14] text-black px-6 py-3 rounded-full hover:bg-white transition-all uppercase tracking-widest hover:scale-105 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            View Collection <ArrowRight size={14}/>
          </Link>
        </div>

        {recentProducts.length === 0 ? (
           <div className="text-center py-10 text-gray-600 border border-dashed border-white/10 rounded-2xl"><p>No products added yet.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((item) => (
              <div key={item.id} className="group bg-[#111] rounded-2xl p-4 border border-white/5 hover:border-[#39FF14] transition-all relative">
                <div className="h-64 bg-black rounded-xl mb-4 overflow-hidden relative">
                  <img src={item.images[0] || '/logo-nobg.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Link 
                        to={getProductLink(item)} 
                        state={{ selectedId: item.id }} 
                        className="bg-[#39FF14] text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                      >
                         <Eye size={14} /> VIEW DETAILS
                      </Link>
                  </div>
                  {item.specialOffer && <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-10">SALE</span>}
                </div>
                <div className="px-1">
                  <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-bold">{item.category}</p>
                  <div className="flex justify-between items-end border-t border-white/10 pt-3">
                    <div className="flex flex-col">
                        {item.specialOffer ? (
                            <><span className="text-gray-500 line-through text-[10px]">${item.price}</span><span className="text-[#39FF14] font-black text-xl">${item.offerPrice}</span></>
                        ) : (<span className="text-white font-black text-xl">${item.price}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Testimonials />
      <MusicPlayer />

    </div>
  );
};

export default Home;