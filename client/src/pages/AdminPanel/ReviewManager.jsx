import React, { useState, useEffect } from 'react';
import { getReviews, updateReview, deleteReview } from '../../utils/api';
import { CheckCircle, XCircle, Trash2, Edit, Star } from 'lucide-react';

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  const fetchReviews = async () => {
    const data = await getReviews();
    setReviews(data.sort((a, b) => b.id - a.id));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatus = async (id, status) => {
    await updateReview(id, { status });
    fetchReviews();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure?")) {
        await deleteReview(id);
        fetchReviews();
    }
  };

  const handleSaveEdit = async () => {
      await updateReview(editingReview.id, editingReview);
      setEditingReview(null);
      fetchReviews();
  };

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-black text-white mb-8">REVIEW MANAGER</h1>

      <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black text-xs uppercase font-bold text-gray-500">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 w-1/3">Feedback</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {reviews.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 whitespace-nowrap">{r.date}</td>
                            <td className="p-4 font-bold text-white">{r.name}</td>
                            <td className="p-4 flex gap-1 text-yellow-400">
                                {[...Array(r.rating || 5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400"/>)}
                            </td>
                            <td className="p-4 italic text-xs">{r.text}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${r.status === 'Approved' ? 'bg-[#39FF14]/20 text-[#39FF14]' : r.status === 'Rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    {r.status}
                                </span>
                            </td>
                            <td className="p-4 flex gap-2 justify-end">
                                {r.status !== 'Approved' && <button onClick={() => handleStatus(r.id, 'Approved')} className="text-[#39FF14] hover:bg-[#39FF14]/20 p-2 rounded"><CheckCircle size={16}/></button>}
                                {r.status !== 'Rejected' && <button onClick={() => handleStatus(r.id, 'Rejected')} className="text-red-500 hover:bg-red-500/20 p-2 rounded"><XCircle size={16}/></button>}
                                <button onClick={() => setEditingReview(r)} className="text-blue-400 hover:bg-blue-400/20 p-2 rounded"><Edit size={16}/></button>
                                <button onClick={() => handleDelete(r.id)} className="text-gray-500 hover:bg-white/10 p-2 rounded"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {reviews.length === 0 && <div className="p-8 text-center text-gray-600">No reviews found.</div>}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
              <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md">
                  <h3 className="text-white font-bold mb-4 text-xl">Edit Review</h3>
                  
                  {/* Edit Name */}
                  <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Customer Name</label>
                  <input 
                      value={editingReview.name} 
                      onChange={e => setEditingReview({...editingReview, name: e.target.value})} 
                      className="w-full bg-black border border-white/20 text-white p-3 rounded-lg mb-4 outline-none focus:border-[#39FF14]" 
                  />

                  {/* Edit Rating (NEW) */}
                  <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Rating</label>
                  <div className="flex gap-2 mb-4 bg-black p-3 rounded-lg border border-white/20">
                      {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                              key={star} 
                              size={24} 
                              onClick={() => setEditingReview({...editingReview, rating: star})}
                              className={`cursor-pointer transition-all ${star <= editingReview.rating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-600 hover:text-yellow-400/50'}`} 
                          />
                      ))}
                  </div>

                  {/* Edit Text */}
                  <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Feedback</label>
                  <textarea 
                      value={editingReview.text} 
                      onChange={e => setEditingReview({...editingReview, text: e.target.value})} 
                      className="w-full bg-black border border-white/20 text-white p-3 rounded-lg h-24 mb-6 outline-none focus:border-[#39FF14] resize-none" 
                  />
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end">
                      <button onClick={() => setEditingReview(null)} className="px-5 py-2 text-gray-400 hover:text-white transition-colors font-bold">Cancel</button>
                      <button onClick={handleSaveEdit} className="px-6 py-2 bg-[#39FF14] text-black font-black rounded-lg hover:bg-white transition-colors">Save Changes</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ReviewManager;