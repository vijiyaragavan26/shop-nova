import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT Token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopnova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Auth Service
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

// Product Service
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getHomepageCollections: () => api.get('/products/homepage-collections'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// Cart Service
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateQuantity: (productId, quantity) => api.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear')
};

// Order Service
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason })
};

// Payment Service
export const paymentAPI = {
  createPaymentOrder: (amount, currency, orderId) =>
    api.post('/payments/create', { amount, currency, orderId }),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData)
};

// Admin Service
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status, comment) =>
    api.put(`/admin/orders/${id}/status`, { status, comment }),
  getAllCustomers: () => api.get('/admin/customers')
};

// Wishlist Service
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) => api.post('/wishlist/toggle', { productId }),
  moveToCart: (productId) => api.post('/wishlist/move-to-cart', { productId })
};

// Review Service
export const reviewAPI = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData)
};

// Address Service
export const addressAPI = {
  getAddresses: () => api.get('/addresses'),
  addAddress: (addressData) => api.post('/addresses', addressData),
  deleteAddress: (id) => api.delete(`/addresses/${id}`)
};

export default api;
