// src/pages/Terms.jsx
import React from 'react';
import { Shield, Truck, AlertTriangle, Lock } from 'lucide-react';

const Terms = () => {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">
            TERMS & <span className="text-[#39FF14]">CONDITIONS</span>
          </h1>
          <p className="text-gray-500 tracking-widest uppercase text-sm">Please read carefully before ordering</p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8">
          
          {/* Section 1 */}
          <div className="bg-[#111] p-8 rounded-2xl border border-white/10 hover:border-[#39FF14] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="text-[#39FF14]" size={32} />
              <h2 className="text-2xl font-bold">1. AGE REQUIREMENT</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              By accessing this website and purchasing products, you certify that you are at least 21 years of age. We reserve the right to verify age at any time. Any orders placed by minors will be cancelled immediately without refund.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-[#111] p-8 rounded-2xl border border-white/10 hover:border-[#39FF14] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Truck className="text-[#39FF14]" size={32} />
              <h2 className="text-2xl font-bold">2. SHIPPING POLICY</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              All orders are shipped via Priority Mail (2-3 Business Days). Tracking numbers are provided for every order. We are not responsible for packages once they are marked as "Delivered" by the carrier. Please ensure your shipping address is 100% correct.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-[#111] p-8 rounded-2xl border border-white/10 hover:border-[#39FF14] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <Lock className="text-[#39FF14]" size={32} />
              <h2 className="text-2xl font-bold">3. PRIVACY & SECURITY</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We value your privacy. All data is encrypted and deleted periodically. We do not sell your information to third parties. Packaging is discreet with no branding or indication of contents on the outside.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-[#111] p-8 rounded-2xl border border-white/10 hover:border-[#39FF14] transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <AlertTriangle className="text-red-500" size={32} />
              <h2 className="text-2xl font-bold text-red-500">4. LIABILITY</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              NorCal Budz is not responsible for the misuse of any products sold. All products are intended for personal use only. By purchasing, you agree to assume all liabilities associated with the use of these products.
            </p>
          </div>

        </div>

        <div className="mt-12 text-center text-gray-600 text-xs uppercase tracking-widest">
          Last Updated: {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
};

export default Terms;