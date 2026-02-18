import React, { useState, useEffect } from 'react';
import { getAdmins, addAdmin, deleteAdmin } from '../../utils/api';
import { UserPlus, Trash2, ShieldCheck, UserX } from 'lucide-react';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: '', password: '' });

  const refresh = async () => {
    const data = await getAdmins();
    // GHOST ACCOUNT EKA HIDE KARANNA (FILTER)
    const visibleAdmins = data.filter(admin => admin.username !== 'ghost');
    setAdmins(visibleAdmins);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (form.username && form.password) { 
        await addAdmin(form); 
        setForm({username:'', password:''}); 
        refresh(); 
    }
  };

  const handleDelete = async (id) => {
    // Delete Confirmation
    if(window.confirm('Are you sure you want to remove this admin?')) { 
        await deleteAdmin(id); 
        refresh(); 
    }
  };

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-black text-white">ADMIN <span className="text-[#39FF14]">ACCESS</span></h2>
        <span className="bg-[#39FF14]/10 text-[#39FF14] text-xs font-bold px-3 py-1 rounded-full border border-[#39FF14]/20">
            {admins.length} Active
        </span>
      </div>

      {/* ADMIN LIST */}
      <div className="grid gap-4 mb-10">
        {admins.map(a => (
          <div key={a.id} className="bg-[#111] p-6 rounded-2xl border border-white/10 flex justify-between items-center hover:border-white/30 transition-all group">
            <div className="flex items-center gap-4">
                <div className="bg-[#39FF14]/10 p-3 rounded-xl text-[#39FF14]">
                    <ShieldCheck size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{a.username}</h3>
                    <p className="text-gray-500 text-xs font-mono">ID: {a.id}</p>
                </div>
            </div>
            
            {/* Delete Button (Only show if more than 1 admin visible) */}
            <button 
                onClick={() => handleDelete(a.id)} 
                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                title="Remove Admin"
            >
                <UserX size={20} />
            </button>
          </div>
        ))}
        {admins.length === 0 && <div className="text-gray-500 italic">No admins found.</div>}
      </div>

      {/* ADD NEW ADMIN FORM */}
      <div className="bg-[#111] p-8 rounded-3xl border border-white/10 max-w-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <UserPlus size={20} className="text-[#39FF14]"/> ADD NEW ADMIN
        </h3>
        
        <form onSubmit={handleAdd} className="space-y-4 relative z-10">
            <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Username</label>
                <input 
                    placeholder="Enter username" 
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#39FF14] transition-colors font-bold" 
                    value={form.username} 
                    onChange={e => setForm({...form, username: e.target.value})} 
                />
            </div>
            <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">Password</label>
                <input 
                    placeholder="Enter strong password" 
                    type="password" 
                    className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#39FF14] transition-colors font-bold" 
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})} 
                />
            </div>
            <button 
                type="submit" 
                className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(57,255,20,0.2)] mt-2"
            >
                CREATE ADMIN
            </button>
        </form>
      </div>
    </div>
  );
};

export default AdminManager;