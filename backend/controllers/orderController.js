const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment');

// Helper to generate unique order number like SN-2026-XXXX
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SN-${new Date().getFullYear()}-${timestamp}${random}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      clearUserCart = true
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified'
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete delivery details including PIN code'
      });
    }

    // Backend verification of prices and stock
    let itemsPrice = 0;
    let discountPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      const origPrice = product.price;
      const effectivePrice = (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price)
        ? product.discountPrice
        : origPrice;

      itemsPrice += origPrice * item.quantity;
      discountPrice += (origPrice - effectivePrice) * item.quantity;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || 'https://via.placeholder.com/150',
        price: effectivePrice,
        quantity: item.quantity
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const netAmount = itemsPrice - discountPrice;
    const deliveryPrice = netAmount > 0 && netAmount < 499 ? 49 : 0;
    const totalPrice = Math.max(0, netAmount + deliveryPrice);

    const orderNumber = generateOrderNumber();

    // Create Payment Record
    const isCod = paymentMethod === 'cod';
    const payment = await Payment.create({
      user: req.user.id,
      amount: totalPrice,
      currency: 'INR',
      paymentMethod,
      status: isCod ? 'pending' : 'completed',
      paidAt: isCod ? null : new Date()
    });

    const order = await Order.create({
      orderNumber,
      user: req.user.id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      payment: payment._id,
      isPaid: !isCod,
      paidAt: !isCod ? new Date() : null,
      itemsPrice: Math.round(itemsPrice * 100) / 100,
      discountPrice: Math.round(discountPrice * 100) / 100,
      deliveryPrice,
      totalPrice: Math.round(totalPrice * 100) / 100,
      orderStatus: 'Order Placed',
      statusHistory: [
        {
          status: 'Order Placed',
          date: new Date(),
          comment: isCod
            ? 'Order placed with Cash on Delivery'
            : 'Payment verified and order placed successfully'
        }
      ]
    });

    // Link order to payment
    payment.order = order._id;
    await payment.save();

    // Clear cart if requested
    if (clearUserCart) {
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [], subtotal: 0, discount: 0, deliveryCharge: 0, finalTotal: 0 }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('payment');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or Order Number
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email phone').populate('payment');
    } else {
      order = await Order.findOne({ orderNumber: id }).populate('user', 'name email phone').populate('payment');
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership unless admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (Customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only orders in 'Order Placed', 'Confirmed', 'Processing' can be cancelled
    const cancellableStatuses = ['Order Placed', 'Confirmed', 'Processing'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in '${order.orderStatus}' status`
      });
    }

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || 'Cancelled by customer';
    order.statusHistory.push({
      status: 'Cancelled',
      date: new Date(),
      comment: order.cancellationReason
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored',
      order
    });
  } catch (error) {
    next(error);
  }
};
