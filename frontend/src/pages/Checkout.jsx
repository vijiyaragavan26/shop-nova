import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Banknote,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderAPI, paymentAPI, addressAPI } from '../services/api';

const Checkout = () => {
  const { items, subtotal, discount, deliveryCharge, finalTotal, refreshCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  // Address Form
  const [addressData, setAddressData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home'
  });

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvv: '888',
    cardName: user?.name || ''
  });

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressAPI.getAddresses();
        setSavedAddresses(res.data.addresses || []);
        if (res.data.addresses?.length > 0) {
          const defaultAddr = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
          setSelectedAddressId(defaultAddr._id);
          setAddressData({
            fullName: defaultAddr.fullName,
            phone: defaultAddr.phone,
            addressLine: defaultAddr.addressLine,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
            type: defaultAddr.type
          });
        }
      } catch (e) {
        // Continue with manual form
      }
    };
    fetchAddresses();
  }, []);

  const handleAddressSelect = (addrId) => {
    setSelectedAddressId(addrId);
    if (addrId === 'new') {
      setAddressData({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home'
      });
    } else {
      const addr = savedAddresses.find((a) => a._id === addrId);
      if (addr) {
        setAddressData({
          fullName: addr.fullName,
          phone: addr.phone,
          addressLine: addr.addressLine,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          type: addr.type
        });
      }
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      addToast('Your cart is empty', 'error');
      navigate('/cart');
      return;
    }

    if (
      !addressData.fullName ||
      !addressData.phone ||
      !addressData.addressLine ||
      !addressData.city ||
      !addressData.state ||
      !addressData.pincode
    ) {
      addToast('Please complete all delivery address details', 'error');
      return;
    }

    setProcessing(true);

    try {
      // Format items for backend verification
      const orderItems = items.map((i) => ({
        product: i.product._id || i.product,
        name: i.product.name,
        quantity: i.quantity,
        price: i.price
      }));

      // 1. Create Order on Backend (prices verified by DB)
      const orderRes = await orderAPI.createOrder({
        orderItems,
        shippingAddress: addressData,
        paymentMethod,
        clearUserCart: true
      });

      const { order, payment } = orderRes.data;

      // 2. Handle Payment Flow
      if (paymentMethod === 'cod') {
        addToast('Order placed successfully with Cash on Delivery!', 'success');
        await refreshCart();
        navigate(`/order-success/${order._id}`);
      } else {
        // Online Gateway / Razorpay / UPI / Card
        // Simulate Gateway verification call
        const verifyRes = await paymentAPI.verifyPayment({
          orderId: order._id,
          razorpayOrderId: 'sim_order_' + Date.now(),
          razorpayPaymentId: 'pay_' + Math.random().toString(36).substring(2, 10),
          status: 'completed'
        });

        if (verifyRes.data.success) {
          addToast('Payment verified successfully! Order confirmed.', 'success');
          await refreshCart();
          navigate(`/order-success/${order._id}`);
        } else {
          addToast('Payment authorization failed', 'error');
        }
      }
    } catch (err) {
      addToast(err.message || 'Checkout failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Secure Checkout</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Complete your order with verified encryption & rapid dispatch
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                1
              </div>
              <h2 className="text-base font-bold text-slate-900">Delivery Information</h2>
            </div>

            {/* Saved Addresses Selector */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600">Select Saved Address:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => handleAddressSelect(addr._id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{addr.addressLine}, {addr.city}</p>
                      <p className="text-[11px] font-semibold text-slate-700 mt-1">PIN: {addr.pincode} • {addr.phone}</p>
                    </div>
                  ))}

                  <div
                    onClick={() => handleAddressSelect('new')}
                    className={`p-3.5 rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-center transition-all ${
                      selectedAddressId === 'new'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-bold'
                        : 'border-slate-200 text-slate-500 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-xs">+ Enter New Delivery Address</span>
                  </div>
                </div>
              </div>
            )}

            {/* Address Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={addressData.fullName}
                  onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={addressData.phone}
                  onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address / Flat / Floor *</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Highline Residency, Outer Ring Road"
                  value={addressData.addressLine}
                  onChange={(e) => setAddressData({ ...addressData, addressLine: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru"
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">State *</label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka"
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">PIN / Postal Code *</label>
                <input
                  type="text"
                  placeholder="e.g. 560103"
                  value={addressData.pincode}
                  onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address Label</label>
                <select
                  value={addressData.type}
                  onChange={(e) => setAddressData({ ...addressData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                >
                  <option value="home">Home (7 AM - 9 PM)</option>
                  <option value="work">Office / Work (9 AM - 6 PM)</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2: Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="text-base font-bold text-slate-900">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Razorpay Online */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-blue-600 text-white flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Razorpay Test Gateway</h4>
                  <p className="text-[11px] text-slate-500">Fast card, netbanking & wallet checkout</p>
                </div>
              </div>

              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'upi'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-600 text-white flex-shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant UPI Payment</h4>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>

              {/* Credit/Debit Card */}
              <div
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'credit_card'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900 text-white flex-shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Credit / Debit Card</h4>
                  <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay</p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'cod'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white flex-shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-slate-500">Pay cash or UPI at your doorstep</p>
                </div>
              </div>
            </div>

            {/* Simulated UPI form */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">UPI ID / VPA</label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-400">A payment prompt will be sent to your UPI app.</p>
              </div>
            )}

            {/* Simulated Card Form */}
            {paymentMethod === 'credit_card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number (Test Mode)</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardData.cardExpiry}
                      onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardData.cardCvv}
                      onChange={(e) => setCardData({ ...cardData, cardCvv: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review & Confirmation (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Items ({items.length})
            </h3>

            {/* Mini Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 space-y-2 pr-1">
              {items.map((item) => (
                <div key={item._id || item.product._id} className="pt-2 flex items-center space-x-3">
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Product Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">FREE</span>
                ) : (
                  <span>₹{deliveryCharge}</span>
                )}
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Final Payable</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing Checkout...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order & Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
