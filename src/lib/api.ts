import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Order, OrderStatus, PaymentStatus, Profile, OrderStatusHistory, DashboardStats } from './types';
import { BUSINESS_CONFIG } from './constants';

const INITIAL_PRODUCT: Product = {
  id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  name: 'Andhra Poornalu (Poornam Boorelu)',
  description: 'Traditional homemade Andhra festival delicacy featuring a crispy golden outer shell made of fermented rice-urad dal batter, stuffed with a decadent filling of slow-cooked Bengal gram (chana dal), aromatic organic jaggery, fresh grated coconut and fragrant green cardamom. Deep-fried to perfection in pure cow ghee and cold-pressed oil.',
  price: 0, // 0 indicates "Contact us for price" initially
  unit: 'Box of 10 pcs',
  is_available: true,
  image_url: '/images/poornalu-brass-plate.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Local storage keys for sandbox mode
const LS_KEYS = {
  PRODUCTS: 'tis_products',
  ORDERS: 'tis_orders',
  PROFILES: 'tis_profiles',
  STATUS_HISTORY: 'tis_status_history',
};

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    if (typeof localStorage === 'undefined') return defaultVal;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Initialize local defaults if empty
function ensureLocalDefaults() {
  const products = getLocal<Product[]>(LS_KEYS.PRODUCTS, []);
  if (products.length === 0) {
    setLocal(LS_KEYS.PRODUCTS, [INITIAL_PRODUCT]);
  }
}

ensureLocalDefaults();

// ----------------------------------------------------
// PRODUCT APIS
// ----------------------------------------------------
export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase fetch products error, fallback to local:', error.message);
      return getLocal<Product[]>(LS_KEYS.PRODUCTS, [INITIAL_PRODUCT]);
    }
    return data && data.length > 0 ? (data as Product[]) : [INITIAL_PRODUCT];
  }

  return getLocal<Product[]>(LS_KEYS.PRODUCTS, [INITIAL_PRODUCT]);
}

export async function updateProduct(
  id: string,
  updates: Partial<Pick<Product, 'price' | 'description' | 'is_available' | 'name' | 'unit' | 'image_url'>>
): Promise<Product> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Product;
  }

  const products = getLocal<Product[]>(LS_KEYS.PRODUCTS, [INITIAL_PRODUCT]);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    const newProd = { ...INITIAL_PRODUCT, ...updates, id, updated_at: now };
    products.push(newProd);
    setLocal(LS_KEYS.PRODUCTS, products);
    return newProd;
  }

  products[index] = { ...products[index], ...updates, updated_at: now };
  setLocal(LS_KEYS.PRODUCTS, products);
  return products[index];
}

// ----------------------------------------------------
// ORDER APIS
// ----------------------------------------------------
export async function createOrder(
  data: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at' | 'customer' | 'product'>
): Promise<Order> {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `TIS-${dateStr}-${randomSuffix}`;
  const nowIso = now.toISOString();

  if (isSupabaseConfigured) {
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: data.customer_id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_amount: data.total_amount,
        delivery_type: data.delivery_type,
        delivery_address: data.delivery_address,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        instructions: data.instructions,
        order_status: 'Pending',
        payment_status: 'Unpaid',
      })
      .select('*, customer:profiles(*), product:products(*)')
      .single();

    if (error) throw new Error(error.message);
    return newOrder as Order;
  }

  // Local sandbox mode
  const localOrder: Order = {
    ...data,
    id: `ord_${Date.now()}_${randomSuffix}`,
    order_number: orderNumber,
    order_status: 'Pending',
    payment_status: 'Unpaid',
    created_at: nowIso,
    updated_at: nowIso,
  };

  // Attach customer & product for local viewing
  const profiles = getLocal<Profile[]>(LS_KEYS.PROFILES, []);
  localOrder.customer = profiles.find((p) => p.id === data.customer_id);
  const products = getLocal<Product[]>(LS_KEYS.PRODUCTS, [INITIAL_PRODUCT]);
  localOrder.product = products.find((p) => p.id === data.product_id) || INITIAL_PRODUCT;

  const orders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
  orders.unshift(localOrder);
  setLocal(LS_KEYS.ORDERS, orders);

  // Add initial status history entry
  const history = getLocal<OrderStatusHistory[]>(LS_KEYS.STATUS_HISTORY, []);
  history.push({
    id: `hist_${Date.now()}`,
    order_id: localOrder.id,
    old_status: null,
    new_status: 'Pending',
    notes: 'Order initiated by customer',
    updated_by: data.customer_id,
    created_at: nowIso,
  });
  setLocal(LS_KEYS.STATUS_HISTORY, history);

  return localOrder;
}

