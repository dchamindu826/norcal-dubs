// src/pages/AdminPanel/ProductManager.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, saveProduct, deleteProduct, getCategories } from '../../utils/api';
import { Plus, Trash2, Edit, X, Check, Video, Image as ImageIcon, UploadCloud } from 'lucide-react';
import './FormStyles.css'; 

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // pageType default value is empty
  const [formData, setFormData] = useState({
    id: null, name: '', price: '', offerPrice: '', 
    pageType: '', category: '', // pageType is Mandatory, category is Optional
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

  const handleSave = async (e) => {
    e.preventDefault();
    // Validate Page Type
    if (!formData.name || !formData.price || !formData.pageType) {
        return alert("Name, Price and Page Type (Flower/Edibles/Dispos) are required!");
    }
    setLoading(true);

    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('offerPrice', formData.offerPrice || 0);
        data.append('pageType', formData.pageType); // Saving Page Type
        data.append('category', formData.category); // Optional
        data.append('description', formData.description);
        data.append('specialOffer', formData.specialOffer);

        formData.images.forEach(img => { if (img.file) data.append('files', img.file); });
        formData.videos.forEach(vid => { if (vid.file) data.append('files', vid.file); });

        await saveProduct(data);
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

  // ... (Image/Video Handlers keep same as before) ...
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
      <div className="flex justify-between items-center mb-8 bg-black p-4 border-b border-gray-800">
        <h2 className="text-3xl font-bold text-white">INVENTORY</h2>
        <button onClick={() => setShowForm(true)} className="pm-btn-save" style={{padding: '10px 20px'}}><Plus size={20} /> ADD DROP</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-[#111] p-4 rounded-xl border border-gray-800 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <img src={p.images[0] || '/logo-nobg.png'} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <span className="text-[#39FF14] text-xs font-bold uppercase mr-2">{p.pageType}</span>
                <span className="text-gray-500 text-sm">${p.price}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 bg-red-500/10 rounded"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="pm-overlay">
          <div className="pm-modal">
            <div className="pm-header"><span className="pm-title">NEW DROP</span><button onClick={closeModal} className="pm-close-btn"><X size={28} /></button></div>
            <div className="pm-body">
              
              {/* PAGE TYPE SELECTION (MANDATORY) */}
              <div className="pm-group">
                  <label className="pm-label text-[#39FF14]">SELECT PAGE (REQUIRED)</label>
                  <div className="grid grid-cols-3 gap-4">
                      {['Flower', 'Edibles', 'Dispos'].map(type => (
                          <button 
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, pageType: type})}
                            className={`py-3 rounded-xl font-bold border transition-all ${formData.pageType === type ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'bg-black text-gray-500 border-white/10 hover:border-white'}`}
                          >
                              {type}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="pm-grid-2">
                <div className="pm-group"><label className="pm-label">Product Name</label><input className="pm-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                
                {/* CATEGORY (OPTIONAL) */}
                <div className="pm-group">
                    <label className="pm-label">Sub-Category (Optional)</label>
                    <select className="pm-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="">None</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>

              {/* ... (Pricing, Description, Image Uploads - Same as before) ... */}
              <div className="pm-price-box">
                <div className="flex justify-between items-center mb-4"><label className="pm-label text-[#39FF14]">PRICING</label><div className="flex items-center gap-2"><span className="pm-label">OFFER?</span><input type="checkbox" checked={formData.specialOffer} onChange={e => setFormData({...formData, specialOffer: e.target.checked})} style={{width: '20px', height: '20px', accentColor: '#39FF14'}} /></div></div>
                <div className="pm-grid-2">
                  <div className="pm-group"><label className="pm-label">Regular ($)</label><input type="number" className="pm-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                  {formData.specialOffer && <div className="pm-group"><label className="pm-label" style={{color:'#39FF14'}}>Offer ($)</label><input type="number" className="pm-input" style={{borderColor:'#39FF14', color:'#39FF14'}} value={formData.offerPrice} onChange={e => setFormData({...formData, offerPrice: e.target.value})} /></div>}
                </div>
              </div>
              <div className="pm-group"><label className="pm-label">Description</label><textarea rows="3" className="pm-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              
              <div className="pm-group">
                <label className="pm-btn-add flex items-center justify-center gap-2 cursor-pointer text-center"><UploadCloud size={18} /><span>IMAGES</span><input type="file" accept="image/*" multiple onChange={handleImageUpload} hidden /></label>
                <div className="flex gap-2 mt-2 overflow-x-auto">{formData.images.map((img, i) => (<div key={i} className="relative group shrink-0"><img src={img.preview || img} className="w-16 h-16 rounded border border-gray-700 object-cover" /><button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">×</button></div>))}</div>
              </div>
              <div className="pm-group">
                <label className="pm-btn-add flex items-center justify-center gap-2 cursor-pointer text-center"><Video size={18} /><span>VIDEOS</span><input type="file" accept="video/*" multiple onChange={handleVideoUpload} hidden /></label>
                <div className="flex flex-col gap-2 mt-2">{formData.videos.map((vid, i) => (<div key={i} className="flex justify-between items-center bg-[#151515] p-2 rounded"><span className="text-xs text-gray-400">Video {i+1}</span><button onClick={() => removeVideo(i)} className="text-red-500 text-xs">REMOVE</button></div>))}</div>
              </div>

            </div>
            <div className="pm-footer"><button onClick={closeModal} className="text-gray-400 font-bold">CANCEL</button><button onClick={handleSave} className="pm-btn-save" disabled={loading}>{loading ? 'SAVING...' : 'SAVE PRODUCT'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductManager;