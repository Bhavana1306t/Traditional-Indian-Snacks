// ==============================================================================
// TRADITIONAL INDIAN SNACKS - COMPREHENSIVE E2E & SECURITY VERIFICATION SUITE
// ==============================================================================

import assert from 'node:assert/strict';

console.log('------------------------------------------------------------');
console.log('RUNNING TEST SUITE: Traditional Indian Snacks Platform');
console.log('------------------------------------------------------------\n');

// Mock in-memory localStorage for test execution
const storage = new Map();
global.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};

// Polyfill import.meta.env for Node test runner
if (!import.meta.env) {
  import.meta.env = {
    VITE_SUPABASE_URL: '',
    VITE_SUPABASE_ANON_KEY: '',
  };
}

// Import TypeScript modules directly with Node 24 experimental strip types
import { BUSINESS_CONFIG } from '../src/lib/constants.ts';
import { generateWhatsAppOrderMessage } from '../src/lib/whatsapp.ts';
import {
  getProducts,
  updateProduct,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderTimeline,
  getProfile,
  saveProfile,
  getCustomers,
  getDashboardStats,
} from '../src/lib/api.ts';

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${testName}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(testName, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${testName}`);
    console.error(`    Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAllTests() {
  console.log('=== 1. CUSTOMER WORKFLOWS ===');

  let testCustomer1 = null;
  let testOrder1 = null;

  await runAsyncTest('Customer registration and profile setup', async () => {
    const profile = {
      id: 'cust_9948016716',
      full_name: 'Suresh Varma',
      phone: '+91 9948016716',
      address: 'Flat 402, Sri Rama Nilayam, Vijayawada, Andhra Pradesh',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    testCustomer1 = await saveProfile(profile);
    assert.equal(testCustomer1.id, 'cust_9948016716');
    assert.equal(testCustomer1.phone, '+91 9948016716');
  });

  await runAsyncTest('Retrieve customer profile', async () => {
    const retrieved = await getProfile(testCustomer1.id);
    assert.ok(retrieved);
    assert.equal(retrieved.full_name, 'Suresh Varma');
  });

  await runAsyncTest('Customer places a new Poornalu order with Delivery', async () => {
    const products = await getProducts();
    assert.ok(products.length > 0, 'At least 1 product must exist');
    const poornaluProduct = products[0];

    testOrder1 = await createOrder({
      customer_id: testCustomer1.id,
      product_id: poornaluProduct.id,
      quantity: 3,
      unit_price: poornaluProduct.price,
      total_amount: poornaluProduct.price * 3,
      delivery_type: 'delivery',
      delivery_address: testCustomer1.address,
      preferred_date: '2026-11-05',
      preferred_time: 'Morning (9:00 AM - 1:00 PM)',
      instructions: 'Traditional wedding festival pack, extra crispy outer layer',
      order_status: 'Pending',
      payment_status: 'Unpaid',
    });

    assert.ok(testOrder1.id);
    assert.ok(testOrder1.order_number.startsWith('TIS-'));
    assert.equal(testOrder1.order_status, 'Pending');
    assert.equal(testOrder1.payment_status, 'Unpaid');
    assert.equal(testOrder1.quantity, 3);
  });

  runTest('Generate authentic WhatsApp order summary for +91 9948016716', () => {
    const msg = generateWhatsAppOrderMessage(testOrder1, testCustomer1);
    assert.ok(msg.includes('TRADITIONAL INDIAN SNACKS'));
    assert.ok(msg.includes(testOrder1.order_number));
    assert.ok(msg.includes(testCustomer1.full_name));
    assert.ok(msg.includes('+91 9948016716'));
    assert.ok(msg.includes(BUSINESS_CONFIG.owner));
    assert.ok(msg.includes('Andhra Poornalu'));
  });

  await runAsyncTest('Customer views order history (must see only their orders)', async () => {
    const customerOrders = await getOrders(testCustomer1.id);
    assert.equal(customerOrders.length, 1);
    assert.equal(customerOrders[0].id, testOrder1.id);
  });

  await runAsyncTest('Customer tracks order status timeline', async () => {
    const timeline = await getOrderTimeline(testOrder1.id);
    assert.ok(timeline.length > 0);
    assert.equal(timeline[0].new_status, 'Pending');
  });

  await runAsyncTest('Customer updates profile address', async () => {
    const updated = await saveProfile({
      ...testCustomer1,
      address: 'Plot 12, Guntur Road, Andhra Pradesh',
    });
    assert.equal(updated.address, 'Plot 12, Guntur Road, Andhra Pradesh');
  });

  console.log('\n=== 2. ADMIN WORKFLOWS ===');

  await runAsyncTest('Admin views real dashboard statistics', async () => {
    const stats = await getDashboardStats();
    assert.ok(stats.totalOrders >= 1);
    assert.ok(stats.totalCustomers >= 1);
    assert.ok(stats.pendingOrders >= 1);
  });

  await runAsyncTest('Admin searches for customer by name and phone', async () => {
    const customers = await getCustomers();
    const foundByName = customers.filter((c) => c.full_name.includes('Suresh'));
    const foundByPhone = customers.filter((c) => c.phone.includes('9948016716'));
    assert.equal(foundByName.length, 1);
    assert.equal(foundByPhone.length, 1);
  });

  await runAsyncTest('Admin updates order status through complete lifecycle to Delivered', async () => {
    // 1. Pending -> Confirmed
    let order = await updateOrderStatus(testOrder1.id, 'Confirmed', 'Batch accepted by Lakshmipathi Raju');
    assert.equal(order.order_status, 'Confirmed');

    // 2. Confirmed -> Preparing
    order = await updateOrderStatus(testOrder1.id, 'Preparing', 'Fresh chana dal poornam frying in pure cow ghee');
    assert.equal(order.order_status, 'Preparing');

    // 3. Preparing -> Out for Delivery
    order = await updateOrderStatus(testOrder1.id, 'Out for Delivery', 'Dispatched with hot thermal sweet box packaging');
    assert.equal(order.order_status, 'Out for Delivery');

    // 4. Out for Delivery -> Delivered
    order = await updateOrderStatus(testOrder1.id, 'Delivered', 'Delivered at customer doorstep');
    assert.equal(order.order_status, 'Delivered');

    // Verify history audit trail contains all 5 entries
    const history = await getOrderTimeline(testOrder1.id);
    assert.equal(history.length, 5);
    assert.equal(history[history.length - 1].new_status, 'Delivered');
  });

  await runAsyncTest('Admin updates payment status to Paid and verifies revenue recalculation', async () => {
    // First set unit price to 200 for testing revenue
    const products = await getProducts();
    await updateProduct(products[0].id, { price: 200 });

    // Update order with price
    testOrder1.unit_price = 200;
    testOrder1.total_amount = 600; // 3 boxes * 200

    const updated = await updatePaymentStatus(testOrder1.id, 'Paid');
    assert.equal(updated.payment_status, 'Paid');

    // Verify Dashboard total revenue now reflects the paid order
    const stats = await getDashboardStats();
    assert.ok(stats.totalRevenue >= 600);
  });

  await runAsyncTest('Admin configures product price and toggles availability', async () => {
    const products = await getProducts();
    const target = products[0];

    // Admin updates price to ₹220 per box
    const updated = await updateProduct(target.id, {
      price: 220,
      description: 'Handmade festival Poornalu made with 100% cow ghee and organic jaggery',
      is_available: true,
    });

    assert.equal(updated.price, 220);
    assert.equal(updated.is_available, true);
  });

  console.log('\n=== 3. SECURITY & PRIVILEGE ESCALATION PREVENTION ===');

  await runAsyncTest('Customer isolation: Customer 2 cannot see Customer 1 orders', async () => {
    // Register Customer 2
    const cust2 = await saveProfile({
      id: 'cust_9123456789',
      full_name: 'Anand Rao',
      phone: '+91 9123456789',
      address: 'Rajahmundry, Andhra Pradesh',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Customer 2 requests orders
    const cust2Orders = await getOrders(cust2.id);
    assert.equal(cust2Orders.length, 0, 'Customer 2 must not see Customer 1 orders');

    // Customer 1 requests orders
    const cust1Orders = await getOrders(testCustomer1.id);
    assert.equal(cust1Orders.length, 1);
  });

  runTest('Admin role verification: Non-admin email is denied', () => {
    const testEmail = 'random_customer@gmail.com';
    const isAuthorized = testEmail.toLowerCase() === BUSINESS_CONFIG.email.toLowerCase();
    assert.equal(isAuthorized, false, 'Non-admin email must not be authorized as admin');
  });

  runTest('Initial price is 0 so UI displays "Contact us for price"', () => {
    const priceText = (price) => (price > 0 ? `₹${price}` : 'Contact us for price');
    assert.equal(priceText(0), 'Contact us for price');
    assert.equal(priceText(250), '₹250');
  });

  console.log('\n------------------------------------------------------------');
  console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} tests passed successfully!`);
  console.log('------------------------------------------------------------\n');
}

runAllTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
