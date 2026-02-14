// src/pages/AdminPanel/CategoryManager.jsx
import React, { useState, useEffect } from 'react';
import { getCategories, saveCategories } from '../../utils/storage';
import { Trash2, Plus } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');

  useEffect(() => { setCategories(getCategories()); }, []);

  const addCat = () => {
    if (newCat && !categories.includes(newCat)) {
      const updated = [...categories, newCat];
      setCategories(updated);
      saveCategories(updated);
      setNewCat('');
    }
  };

  const deleteCat = (cat) => {
    if(window.confirm('Delete category?')) {
      const updated = categories.filter(c => c !== cat);
      setCategories(updated);
      saveCategories(updated);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold mb-8">MANAGE <span className="text-[#39FF14]">CATEGORIES</span></h2>
      
      <div className="flex gap-4 mb-8">
        <input 
          value={newCat} 
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New Category Name" 
          className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 text-white focus:border-[#39FF14] outline-none"
        />
        <button onClick={addCat} className="bg-[#39FF14] text-black px-6 rounded-lg font-bold hover:opacity-90">ADD</button>
      </div>

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat} className="flex justify-between items-center bg-[#111] p-4 rounded-lg border border-white/5">
            <span className="text-lg font-medium">{cat}</span>
            <button onClick={() => deleteCat(cat)} className="text-red-500 hover:bg-red-500/10 p-2 rounded"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;