# 🛍️ ShopNova – Full-Stack Modern E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**ShopNova** is a modern, responsive, end-to-end full-stack e-commerce website inspired by Amazon and Flipkart, delivering a seamless shopping experience: product discovery, advanced filters, dynamic shopping cart, secure checkout, test payment gateway integration, order tracking timeline, customer portal, and comprehensive administrator management.

Developed as a flagship project for **CodSoft Web Development Internship – Level 3 Task 1**.

---

## 📸 Key Highlights & Features

- **Modern Amazon/Flipkart Aesthetic**: Pure white background with dark navy (`#0f172a`) and electric blue (`#2563eb`) accents, smooth card hover interactions, and responsive typography.
- **Hero & Curated Collections**:
  - Hero banner with headline: *"Discover Products. Shop Smarter. Live Better."*
  - Category Showcase with custom badges
  - Today's Special Deals with a real-time countdown timer
  - Featured Products, Best Sellers & Latest Arrivals
  - Verified Buyer Testimonials & Newsletter Subscription
- **Advanced Catalog & Filters**:
  - Full-text search with live debounce
  - Dynamic category selector
  - Price range filtering (Min/Max ₹)
  - Star rating filter (& up)
  - Sorting: Price (Low to High, High to Low), Popularity, Highest Rated, Newest
  - Responsive mobile filter drawer & pagination
- **Interactive Product Details**:
  - High-res image gallery with thumbnail switcher
  - Pricing breakdown with instant discount percentage saved
  - Detailed technical specifications table
  - Quantity controls with live stock validation
  - Customer ratings & reviews with verified purchaser verification
  - Related product recommendations
- **Dynamic Shopping Cart**:
  - Quantity adjustment (`+`, `-`) with available stock constraints
  - Live calculations: Subtotal, Discounts, Delivery Fee, Final Total
  - Free shipping progress bar (Free delivery over ₹499)
  - Coupon support (`NOVA2026` for 10% extra off)
  - Database synchronized for logged-in users
- **Checkout & Test Payment Gateway**:
  - Customer shipping information form with saved addresses selector
  - Multiple payment options:
    - **Cash on Delivery (COD)**
    - **Instant UPI** (PhonePe, GPay, Paytm simulation)
    - **Credit / Debit Card** (Visa, Mastercard, RuPay)
    - **Razorpay Test Gateway**
  - **Zero Trust Security**: Prices and calculations are verified on the backend by querying the database; frontend prices are never trusted.
- **Order Tracking & Management**:
  - Unique order reference numbers (e.g. `SN-2026-XXXXXX`)
  - Visual stage-by-stage stepper timeline:
    `Order Placed` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`
  - Order cancellation option for eligible stages (with automatic inventory restoration)
- **Customer Dashboard**:
  - Overview with order statistics & recent shipments
  - Order history with tracking links
  - Wishlist management with 1-click "Move to Cart"
  - Saved delivery addresses (add, remove, set default)
  - Account profile editor & password change
- **Administrator Portal**:
  - Real-time KPI metrics: Total Revenue, Orders, Customers, Live Products, Pending Shipments, Low Stock Warnings
  - Visual 7-day revenue analytics bar chart
  - Product catalog manager: Add new product with specs, edit existing products, stock updates, delete
  - Order fulfillment manager: Update order statuses with real-time customer timeline logs
  - Customer registry with lifetime spend analytics

---

## 🔑 Demo Credentials

For quick evaluation, pre-seeded accounts are provided with 1-click login buttons on the `/login` page:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@shopnova.com` | `Customer123!` | Customer Dashboard, Cart, Orders, Wishlist, Checkout |
| **Administrator** | `admin@shopnova.com` | `AdminPassword123!` | Full Admin Portal, Metrics, Inventory & Orders Control |

---

## 🛠️ Technology Stack

### Frontend
- **React.js 18** (Vite build system)
- **Tailwind CSS 3** (Custom navy & electric palette)
- **React Router v6** (Nested routes & protected route wrappers)
- **Lucide React** (Clean icons)
- **Axios** (With automatic JWT Authorization interceptor)
- **Context API** (State for Auth, Cart, Wishlist, and Toasts)

