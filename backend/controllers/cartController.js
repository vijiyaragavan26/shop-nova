const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to recalculate cart totals using verified database prices
const calculateCartTotals = async (items) => {
  let subtotal = 0;
  let discount = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    // Use current DB price
    const originalPrice = product.price;
    const effectivePrice = (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price)
      ? product.discountPrice
      : originalPrice;

    const itemSubtotal = originalPrice * item.quantity;
    const itemDiscount = (originalPrice - effectivePrice) * item.quantity;

    subtotal += itemSubtotal;
    discount += itemDiscount;

    verifiedItems.push({
      product: product._id,
      quantity: Math.min(item.quantity, Math.max(1, product.stock)),
      price: effectivePrice
    });
  }

  // Delivery charge calculation: Free delivery over ₹499, else ₹49
  const netAmount = subtotal - discount;
  const deliveryCharge = netAmount > 0 && netAmount < 499 ? 49 : 0;
  const finalTotal = Math.max(0, netAmount + deliveryCharge);

  return {
    verifiedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryCharge,
    finalTotal: Math.round(finalTotal * 100) / 100
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryCharge: 0,
        finalTotal: 0
      });
    }

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: 'This product is currently out of stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    const qtyToAdd = Math.max(1, parseInt(quantity, 10));

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qtyToAdd;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }
      const effectivePrice = (product.discountPrice && product.discountPrice > 0)
        ? product.discountPrice
        : product.price;

      cart.items.push({
        product: product._id,
        quantity: qtyToAdd,
        price: effectivePrice
      });
    }

    const totals = await calculateCartTotals(cart.items);
    cart.items = totals.verifiedItems;
    cart.subtotal = totals.subtotal;
    cart.discount = totals.discount;
    cart.deliveryCharge = totals.deliveryCharge;
    cart.finalTotal = totals.finalTotal;

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    const qty = parseInt(quantity, 10);
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart'
      });
    }

    if (qty <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (product && qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }
      cart.items[itemIndex].quantity = qty;
    }

    const totals = await calculateCartTotals(cart.items);
    cart.items = totals.verifiedItems;
    cart.subtotal = totals.subtotal;
    cart.discount = totals.discount;
    cart.deliveryCharge = totals.deliveryCharge;
    cart.finalTotal = totals.finalTotal;

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    const totals = await calculateCartTotals(cart.items);
    cart.items = totals.verifiedItems;
    cart.subtotal = totals.subtotal;
    cart.discount = totals.discount;
    cart.deliveryCharge = totals.deliveryCharge;
    cart.finalTotal = totals.finalTotal;

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock brand category'
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      cart.discount = 0;
      cart.deliveryCharge = 0;
      cart.finalTotal = 0;
      await cart.save();
    }
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};
