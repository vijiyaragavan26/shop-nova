const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Models for initial empty-database detection
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'ShopNova API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler
app.use(errorHandler);

// Auto-seed helper if collection has 0 products
const checkAndSeedDB = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[ShopNova] Database empty. Auto-seeding initial products & users...');
      const adminUser = await User.create({
        name: 'Admin ShopNova',
        email: 'admin@shopnova.com',
        password: 'AdminPassword123!',
        role: 'admin',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
      });

      const customerUser = await User.create({
        name: 'Alex Johnson',
        email: 'customer@shopnova.com',
        password: 'Customer123!',
        role: 'customer',
        phone: '+91 98765 12345',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
      });

      const categoriesData = [
        { name: 'Electronics', slug: 'electronics', description: 'Smartphones, Laptops & Tech', icon: 'Smartphone' },
        { name: 'Fashion', slug: 'fashion', description: 'Clothing, Watches & Apparel', icon: 'Shirt' },
        { name: 'Home & Living', slug: 'home-living', description: 'Furniture & Interior Decor', icon: 'Home' },
        { name: 'Beauty & Grooming', slug: 'beauty-grooming', description: 'Skincare, Fragrances & Wellness', icon: 'Sparkles' },
        { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Workout & Fitness Gear', icon: 'Activity' },
        { name: 'Audio & Sound', slug: 'audio-sound', description: 'Studio Headphones & Hi-Fi Speakers', icon: 'Headphones' }
      ];
      await Category.insertMany(categoriesData);

      const productsData = [
        {
          name: 'NovaSound Pro Wireless ANC Headphones',
          brand: 'NovaSound',
          category: 'Audio & Sound',
          price: 9999,
          discountPrice: 6499,
          stock: 24,
          rating: 4.8,
          numReviews: 142,
          isFeatured: true,
          isBestSeller: true,
          isDeal: true,
          dealBadge: '35% OFF Today',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Experience deep immersive acoustic sound with active 42dB noise cancellation, 40-hour ultra-long battery life, and crystal-clear beamforming microphone array for calls.',
          specifications: [
            { key: 'Noise Cancellation', value: 'Hybrid ANC up to 42dB' },
            { key: 'Battery Life', value: '40 Hours Playback' },
            { key: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm AUX' },
            { key: 'Charging', value: 'Fast USB-C (10m charge = 5h play)' },
            { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
          ]
        },
        {
          name: 'AeroPulse GPS Smartwatch Ultra',
          brand: 'AeroPulse',
          category: 'Electronics',
          price: 14999,
          discountPrice: 8999,
          stock: 18,
          rating: 4.7,
          numReviews: 98,
          isFeatured: true,
          isBestSeller: true,
          isDeal: true,
          dealBadge: 'Limited Time Deal',
          images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Titanium bezel smartwatch featuring a 1.96-inch Always-on AMOLED display, dual-frequency GPS, SpO2 blood oxygen tracking, 120+ workout modes and 5ATM water resistance.',
          specifications: [
            { key: 'Display', value: '1.96" Sapphire AMOLED 600 nits' },
            { key: 'Water Resistance', value: '5 ATM (50 meters)' },
            { key: 'Battery', value: 'Up to 14 days normal usage' },
            { key: 'Sensors', value: 'Optical Heart Rate, SpO2, Sleep Tracker' }
          ]
        },
        {
          name: 'NovaBook Pro 15.6" M3 Silicon Laptop',
          brand: 'NovaTech',
          category: 'Electronics',
          price: 89999,
          discountPrice: 79999,
          stock: 8,
          rating: 4.9,
          numReviews: 64,
          isFeatured: true,
          isBestSeller: false,
          isDeal: false,
          dealBadge: 'Save ₹10,000',
          images: [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Engineered for creators and engineers. 15.6-inch Retina TrueTone display, 16GB Unified RAM, 1TB NVMe PCIe 4.0 SSD and up to 18 hours of battery efficiency.',
          specifications: [
            { key: 'Processor', value: '10-Core NextGen CPU' },
            { key: 'Memory', value: '16GB High-Speed RAM' },
            { key: 'Storage', value: '1TB Ultra NVMe SSD' },
            { key: 'OS', value: 'Windows 11 Pro / NovaOS' }
          ]
        },
        {
          name: 'Urban Luxe Classic Minimalist Chronograph',
          brand: 'UrbanLuxe',
          category: 'Fashion',
          price: 5499,
          discountPrice: 3299,
          stock: 35,
          rating: 4.6,
          numReviews: 87,
          isFeatured: false,
          isBestSeller: true,
          isDeal: true,
          dealBadge: 'Hot Trend',
          images: [
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Understated elegance crafted from surgical-grade stainless steel with genuine Italian leather strap, sapphire crystal glass, and Japanese precision quartz movement.',
          specifications: [
            { key: 'Case Material', value: '316L Stainless Steel' },
            { key: 'Strap', value: 'Interchangeable Genuine Italian Leather' },
            { key: 'Movement', value: 'Japanese Quartz 3-Hand' }
          ]
        },
        {
          name: 'Veloce Pro Athletic Running Sneakers',
          brand: 'Veloce',
          category: 'Fashion',
          price: 6999,
          discountPrice: 4499,
          stock: 22,
          rating: 4.7,
          numReviews: 110,
          isFeatured: true,
          isBestSeller: false,
          isDeal: true,
          dealBadge: '36% OFF',
          images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Engineered with responsive carbon-infused foam midsole and breathable fly-knit mesh upper for superior propulsion, cloud-like shock absorption and all-day comfort.',
          specifications: [
            { key: 'Upper Material', value: 'Engineered Dynamic FlyKnit' },
            { key: 'Midsole', value: 'Energy-Return Nitrogen-Infused Foam' },
            { key: 'Weight', value: '235g per shoe' }
          ]
        },
        {
          name: 'Artisan Matte Ceramic Dinnerware Set (16 Pcs)',
          brand: 'CasaNova',
          category: 'Home & Living',
          price: 7999,
          discountPrice: 4999,
          stock: 12,
          rating: 4.9,
          numReviews: 53,
          isFeatured: false,
          isBestSeller: true,
          isDeal: false,
          dealBadge: 'Handcrafted',
          images: [
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Handcrafted stoneware ceramic dinner set including 4 dinner plates, 4 salad plates, 4 cereal bowls, and 4 mugs with organic curved silhouettes.',
          specifications: [
            { key: 'Material', value: 'Stoneware Ceramic' },
            { key: 'Pieces', value: '16 Piece Service for 4' }
          ]
        },
        {
          name: 'Aura Nordic Minimalist Arc Floor Lamp',
          brand: 'Lumina',
          category: 'Home & Living',
          price: 8499,
          discountPrice: 5999,
          stock: 15,
          rating: 4.8,
          numReviews: 41,
          isFeatured: true,
          isBestSeller: false,
          isDeal: true,
          dealBadge: 'Best Seller',
          images: [
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Architectural statement lighting featuring a brushed brass arc with natural linen drum shade and heavy marble stabilization base.',
          specifications: [
            { key: 'Base', value: 'Solid Heavy Marble' },
            { key: 'Shade', value: '100% Textured Linen' }
          ]
        },
        {
          name: 'PureBotanics 24K Gold Squalane Serum (50ml)',
          brand: 'PureBotanics',
          category: 'Beauty & Grooming',
          price: 3200,
          discountPrice: 2199,
          stock: 45,
          rating: 4.9,
          numReviews: 129,
          isFeatured: true,
          isBestSeller: true,
          isDeal: true,
          dealBadge: 'Cruelty-Free',
          images: [
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Clinically proven anti-aging glow serum infused with 99.9% pure 24K gold flakes, cold-pressed sugarcane squalane and multi-molecular hyaluronic acid.',
          specifications: [
            { key: 'Ingredients', value: '24K Colloidal Gold, Squalane, Peptides' }
          ]
        },
        {
          name: 'HydroShield Pro Stainless Insulated Bottle (1L)',
          brand: 'HydroShield',
          category: 'Sports & Fitness',
          price: 1899,
          discountPrice: 1299,
          stock: 50,
          rating: 4.8,
          numReviews: 215,
          isFeatured: false,
          isBestSeller: true,
          isDeal: true,
          dealBadge: 'Top Rated',
          images: [
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Double-wall vacuum insulation keeps beverages iced for 24 hours or piping hot for 12 hours.',
          specifications: [
            { key: 'Capacity', value: '1000ml / 32oz' }
          ]
        },
        {
          name: 'BoomBox Pro 360 Waterproof Bluetooth Speaker',
          brand: 'NovaSound',
          category: 'Audio & Sound',
          price: 6499,
          discountPrice: 3999,
          stock: 25,
          rating: 4.7,
          numReviews: 95,
          isFeatured: true,
          isBestSeller: false,
          isDeal: true,
          dealBadge: 'IPX7 Waterproof',
          images: [
            'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
          ],
          description: 'Rich 360-degree room-filling acoustic sound with deep punchy bass radiators. IPX7 waterproof submersible up to 1 meter.',
          specifications: [
            { key: 'Power Output', value: '30W RMS Stereo' }
          ]
        }
      ];

      const insertedProducts = await Product.insertMany(productsData);

      // Seed an initial order for Alex
      const order = await Order.create({
        orderNumber: 'SN-2026-881290',
        user: customerUser._id,
        orderItems: [
          {
            product: insertedProducts[0]._id,
            name: insertedProducts[0].name,
            image: insertedProducts[0].images[0],
            price: insertedProducts[0].discountPrice,
            quantity: 1
          }
        ],
        shippingAddress: {
          fullName: 'Alex Johnson',
          phone: '+91 98765 12345',
          addressLine: 'Flat 402, Highline Residency, Outer Ring Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560103'
        },
        paymentMethod: 'razorpay',
        isPaid: true,
        paidAt: new Date(),
        itemsPrice: insertedProducts[0].price,
        discountPrice: insertedProducts[0].price - insertedProducts[0].discountPrice,
        deliveryPrice: 0,
        totalPrice: insertedProducts[0].discountPrice,
        orderStatus: 'Delivered',
        deliveredAt: new Date(),
        statusHistory: [
          { status: 'Order Placed', date: new Date(), comment: 'Order placed' },
          { status: 'Confirmed', date: new Date(), comment: 'Payment verified' },
          { status: 'Processing', date: new Date(), comment: 'Item packed' },
          { status: 'Shipped', date: new Date(), comment: 'Shipped with courier' },
          { status: 'Out for Delivery', date: new Date(), comment: 'Out for delivery' },
          { status: 'Delivered', date: new Date(), comment: 'Delivered safely' }
        ]
      });

      await Payment.create({
        user: customerUser._id,
        order: order._id,
        amount: order.totalPrice,
        currency: 'INR',
        paymentMethod: 'razorpay',
        status: 'completed',
        paidAt: new Date()
      });

      await Review.create({
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: insertedProducts[0]._id,
        rating: 5,
        title: 'Outstanding Sound & Battery Life!',
        comment: 'The active noise cancellation is surprisingly good on flights and during work calls.',
        isVerifiedPurchase: true
      });

      console.log('[ShopNova] Initial data populated successfully!');
    }
  } catch (err) {
    console.error('[ShopNova Auto-seed Error]:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB().then(async () => {
  await checkAndSeedDB();
  app.listen(PORT, () => {
    console.log(`🚀 [ShopNova API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;
