import React, { useState, useEffect } from 'react';
import { getAdmins, addAdmin, deleteAdmin } from '../../utils/api';
import { UserPlus, Trash2, ShieldCheck } from 'lucide-react';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: '', password: '' });

  const refresh = async () => setAdmins(await getAdmins());
  useEffect(() => { refresh(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (form.username && form.password) { await addAdmin(form); setForm({username:'', password:''}); refresh(); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Remove admin?')) { await deleteAdmin(id); refresh(); }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-white">ADMIN <span className="text-[#39FF14]">ACCESS</span></h2>
      <div className="grid gap-4 mb-8">
        {admins.map(a => (
          <div key={a.id} className="bg-[#111] p-6 rounded-xl border border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-4"><ShieldCheck className="text-[#39FF14]" size={24} /><h3 className="text-xl font-bold text-white">{a.username}</h3></div>
            {admins.length > 1 && <button onClick={() => handleDelete(a.id)} className="p-2 bg-red-500/10 text-red-500 rounded"><Trash2 size={18} /></button>}
          </div>
        ))}
      </div>
      <div className="bg-[#111] p-6 rounded-xl border border-white/10 max-w-md">
        <h3 className="text-lg font-bold text-white mb-4">ADD NEW ADMIN</h3>
        <form onSubmit={handleAdd} className="space-y-4">
            <input placeholder="Username" className="w-full bg-black border border-white/10 p-3 rounded text-white" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            <input placeholder="Password" type="password" className="w-full bg-black border border-white/10 p-3 rounded text-white" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit" className="w-full bg-[#39FF14] text-black font-bold py-3 rounded">CREATE ADMIN</button>
        </form>
      </div>
    </div>
  );
};
export default AdminManager;