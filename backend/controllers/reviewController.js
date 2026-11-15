const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review (Verified purchasers only or registered buyers)
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating (1-5) and comment are required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product'
      });
    }

    // Check if user purchased the product
    const deliveredOrder = await Order.findOne({
      user: req.user.id,
      'orderItems.product': productId
    });

    const isVerifiedPurchase = Boolean(deliveredOrder);

    const review = await Review.create({
      user: req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      product: productId,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerifiedPurchase
    });

    res.status(201).json({
      success: true,
      message: isVerifiedPurchase
        ? 'Verified purchase review posted successfully!'
        : 'Review posted successfully!',
      review
    });
  } catch (error) {
    next(error);
  }
};
