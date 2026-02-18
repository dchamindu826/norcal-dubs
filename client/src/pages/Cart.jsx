import React, { useState, useEffect } from 'react';
import { Trash2, CreditCard, Mail, DollarSign, Upload, AlertTriangle, Plus, Minus, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({ name: '', telegram: '', phone: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState('CashApp');
  const [slipFile, setSlipFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('norcal_cart') || '[]');
    setCart(savedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('norcal_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('norcal_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const clearCart = () => {
    if(window.confirm("Are you sure you want to clear the cart?")) {
        setCart([]);
        localStorage.removeItem('norcal_cart');
        window.dispatchEvent(new Event('storage'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('customerName', formData.name);
      data.append('telegram', formData.telegram);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('notes', formData.notes);
      data.append('total', total);
      data.append('paymentMethod', paymentMethod);
      // Send cart with quantities
      data.append('items', JSON.stringify(cart));
      
      if (slipFile) {
        data.append('slip', slipFile);
      }

      await axios.post(`${API_URL}/orders`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Order Placed Successfully! Admin has been notified.");
      localStorage.removeItem('norcal_cart');
      setCart([]);
      window.dispatchEvent(new Event('storage'));
      window.location.href = '/';
      
    } catch (error) {
      console.error(error);
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="pt-32 text-center text-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">YOUR CART IS EMPTY</h2>
        <Link to="/" className="bg-[#39FF14] text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">GO SHOPPING</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: CART ITEMS */}
        <div>
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-3xl font-black uppercase italic">Your Cart</h2>
             <button onClick={clearCart} className="text-xs text-red-500 underline uppercase font-bold hover:text-red-400">Clear Cart</button>
          </div>
          
          <div className="space-y-4 mb-8">
            {cart.map((item, index) => (
              <div key={index} className="flex gap-4 bg-[#111] p-4 rounded-xl border border-white/5 hover:border-[#39FF14] transition-colors relative group">
                <img src={item.images[0]} className="w-24 h-24 object-cover rounded-lg bg-black" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">{item.name}</h3>
                    <p className="text-[#39FF14] font-mono font-bold">${item.price} <span className="text-gray-500 text-xs font-normal">/ unit</span></p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-black rounded-lg border border-white/10">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:text-[#39FF14]"><Minus size={14}/></button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-[#39FF14]"><Plus size={14}/></button>
                      </div>
                      <div className="text-right">
                          <p className="text-sm font-bold text-white">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                      </div>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-white/10 flex justify-between items-center">
             <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total Amount</span>
             <span className="text-3xl font-black text-[#39FF14]">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT: CHECKOUT FORM (Updated CSS) */}
        <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 shadow-2xl h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-50"></div>
          
          <h2 className="text-2xl font-black mb-6 text-white uppercase flex items-center gap-2">
            <CreditCard className="text-[#39FF14]" /> Secure Checkout
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Form Fields with Better Styling */}
            <div className="group">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block group-focus-within:text-[#39FF14] transition-colors">Full Name</label>
              <input required className="w-full bg-[#151515] border border-white/10 p-4 rounded-xl text-white focus:border-[#39FF14] outline-none transition-all placeholder:text-gray-700" placeholder="Enter your full name"
                onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="group">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block group-focus-within:text-[#39FF14] transition-colors">Telegram Username</label>
              <input required placeholder="@username" className="w-full bg-[#151515] border border-white/10 p-4 rounded-xl text-[#39FF14] focus:border-[#39FF14] outline-none transition-all placeholder:text-gray-700 font-medium" 
                onChange={e => setFormData({...formData, telegram: e.target.value})} />
              
              {/* Telegram Helper Text */}
              <div className="mt-2 flex items-start gap-2 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                 <div className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shrink-0">?</div>
                 <p className="text-[10px] text-gray-400 leading-tight">
                    To find your username: Open Telegram ➝ Settings ➝ Username. If you don't have one, please create it in Settings.
                 </p>
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block group-focus-within:text-[#39FF14] transition-colors">Phone Number</label>
              <input required type="tel" placeholder="(000) 000-0000" className="w-full bg-[#151515] border border-white/10 p-4 rounded-xl text-white focus:border-[#39FF14] outline-none transition-all placeholder:text-gray-700" 
                onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="group">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block group-focus-within:text-[#39FF14] transition-colors">Delivery Address</label>
              <textarea required rows="2" placeholder="Street, City, Zip Code..." className="w-full bg-[#151515] border border-white/10 p-4 rounded-xl text-white focus:border-[#39FF14] outline-none transition-all placeholder:text-gray-700 resize-none" 
                onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            {/* Payment Method Selection */}
            <div className="pt-4">
              <label className="text-[10px] text-gray-500 uppercase mb-3 block font-bold tracking-widest">Select Payment Method</label>
              <div className="grid grid-cols-1 gap-3">
                {['CashApp', 'Cash Through Mail'].map(method => (
                  <button key={method} type="button" 
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all duration-300 ${paymentMethod === method ? 'bg-[#39FF14] text-black border-[#39FF14] font-black translate-x-1 shadow-lg' : 'bg-[#151515] border-white/10 text-gray-400 hover:border-white/30'}`}
                  >
                    {method.includes('CashApp') && <DollarSign size={20} />}
                    
                    {method.includes('Mail') && <Mail size={20} />}
                    <span className="tracking-wide">{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INFO BOX */}
            <div className="bg-[#151515] p-5 rounded-xl border border-white/5 mt-2 text-center relative overflow-hidden">
                {paymentMethod === 'CashApp' && <><p className="text-gray-500 text-[10px] uppercase mb-1">Send Total to CashApp Tag</p><p className="text-2xl font-black text-white select-all cursor-pointer hover:text-[#39FF14] transition-colors">$NorCalBudz</p></>}
                {paymentMethod.includes('Mail') && <p className="text-white text-xs leading-relaxed">Please wrap cash securely. We will provide the mailing address via Telegram after you place the order.</p>}
                
                {(paymentMethod !== 'Cash Through Mail') && (
                     <div className="mt-4 bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-start gap-3 text-left">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-red-500 text-[10px] font-bold leading-relaxed">
                            IMPORTANT: Do NOT write "Weed", "Drugs" or "Buds" in payment notes. Leave blank or use your name.
                        </p>
                     </div>
                )}
            </div>

            {/* Slip Upload */}
            {(paymentMethod !== 'Cash Through Mail') && (
                <div className="mt-2">
                    <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block tracking-widest">Upload Payment Proof (Optional)</label>
                    <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#39FF14] hover:bg-white/5 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            onChange={(e) => setSlipFile(e.target.files[0])} />
                        <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-[#39FF14] transition-colors" size={24} />
                        {slipFile ? (
                            <p className="text-[#39FF14] text-xs font-bold">{slipFile.name}</p>
                        ) : (
                            <p className="text-gray-400 text-xs group-hover:text-white">Click to upload screenshot</p>
                        )}
                    </div>
                </div>
            )}

            <div className="group pt-2">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block">Special Notes</label>
              <textarea className="w-full bg-[#151515] border border-white/10 p-4 rounded-xl text-white focus:border-[#39FF14] outline-none transition-all placeholder:text-gray-700 resize-none" rows="2"
                onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Gate code, delivery instructions..." />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#39FF14] text-black font-black py-5 rounded-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:scale-[1.02] active:scale-95 transition-all mt-4 text-lg uppercase tracking-widest">
              {loading ? 'PROCESSING...' : 'COMPLETE ORDER'}
            </button>
            <p className="text-[10px] text-center text-gray-600 mt-2">All orders are encrypted and secure.</p>

          </form>
        </div>
      </div>
    </div>
  );
};
export default Cart;