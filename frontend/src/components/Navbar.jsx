import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  ShieldAlert,
  Sparkles,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount, finalTotal } = useCart();
  const { totalWishlistCount } = useWishlist();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() || selectedCategory !== 'all') {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('keyword', searchTerm.trim());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      navigate(`/shop?${params.toString()}`);
    } else {
      navigate('/shop');
    }
  };

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty & Grooming',
    'Sports & Fitness',
    'Audio & Sound'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                Shop<span className="text-blue-600">Nova</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Search Bar - Center Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center relative rounded-full border-2 border-slate-200 hover:border-blue-500 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-white"
          >
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 text-slate-600 text-xs font-medium py-2.5 px-3 rounded-l-full border-r border-slate-200 outline-none hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Keyword Input */}
            <input
              type="text"
              placeholder="Search products, brands, electronics, fashion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-800 placeholder-slate-400 bg-transparent"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full mr-1 transition-colors duration-150"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Wishlist */}
            <Link
              to="/dashboard/wishlist"
              className="p-2.5 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors relative"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="flex items-center space-x-2 py-2 px-3 rounded-xl text-slate-800 hover:bg-blue-50 transition-colors group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-medium leading-none">Cart</span>
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </Link>

            {/* User Dropdown / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden md:block text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 mr-2.5" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2.5 text-slate-400" />
                        Customer Dashboard
                      </Link>

                      <Link
                        to="/dashboard/orders"
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Package className="w-4 h-4 mr-2.5 text-slate-400" />
                        My Orders
                      </Link>

                      <Link
                        to="/dashboard/wishlist"
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-2.5 text-slate-400" />
                        My Wishlist
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={logout}
                        className="flex w-full items-center px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation (Desktop) */}
        <div className="hidden md:flex items-center justify-between border-t border-slate-100 py-2.5 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-900 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-blue-600 transition-colors">
              Shop All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="hover:text-blue-600 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/shop?isDeal=true"
              className="flex items-center text-rose-600 hover:text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-full transition-colors"
            >
              <Flame className="w-3.5 h-3.5 mr-1 text-rose-500" />
              Today's Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center mb-4 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
            />
            <button type="submit" className="absolute right-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Links */}
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link to="/" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Home
            </Link>
            <Link to="/shop" className="py-2 px-3 rounded-lg hover:bg-slate-50">
              Shop All Products
            </Link>
            <Link
              to="/shop?isDeal=true"
              className="py-2 px-3 rounded-lg text-rose-600 font-bold bg-rose-50"
            >
              🔥 Hot Deals & Offers
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Categories
              </p>
              {categories.map((c) => (
                <Link
                  key={c}
                  to={`/shop?category=${encodeURIComponent(c)}`}
                  className="block py-1.5 px-3 rounded-lg text-xs hover:bg-slate-50"
                >
                  {c}
                </Link>
              ))}
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                className="py-2 px-3 rounded-lg text-blue-600 font-bold bg-blue-50"
              >
                Admin Management Portal
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