### Backend
- **Node.js** & **Express.js** (REST API architecture)
- **Mongoose / MongoDB** (ObjectIds, Schemas, Indexes, Aggregations)
- **mongodb-memory-server** (Automatic zero-config fallback if local MongoDB isn't running)
- **JWT (JSON Web Tokens)** & **bcryptjs** (Secure authentication and password hashing)
- **Morgan** & **CORS** middleware

---

## 📁 Project Structure

```
shopnova/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ProductCard, RatingStars, ProtectedRoute
│   │   ├── pages/            # Home, Shop, ProductDetails, Cart, Checkout, OrderSuccess, Tracking, Auth
│   │   ├── layouts/          # MainLayout
│   │   ├── dashboards/       # CustomerDashboard, AdminDashboard
│   │   ├── services/         # Axios API client & endpoints
│   │   ├── context/          # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── App.jsx           # Master route configurations
│   │   ├── main.jsx          # Providers & React root
│   │   └── index.css         # Tailwind & custom scrollbar styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── config/               # db.js (MongoDB Atlas / local / In-Memory fallback)
│   ├── controllers/          # auth, product, cart, order, payment, admin, wishlist, review, address
│   ├── models/               # User, Product, Category, Cart, Order, Payment, Review, Wishlist, Address
│   ├── routes/               # Modular Express API routes
│   ├── middleware/           # auth (protect, admin), errorHandler
│   ├── utils/                # seeder.js (Seed database with realistic initial data)
│   ├── .env.example
│   ├── server.js             # Express app entry & auto-seed check
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Clone or Navigate to the Repository
```bash
cd e-com
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Configure Environment Variables (Optional)
A pre-configured `.env` is created in `backend/.env`. If you want to connect to your own MongoDB Atlas instance, update:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopnova
JWT_SECRET=shopnova_super_secure_jwt_secret_token_key_2026!
JWT_EXPIRES_IN=30d
RAZORPAY_KEY_ID=rzp_test_shopnova12345
RAZORPAY_KEY_SECRET=shopnova_secret_67890
```
> *Note:* If no local or remote MongoDB is provided, ShopNova will **automatically spin up an embedded in-memory MongoDB** so you can run and test everything out of the box with zero external setup!

### 5. Run the Application
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Client runs on http://localhost:3000
```

Visit **`http://localhost:3000`** in your browser.

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` – Register a new customer or admin
- `POST /api/auth/login` – Login & receive JWT token
- `POST /api/auth/logout` – Clear user session
- `GET /api/auth/me` – Get authenticated user profile *(Protected)*
- `PUT /api/auth/update-profile` – Update name, phone, avatar *(Protected)*
- `PUT /api/auth/change-password` – Change account password *(Protected)*
- `POST /api/auth/forgot-password` – Request password reset token
- `POST /api/auth/reset-password` – Reset password with token

### Products & Categories
- `GET /api/products` – Query products (search, category, price, rating, sort, pagination)
- `GET /api/products/homepage-collections` – Homepage deals, featured, best-sellers
- `GET /api/products/categories` – Category list with product counts
- `GET /api/products/:id` – Product details with specs & related items
- `POST /api/products` – Create new product *(Admin only)*
- `PUT /api/products/:id` – Update product *(Admin only)*
- `DELETE /api/products/:id` – Delete product *(Admin only)*

### Cart & Wishlist
- `GET /api/cart` – Get user's cart *(Protected)*
- `POST /api/cart/add` – Add item to cart *(Protected)*
- `PUT /api/cart/update` – Update item quantity *(Protected)*
- `DELETE /api/cart/remove/:productId` – Remove item *(Protected)*
- `DELETE /api/cart/clear` – Empty cart *(Protected)*
- `GET /api/wishlist` – Get user's wishlist *(Protected)*
- `POST /api/wishlist/toggle` – Add/remove item in wishlist *(Protected)*
- `POST /api/wishlist/move-to-cart` – Transfer from wishlist to cart *(Protected)*

### Orders & Payments
- `POST /api/orders` – Place new order (backend verifies prices & stock) *(Protected)*
- `GET /api/orders/my-orders` – Customer order history *(Protected)*
- `GET /api/orders/:id` – Detailed order view with tracking timeline *(Protected)*
- `PUT /api/orders/:id/cancel` – Cancel eligible order *(Protected)*
- `POST /api/payments/create` – Create payment order *(Protected)*
- `POST /api/payments/verify` – Verify payment transaction *(Protected)*

### Admin Dashboard
- `GET /api/admin/dashboard` – KPIs, revenue analytics, low stock alerts *(Admin only)*
- `GET /api/admin/orders` – View and filter all customer orders *(Admin only)*
- `PUT /api/admin/orders/:id/status` – Update fulfillment status *(Admin only)*
- `GET /api/admin/customers` – Customer lifetime analytics *(Admin only)*

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. Link repository in [Vercel](https://vercel.com).
3. Set root directory to `frontend`.
4. Add environment variable:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://shopnova-api.onrender.com/api`).
5. Deploy.

### Backend Deployment (Render / Railway)
1. Link repository in [Render](https://render.com) as a Web Service.
2. Set root directory to `backend`.
3. Build command: `npm install`
4. Start command: `node server.js`
5. Configure Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `JWT_SECRET`: Random 32+ character secure secret string.
   - `NODE_ENV`: `production`

---

## 🛡️ Security Implementation
- **Passwords**: Hashed with salt rounds using `bcryptjs`.
- **JWT**: Stateless bearer authentication with role-based guard middleware.
- **Backend Price Protection**: The backend never accepts client-provided item prices or totals; all calculations are executed against verified database product records.
- **Stock Protection**: Available inventory is checked and reserved on order placement, and restored automatically upon order cancellation.

---

## 👨‍💻 Author & Credits
- **Project**: ShopNova Full-Stack E-Commerce Platform
- **Internship**: CodSoft Web Development Internship – Level 3 Task 1
- **License**: MIT License
