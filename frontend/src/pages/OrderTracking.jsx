import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const OrderTracking = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getOrderById(id);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Failed to load tracking details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await orderAPI.cancelOrder(order._id, 'Customer requested cancellation via portal');
      addToast(res.data.message, 'info');
      await fetchOrder();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <Link to="/dashboard/orders" className="text-xs font-bold text-blue-600">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', desc: 'Order received in system' },
    { label: 'Confirmed', desc: 'Payment verified & order approved' },
    { label: 'Processing', desc: 'Packed in fulfillment hub' },
    { label: 'Shipped', desc: 'Handed over to express courier' },
    { label: 'Out for Delivery', desc: 'Courier agent on route' },
    { label: 'Delivered', desc: 'Package delivered to recipient' }
  ];

  const currentStepIndex = steps.findIndex((s) => s.label === order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = ['Order Placed', 'Confirmed', 'Processing'].includes(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Orders</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            Track Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-colors self-start sm:self-auto"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Delivery Status Progression
        </h2>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-3 text-rose-800">
            <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold">This order was cancelled</h4>
              <p className="text-[11px] text-rose-600">{order.cancellationReason || 'No reason provided'}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Desktop Horizontal Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.label} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-50'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-slate-400 max-w-[120px] mx-auto mt-0.5 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Timeline Events */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Activity History
            </h3>
            <div className="space-y-4">
              {order.statusHistory.map((hist, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{hist.status}</p>
                    <p className="text-slate-500">{hist.comment}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(hist.date).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Items & Shipping Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Items List (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Ordered Products ({order.orderItems.length})
          </h3>
          <div className="divide-y divide-slate-100">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <span className="text-xs font-black text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment (5 cols) */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Delivery Address
            </h4>
            <p className="text-xs font-bold text-slate-800">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {order.shippingAddress.addressLine}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Payment Information
            </h4>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Method</span>
              <span className="font-bold text-slate-900 capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Payment Status</span>
              <span className={`font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.isPaid ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900">Total Charged</span>
              <span className="text-base font-black text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
