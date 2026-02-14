import React, { useState, useEffect } from 'react';
import { getProducts, saveProducts, getCategories } from '../../utils/storage';
import { Plus, Trash2, Edit, X, Check, Video, Image as ImageIcon, UploadCloud } from 'lucide-react';

import './FormStyles.css'; 

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // Upload wenakota pennanna
  
  const [formData, setFormData] = useState({
    id: null, name: '', price: '', offerPrice: '', category: '', 
    description: '', images: [], videos: [], specialOffer: false
  });

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  const handleDelete = (id) => {
    if(window.confirm('Delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Fill required fields!");

    const payload = {
      ...formData,
      id: formData.id || Date.now(),
      price: parseFloat(formData.price),
      offerPrice: formData.specialOffer ? parseFloat(formData.offerPrice) : null
    };
    
    const updatedProducts = formData.id 
      ? products.map(p => p.id === formData.id ? payload : p)
      : [...products, payload];

    try {
        setProducts(updatedProducts);
        saveProducts(updatedProducts);
        closeModal();
    } catch (error) {
        alert("Storage Full! Images loku wadi. Podi images use karanna.");
    }
  };

  const closeModal = () => { setShowForm(false); resetForm(); };
  
  const resetForm = () => {
    setFormData({ id: null, name: '', price: '', offerPrice: '', category: '', description: '', images: [], videos: [], specialOffer: false });
  };

  // --- FILE CONVERSION HELPER (File -> Base64) ---
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
        return alert("Maximum 5 images allowed!");
    }

    setLoading(true);
    const base64Files = await Promise.all(files.map(convertToBase64));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Files] }));
    setLoading(false);
  };

  // --- VIDEO UPLOAD HANDLER ---
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.videos.length > 3) {
        return alert("Maximum 3 videos allowed!");
    }

    // Warning for large videos
    if (files.some(f => f.size > 5000000)) { // 5MB limit check (Optional)
        alert("Warning: Videos are large. Local storage might get full.");
    }

    setLoading(true);
    const base64Files = await Promise.all(files.map(convertToBase64));
    setFormData(prev => ({ ...prev, videos: [...prev.videos, ...base64Files] }));
    setLoading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeVideo = (index) => {
    setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
  };

  return (
    <div className="relative pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-black p-4 border-b border-gray-800">
        <h2 className="text-3xl font-bold text-white">INVENTORY</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="pm-btn-save" style={{padding: '10px 20px'}}>
          <Plus size={20} /> ADD DROP
        </button>
      </div>

      {/* LIST VIEW */}
      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-[#111] p-4 rounded-xl border border-gray-800 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <img src={p.images[0] || '/logo-nobg.png'} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-gray-500 text-sm">${p.price}</p>
                <div className="flex gap-2 mt-1">
                    {p.images.length > 0 && <span className="text-xs bg-gray-800 px-1 rounded flex items-center gap-1"><ImageIcon size={10}/> {p.images.length}</span>}
                    {p.videos.length > 0 && <span className="text-xs bg-gray-800 px-1 rounded flex items-center gap-1 text-[#39FF14]"><Video size={10}/> {p.videos.length}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFormData(p); setShowForm(true); }} className="p-2 text-blue-500 bg-blue-500/10 rounded"><Edit /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 bg-red-500/10 rounded"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {/* --- THE MODAL FORM --- */}
      {showForm && (
        <div className="pm-overlay">
          <div className="pm-modal">
            
            {/* Header */}
            <div className="pm-header">
              <span className="pm-title">{formData.id ? 'EDIT DROP' : 'NEW DROP'}</span>
              <button onClick={closeModal} className="pm-close-btn"><X size={28} /></button>
            </div>

            {/* Body */}
            <div className="pm-body">
              
              <div className="pm-grid-2">
                <div className="pm-group">
                  <label className="pm-label">Product Name</label>
                  <input className="pm-input" placeholder="e.g. Purple Haze" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="pm-group">
                  <label className="pm-label">Category</label>
                  <select className="pm-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="pm-price-box">
                <div className="flex justify-between items-center mb-4">
                  <label className="pm-label text-[#39FF14]">PRICING STRATEGY</label>
                  <div className="flex items-center gap-2">
                    <span className="pm-label">SPECIAL OFFER?</span>
                    <input type="checkbox" checked={formData.specialOffer} onChange={e => setFormData({...formData, specialOffer: e.target.checked})} style={{width: '20px', height: '20px', accentColor: '#39FF14'}} />
                  </div>
                </div>

                <div className="pm-grid-2">
                  <div className="pm-group">
                    <label className="pm-label">Regular Price ($)</label>
                    <input type="number" className="pm-input" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  {formData.specialOffer && (
                    <div className="pm-group">
                      <label className="pm-label" style={{color:'#39FF14'}}>Offer Price ($)</label>
                      <input type="number" className="pm-input" style={{borderColor:'#39FF14', color:'#39FF14'}} placeholder="0.00" value={formData.offerPrice} onChange={e => setFormData({...formData, offerPrice: e.target.value})} />
                    </div>
                  )}
                </div>
              </div>

              <div className="pm-group">
                <label className="pm-label">Description</label>
                <textarea rows="3" className="pm-textarea" placeholder="Product details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              {/* --- IMAGE UPLOAD (FILE PICKER) --- */}
              <div className="pm-group">
                <div className="flex justify-between items-center">
                    <label className="pm-label">Product Images ({formData.images.length}/5)</label>
                    {loading && <span className="text-[#39FF14] text-xs animate-pulse">Processing...</span>}
                </div>
                
                <div className="flex flex-col gap-4">
                    {/* Custom File Input Button */}
                    <label className="pm-btn-add flex items-center justify-center gap-2 cursor-pointer text-center">
                        <UploadCloud size={18} />
                        <span>CHOOSE IMAGES</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageUpload} 
                            hidden 
                            disabled={formData.images.length >= 5}
                        />
                    </label>

                    {/* Image Previews */}
                    <div className="flex gap-2 overflow-x-auto min-h-[70px]">
                        {formData.images.map((img, i) => (
                            <div key={i} className="relative group shrink-0">
                                <img src={img} className="w-16 h-16 rounded border border-gray-700 object-cover" />
                                <button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

              {/* --- VIDEO UPLOAD (FILE PICKER) --- */}
              <div className="pm-group">
                <div className="flex justify-between items-center">
                    <label className="pm-label text-[#39FF14]">Product Videos ({formData.videos.length}/3)</label>
                </div>
                
                <div className="flex flex-col gap-4">
                    {/* Custom File Input Button */}
                    <label className="pm-btn-add flex items-center justify-center gap-2 cursor-pointer text-center">
                        <Video size={18} />
                        <span>CHOOSE VIDEOS</span>
                        <input 
                            type="file" 
                            accept="video/*" 
                            multiple 
                            onChange={handleVideoUpload} 
                            hidden 
                            disabled={formData.videos.length >= 3}
                        />
                    </label>

                    {/* Video List */}
                    <div className="flex flex-col gap-2">
                        {formData.videos.map((vid, i) => (
                            <div key={i} className="flex justify-between items-center bg-[#151515] p-2 rounded border border-gray-800">
                                <video src={vid} className="w-10 h-10 object-cover rounded" />
                                <span className="text-xs text-gray-400">Video {i + 1}</span>
                                <button onClick={() => removeVideo(i)} className="text-red-500 hover:text-white text-xs font-bold">REMOVE</button>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="pm-footer">
              <button onClick={closeModal} className="text-gray-400 hover:text-white font-bold">CANCEL</button>
              <button onClick={handleSave} className="pm-btn-save" disabled={loading}>
                {loading ? 'UPLOADING...' : <><Check size={20} /> SAVE PRODUCT</>}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;