export type UserRoleType = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRoleType;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  is_available: boolean;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';

export type DeliveryType = 'pickup' | 'delivery';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  delivery_type: DeliveryType;
  delivery_address: string | null;
  preferred_date: string;
  preferred_time: string;
  instructions: string | null;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  // Joined relation fields
  customer?: Profile;
  product?: Product;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  notes: string | null;
  updated_by?: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  confirmedOrders: number;
  preparingOrders: number;
  readyForPickupOrders: number;
  outForDeliveryOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}
