import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, X, Send } from 'lucide-react';
import { getReviews, addReview } from '../utils/api';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const allReviews = await getReviews();
      setReviews(allReviews.filter(r => r.status === 'Approved'));
    };
    fetchReviews();
  }, []);

  // Auto Slider Logic
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || reviews.length === 0) return;
    
    let scrollAmount = 0;
    const scrollStep = 1;
    const delay = 30;

    const scrollInterval = setInterval(() => {
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
            slider.scrollLeft = 0; // Reset to start
        } else {
            slider.scrollLeft += scrollStep;
        }
    }, delay);

    return () => clearInterval(scrollInterval);
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
    <div className="container mx-auto px-6 mb-20 overflow-hidden">
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

      {/* HORIZONTAL CARDS SLIDER */}
      {reviews.length > 0 ? (
          <div 
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4"
              style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
              {reviews.map((review, idx) => (
                  <div key={idx} className="min-w-[300px] md:min-w-[350px] snap-center bg-[#111] p-6 rounded-3xl border border-white/10 hover:border-[#39FF14]/50 transition-colors flex flex-col relative group">
                      <Quote className="absolute top-4 right-4 text-white/5 group-hover:text-[#39FF14]/10 transition-colors" size={40} />
                      <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                          ))}
                      </div>
                      <p className="text-sm text-gray-300 italic mb-6 flex-1 leading-relaxed">
                          "{review.text}"
                      </p>
                      <div className="border-t border-white/10 pt-4 mt-auto">
                          <h4 className="text-white font-bold text-sm tracking-wider">{review.name}</h4>
                          <span className="text-[10px] text-[#39FF14] uppercase font-bold tracking-widest">Verified Buyer</span>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <div className="text-center py-10 text-gray-600 border border-dashed border-white/10 rounded-2xl">
              <p>No reviews yet. Be the first to leave one!</p>
          </div>
      )}

      {/* SUBMIT REVIEW MODAL (Same as before) */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-3xl p-6 relative">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">Leave a <span className="text-[#39FF14]">Review</span></h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                      <div>
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#39FF14]" placeholder="Your Name" />
                      </div>
                      <div>
                          <div className="flex gap-2 bg-[#111] border border-white/10 p-3 rounded-xl justify-center">
                              {[1,2,3,4,5].map(star => (
                                  <Star key={star} size={28} onClick={() => setFormData({...formData, rating: star})} className={`cursor-pointer transition-all ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-600'}`} />
                              ))}
                          </div>
                      </div>
                      <div>
                          <textarea required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-[#111] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-[#39FF14] h-24 resize-none" placeholder="Your Feedback" />
                      </div>
                      <button disabled={isSubmitting} type="submit" className="w-full bg-[#39FF14] text-black font-black py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                          {isSubmitting ? 'SUBMITTING...' : <><Send size={18}/> SUBMIT</>}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Testimonials;