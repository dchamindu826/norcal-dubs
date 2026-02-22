import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MENNA ME TIKA WENAS KARANNA ---
import hero1 from '../assets/hero1.jpeg'; // .jpg nemei .jpeg
import hero2 from '../assets/hero2.jpeg'; // .jpg nemei .jpeg
import hero3 from '../assets/hero3.jpeg'; // .jpg nemei .jpeg
import hero4 from '../assets/hero4.jpg';  // Meka hari (.jpg ma thiyanna)
const Hero = () => {
  // Slide Data (Image + Text)
  const slides = [
    { 
      id: 1, 
      image: hero1, 
      title: "PURE GENETICS", 
      subtitle: "Exotic Strains from Northern California" 
    },
    { 
      id: 2, 
      image: hero2, 
      title: "SCIENTIFIC PURITY", 
      subtitle: "Hydroponically Grown for Maximum Potency" 
    },
    { 
      id: 3, 
      image: hero3, 
      title: "NATURE'S GIFT", 
      subtitle: "100% Organic & Pesticide Free" 
    },
    { 
      id: 4, 
      image: hero4, 
      title: "ELEVATED MIND", 
      subtitle: "Experience the Next Level of Relaxation" 
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto Slide Logic (Every 5 Seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">
      
      {/* --- SLIDESHOW BACKGROUND --- */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Image */}
          <img 
            src={slides[current].image} 
            alt={slides[current].title} 
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Dark Overlay Gradient (Top & Bottom fade) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90"></div>
        </motion.div>
      </AnimatePresence>

      {/* --- CONTENT OVERLAY --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        
        {/* Animated Text */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={current}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h2 className="text-[#39FF14] tracking-[0.3em] text-sm md:text-base uppercase font-bold mb-4 drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
              Welcome to Norcal Budz
            </h2>
            
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none drop-shadow-2xl">
              {slides[current].title}
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl tracking-wide font-light mb-10">
              {slides[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CTA Button (Static) */}
        <Link to="/flower">
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "#39FF14", color: "#000" }}
    whileTap={{ scale: 0.95 }}
    className="group relative px-8 py-4 bg-transparent border border-[#39FF14] text-[#39FF14] rounded-full font-bold uppercase tracking-widest transition-all duration-300 overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      View Collection <ArrowRight size={18} />
    </span>
    <div className="absolute inset-0 bg-[#39FF14] translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
  </motion.button>
</Link>

      </div>

      {/* --- SLIDE INDICATORS (Dots at bottom) --- */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === current ? "w-8 bg-[#39FF14]" : "w-2 bg-white/30 hover:bg-white"
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default Hero;