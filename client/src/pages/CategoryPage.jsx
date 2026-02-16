import React, { useEffect, useState } from 'react';
import { getProducts } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Video, Image as ImageIcon, ShoppingBag, Play, Plus, Minus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const CategoryPage = ({ pageType }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [qty, setQty] = useState(1); // Quantity State
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const allP = await getProducts();
      const filtered = allP.filter(p => p.pageType === pageType).reverse();
      setProducts(filtered);

      if (location.state?.selectedId) {
        const productToOpen = filtered.find(p => p.id === location.state.selectedId);
        if (productToOpen) openProduct(productToOpen);
      }
    };
    fetchData();
  }, [pageType, location.state]);

  // Handle Add to Cart & Redirect
  const addToCart = () => {
    if (!selectedProduct) return;

    const currentCart = JSON.parse(localStorage.getItem('norcal_cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = currentCart.findIndex(item => item.id === selectedProduct.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += qty;
    } else {
      currentCart.push({ ...selectedProduct, quantity: qty });
    }

    localStorage.setItem('norcal_cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('storage'));
    
    // Redirect immediately to checkout
    navigate('/cart');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const openProduct = (item) => {
    setQty(1); // Reset qty
    setSelectedProduct(item);
    if (item.images.length > 0) setActiveMedia({ type: 'image', url: item.images[0] });
    else if (item.videos.length > 0) setActiveMedia({ type: 'video', url: item.videos[0] });
  };

  return (
    <div className="pt-24 px-4 min-h-screen bg-[#050505] text-white pb-20">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter uppercase">
          {pageType} <span className="text-[#39FF14]">MENU</span>
        </h1>
        
        {/* Search */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder={`Search ${pageType}...`} 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#111] border border-white/10 rounded-full py-3 pl-12 pr-6 text-white outline-none focus:border-[#39FF14] transition-colors" 
          />
        </div>
      </div>

      {/* PRODUCTS GRID (Simple Grid - No Complex Animations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {paginatedProducts.map((item) => (
            <div key={item.id} onClick={() => openProduct(item)} className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#39FF14] group cursor-pointer relative shadow-lg hover:-translate-y-1 transition-all duration-300">
              {item.specialOffer && <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">OFFER</div>}
              
              <div className="h-64 overflow-hidden relative bg-[#111]">
                  <img src={item.images[0] || '/logo-nobg.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-2 right-2 flex gap-1">
                      {item.videos.length > 0 && <div className="bg-black/60 p-1 rounded backdrop-blur-sm"><Video size={12} className="text-[#39FF14]"/></div>}
                  </div>
              </div>

              <div className="p-5">
                  <p className="text-[#39FF14] text-[10px] font-bold uppercase tracking-widest mb-1">{item.category}</p>
                  <h3 className="text-xl font-bold text-white leading-tight mb-4">{item.name}</h3>
                  <div className="flex justify-between items-center border-t border-white/10 pt-4">
                    <div className="flex flex-col">
                        {item.specialOffer ? (<><span className="text-gray-500 line-through text-xs">${item.price}</span><span className="text-[#39FF14] font-black text-2xl">${item.offerPrice}</span></>) : (<span className="text-white font-black text-2xl">${item.price}</span>)}
                    </div>
                    <button className="bg-white text-black p-2 rounded-full hover:bg-[#39FF14] transition-colors"><ShoppingBag size={20} /></button>
                  </div>
              </div>
            </div>
          ))}
      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/95 backdrop-blur-lg">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-[#0a0a0a] w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl border border-white/10 relative shadow-2xl flex flex-col md:flex-row">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-white hover:text-black border border-white/10 transition-colors"><X size={24} /></button>
              
              {/* MEDIA SECTION */}
              <div className="w-full md:w-1/2 bg-black flex flex-col border-b md:border-b-0 md:border-r border-white/10">
                <div className="flex-1 relative flex items-center justify-center bg-[#050505] p-4 min-h-[300px]">
                  {activeMedia?.type === 'video' ? (
                    <video src={activeMedia.url} controls autoPlay className="max-w-full max-h-[500px] rounded-lg shadow-2xl" />
                  ) : (
                    <img src={activeMedia?.url || '/logo-nobg.png'} className="max-w-full max-h-[500px] object-contain drop-shadow-2xl" alt="Main View" />
                  )}
                </div>
                {/* Thumbnails */}
                <div className="h-24 bg-[#111] border-t border-white/10 flex items-center px-4 gap-3 overflow-x-auto scrollbar-hide">
                  {selectedProduct.images.map((img, i) => (
                    <button key={`img-${i}`} onClick={() => setActiveMedia({ type: 'image', url: img })} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeMedia?.url === img ? 'border-[#39FF14]' : 'border-transparent opacity-60'}`}><img src={img} className="w-full h-full object-cover" /></button>
                  ))}
                  {selectedProduct.videos.map((vid, i) => (
                    <button key={`vid-${i}`} onClick={() => setActiveMedia({ type: 'video', url: vid })} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-gray-900 transition-all ${activeMedia?.url === vid ? 'border-[#39FF14]' : 'border-transparent opacity-60'}`}><video src={vid} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center justify-center"><Play size={20} className="text-white fill-white" /></div></button>
                  ))}
                </div>
              </div>

              {/* DETAILS SECTION */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col h-full overflow-y-auto">
                  <div className="mb-auto">
                    <span className="text-[#39FF14] font-bold tracking-[0.2em] uppercase text-xs mb-2 block">{selectedProduct.pageType} / {selectedProduct.category}</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-none">{selectedProduct.name}</h2>
                    <div className="mb-8 mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 inline-block">
                        {selectedProduct.specialOffer ? (
                             <div className="flex flex-col"><span className="text-sm text-gray-500 line-through font-bold mb-1">REGULAR: ${selectedProduct.price}</span><div className="flex items-center gap-3"><span className="text-4xl font-black text-[#39FF14]">${selectedProduct.offerPrice}</span><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Save Big</span></div></div>
                        ) : (<span className="text-4xl font-black text-white">${selectedProduct.price}</span>)}
                    </div>
                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Description</h4>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-8 border-l-2 border-[#39FF14] pl-4">{selectedProduct.description || "No description available."}</p>
                  </div>

                  {/* QUANTITY & ADD TO CART */}
                  <div className="mt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs font-bold uppercase text-gray-500">Quantity:</span>
                        <div className="flex items-center bg-[#111] rounded-full border border-white/20">
                          <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:text-[#39FF14]"><Minus size={16}/></button>
                          <span className="w-8 text-center font-bold">{qty}</span>
                          <button onClick={() => setQty(qty + 1)} className="p-3 hover:text-[#39FF14]"><Plus size={16}/></button>
                        </div>
                      </div>

                      <button 
                        onClick={addToCart}
                        className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all flex items-center justify-center gap-3 text-lg"
                      >
                        <ShoppingBag size={24} /> BUY NOW
                      </button>
                      <p className="text-center text-gray-500 text-xs mt-3 uppercase tracking-widest">You will be redirected to checkout</p>
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;