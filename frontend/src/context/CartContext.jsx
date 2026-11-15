import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    deliveryCharge: 0,
    finalTotal: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Local storage guest cart
      const localCart = localStorage.getItem('shopnova_guest_cart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          localStorage.removeItem('shopnova_guest_cart');
        }
      }
      return;
    }

    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id;

    if (!isAuthenticated) {
      addToast('Please log in to add items to your cart', 'info');
      return { success: false, requireLogin: true };
    }

    try {
      const res = await cartAPI.addToCart(productId, quantity);
      setCart(res.data.cart);
      addToast(`Added "${product.name}" to cart!`, 'success');
      return { success: true };
    } catch (err) {
      addToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartAPI.updateQuantity(productId, quantity);
      setCart(res.data.cart);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartAPI.removeFromCart(productId);
      setCart(res.data.cart);
      addToast('Item removed from cart', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await cartAPI.clearCart();
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryCharge: 0,
        finalTotal: 0
      });
    } catch (err) {
      console.error('Error clearing cart:', err.message);
    }
  };

  const totalItemsCount = cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        totalItemsCount,
        subtotal: cart.subtotal,
        discount: cart.discount,
        deliveryCharge: cart.deliveryCharge,
        finalTotal: cart.finalTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
