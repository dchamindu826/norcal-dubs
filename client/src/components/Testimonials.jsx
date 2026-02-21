import React, { useState, useEffect } from 'react';
import { Star, Quote, X, Send } from 'lucide-react';
import { getReviews, addReview } from '../utils/api';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const allReviews = await getReviews();
      // Only show approved reviews
      setReviews(allReviews.filter(r => r.status === 'Approved'));
    };
    fetchReviews();
  }, []);

  // Auto Slider
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000); // Slides every 5 seconds
    return () => clearInterval(interval);
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return alert("Please fill all fields");
    setIsSubmitting(true);
    try {
        await addReview(formData);
        alert("Review submitted! Waiting for admin approval.");
        setIsModalOpen(false);
        setFormData({ name: '', rating: 5, text: '' });
    } catch (error) {
        alert("Failed to submit review.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 mb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black tracking-tighter mb-2">CLIENT <span className="text-[#39FF14]">REVIEWS</span></h2>
          <p className="text-gray-400 text-sm tracking-wide">What our family says about us</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-xs font-bold border border-[#39FF14] text-[#39FF14] px-6 py-3 rounded-full hover:bg-[#39FF14] hover:text-black transition-all uppercase tracking-widest"
        >
          Write a Review
        </button>
      </div>

      {/* REVIEW SLIDER */}
      {reviews.length > 0 ? (
          <div className="bg-[#111] p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden text-center max-w-4xl mx-auto min-h-[250px] flex flex-col justify-center">
              <Quote className="absolute top-4 left-4 md:top-8 md:left-8 text-white/5" size={80} />
              
              <div className="animate-fade-in transition-all duration-500">
                  <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} className={i < reviews[currentIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                      ))}
                  </div>
                  <p className="text-lg md:text-2xl font-medium text-gray-300 italic mb-8 leading-relaxed">
                      "{reviews[currentIndex].text}"
                  </p>
                  <div>
                      <h4 className="text-white font-bold tracking-wider">{reviews[currentIndex].name}</h4>
                      <span className="text-xs text-gray-500 uppercase">{reviews[currentIndex].date} • Verified Buyer</span>
                  </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                  {reviews.map((_, idx) => (
                      <button 
                          key={idx} 
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[#39FF14] w-6' : 'bg-white/20'}`}
                      />
                  ))}
              </div>
          </div>
      ) : (
          <div className="text-center py-10 text-gray-600 border border-dashed border-white/10 rounded-2xl">
              <p>No reviews yet. Be the first to leave one!</p>
          </div>
      )}

      {/* SUBMIT REVIEW MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-3xl p-6 relative">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Leave a <span className="text-[#39FF14]">Review</span></h3>
                  <p className="text-xs text-gray-500 mb-6">Your feedback will be reviewed by our team.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Your Name / Telegram ID</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#39FF14]" placeholder="e.g. John Doe" />
                      </div>
                      <div>
                          <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Rating</label>
                          <div className="flex gap-2">
                              {[1,2,3,4,5].map(star => (
                                  <Star 
                                      key={star} 
                                      size={28} 
                                      onClick={() => setFormData({...formData, rating: star})}
                                      className={`cursor-pointer transition-all ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-600 hover:text-yellow-400/50'}`} 
                                  />
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Your Feedback</label>
                          <textarea required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-[#111] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#39FF14] h-24 resize-none" placeholder="How was the quality and service?" />
                      </div>
                      <button disabled={isSubmitting} type="submit" className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                          {isSubmitting ? 'SUBMITTING...' : <><Send size={18}/> SUBMIT REVIEW</>}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Testimonials;