import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  ShieldCheck,
  Star,
  Quote
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Home = () => {
  const [collections, setCollections] = useState({
    featured: [],
    deals: [],
    bestSellers: [],
    latest: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);

  // Simulated countdown for deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await productAPI.getHomepageCollections();
        setCollections(res.data);
      } catch (err) {
        console.error('Failed to load homepage collections:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const categoryCards = [
    {
      name: 'Electronics',
      desc: 'Laptops, Smartwatches & Gadgets',
      img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
      badge: 'Up to 40% Off'
    },
    {
      name: 'Audio & Sound',
      desc: 'Studio Headphones & Speakers',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      badge: 'Trending Now'
    },
    {
      name: 'Fashion',
      desc: 'Watches, Sneakers & Leather',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      badge: 'New Season'
    },
    {
      name: 'Home & Living',
      desc: 'Nordic Lamps & Ceramic Sets',
      img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
      badge: 'Best Value'
    },
    {
      name: 'Beauty & Grooming',
      desc: 'Glow Serums & Self Care',
      img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      badge: 'Cruelty-Free'
    },
    {
      name: 'Sports & Fitness',
      desc: 'Insulated Bottles & Mats',
      img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
      badge: 'Top Rated'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Verified Buyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      comment: 'ShopNova delivered my NovaSound wireless headphones in under 36 hours! The audio clarity is breathtaking and packaging was immaculate.',
      rating: 5,
      product: 'NovaSound Pro Wireless ANC Headphones'
    },
    {
      name: 'Rahul Verma',
      role: 'Tech Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment: 'Smooth checkout with Razorpay test mode, order tracking gave minute-by-minute updates. The AeroPulse smartwatch is a beauty.',
      rating: 5,
      product: 'AeroPulse GPS Smartwatch Ultra'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Interior Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment: 'The Aura Nordic lamp and ceramic dinner set arrived in heavy protective cushioning. Top notch customer support and authentic build.',
      rating: 5,
      product: 'Aura Nordic Minimalist Arc Lamp'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-navy-800 text-white py-16 sm:py-24">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Online Shopping</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Discover Products. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300">
                  Shop Smarter.
                </span>{' '}
                Live Better.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Explore amazing products, discover exciting deals and enjoy a seamless online shopping experience with verified authenticity, direct tracking and express delivery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#categories"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-2xl border border-slate-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Explore Categories</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Verified Authentic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Best Price Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.8/5 Customer Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800/80 p-5 backdrop-blur-md">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                    alt="Featured Deal"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    Deal of the Day
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Audio & Sound</span>
                      <h3 className="text-base font-bold text-white">NovaSound Pro ANC Wireless</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-white">₹6,499</span>
                      <span className="block text-xs text-slate-400 line-through">₹9,999</span>
                    </div>
                  </div>

                  <Link
                    to="/shop?isDeal=true"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center transition-colors"
                  >
                    Claim Today's Offer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse by Category</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {cat.badge}
                </span>
              </div>
              <div className="p-3 text-center">
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TODAY'S SPECIAL OFFERS / DEALS OF THE DAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/20">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full w-max mb-2">
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Special Offers & Deals</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Deals of the Day – Up to 50% OFF
              </h2>
              <p className="text-xs text-rose-100 mt-1">
                Handpicked premium discounts refreshed every 24 hours. Don't miss out!
              </p>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
              <Clock className="w-5 h-5 text-amber-300" />
              <div className="flex items-center space-x-1.5 text-center">
                <div>
                  <span className="text-lg font-black block leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70">Hours</span>
                </div>
                <span className="text-lg font-bold">:</span>
                <div>
                  <span className="text-lg font-black block leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70">Mins</span>
                </div>
                <span className="text-lg font-bold">:</span>
                <div>
                  <span className="text-lg font-black block leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70">Secs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {(collections.deals.length > 0 ? collections.deals.slice(0, 4) : collections.featured.slice(0, 4)).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Editor's Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop?isFeatured=true"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.featured.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop?isBestSeller=true"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. LATEST ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just In</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center transition-colors"
          >
            <span>View Latest</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.latest.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-2">
            <Quote className="w-3.5 h-3.5" />
            <span>Real Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            What Our Customers Say
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Over 100,000+ happy shoppers trust ShopNova for authentic lifestyle & tech gear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <p className="text-[10px] text-emerald-600 font-semibold">{item.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
