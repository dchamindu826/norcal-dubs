import React, { useState, useEffect } from 'react';
import { getProducts, saveProduct, updateProduct, deleteProduct, getCategories } from '../../utils/api';
import { Plus, Trash2, Edit, X, Video, UploadCloud } from 'lucide-react';
import './FormStyles.css'; 

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null, name: '', price: '', offerPrice: '', 
    pageType: '', category: '', 
    description: '', images: [], videos: [], specialOffer: false
  });

  const fetchData = async () => {
    setProducts(await getProducts());
    setCategories(await getCategories());
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  // EDIT CLICK HANDLER
  const handleEdit = (product) => {
    setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        offerPrice: product.offerPrice || '',
        pageType: product.pageType,
        category: product.category || '',
        description: product.description || '',
        specialOffer: product.specialOffer || false,
        // Keep existing URLs loaded in preview format
        images: product.images.map(url => ({ url, preview: url })),
        videos: product.videos.map(url => ({ url, preview: url }))
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.pageType) {
        return alert("Name, Price and Page Type (Flower/Edibles/Dispos) are required!");
    }
    setLoading(true);

    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('offerPrice', formData.offerPrice || 0);
        data.append('pageType', formData.pageType); 
        data.append('category', formData.category || ''); 
        data.append('description', formData.description || '');
        data.append('specialOffer', formData.specialOffer);

        // Separate existing URLs and New Files
        formData.images.forEach(img => { 
            if (img.file) data.append('files', img.file); 
            else if (img.url) data.append('existingImages', img.url);
        });
        formData.videos.forEach(vid => { 
            if (vid.file) data.append('files', vid.file); 
            else if (vid.url) data.append('existingVideos', vid.url);
        });

        // Use Update API if ID exists, else Save API
        if (formData.id) {
            await updateProduct(formData.id, data);
        } else {
            await saveProduct(data);
        }
        
        closeModal();
        fetchData();
    } catch (error) {
        alert("Error saving.");
    } finally {
        setLoading(false);
    }
  };

  const closeModal = () => { 
      setShowForm(false); 
      setFormData({ id: null, name: '', price: '', offerPrice: '', pageType: '', category: '', description: '', images: [], videos: [], specialOffer: false }); 
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
  };
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setFormData(prev => ({ ...prev, videos: [...prev.videos, ...newFiles] }));
  };
  const removeImage = (i) => setFormData(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  const removeVideo = (i) => setFormData(p => ({ ...p, videos: p.videos.filter((_, idx) => idx !== i) }));

  return (
    <div className="relative pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 bg-black p-4 rounded-xl sm:rounded-none sm:p-0 sm:bg-transparent border border-gray-800 sm:border-none gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">INVENTORY</h2>
        <button onClick={() => setShowForm(true)} className="w-full sm:w-auto bg-[#39FF14] text-black font-bold py-3 sm:py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <Plus size={20} /> ADD DROP
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-[#111] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-800 flex justify-between items-center text-white hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <img src={p.images[0] || '/logo-nobg.png'} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0 border border-white/10" />
              <div className="truncate">
                <h3 className="font-bold text-sm sm:text-lg truncate">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="bg-[#39FF14]/10 text-[#39FF14] px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold uppercase">{p.pageType}</span>
                    <span className="text-gray-400 text-xs sm:text-sm font-mono">${p.price}</span>
                </div>
              </div>
            </div>
            
            {/* ACTION BUTTONS (EDIT & DELETE) */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button onClick={() => handleEdit(p)} className="p-2 sm:p-3 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white transition-colors rounded-lg">
                    <Edit size={16} className="sm:w-5 sm:h-5"/>
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 sm:p-3 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors rounded-lg">
                    <Trash2 size={16} className="sm:w-5 sm:h-5"/>
                </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="col-span-full text-gray-500 italic p-4 text-center text-sm">No products found.</div>}
      </div>

      {showForm && (
        <div className="pm-overlay">
          <div className="pm-modal">
            {/* Dynamic Title */}
            <div className="pm-header"><span className="pm-title">{formData.id ? 'EDIT DROP' : 'NEW DROP'}</span><button onClick={closeModal} className="pm-close-btn"><X size={24} className="sm:w-7 sm:h-7"/></button></div>
            <div className="pm-body">
              
              <div className="pm-group">
                  <label className="pm-label text-[#39FF14]">SELECT PAGE (REQUIRED)</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      {['Flower', 'Edibles', 'Dispos'].map(type => (
                          <button 
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, pageType: type})}
                            className={`py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold border transition-all text-xs sm:text-sm ${formData.pageType === type ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'bg-black text-gray-500 border-white/10 hover:border-white'}`}
                          >
                              {type}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="pm-grid-2">
                <div className="pm-group"><label className="pm-label">Product Name</label><input className="pm-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Blue Dream" /></div>
                
                <div className="pm-group">
                    <label className="pm-label">Sub-Category (Optional)</label>
                    <select className="pm-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="">None</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>

              <div className="pm-price-box">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <label className="pm-label text-[#39FF14] m-0">PRICING</label>
                    <div className="flex items-center gap-2">
                        <span className="pm-label m-0">OFFER?</span>
                        <input type="checkbox" checked={formData.specialOffer} onChange={e => setFormData({...formData, specialOffer: e.target.checked})} className="w-4 h-4 sm:w-5 sm:h-5 accent-[#39FF14]" />
                    </div>
                </div>
                <div className="pm-grid-2">
                  <div className="pm-group"><label className="pm-label">Regular ($)</label><input type="number" className="pm-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00"/></div>
                  {formData.specialOffer && <div className="pm-group"><label className="pm-label" style={{color:'#39FF14'}}>Offer ($)</label><input type="number" className="pm-input" style={{borderColor:'#39FF14', color:'#39FF14'}} value={formData.offerPrice} onChange={e => setFormData({...formData, offerPrice: e.target.value})} placeholder="0.00" /></div>}
                </div>
              </div>
              <div className="pm-group"><label className="pm-label">Description</label><textarea rows="3" className="pm-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Product details..." /></div>
              
              <div className="pm-group">
                <label className="pm-btn-add flex items-center justify-center gap-2 cursor-pointer text-center"><UploadCloud size={16} className="sm:w-[18px] sm:h-[18px]"/><span>ADD IMAGES</span><input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden /></label>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">{formData.images.map((img, i) => (<div key={i} className="relative group shrink-0"><img src={img.preview || img} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border border-gray-700 object-cover" /><button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs">×</button></div>))}</div>
              </div>
              <div className="pm-group">
                <label className="pm-btn-add flex items-center justify-center gap-2 cursor-pointer text-center"><Video size={16} className="sm:w-[18px] sm:h-[18px]"/><span>ADD VIDEOS</span><input type="file" accept="video/*" multiple onChange={handleVideoUpload} hidden /></label>
                <div className="flex flex-col gap-2 mt-2">{formData.videos.map((vid, i) => (<div key={i} className="flex justify-between items-center bg-[#151515] p-2 sm:p-3 rounded-lg border border-white/5"><span className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[200px]">{vid.file ? vid.file.name : `Video ${i+1}`}</span><button onClick={() => removeVideo(i)} className="text-red-500 text-[10px] sm:text-xs font-bold bg-red-500/10 px-2 py-1 rounded">REMOVE</button></div>))}</div>
              </div>

            </div>
            <div className="pm-footer">
                <button onClick={closeModal} className="text-gray-400 font-bold py-3 sm:py-0 text-sm sm:text-base hover:text-white transition-colors">CANCEL</button>
                {/* Dynamic Button Text */}
                <button onClick={handleSave} className="pm-btn-save" disabled={loading}>{loading ? 'SAVING...' : (formData.id ? 'UPDATE PRODUCT' : 'SAVE PRODUCT')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductManager;