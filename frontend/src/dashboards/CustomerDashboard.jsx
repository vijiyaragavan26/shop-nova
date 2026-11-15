import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Package,
  Heart,
  MapPin,
  User,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Trash2,
  Lock,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { orderAPI, addressAPI, authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const CustomerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const { user, updateProfile } = useAuth();
  const { products: wishlistProducts, moveToCart, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Add Address Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
    isDefault: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, addrRes] = await Promise.all([
          orderAPI.getMyOrders(),
          addressAPI.getAddresses()
        ]);
        setOrders(ordersRes.data.orders || []);
        setAddresses(addrRes.data.addresses || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err.message);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: profileName,
      phone: profilePhone,
      avatar: profileAvatar
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      addToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressAPI.addAddress(newAddress);
      addToast('Address saved successfully!', 'success');
      setAddresses([...addresses, res.data.address]);
      setShowAddressModal(false);
      setNewAddress({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home',
        isDefault: false
      });
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressAPI.deleteAddress(id);
      addToast('Address deleted', 'info');
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) =>
    ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)
  ).length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black">{user?.name}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Customer
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.email} • {user?.phone || 'No phone set'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-center text-xs">
          <div>
            <span className="text-xl font-black block text-white">{totalOrders}</span>
            <span className="text-slate-400 text-[10px]">Total Orders</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-xl font-black block text-blue-400">{activeOrders}</span>
            <span className="text-slate-400 text-[10px]">Active Orders</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-xl font-black block text-rose-400">{wishlistProducts.length}</span>
            <span className="text-slate-400 text-[10px]">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <button
            onClick={() => setSearchParams({ tab: 'overview' })}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              currentTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4" />
              <span>Overview</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'orders' })}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              currentTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {totalOrders}
            </span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              currentTab === 'wishlist'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Heart className="w-4 h-4" />
              <span>My Wishlist</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {wishlistProducts.length}
            </span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'addresses' })}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              currentTab === 'addresses'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'settings' })}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              currentTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4" />
              <span>Account Settings</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{totalOrders}</h4>
                    <p className="text-xs text-slate-400">Total Placed Orders</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{activeOrders}</h4>
                    <p className="text-xs text-slate-400">Active Shipments</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">{deliveredOrders}</h4>
                    <p className="text-xs text-slate-400">Completed Orders</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Recent Orders</h3>
                  <button
                    onClick={() => setSearchParams({ tab: 'orders' })}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All Orders
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No orders placed yet. Start shopping!
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {orders.slice(0, 3).map((ord) => (
                      <div key={ord._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900">
                            Order #{ord.orderNumber}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.orderItems?.length} items
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-black text-slate-900">
                            ₹{ord.totalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            {ord.orderStatus}
                          </span>
                          <Link
                            to={`/order-tracking/${ord._id}`}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl"
                          >
                            Track
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {currentTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-slate-900">Order History ({orders.length})</h2>

              {orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow">
                    Shop Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div>
                          <span className="font-bold text-slate-900">Order #{ord.orderNumber}</span>
                          <span className="text-slate-400 ml-2">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">
                            ₹{ord.totalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2">
                        {ord.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                              />
                              <div>
                                <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                                <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-slate-900">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="pt-2 flex justify-end space-x-3">
                        <Link
                          to={`/order-tracking/${ord._id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                        >
                          Track Delivery
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {currentTab === 'wishlist' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-slate-900">
                My Saved Wishlist ({wishlistProducts.length})
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">Your wishlist is currently empty.</p>
                  <Link to="/shop" className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow">
                    Discover Items
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map((prod) => (
                    <div
                      key={prod._id}
                      className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2">
                        <img
                          src={prod.images?.[0] || 'https://via.placeholder.com/300'}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                        <p className="text-sm font-black text-slate-900 mt-1">
                          ₹{(prod.discountPrice || prod.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <button
                          onClick={() => moveToCart(prod._id)}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center space-x-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {currentTab === 'addresses' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No saved addresses. Click "Add New Address" above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="p-4 rounded-2xl border border-slate-200 relative flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                          <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{addr.addressLine}</p>
                        <p className="text-xs text-slate-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-xs text-slate-700 font-semibold mt-1">Mobile: {addr.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {currentTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-8">
              {/* Profile Details */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Save Profile Changes
                </button>
              </form>

              {/* Password Change */}
              <form onSubmit={handleChangePassword} className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Change Password
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">New Password (min 6 chars)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Delivery Address</h3>

            <form onSubmit={handleCreateAddress} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Address / Street</label>
                <input
                  type="text"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">State</label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
