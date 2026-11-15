import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Truck,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const {
    items,
    totalItemsCount,
    subtotal,
    discount,
    deliveryCharge,
    finalTotal,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'NOVA2026' || couponCode.toUpperCase() === 'NOVA10') {
      const extraDiscount = Math.round(finalTotal * 0.1);
      setAppliedDiscount(extraDiscount);
      addToast('Coupon applied! 10% discount added.', 'success');
    } else {
      addToast('Invalid promo code. Try "NOVA2026"', 'error');
    }
  };

  const netPayable = Math.max(0, finalTotal - appliedDiscount);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Waiting</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Sign in to view items added to your cart, enjoy fast checkout, and track delivery progress.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Sign In to Account
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Looks like you haven't added anything to your cart yet. Discover hot deals and tech favorites now!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>Start Shopping Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const freeDeliveryDeficit = 499 - (subtotal - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You have {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center space-x-3 text-xs text-blue-900">
            <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
            {freeDeliveryDeficit > 0 ? (
              <p>
                Add <strong className="text-blue-700">₹{freeDeliveryDeficit}</strong> more to your cart to qualify for <strong>FREE Express Delivery</strong>!
              </p>
            ) : (
              <p className="font-bold text-emerald-700 flex items-center">
                <Check className="w-4 h-4 mr-1 text-emerald-600" />
                Congratulations! You have unlocked FREE Express Delivery on this order.
              </p>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {items.map((item) => {
              const prod = item.product;
              if (!prod) return null;

              return (
                <div key={item._id || prod._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={prod.images?.[0] || 'https://via.placeholder.com/150'}
                      alt={prod.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                        {prod.category}
                      </span>
                      <Link
                        to={`/product/${prod._id || prod.slug}`}
                        className="text-sm font-bold text-slate-800 hover:text-blue-600 line-clamp-1 transition-colors block"
                      >
                        {prod.name}
                      </Link>
                      <p className="text-xs text-slate-400">{prod.brand}</p>
                      <div className="sm:hidden font-black text-slate-900 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(prod._id, item.quantity - 1)}
                        className="p-2 text-slate-500 hover:bg-slate-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(prod._id, item.quantity + 1)}
                        disabled={item.quantity >= (prod.stock || 99)}
                        className="p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Desktop */}
                    <div className="hidden sm:block text-right w-24">
                      <span className="text-base font-black text-slate-900 block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(prod._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Product Discounts</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-purple-600 font-bold">
                  <span>Coupon Discount (NOVA2026)</span>
                  <span>- ₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-900">₹{deliveryCharge}</span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{netPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter code (NOVA2026)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs uppercase font-bold border border-slate-200 rounded-l-xl outline-none focus:border-blue-500"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-r-xl transition-colors"
              >
                Apply
              </button>
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Promise */}
            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
