import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Send,
  Heart
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast('Thank you for subscribing to ShopNova newsletter!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Feature highlights bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-xs text-slate-400">On all orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Razorpay, UPI & Cards protected</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Easy Return</h4>
              <p className="text-xs text-slate-400">Hassle-free instant replacement</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Direct phone & chat assistance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Shop<span className="text-blue-500">Nova</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover Products. Shop Smarter. Live Better. ShopNova is India's premier online destination for electronics, fashion, home essentials, and lifestyle brands with guaranteed authenticity and lightning-fast delivery.
            </p>

            {/* Newsletter input */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-white mb-2">Subscribe for exclusive deals & drops</p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 text-xs text-white px-3.5 py-2.5 rounded-l-xl border border-slate-700 outline-none focus:border-blue-500 flex-1 placeholder-slate-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-r-xl transition-colors text-xs font-semibold flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?isFeatured=true" className="hover:text-white transition-colors">Featured Items</Link></li>
              <li><Link to="/shop?isDeal=true" className="hover:text-white transition-colors">Today's Deals</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=Electronics" className="hover:text-white transition-colors">Electronics & Laptops</Link></li>
              <li><Link to="/shop?category=Fashion" className="hover:text-white transition-colors">Fashion & Apparel</Link></li>
              <li><Link to="/shop?category=Home%20%26%20Living" className="hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link to="/shop?category=Audio%20%26%20Sound" className="hover:text-white transition-colors">Audio & Headphones</Link></li>
              <li><Link to="/shop?category=Beauty%20%26%20Grooming" className="hover:text-white transition-colors">Beauty & Skincare</Link></li>
              <li><Link to="/shop?category=Sports%20%26%20Fitness" className="hover:text-white transition-colors">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Customer Support & Security */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h5>
            <ul className="space-y-2 text-xs mb-4">
              <li><Link to="/dashboard/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Customer Dashboard</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Accepted Payments:</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">UPI</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Razorpay</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Visa</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Mastercard</span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopNova Inc. All rights reserved. Designed for CodSoft Internship.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 mx-1 text-rose-500 fill-rose-500" /> using React, Node.js & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
