import React, { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Video, Image as ImageIcon, ShoppingBag, Play, Phone, Send } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const allP = await getProducts();
      setProducts(allP.reverse());
      setFilteredProducts(allP);
      const allC = await getCategories();
      setCategories(['All', ...allC]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  const openProduct = (item) => {
    setSelectedProduct(item);
    if (item.images.length > 0) setActiveMedia({ type: 'image', url: item.images[0] });
    else if (item.videos.length > 0) setActiveMedia({ type: 'video', url: item.videos[0] });
  };

  return (
    <div className="pt-24 px-4 min-h-screen bg-[#050505] text-white pb-20">
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">PREMIUM <span className="text-[#39FF14]">COLLECTION</span></h1>
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input type="text" placeholder="Search Strains..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-full py-3 pl-12 pr-6 text-white outline-none focus:border-[#39FF14] transition-colors" />
        </div>
        <div className="flex gap-3 justify-center overflow-x-auto pb-4 px-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap ${activeCategory === cat ? 'bg-[#39FF14] text-black' : 'bg-[#111] text-gray-400 border border-white/10'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <AnimatePresence>
          {filteredProducts.map((item) => (
            <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={item.id} onClick={() => openProduct(item)} className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#39FF14] group cursor-pointer relative shadow-lg">
              {item.specialOffer && <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">SPECIAL OFFER</div>}
              <div className="h-64 overflow-hidden relative bg-[#111]">
                 <img src={item.images[0] || '/logo-nobg.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute bottom-2 right-2 flex gap-1">
                    {item.images.length > 1 && <div className="bg-black/60 p-1 rounded backdrop-blur-sm"><ImageIcon size={12} className="text-white"/></div>}
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/95 backdrop-blur-lg">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-[#0a0a0a] w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl border border-white/10 relative shadow-2xl flex flex-col md:flex-row">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-white hover:text-black border border-white/10"><X size={24} /></button>
              <div className="w-full md:w-1/2 bg-black flex flex-col border-b md:border-b-0 md:border-r border-white/10">
                <div className="flex-1 relative flex items-center justify-center bg-[#050505] p-4 min-h-[300px]">
                  {activeMedia?.type === 'video' ? (
                    <video src={activeMedia.url} controls autoPlay className="max-w-full max-h-[500px] rounded-lg shadow-2xl" />
                  ) : (
                    <img src={activeMedia?.url || '/logo-nobg.png'} className="max-w-full max-h-[500px] object-contain drop-shadow-2xl" alt="Main View" />
                  )}
                </div>
                <div className="h-24 bg-[#111] border-t border-white/10 flex items-center px-4 gap-3 overflow-x-auto scrollbar-hide">
                  {selectedProduct.images.map((img, i) => (
                    <button key={`img-${i}`} onClick={() => setActiveMedia({ type: 'image', url: img })} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeMedia?.url === img ? 'border-[#39FF14]' : 'border-transparent opacity-60'}`}><img src={img} className="w-full h-full object-cover" /></button>
                  ))}
                  {selectedProduct.videos.map((vid, i) => (
                    <button key={`vid-${i}`} onClick={() => setActiveMedia({ type: 'video', url: vid })} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-gray-900 transition-all ${activeMedia?.url === vid ? 'border-[#39FF14]' : 'border-transparent opacity-60'}`}><video src={vid} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center justify-center"><Play size={20} className="text-white fill-white" /></div></button>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col h-full overflow-y-auto">
                  <div className="mb-auto">
                    <span className="text-[#39FF14] font-bold tracking-[0.2em] uppercase text-xs mb-2 block">{selectedProduct.category}</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-none">{selectedProduct.name}</h2>
                    <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 inline-block">
                        {selectedProduct.specialOffer ? (
                             <div className="flex flex-col"><span className="text-sm text-gray-500 line-through font-bold mb-1">REGULAR: ${selectedProduct.price}</span><div className="flex items-center gap-3"><span className="text-4xl font-black text-[#39FF14]">${selectedProduct.offerPrice}</span><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Save Big</span></div></div>
                        ) : (<span className="text-4xl font-black text-white">${selectedProduct.price}</span>)}
                    </div>
                    <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Description</h4>
                    <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-8 border-l-2 border-[#39FF14] pl-4">{selectedProduct.description || "No description."}</p>
                  </div>
                  <div className="mt-8 space-y-4">
                      <button className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3 text-lg"><Phone size={20} /> CALL TO ORDER</button>
                      <a href="https://t.me/NorCalBudz707" target="_blank" rel="noreferrer" className="w-full bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#0088cc] font-bold py-4 rounded-xl hover:bg-[#0088cc] hover:text-white transition-all flex items-center justify-center gap-3"><Send size={20} /> ORDER VIA TELEGRAM</a>
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Shop;