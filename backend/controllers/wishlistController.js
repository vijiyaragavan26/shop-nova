const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get logged in user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate({
      path: 'products',
      select: 'name slug price discountPrice images stock brand category rating numReviews'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    const index = wishlist.products.findIndex(
      (p) => p.toString() === productId.toString()
    );

    let isAdded = false;
    if (index > -1) {
      // Remove
      wishlist.products.splice(index, 1);
      isAdded = false;
    } else {
      // Add
      wishlist.products.push(productId);
      isAdded = true;
    }

    await wishlist.save();
    await wishlist.populate({
      path: 'products',
      select: 'name slug price discountPrice images stock brand category rating numReviews'
    });

    res.status(200).json({
      success: true,
      isAdded,
      message: isAdded ? 'Added to Wishlist' : 'Removed from Wishlist',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/move-to-cart
// @access  Private
exports.moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    // Remove from wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== productId.toString()
      );
      await wishlist.save();
    }

    // Add to cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId.toString()
    );

    const effectivePrice = (product.discountPrice && product.discountPrice > 0)
      ? product.discountPrice
      : product.price;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        product: product._id,
        quantity: 1,
        price: effectivePrice
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product moved to cart successfully'
    });
  } catch (error) {
    next(error);
  }
};
