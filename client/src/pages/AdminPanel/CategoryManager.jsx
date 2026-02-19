import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory } from '../../utils/api';
import { Trash2 } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');

  const refresh = async () => setCategories(await getCategories());
  useEffect(() => { refresh(); }, []);

  const handleAdd = async () => {
    if (newCat) { await addCategory(newCat); setNewCat(''); refresh(); }
  };

  const handleDelete = async (cat) => {
    if(window.confirm('Delete?')) { await deleteCategory(cat); refresh(); }
  };

  return (
    <div className="max-w-2xl pb-20">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">MANAGE <span className="text-[#39FF14]">CATEGORIES</span></h2>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
        <input 
          value={newCat} 
          onChange={(e) => setNewCat(e.target.value)} 
          placeholder="New Category Name" 
          className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 sm:py-4 text-sm sm:text-base text-white focus:border-[#39FF14] outline-none" 
        />
        <button 
          onClick={handleAdd} 
          className="bg-[#39FF14] text-black px-6 py-3 sm:py-4 rounded-xl font-bold w-full sm:w-auto"
        >
          ADD
        </button>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {categories.map(cat => (
          <div key={cat} className="flex justify-between items-center bg-[#111] p-3 sm:p-4 rounded-xl border border-white/5">
            <span className="text-base sm:text-lg font-medium text-white">{cat}</span>
            <button onClick={() => handleDelete(cat)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoryManager;