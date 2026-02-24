import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import { Eye, Search, Filter, X, ShoppingBag, Check, Play } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null); // <-- Main screen eke penna one image/video eka
  const [addedToCart, setAddedToCart] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const categories = ['All', 'Flower', 'Edibles', 'Dispos'];

  // Modal eka open karanakota main media eka set karana function eka
  const openProductModal = (product) => {
      setSelectedProduct(product);
      if (product.images && product.images.length > 0) {
          setActiveMedia({ type: 'image', url: product.images[0] });
      } else if (product.videos && product.videos.length > 0) {
          setActiveMedia({ type: 'video', url: product.videos[0] });
      } else {
          setActiveMedia(null);
      }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts();
        const reversedProducts = allProducts.reverse();
        setProducts(reversedProducts);
        setFilteredProducts(reversedProducts);

        if (location.state && location.state.selectedId) {
            const productToOpen = reversedProducts.find(p => p.id === location.state.selectedId);
            if (productToOpen) openProductModal(productToOpen);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.state]);

  useEffect(() => {
    let result = products;

    if (activeTab !== 'All') {
      result = result.filter(p => p.pageType === activeTab || p.category === activeTab);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [activeTab, searchQuery, products]);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('norcal_cart') || '[]');
    cart.push({ ...product, cartId: Date.now(), quantity: 1 });
    localStorage.setItem('norcal_cart', JSON.stringify(cart));
    
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/cart');
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="container mx-auto max-w-7xl">
        
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase drop-shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            PREMIUM <span className="text-[#39FF14]">COLLECTION</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Explore our premium selection of exotic strains, delicious edibles, and high-quality disposables.
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-full p-2 mb-10 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-20 z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          
          <div className="flex gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide px-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 md:px-6 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === cat 
                  ? 'bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.4)] scale-105' 
                  : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 px-2 pb-2 md:pb-0 md:pr-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-white/10 text-white text-sm rounded-full py-3 pl-10 pr-4 outline-none focus:border-[#39FF14] focus:bg-black transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#0a0a0a] border border-dashed border-white/10 rounded-3xl">
            <Filter size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">No Products Found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
            <button onClick={() => {setActiveTab('All'); setSearchQuery('');}} className="mt-6 text-[#39FF14] text-xs font-bold uppercase tracking-widest hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
            {filteredProducts.map((item) => (
              <div 
                key={item.id} 
                className="group bg-[#0a0a0a] rounded-2xl md:rounded-3xl p-3 md:p-4 border border-white/5 hover:border-[#39FF14]/50 transition-all duration-300 relative shadow-xl hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] cursor-pointer flex flex-col"
                onClick={() => openProductModal(item)} 
              >
                <div className="h-40 md:h-64 bg-black rounded-xl md:rounded-2xl mb-4 overflow-hidden relative">
                  <img src={item.images[0] || '/logo-nobg.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-[#39FF14] text-black px-4 md:px-6 py-2 md:py-3 rounded-full font-black text-[10px] md:text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.5)] uppercase tracking-widest">
                         <Eye size={16} /> View
                      </div>
                  </div>
                  
                  {item.specialOffer && <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-3 py-1 rounded-full shadow-lg z-10">SALE</span>}
                </div>
                
                <div className="px-1 flex-1 flex flex-col">
                  <h3 className="text-base md:text-xl font-black text-white truncate mb-1">{item.name}</h3>
                  
                  <div className="flex justify-between items-center mb-4">
                      <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold">{item.category}</p>
                      <span className="text-[8px] md:text-[9px] bg-white/5 text-gray-400 px-2 py-1 rounded md:rounded-md uppercase font-bold">{item.pageType}</span>
                  </div>
                  
                  <div className="mt-auto border-t border-white/10 pt-3 md:pt-4 flex justify-between items-center">
                        {item.specialOffer ? (
                            <div className="flex flex-col">
                                <span className="text-gray-600 line-through text-[10px] md:text-xs font-medium">${item.price}</span>
                                <span className="text-[#39FF14] font-black text-lg md:text-2xl leading-none">${item.offerPrice}</span>
                            </div>
                        ) : (
                            <span className="text-white font-black text-lg md:text-2xl">${item.price}</span>
                        )}
                        <div className="bg-white/5 p-2 rounded-full text-white group-hover:bg-[#39FF14] group-hover:text-black transition-colors">
                            <ShoppingBag size={18} className="md:w-5 md:h-5" />
                        </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- EBAY STYLE PRODUCT DETAILS MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0a0a0a] w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border border-[#39FF14]/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative flex flex-col md:flex-row">
                
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-black/50 text-gray-400 hover:text-white p-2 rounded-full z-20 backdrop-blur-md border border-white/10 hover:border-white transition-all">
                    <X size={20} />
                </button>

                {/* Left Side: Ebay Style Media Viewer */}
                <div className="w-full md:w-1/2 flex flex-col bg-[#050505] relative border-r border-white/5 h-[50vh] md:h-auto">
                    {selectedProduct.specialOffer && (
                        <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            SPECIAL OFFER
                        </div>
                    )}
                    
                    {/* Main Viewing Window */}
                    <div className="flex-1 w-full flex items-center justify-center bg-black overflow-hidden relative">
                        {activeMedia ? (
                            activeMedia.type === 'image' ? (
                                <img src={activeMedia.url} className="w-full h-full object-contain" alt={selectedProduct.name} />
                            ) : (
                                <video src={activeMedia.url} controls autoPlay className="w-full h-full object-contain" />
                            )
                        ) : (
                            <img src="/logo-nobg.png" className="w-full h-full object-contain opacity-30 p-10" alt="No Media" />
                        )}
                    </div>

                    {/* Small Thumbnails (Chuti Kotu) */}
                    {((selectedProduct.images?.length || 0) + (selectedProduct.videos?.length || 0)) > 1 && (
                        <div className="h-24 md:h-28 w-full flex gap-3 p-3 overflow-x-auto scrollbar-hide bg-[#0a0a0a] border-t border-white/5 items-center">
                            
                            {/* Image Thumbnails */}
                            {selectedProduct.images?.map((img, idx) => (
                                <button 
                                    key={`thumb-img-${idx}`}
                                    onClick={() => setActiveMedia({ type: 'image', url: img })}
                                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeMedia?.url === img ? 'border-[#39FF14] opacity-100 scale-105 shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="thumb" />
                                </button>
                            ))}

                            {/* Video Thumbnails */}
                            {selectedProduct.videos?.map((vid, idx) => (
                                <button 
                                    key={`thumb-vid-${idx}`}
                                    onClick={() => setActiveMedia({ type: 'video', url: vid })}
                                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 relative ${activeMedia?.url === vid ? 'border-[#39FF14] opacity-100 scale-105 shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                >
                                    <video src={vid} className="w-full h-full object-cover" />
                                    {/* Play icon inside thumbnail */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md rounded-full p-1.5">
                                            <Play size={14} className="text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                </button>
                            ))}

                        </div>
                    )}
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto scrollbar-hide h-[40vh] md:h-full">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#39FF14] text-[10px] font-black uppercase tracking-widest bg-[#39FF14]/10 px-3 py-1 rounded-full border border-[#39FF14]/20">
                            {selectedProduct.pageType}
                        </span>
                        {selectedProduct.category && (
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                {selectedProduct.category}
                            </span>
                        )}
                    </div>
                    
                    <h2 className="text-2xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                        {selectedProduct.name}
                    </h2>

                    <div className="flex items-end gap-3 mb-6 pb-6 border-b border-white/10">
                        {selectedProduct.specialOffer ? (
                            <>
                                <span className="text-[#39FF14] text-3xl md:text-4xl font-black">${selectedProduct.offerPrice}</span>
                                <span className="text-gray-600 line-through text-base md:text-lg font-bold mb-1">${selectedProduct.price}</span>
                            </>
                        ) : (
                            <span className="text-white text-3xl md:text-4xl font-black">${selectedProduct.price}</span>
                        )}
                    </div>

                    <div className="flex-1 mb-8">
                        <h4 className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-3">Description</h4>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                            {selectedProduct.description || "No description available for this premium product."}
                        </p>
                    </div>

                    <button 
                        onClick={() => handleAddToCart(selectedProduct)}
                        disabled={addedToCart}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 text-sm md:text-base mt-auto flex-shrink-0 ${
                            addedToCart 
                            ? 'bg-white text-black' 
                            : 'bg-[#39FF14] text-black hover:bg-white hover:scale-[1.02]'
                        }`}
                    >
                        {addedToCart ? (
                            <><Check size={20} /> ADDED TO CART</>
                        ) : (
                            <><ShoppingBag size={20} /> ADD TO CART</>
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Collection;