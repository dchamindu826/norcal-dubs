import React, { useState } from 'react';
import { HelpCircle, X, ShoppingCart, FileText, CreditCard, MessageCircle } from 'lucide-react';

const HowToOrder = () => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    {
      icon: <ShoppingCart size={18} className="text-black" />,
      title: "FILL CART",
      desc: "Add items to your cart."
    },
    {
      icon: <FileText size={18} className="text-black" />,
      title: "CHECKOUT",
      desc: "Enter details & Telegram username."
    },
    {
      icon: <CreditCard size={18} className="text-black" />,
      title: "PAYMENT",
      desc: "Pay via CashApp, Crypto, or Mail."
    },
    {
      icon: <MessageCircle size={18} className="text-black" />,
      title: "WE CONTACT",
      desc: "Admin will message you on Telegram."
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#39FF14] text-black font-black p-3 md:p-4 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.5)] hover:scale-110 transition-transform flex items-center gap-2 animate-bounce-slow"
      >
        <HelpCircle size={24} strokeWidth={2.5} />
        <span className="hidden md:inline text-sm tracking-widest uppercase">GUIDE</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/95 backdrop-blur-md animate-fade-in overflow-y-auto py-10">
          <div className="bg-[#0a0a0a] border border-[#39FF14]/30 w-full max-w-sm md:max-w-lg rounded-3xl p-6 md:p-8 relative shadow-[0_0_50px_rgba(57,255,20,0.1)] my-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 bg-[#111] text-gray-400 hover:text-white p-2 rounded-full border border-white/10 hover:border-white transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6 md:mb-10 mt-2">
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                HOW TO <span className="text-[#39FF14]">ORDER</span>
              </h2>
              <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mt-2">Simple 4-Step Process</p>
            </div>

            {/* Steps List */}
            <div className="space-y-4 md:space-y-6 relative pl-2">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#39FF14]/20"></div>

              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 relative items-start">
                  {/* Number Bubble */}
                  <div className="relative z-10 bg-[#39FF14] w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(57,255,20,0.3)] border-2 border-black">
                    {step.icon}
                  </div>
                  
                  {/* Text */}
                  <div className="bg-[#111] p-3 md:p-4 rounded-xl border border-white/5 flex-1 hover:border-[#39FF14]/50 transition-colors">
                    <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wider mb-1">{step.title}</h4>
                    <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Link */}
            <div className="mt-6 md:mt-8 text-center pt-6 border-t border-white/10">
              <a 
                href="https://t.me/NorCalBudz707" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#0088cc] bg-[#0088cc]/10 px-6 py-3 rounded-full font-bold text-xs hover:bg-[#0088cc] hover:text-white transition-all w-full justify-center md:w-auto"
              >
                <MessageCircle size={16} /> CONTACT SUPPORT
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default HowToOrder;