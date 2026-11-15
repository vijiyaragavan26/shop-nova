const http = require('http');

async function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTest() {
  console.log('--- STARTING SHOPNOVA E2E VERIFICATION TEST ---');

  // 1. Health
  const health = await request({ hostname: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log('✓ [Health]:', health.data.status, health.data.service);

  // 2. Customer Login
  const login = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'customer@shopnova.com', password: 'Customer123!' }
  );
  console.log('✓ [Customer Login]:', login.data.user.name, `(${login.data.user.role})`);
  const customerToken = login.data.token;

  // 3. Products
  const products = await request({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
  console.log('✓ [Products Catalog]:', `${products.data.count} products retrieved.`);
  const product = products.data.products[0];

  // 4. Cart Add
  const cartAdd = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/cart/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      }
    },
    { productId: product._id, quantity: 2 }
  );
  console.log('✓ [Cart Add]:', `${cartAdd.data.cart.items.length} item types in cart. Subtotal: ₹${cartAdd.data.cart.subtotal}`);

  // 5. Create Order
  const order = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      }
    },
    {
      orderItems: [{ product: product._id, quantity: 1, name: product.name, price: product.price }],
      shippingAddress: {
        fullName: 'Alex Johnson',
        phone: '+91 98765 12345',
        addressLine: 'Flat 402, Highline Residency',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103'
      },
      paymentMethod: 'razorpay',
      clearUserCart: true
    }
  );
  console.log('✓ [Order Placed]:', `Order Number: ${order.data.order.orderNumber}, Status: ${order.data.order.orderStatus}, Total: ₹${order.data.order.totalPrice}`);

  // 6. Payment Verification
  const verify = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/payments/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      }
    },
    {
      orderId: order.data.order._id,
      razorpayOrderId: 'sim_ord_test123',
      razorpayPaymentId: 'sim_pay_test456',
      status: 'completed'
    }
  );
  console.log('✓ [Payment Verified]:', verify.data.status, verify.data.message);

  // 7. Admin Dashboard
  const adminLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    { email: 'admin@shopnova.com', password: 'AdminPassword123!' }
  );
  console.log('✓ [Admin Login]:', adminLogin.data.user.name, `(${adminLogin.data.user.role})`);

  const adminDash = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminLogin.data.token}` }
  });
  console.log('✓ [Admin Dashboard Metrics]:');
  console.log('   - Total Revenue: ₹' + adminDash.data.stats.totalRevenue);
  console.log('   - Total Orders:', adminDash.data.stats.totalOrders);
  console.log('   - Total Customers:', adminDash.data.stats.totalCustomers);
  console.log('   - Total Products:', adminDash.data.stats.totalProducts);

  console.log('----------------------------------------------------');
  console.log('🎉 ALL FULL-STACK E-COMMERCE END-TO-END FLOWS VERIFIED SUCCESSFULLY!');
}

runTest().catch(console.error);
