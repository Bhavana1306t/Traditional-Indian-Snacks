
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DashboardStats, Order } from '../../lib/types';
import { getDashboardStats, getOrders } from '../../lib/api';

import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from '../../components/common/StatusBadge';

import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { BUSINESS_CONFIG } from '../../lib/constants';

import {
  ShoppingBag,
  Users,
  Clock,
  CheckCircle2,
  Flame,
  Store,
  Truck,
  CheckCheck,
  XCircle,
  IndianRupee,
  RefreshCw,
  Eye,
  ExternalLink,
  Tag,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    try {
      const [statsData, ordersData] = await Promise.all([
        getDashboardStats(),
        getOrders(),
      ]);

      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderUpdated = (updated: Order) => {
    setSelectedOrder(updated);
    loadDashboardData();
  };

  // Identify pickup orders, including different possible stored formats.
  const isPickupOrder = (order: Order) => {
    const type = String(order.delivery_type || '')
      .toLowerCase()
      .replace(/[\s_-]/g, '');

    return type === 'pickup' || type === 'selfpickup';
  };

  // Display Picked Up instead of Delivered for completed pickup orders.
  const renderOrderStatus = (order: Order) => {
    if (
      isPickupOrder(order) &&
      order.order_status === 'Delivered'
    ) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-medium text-green-800 whitespace-nowrap">
          <CheckCheck className="w-3.5 h-3.5" />
          Picked Up
        </span>
      );
    }

    return (
      <OrderStatusBadge
        status={order.order_status}
        size="sm"
      />
    );
  };

  return (
    <div className="space-y-8">

      {/* Top Welcome & Sync Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C69A45]/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
            Admin Executive Overview
          </h1>

          <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
            Real-time business performance for {BUSINESS_CONFIG.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] text-xs font-semibold border border-[#C69A45]/50 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span>Sync Live Stats</span>
          </button>

          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <Tag className="w-3.5 h-3.5 text-[#FFE082]" />
            <span>Pricing & Stock</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

        {/* Total Orders */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-[#C69A45]/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#553322]/70 uppercase tracking-wider">
              Total Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-[#C69A45]" />
          </div>

          <p className="text-2xl font-serif font-bold text-[#7B211F] mt-2">
            {stats?.totalOrders ?? 0}
          </p>
        </div>

        {/* Total Customers */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-[#C69A45]/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#553322]/70 uppercase tracking-wider">
              Total Customers
            </span>
            <Users className="w-4 h-4 text-[#C69A45]" />
          </div>

          <p className="text-2xl font-serif font-bold text-[#7B211F] mt-2">
            {stats?.totalCustomers ?? 0}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-emerald-50/40 p-4 rounded-2xl border-2 border-emerald-400 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
              Total Revenue
            </span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-emerald-800 mt-2">
            ₹{(stats?.totalRevenue ?? 0).toFixed(2)}
          </p>

          <span className="text-[10px] text-emerald-700 block mt-0.5">
            From Paid Orders
          </span>
        </div>

        {/* Pending Orders */}
        <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
              Pending Orders
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-amber-800 mt-2">
            {stats?.pendingOrders ?? 0}
          </p>
        </div>

        {/* Confirmed Orders */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-emerald-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
              Confirmed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-emerald-800 mt-2">
            {stats?.confirmedOrders ?? 0}
          </p>
        </div>

        {/* Preparing */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-orange-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-orange-900 uppercase tracking-wider">
              Preparing
            </span>
            <Flame className="w-4 h-4 text-orange-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-orange-800 mt-2">
            {stats?.preparingOrders ?? 0}
          </p>
        </div>

        {/* Ready for Pickup */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-yellow-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-yellow-900 uppercase tracking-wider">
              Ready for Pickup
            </span>
            <Store className="w-4 h-4 text-yellow-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-yellow-800 mt-2">
            {stats?.readyForPickupOrders ?? 0}
          </p>
        </div>

        {/* Out for Delivery */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-indigo-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider">
              Out for Delivery
            </span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-indigo-800 mt-2">
            {stats?.outForDeliveryOrders ?? 0}
          </p>
        </div>

        {/* Delivered */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-green-400 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-green-900 uppercase tracking-wider">
              Delivered
            </span>
            <CheckCheck className="w-4 h-4 text-green-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-green-800 mt-2">
            {stats?.deliveredOrders ?? 0}
          </p>
        </div>

        {/* Cancelled */}
        <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-rose-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-900 uppercase tracking-wider">
              Cancelled
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>

          <p className="text-2xl font-serif font-bold text-rose-800 mt-2">
            {stats?.cancelledOrders ?? 0}
          </p>
        </div>

      </div>

      {/* Recent Customer Bookings */}
      <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 shadow-md">

        <div className="flex items-center justify-between pb-4 border-b border-[#C69A45]/30 mb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#7B211F]">
              Recent Customer Bookings
            </h3>

            <p className="text-xs text-[#553322]/70">
              Latest orders submitted by customers online
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-xs font-serif font-bold text-[#7B211F] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#553322]/70">
            No orders found in database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">

              <thead>
                <tr className="border-b border-[#C69A45]/30 text-[#7B211F] font-serif uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Qty</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#C69A45]/20">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#F8E7CB]/50 transition"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#7B211F]">
                      {order.order_number}
                    </td>

                    <td className="py-2.5 px-3 font-medium">
                      {order.customer?.full_name || 'N/A'}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[#553322]/80">
                      {order.customer?.phone || 'N/A'}
                    </td>

                    <td className="py-2.5 px-3 font-semibold">
                      {order.quantity} Box(es)
                    </td>

                    <td className="py-2.5 px-3 capitalize">
                      {isPickupOrder(order) ? 'Pickup' : 'Delivery'}
                    </td>

                    <td className="py-2.5 px-3">
                      {order.preferred_date}
                    </td>

                    <td className="py-2.5 px-3">
                      {renderOrderStatus(order)}
                    </td>

                    <td className="py-2.5 px-3">
                      <PaymentStatusBadge
                        status={order.payment_status}
                        size="sm"
                      />
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 rounded-lg bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onOrderUpdated={handleOrderUpdated}
      />

    </div>
  );
};
