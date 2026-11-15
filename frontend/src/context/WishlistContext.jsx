import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { refreshCart } = useCart();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist({ products: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist();
      if (res.data.wishlist) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    if (!wishlist?.products) return false;
    return wishlist.products.some(
      (p) => (p._id || p.id || p).toString() === productId.toString()
    );
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    if (!isAuthenticated) {
      addToast('Please login to manage your wishlist', 'info');
      return;
    }

    try {
      const res = await wishlistAPI.toggleWishlist(productId);
      setWishlist(res.data.wishlist);
      addToast(res.data.message, res.data.isAdded ? 'success' : 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const moveToCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await wishlistAPI.moveToCart(productId);
      addToast(res.data.message, 'success');
      await Promise.all([fetchWishlist(), refreshCart()]);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        products: wishlist.products || [],
        totalWishlistCount: wishlist.products?.length || 0,
        loading,
        isInWishlist,
        toggleWishlist,
        moveToCart,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
