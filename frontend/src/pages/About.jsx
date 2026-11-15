import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, Award, Sparkles, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          Empowering Smarter Shopping with ShopNova
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Founded with a clear vision: to bring a truly modern, transparent, and delight-driven online shopping experience to customers across India and worldwide.
        </p>
      </div>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden aspect-video max-h-96 w-full border border-slate-100 shadow-md">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="ShopNova Team"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">100% Genuine Products</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every product in our catalog is procured directly from verified brand manufacturers with authentic serial tracking and full warranty protection.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Seamless Customer Journey</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            From intuitive search filtering and real-time stock indicators to instant payment reconciliation and stage-by-stage logistics tracking.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Customer-First Service</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our dedicated 24/7 support team and transparent 7-day doorstep return policy give you absolute peace of mind on every order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
