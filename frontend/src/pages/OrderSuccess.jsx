import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Home } from 'lucide-react';
import { orderAPI } from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrderById(id);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to load order:', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Celebration Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50 duration-300">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-sm text-slate-500">
          We have received your order and are dispatching it with express tracking.
        </p>
        <p className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-block mt-2">
          Order Reference: {order?.orderNumber || id}
        </p>
      </div>

      {/* Quick Details Box */}
      {order && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-semibold">
            <span className="text-slate-500">Total Paid / Payable</span>
            <span className="text-lg font-black text-slate-900">₹{order.totalPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold text-slate-700">Delivery To:</p>
              <p className="text-slate-500 mt-0.5">
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.addressLine}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-700">Payment Status:</p>
              <p className="text-slate-500 mt-0.5 capitalize">
                Method: {order.paymentMethod} • <span className={order.isPaid ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {order.isPaid ? 'Paid Online' : 'Pending (COD)'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/order-tracking/${id}`}
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-transform active:scale-95"
        >
          <Truck className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
