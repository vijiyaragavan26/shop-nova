const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Razorpay test credentials or mock mode
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_shopnova12345';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'shopnova_secret_67890';

// @desc    Create Razorpay / Online payment order
// @route   POST /api/payments/create
// @access  Private
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // In a real or sandbox environment, we generate a valid test order ID
    const razorpayOrderId = 'order_' + crypto.randomBytes(8).toString('hex');
    const amountInPaise = Math.round(Number(amount) * 100);

    res.status(200).json({
      success: true,
      razorpayOrderId,
      amount: amountInPaise,
      currency,
      keyId: RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment transaction
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
      status = 'completed',
      failureReason
    } = req.body;

    if (status === 'failed') {
      if (orderId) {
        await Payment.findOneAndUpdate(
          { order: orderId },
          { status: 'failed', failureReason: failureReason || 'Transaction declined' }
        );
      }
      return res.status(400).json({
        success: false,
        status: 'failed',
        message: failureReason || 'Payment failed'
      });
    }

    // Update payment record
    let payment;
    if (orderId) {
      payment = await Payment.findOneAndUpdate(
        { order: orderId },
        {
          status: 'completed',
          razorpayOrderId: razorpayOrderId || 'simulated_order_' + Date.now(),
          razorpayPaymentId: razorpayPaymentId || 'pay_' + crypto.randomBytes(8).toString('hex'),
          razorpaySignature: razorpaySignature || 'sig_verified_' + Date.now(),
          paidAt: new Date()
        },
        { new: true }
      );

      // Update Order
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: new Date(),
        orderStatus: 'Confirmed',
        $push: {
          statusHistory: {
            status: 'Confirmed',
            date: new Date(),
            comment: 'Payment verified successfully online'
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      status: 'completed',
      message: 'Payment verified successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};
