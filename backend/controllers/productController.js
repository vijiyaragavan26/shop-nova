const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, searching, sorting and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort,
      isFeatured,
      isBestSeller,
      isDeal,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Keyword search
    if (keyword && keyword.trim() !== '') {
      const searchRegex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'all' && category !== '') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Brand filter
    if (brand && brand !== 'all' && brand !== '') {
      query.brand = brand;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Min Rating filter
    if (minRating !== undefined && minRating !== '') {
      query.rating = { $gte: Number(minRating) };
    }

    // Flags filter
    if (isFeatured === 'true') query.isFeatured = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isDeal === 'true') query.isDeal = true;

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, numReviews: -1 };
    else if (sort === 'popularity') sortOptions = { numReviews: -1, rating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: pageNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if ID is valid Mongo ObjectId, otherwise lookup by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      images,
      stock,
      specifications,
      isFeatured,
      isBestSeller,
      isDeal,
      dealBadge
    } = req.body;

    if (!name || !price || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, price, category and description'
      });
    }

    const defaultImages = images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      brand: brand || 'ShopNova Originals',
      images: defaultImages,
      stock: stock !== undefined ? Number(stock) : 10,
      specifications: specifications || [],
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isDeal: Boolean(isDeal),
      dealBadge: dealBadge || ''
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get homepage collections (Featured, Deals, Best Sellers, Latest)
// @route   GET /api/products/homepage-collections
// @access  Public
exports.getHomepageCollections = async (req, res, next) => {
  try {
    const [featured, deals, bestSellers, latest, categories] = await Promise.all([
      Product.find({ isFeatured: true }).limit(8),
      Product.find({ isDeal: true }).limit(8),
      Product.find({ isBestSeller: true }).limit(8),
      Product.find().sort({ createdAt: -1 }).limit(8),
      Product.distinct('category')
    ]);

    res.status(200).json({
      success: true,
      featured,
      deals,
      bestSellers,
      latest,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories list with icons/counts
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categoriesFromDB = await Category.find({ isActive: true });
    if (categoriesFromDB && categoriesFromDB.length > 0) {
      return res.status(200).json({
        success: true,
        categories: categoriesFromDB
      });
    }

    // Fallback: aggregation from products
    const distinctCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const formatted = distinctCategories.map((c) => ({
      name: c._id,
      slug: c._id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      count: c.count
    }));

    res.status(200).json({
      success: true,
      categories: formatted
    });
  } catch (error) {
    next(error);
  }
};
