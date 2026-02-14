import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, getAdmins } from '../../utils/storage';
import { Package, Layers, Users, TrendingUp, Plus, Trash2, Calendar } from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color }) => (
  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-[#39FF14]/50 transition-all duration-300 group relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon size={80} />
    </div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color} bg-opacity-20`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-4xl font-bold text-white mb-1">{count}</h3>
      <p className="text-gray-400 text-xs uppercase tracking-widest">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, admins: 0, views: 0 });
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // 1. Stats Load
    const currentViews = parseInt(localStorage.getItem('norcal_site_views') || '1250');
    setStats({
      products: getProducts().length,
      categories: getCategories().length,
      admins: getAdmins().length,
      views: currentViews
    });

    // 2. Notes Load
    const savedNotes = JSON.parse(localStorage.getItem('norcal_admin_notes') || '[]');
    setNotes(savedNotes);
  }, []);

  // --- NOTES HANDLER ---
  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })
    };
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('norcal_admin_notes', JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('norcal_admin_notes', JSON.stringify(updatedNotes));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">DASHBOARD <span className="text-[#39FF14]">OVERVIEW</span></h2>
      
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" count={stats.products} icon={Package} color="bg-blue-500" />
        <StatCard title="Categories" count={stats.categories} icon={Layers} color="bg-purple-500" />
        <StatCard title="Active Admins" count={stats.admins} icon={Users} color="bg-yellow-500" />
        <StatCard title="Site Visits" count={stats.views} icon={TrendingUp} color="bg-[#39FF14]" />
      </div>

      {/* DASHBOARD WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. ADMIN NOTES SECTION (2 Columns Wide) */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Calendar className="text-[#39FF14]" size={20}/> ADMIN NOTES
              </h3>
              <span className="text-xs text-gray-500 uppercase tracking-widest">{notes.length} NOTES SAVED</span>
           </div>

           {/* Input Area */}
           <div className="flex gap-4 mb-6">
              <input 
                type="text" 
                placeholder="Write a quick note or reminder..." 
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 text-white focus:border-[#39FF14] outline-none"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNote()}
              />
              <button onClick={addNote} className="bg-[#39FF14] text-black px-6 rounded-xl font-bold hover:bg-white transition-colors">ADD</button>
           </div>

           {/* Notes List */}
           <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {notes.length === 0 && <p className="text-gray-600 text-center py-10">No notes yet. Keep track of your tasks here.</p>}
              {notes.map(note => (
                <div key={note.id} className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-between items-start group hover:border-white/20 transition-all">
                   <div>
                      <p className="text-white text-sm mb-1">{note.text}</p>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{note.date}</span>
                   </div>
                   <button onClick={() => deleteNote(note.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* 2. SYSTEM STATUS (1 Column Wide) */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-bold text-white mb-6">SYSTEM STATUS</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Server Status</span>
                    <span className="text-[#39FF14] text-xs font-bold bg-[#39FF14]/10 px-2 py-1 rounded">ONLINE</span>
                 </div>
                 <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Database</span>
                    <span className="text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded">LOCAL</span>
                 </div>
                 <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Security Level</span>
                    <span className="text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">BASIC</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Version</span>
                    <span className="text-white text-xs font-bold">v1.2.0</span>
                 </div>
              </div>
           </div>
           
           <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-gray-600 text-xs">Last Login: Just Now</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;