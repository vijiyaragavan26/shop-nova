import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  Truck,
  Eye,
  X,
  ChevronDown,
  LayoutDashboard,
  Boxes,
  ShoppingBag
} from 'lucide-react';
import { adminAPI, productAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & Analytics State
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [productKeyword, setProductKeyword] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form
  const [productFormData, setProductFormData] = useState({
    name: '',
    brand: 'ShopNova',
    category: 'Electronics',
    price: '',
    discountPrice: '',
    stock: 10,
    images: '',
    description: '',
    isFeatured: false,
    isBestSeller: false,
    isDeal: false
  });

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchKeyword, setOrderSearchKeyword] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Customers Tab State
  const [customers, setCustomers] = useState([]);

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const res = await adminAPI.getDashboardStats();
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await productAPI.getProducts({ limit: 100, keyword: productKeyword });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err.message);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const params = {};
      if (orderStatusFilter !== 'all') params.status = orderStatusFilter;
      if (orderSearchKeyword) params.keyword = orderSearchKeyword;
      const res = await adminAPI.getAllOrders(params);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err.message);
    }
  };

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      const res = await adminAPI.getAllCustomers();
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'customers') fetchCustomers();
  }, [activeTab, orderStatusFilter]);

  // Product Save (Create / Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const imageArray = productFormData.images
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      const payload = {
        name: productFormData.name,
        brand: productFormData.brand,
        category: productFormData.category,
        price: Number(productFormData.price),
        discountPrice: productFormData.discountPrice ? Number(productFormData.discountPrice) : 0,
        stock: Number(productFormData.stock),
        images: imageArray.length > 0 ? imageArray : [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
        ],
        description: productFormData.description,
        isFeatured: Boolean(productFormData.isFeatured),
        isBestSeller: Boolean(productFormData.isBestSeller),
        isDeal: Boolean(productFormData.isDeal)
      };

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, payload);
        addToast('Product updated successfully', 'success');
      } else {
        await productAPI.createProduct(payload);
        addToast('Product created successfully', 'success');
      }

      setShowAddProductModal(false);
      setEditingProduct(null);
      fetchProducts();
      fetchStats();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      stock: prod.stock,
      images: prod.images?.join('\n') || '',
      description: prod.description,
      isFeatured: prod.isFeatured || false,
      isBestSeller: prod.isBestSeller || false,
      isDeal: prod.isDeal || false
    });
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      addToast('Product deleted', 'info');
      fetchProducts();
      fetchStats();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus}`);
      addToast(`Order status updated to "${newStatus}"`, 'success');
      fetchOrders();
      fetchStats();
      if (selectedOrderDetails?._id === orderId) {
        setSelectedOrderDetails((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loadingStats) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, lowStockProducts, salesAnalytics, bestSelling, recentOrders } = dashboardData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black">ShopNova Administrator Portal</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Live Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time catalog control, logistics fulfillment, revenue metrics and customer accounts.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2">
          {['overview', 'products', 'orders', 'customers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
              <p className="text-xl font-black text-slate-900">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> Verified Sales
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
              <p className="text-xl font-black text-slate-900">{stats?.totalOrders || 0}</p>
              <span className="text-[10px] text-blue-600 font-semibold">Processed</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customers</span>
              <p className="text-xl font-black text-slate-900">{stats?.totalCustomers || 0}</p>
              <span className="text-[10px] text-purple-600 font-semibold">Registered</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Products</span>
              <p className="text-xl font-black text-slate-900">{stats?.totalProducts || 0}</p>
              <span className="text-[10px] text-indigo-600 font-semibold">In Catalog</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Orders</span>
              <p className="text-xl font-black text-amber-600">{stats?.pendingOrders || 0}</p>
              <span className="text-[10px] text-amber-600 font-semibold">Needs Packing</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alert</span>
              <p className="text-xl font-black text-rose-600">{stats?.lowStockCount || 0}</p>
              <span className="text-[10px] text-rose-600 font-semibold">&le; 5 units left</span>
            </div>
          </div>

          {/* Sales Analytics Chart & Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sales Chart (8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Weekly Revenue Trends</h3>
                  <p className="text-[11px] text-slate-400">Daily gross turnover from verified customer checkouts</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Last 7 Days
                </span>
              </div>

              {/* Responsive Visual Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
                {salesAnalytics?.map((day, idx) => {
                  const maxRev = Math.max(...salesAnalytics.map((s) => s.revenue), 10000);
                  const heightPercent = Math.min(100, Math.max(12, (day.revenue / maxRev) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700">
                        ₹{day.revenue.toLocaleString('en-IN')}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-xl bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-700 group-hover:to-blue-500 transition-all shadow-sm"
                      ></div>
                      <span className="text-[10px] font-bold text-slate-500">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low Stock Alerts (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Low Stock Warnings</span>
                </h3>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  {lowStockProducts?.length || 0}
                </span>
              </div>

              {lowStockProducts?.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  All inventory stocks are healthy!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-2 pr-1">
                  {lowStockProducts?.map((item) => (
                    <div key={item._id} className="pt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                        {item.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
              Top Best-Selling & Rated Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {bestSelling?.map((prod) => (
                <div key={prod._id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white">
                    <img src={prod.images?.[0]} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">₹{prod.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="text-amber-500 font-bold">★ {prod.rating}</span>
                    <span>{prod.numReviews} Reviews</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Manage Catalog Products ({products.length})</h2>
              <p className="text-xs text-slate-500">Create, edit prices, manage stock quantities, and feature products.</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductFormData({
                    name: '',
                    brand: 'ShopNova Originals',
                    category: 'Electronics',
                    price: '',
                    discountPrice: '',
                    stock: 15,
                    images: '',
                    description: '',
                    isFeatured: false,
                    isBestSeller: false,
                    isDeal: false
                  });
                  setShowAddProductModal(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Search products in admin table..."
              value={productKeyword}
              onChange={(e) => setProductKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img
                        src={prod.images?.[0]}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-slate-400">{prod.brand}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{prod.category}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">₹{(prod.discountPrice || prod.price).toLocaleString('en-IN')}</span>
                      {prod.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through block">₹{prod.price}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          prod.stock <= 5
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-500">
                      ★ {prod.rating} ({prod.numReviews})
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditProductClick(prod)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Manage Customer Orders ({orders.length})</h2>
              <p className="text-xs text-slate-500">Track shipments, verify payment verification, and update delivery statuses.</p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-3">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-xl outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      #{ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{ord.shippingAddress?.fullName}</p>
                      <p className="text-[10px] text-slate-400">{ord.shippingAddress?.city}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      ₹{ord.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ord.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {ord.paymentMethod?.toUpperCase()} ({ord.isPaid ? 'PAID' : 'PENDING'})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        className="text-[11px] font-bold bg-slate-50 border border-slate-200 py-1 px-2 rounded-lg cursor-pointer outline-none focus:border-blue-500"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS MANAGEMENT */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Registered Customer Accounts ({customers.length})</h2>
            <p className="text-xs text-slate-500">View customer lifetime orders and aggregate purchasing values.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img
                        src={c.avatar || 'https://via.placeholder.com/100'}
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900">{c.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.email}</td>
                    <td className="py-3 px-4 text-slate-600">{c.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.totalOrders} orders</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to ShopNova'}
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. NovaSound Studio Bluetooth Speakers"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty & Grooming">Beauty & Grooming</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Audio & Sound">Audio & Sound</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={productFormData.discountPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, discountPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Available Stock *</label>
                  <input
                    type="number"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Image URLs (One URL per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="https://images.unsplash.com/photo-..."
                  value={productFormData.images}
                  onChange={(e) => setProductFormData({ ...productFormData, images: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Product Description *</label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl outline-none resize-none"
                  required
                />
              </div>

              {/* Promotional Flags */}
              <div className="flex items-center space-x-6 text-xs text-slate-700 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isFeatured}
                    onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isBestSeller}
                    onChange={(e) => setProductFormData({ ...productFormData, isBestSeller: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isDeal}
                    onChange={(e) => setProductFormData({ ...productFormData, isDeal: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Hot Deal</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