export async function getOrders(customerId?: string): Promise<Order[]> {
  if (isSupabaseConfigured) {
    let query = supabase
      .from('orders')
      .select('*, customer:profiles(*), product:products(*)')
      .order('created_at', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []) as Order[];
  }

  const orders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
  if (customerId) {
    return orders.filter((o) => o.customer_id === customerId);
  }
  return orders;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:profiles(*), product:products(*)')
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .single();
    if (error) return null;
    return data as Order;
  }

  const orders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
  return orders.find((o) => o.id === orderId || o.order_number === orderId) || null;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string,
  adminUserId?: string
): Promise<Order> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: newStatus, updated_at: now })
      .eq('id', orderId)
      .select('*, customer:profiles(*), product:products(*)')
      .single();

    if (error) throw new Error(error.message);

    // If trigger doesn't cover custom notes or updated_by
    if (notes) {
      await supabase.from('order_status_history').insert({
        order_id: orderId,
        new_status: newStatus,
        notes: notes || `Status changed to ${newStatus}`,
        updated_by: adminUserId,
      });
    }

    return data as Order;
  }

  const orders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) throw new Error('Order not found');

  const oldStatus = orders[index].order_status;
  orders[index].order_status = newStatus;
  orders[index].updated_at = now;
  setLocal(LS_KEYS.ORDERS, orders);

  // Add history entry
  const history = getLocal<OrderStatusHistory[]>(LS_KEYS.STATUS_HISTORY, []);
  history.push({
    id: `hist_${Date.now()}`,
    order_id: orderId,
    old_status: oldStatus,
    new_status: newStatus,
    notes: notes || `Order status updated to ${newStatus}`,
    updated_by: adminUserId || 'admin',
    created_at: now,
  });
  setLocal(LS_KEYS.STATUS_HISTORY, history);

  return orders[index];
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  totalAmountOverride?: number
): Promise<Order> {
  const now = new Date().toISOString();
  const updatePayload: Record<string, any> = { payment_status: paymentStatus, updated_at: now };
  if (typeof totalAmountOverride === 'number') {
    updatePayload.total_amount = totalAmountOverride;
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select('*, customer:profiles(*), product:products(*)')
      .single();

    if (error) throw new Error(error.message);
    return data as Order;
  }

  const orders = getLocal<Order[]>(LS_KEYS.ORDERS, []);
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) throw new Error('Order not found');

  orders[index].payment_status = paymentStatus;
  if (typeof totalAmountOverride === 'number') {
    orders[index].total_amount = totalAmountOverride;
    orders[index].unit_price = orders[index].quantity > 0 ? totalAmountOverride / orders[index].quantity : totalAmountOverride;
  }
  orders[index].updated_at = now;
  setLocal(LS_KEYS.ORDERS, orders);

  return orders[index];
}

export async function getOrderTimeline(orderId: string): Promise<OrderStatusHistory[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []) as OrderStatusHistory[];
  }

  const history = getLocal<OrderStatusHistory[]>(LS_KEYS.STATUS_HISTORY, []);
  return history.filter((h) => h.order_id === orderId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

// ----------------------------------------------------
// PROFILES & CUSTOMERS APIS
// ----------------------------------------------------
export async function getProfile(userId: string): Promise<Profile | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data as Profile;
  }

  const profiles = getLocal<Profile[]>(LS_KEYS.PROFILES, []);
  return profiles.find((p) => p.id === userId) || null;
}

export async function saveProfile(profile: Profile): Promise<Profile> {
  const now = new Date().toISOString();
  const toSave = { ...profile, updated_at: now };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(toSave)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  }

  const profiles = getLocal<Profile[]>(LS_KEYS.PROFILES, []);
  const idx = profiles.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    profiles[idx] = toSave;
  } else {
    profiles.push(toSave);
  }
  setLocal(LS_KEYS.PROFILES, profiles);
  return toSave;
}

export async function getCustomers(): Promise<Profile[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as Profile[];
  }

  return getLocal<Profile[]>(LS_KEYS.PROFILES, []);
}

// ----------------------------------------------------
// DASHBOARD KPI STATS
// ----------------------------------------------------
export async function getDashboardStats(): Promise<DashboardStats> {
  const orders = await getOrders();
  const customers = await getCustomers();

  let totalRevenue = 0;
  let pendingOrders = 0;
  let confirmedOrders = 0;
  let preparingOrders = 0;
  let readyForPickupOrders = 0;
  let outForDeliveryOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;

  for (const o of orders) {
    if (o.payment_status === 'Paid') {
      totalRevenue += Number(o.total_amount) || 0;
    }

    switch (o.order_status) {
      case 'Pending':
        pendingOrders++;
        break;
      case 'Confirmed':
        confirmedOrders++;
        break;
      case 'Preparing':
        preparingOrders++;
        break;
      case 'Ready for Pickup':
        readyForPickupOrders++;
        break;
      case 'Out for Delivery':
        outForDeliveryOrders++;
        break;
      case 'Delivered':
        deliveredOrders++;
        break;
      case 'Cancelled':
        cancelledOrders++;
        break;
    }
  }

  return {
    totalOrders: orders.length,
    totalCustomers: customers.length,
    pendingOrders,
    confirmedOrders,
    preparingOrders,
    readyForPickupOrders,
    outForDeliveryOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
  };
}
