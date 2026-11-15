const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrdersCount,
      lowStockProducts,
      recentOrders,
      allCompletedOrders
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments({
        orderStatus: { $in: ['Order Placed', 'Confirmed', 'Processing'] }
      }),
      Product.find({ stock: { $lte: 5 } }).select('name stock price images category'),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('user', 'name email'),
      Order.find({
        orderStatus: { $ne: 'Cancelled' }
      }).select('totalPrice createdAt orderStatus')
    ]);

    // Calculate total revenue
    const totalRevenue = allCompletedOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    // Group sales by day (last 7 days) and month
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const daySales = allCompletedOrders
        .filter((o) => o.createdAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, o) => sum + o.totalPrice, 0);

      last7Days.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue: Math.round(daySales),
        orders: allCompletedOrders.filter((o) => o.createdAt.toISOString().split('T')[0] === dateStr).length
      });
    }

    // Best-selling products (top 5 by rating/reviews or stock sold)
    const bestSelling = await Product.find()
      .sort({ numReviews: -1, rating: -1 })
      .limit(5)
      .select('name price rating numReviews stock images category');

    // Status distribution
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders: pendingOrdersCount,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      recentOrders,
      salesAnalytics: last7Days,
      bestSelling,
      statusDistribution: statusCounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, keyword, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (keyword) {
      query.$or = [
        { orderNumber: new RegExp(keyword, 'i') },
        { 'shippingAddress.fullName': new RegExp(keyword, 'i') },
        { 'shippingAddress.phone': new RegExp(keyword, 'i') }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email phone')
      .populate('payment');

    res.status(200).json({
      success: true,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limitNum),
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;

    const validStatuses = [
      'Order Placed',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If order was cancelled and now changed, or changed to cancelled
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      // Restore stock
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
      order.cancelledAt = new Date();
      order.cancellationReason = comment || 'Cancelled by Administrator';
    }

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'cod') {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      date: new Date(),
      comment: comment || `Status updated to ${status} by Administrator`
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to "${status}"`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered customers (Admin)
// @route   GET /api/admin/customers
// @access  Private/Admin
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Aggregate total orders and spent for each customer
    const customerStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ user: customer._id });
        const totalSpent = orders
          .filter((o) => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + o.totalPrice, 0);

        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          avatar: customer.avatar,
          createdAt: customer.createdAt,
          totalOrders: orders.length,
          totalSpent: Math.round(totalSpent * 100) / 100
        };
      })
    );

    res.status(200).json({
      success: true,
      customers: customerStats
    });
  } catch (error) {
    next(error);
  }
};
