const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[ShopNova Seeder] Cleaning existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      Payment.deleteMany({})
    ]);

    console.log('[ShopNova Seeder] Seeding Users...');
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

    const demoUser2 = await User.create({
      name: 'Sophia Patel',
      email: 'sophia@example.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    });

    console.log('[ShopNova Seeder] Seeding Categories...');
    const categoriesData = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Smartphones, Laptops, Audio & Smart Gadgets',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        icon: 'Smartphone'
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Premium clothing, watches, footwear & accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
        icon: 'Shirt'
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Modern furniture, decor, lighting & kitchenware',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        icon: 'Home'
      },
      {
        name: 'Beauty & Grooming',
        slug: 'beauty-grooming',
        description: 'Skincare, organic wellness, fragrances & self-care',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
        icon: 'Sparkles'
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Gym gear, yoga essentials, wear & smart trackers',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        icon: 'Activity'
      },
      {
        name: 'Audio & Sound',
        slug: 'audio-sound',
        description: 'Studio headphones, portable speakers & hi-fi sound',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        icon: 'Headphones'
      }
    ];

    await Category.insertMany(categoriesData);

    console.log('[ShopNova Seeder] Seeding Products...');
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
          { key: 'OS', value: 'NovaOS / Windows 11 Pro Ready' }
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
          { key: 'Movement', value: 'Japanese Quartz 3-Hand' },
          { key: 'Water Resistance', value: '30 Meters / 3 ATM' }
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
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
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
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Handcrafted stoneware ceramic dinner set including 4 dinner plates, 4 salad plates, 4 cereal bowls, and 4 mugs with organic curved silhouettes and scratch-resistant matte glaze.',
        specifications: [
          { key: 'Material', value: 'Stoneware Ceramic' },
          { key: 'Pieces', value: '16 Piece Service for 4' },
          { key: 'Safety', value: 'Microwave, Oven & Dishwasher Safe' }
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
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Architectural statement lighting featuring a brushed brass arc with natural linen drum shade and heavy marble stabilization base. Compatible with smart bulbs.',
        specifications: [
          { key: 'Base', value: 'Solid Heavy Marble' },
          { key: 'Shade', value: '100% Textured Belgian Linen' },
          { key: 'Bulb Socket', value: 'Standard E27 Warm White LED included' }
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
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Clinically proven anti-aging glow serum infused with 99.9% pure 24K gold flakes, cold-pressed sugarcane squalane and multi-molecular hyaluronic acid for 48h hydration.',
        specifications: [
          { key: 'Key Ingredients', value: '24K Colloidal Gold, Pure Squalane, Peptides' },
          { key: 'Skin Type', value: 'All skin types, Dermatologist Tested' },
          { key: 'Ethics', value: '100% Vegan & Cruelty-Free' }
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
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Double-wall vacuum insulation keeps beverages iced for 24 hours or piping hot for 12 hours. Features 18/8 food-grade stainless steel with sweat-proof powder coating.',
        specifications: [
          { key: 'Capacity', value: '1000ml / 32oz' },
          { key: 'Insulation', value: 'TempLock Vacuum Double Wall' },
          { key: 'Lid', value: 'Leak-proof Chug Cap with silicone grip' }
        ]
      },
      {
        name: 'ProGrip High-Density Non-Slip Yoga Mat',
        brand: 'ZenFit',
        category: 'Sports & Fitness',
        price: 2999,
        discountPrice: 1999,
        stock: 30,
        rating: 4.7,
        numReviews: 89,
        isFeatured: false,
        isBestSeller: false,
        isDeal: false,
        dealBadge: 'Eco-Friendly',
        images: [
          'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Premium biodegradable natural rubber and polyurethane top layer offering unparalleled grip even during intense hot yoga sessions. 6mm extra joint cushioning.',
        specifications: [
          { key: 'Dimensions', value: '72" x 26" x 6mm' },
          { key: 'Material', value: 'Natural Organic Tree Rubber + PU' },
          { key: 'Includes', value: 'Cotton carrying strap' }
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
        description: 'Rich 360-degree room-filling acoustic sound with deep punchy bass radiators. IPX7 waterproof submersible up to 1 meter with 20 hours of continuous party playback.',
        specifications: [
          { key: 'Power Output', value: '30W RMS Stereo' },
          { key: 'Battery', value: '5200mAh / 20 hours' },
          { key: 'Rating', value: 'IPX7 Waterproof & Dustproof' }
        ]
      },
      {
        name: 'Executive Full-Grain Leather Laptop Messenger',
        brand: 'UrbanLuxe',
        category: 'Fashion',
        price: 7999,
        discountPrice: 5499,
        stock: 14,
        rating: 4.9,
        numReviews: 76,
        isFeatured: false,
        isBestSeller: true,
        isDeal: false,
        dealBadge: 'Handmade',
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Handcrafted from 100% full-grain vintage oil-wax cowhide leather. Fits up to 16-inch laptops with padded shockproof compartment, antique brass hardware and YKK zippers.',
        specifications: [
          { key: 'Material', value: 'Full-Grain Colombian Leather' },
          { key: 'Compartments', value: 'Padded 16" laptop sleeve + 4 organizer pockets' },
          { key: 'Hardware', value: 'Solid Antiqued Brass' }
        ]
      }
    ];

    const createdProducts = await Product.insertMany(productsData);

    console.log('[ShopNova Seeder] Seeding Sample Reviews...');
    const sampleReviews = [
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Outstanding Sound & Battery Life!',
        comment: 'The active noise cancellation is surprisingly good on flights and during work calls. Build quality feels very premium. Highly recommend!',
        isVerifiedPurchase: true
      },
      {
        user: demoUser2._id,
        userName: demoUser2.name,
        userAvatar: demoUser2.avatar,
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Better than competitors twice the price',
        comment: 'Bass is tight, mids are very clear, and the quick charging saved my workday twice already.',
        isVerifiedPurchase: true
      },
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: createdProducts[1]._id,
        rating: 5,
        title: 'Sleek design with accurate GPS',
        comment: 'Battery lasts me an entire 10 days with continuous heart monitoring. The titanium finish looks gorgeous.',
        isVerifiedPurchase: true
      }
    ];

    await Review.insertMany(sampleReviews);

    console.log('[ShopNova Seeder] Seeding Sample Orders & Payments for Analytics...');
    // Order 1: Delivered
    const order1 = await Order.create({
      orderNumber: 'SN-2026-881290',
      user: customerUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].discountPrice,
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
      paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      itemsPrice: createdProducts[0].price,
      discountPrice: createdProducts[0].price - createdProducts[0].discountPrice,
      deliveryPrice: 0,
      totalPrice: createdProducts[0].discountPrice,
      orderStatus: 'Delivered',
      deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Order Placed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), comment: 'Order placed online' },
        { status: 'Confirmed', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), comment: 'Payment verified' },
        { status: 'Processing', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), comment: 'Packed in warehouse' },
        { status: 'Shipped', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), comment: 'Dispatched via Express Courier' },
        { status: 'Out for Delivery', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), comment: 'Out for delivery with courier agent' },
        { status: 'Delivered', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), comment: 'Package handed over to recipient' }
      ]
    });

    // Payment 1
    await Payment.create({
      user: customerUser._id,
      order: order1._id,
      amount: order1.totalPrice,
      currency: 'INR',
      paymentMethod: 'razorpay',
      status: 'completed',
      paidAt: order1.paidAt
    });

    // Order 2: Processing
    const order2 = await Order.create({
      orderNumber: 'SN-2026-993412',
      user: customerUser._id,
      orderItems: [
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          image: createdProducts[1].images[0],
          price: createdProducts[1].discountPrice,
          quantity: 1
        },
        {
          product: createdProducts[8]._id,
          name: createdProducts[8].name,
          image: createdProducts[8].images[0],
          price: createdProducts[8].discountPrice,
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
      paymentMethod: 'upi',
      isPaid: true,
      paidAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      itemsPrice: createdProducts[1].price + createdProducts[8].price,
      discountPrice: (createdProducts[1].price - createdProducts[1].discountPrice) + (createdProducts[8].price - createdProducts[8].discountPrice),
      deliveryPrice: 0,
      totalPrice: createdProducts[1].discountPrice + createdProducts[8].discountPrice,
      orderStatus: 'Processing',
      statusHistory: [
        { status: 'Order Placed', date: new Date(Date.now() - 12 * 60 * 60 * 1000), comment: 'Order placed via UPI' },
        { status: 'Confirmed', date: new Date(Date.now() - 12 * 60 * 60 * 1000), comment: 'Payment confirmed via UPI' },
        { status: 'Processing', date: new Date(Date.now() - 6 * 60 * 60 * 1000), comment: 'Order packed in fulfillment center' }
      ]
    });

    // Payment 2
    await Payment.create({
      user: customerUser._id,
      order: order2._id,
      amount: order2.totalPrice,
      currency: 'INR',
      paymentMethod: 'upi',
      status: 'completed',
      paidAt: order2.paidAt
    });

    console.log('----------------------------------------------------');
    console.log('✅ [ShopNova Seeder] Database seeded successfully!');
    console.log('👤 Admin Credentials:');
    console.log('   Email:    admin@shopnova.com');
    console.log('   Password: AdminPassword123!');
    console.log('👤 Customer Credentials:');
    console.log('   Email:    customer@shopnova.com');
    console.log('   Password: Customer123!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`❌ [ShopNova Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
