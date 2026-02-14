import React, { useState, useEffect } from 'react';
import { getAdmins, saveAdmins } from '../../utils/storage';
import { UserPlus, Trash2, Edit, Save, X, ShieldCheck, Key } from 'lucide-react';
import './FormStyles.css'; // Api hadapu styles ma use karamu

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // ID of admin being edited
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setAdmins(getAdmins());
  }, []);

  // --- HANDLERS ---
  const handleDelete = (id) => {
    if (window.confirm('Remove this admin access?')) {
      const updated = admins.filter(a => a.id !== id);
      setAdmins(updated);
      saveAdmins(updated);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return alert("Credentials required!");

    let updatedAdmins;
    if (isEditing) {
      updatedAdmins = admins.map(a => a.id === isEditing ? { ...a, ...formData } : a);
    } else {
      updatedAdmins = [...admins, { id: Date.now(), ...formData, active: true }];
    }

    setAdmins(updatedAdmins);
    saveAdmins(updatedAdmins);
    resetForm();
  };

  const startEdit = (admin) => {
    setFormData({ username: admin.username, password: admin.password });
    setIsEditing(admin.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ username: '', password: '' });
    setIsEditing(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-bold text-white">ADMIN <span className="text-[#39FF14]">ACCESS</span></h2>
           <p className="text-gray-500 text-xs tracking-widest uppercase">Manage who can control the system</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#39FF14] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-colors">
          <UserPlus size={20} /> NEW ADMIN
        </button>
      </div>

      {/* ADMIN LIST */}
      <div className="grid gap-4">
        {admins.map(admin => (
          <div key={admin.id} className="bg-[#111] p-6 rounded-xl border border-white/10 flex justify-between items-center group hover:border-[#39FF14]/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#39FF14]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{admin.username}</h3>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Key size={10} /> ••••••••
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => startEdit(admin)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit size={18} /></button>
              {admins.length > 1 && (
                <button onClick={() => handleDelete(admin.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FORM --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{isEditing ? 'EDIT ADMIN' : 'ADD NEW ADMIN'}</h3>
              <button onClick={resetForm}><X className="text-gray-500 hover:text-white" /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-[#151515] border border-[#333] p-3 rounded-xl text-white outline-none focus:border-[#39FF14]"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                <input 
                  type="text" 
                  className="w-full bg-[#151515] border border-[#333] p-3 rounded-xl text-white outline-none focus:border-[#39FF14]"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2">
                <Save size={20} /> SAVE CREDENTIALS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManager;