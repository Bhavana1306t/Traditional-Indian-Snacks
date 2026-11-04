
import React, { useState, useEffect } from 'react';
import { Order } from '../../lib/types';
import { getOrders } from '../../lib/api';
import {
  OrderStatusBadge,
  PaymentStatusBadge
} from '../../components/common/StatusBadge';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { BUSINESS_CONFIG } from '../../lib/constants';
import {
  Search,
  RefreshCw,
  Eye,
  Store,
  Truck
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filters and Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);

    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and Search Logic
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== 'ALL') {
      result = result.filter(
        (o) => o.order_status === statusFilter
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();

      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          (o.customer?.full_name || '').toLowerCase().includes(q) ||
          (o.customer?.phone || '').includes(q)
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const handleOrderUpdated = (updated: Order) => {
    setSelectedOrder(updated);

    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    );
  };

  const filterTabs: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Preparing', value: 'Preparing' },
    { label: 'Ready for Pickup', value: 'Ready for Pickup' },
    { label: 'Out for Delivery', value: 'Out for Delivery' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const isPickupOrder = (order: Order) => {
    const type = String(order.delivery_type || '')
      .toLowerCase()
      .replace(/[\s_-]/g, '');

    return type === 'pickup' || type === 'selfpickup';
  };

  const formatAmount = (order: Order) => {
    return order.unit_price > 0
      ? `₹${Number(order.total_amount).toFixed(2)}`
      : 'Contact us';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C69A45]/30">

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
            Order Management
          </h1>

          <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
            Manage, confirm, and update customer Andhra Poornalu batches
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] text-xs font-semibold border border-[#C69A45]/50 transition flex items-center gap-2 shadow-sm disabled:opacity-60"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              isLoading ? 'animate-spin' : ''
            }`}
          />
          <span>Refresh Table</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="w-full min-w-0 bg-[#FFF3DD] p-3 sm:p-4 rounded-2xl border border-[#C69A45]/40 shadow-sm space-y-4">

        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#C69A45]" />

          <input
            type="text"
            placeholder="Search name, phone, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-w-0 pl-10 pr-4 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-sm text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const count =
              tab.value === 'ALL'
                ? orders.length
                : orders.filter(
                    (o) => o.order_status === tab.value
                  ).length;

            const isActive = statusFilter === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-2 rounded-full text-[11px] sm:text-xs font-medium transition inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#7B211F] text-[#FFF3DD] font-bold shadow-sm'
                    : 'bg-[#F8E7CB] text-[#553322] hover:bg-[#EDD4AE]'
                }`}
              >
                <span>{tab.label}</span>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#C69A45] text-[#553322]'
                      : 'bg-[#FFF3DD] text-[#553322]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Container */}
      <div className="w-full min-w-0 bg-[#FFF3DD] rounded-2xl sm:rounded-3xl border-2 border-[#C69A45]/40 p-3 sm:p-6 shadow-md">

        {/* Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C69A45]/30 mb-4 text-xs text-[#553322]/70">
          <span>
            Showing <strong>{filteredOrders.length}</strong> of{' '}
            {orders.length} orders
          </span>

          {statusFilter !== 'ALL' && (
            <button
              onClick={() => setStatusFilter('ALL')}
              className="text-[#7B211F] hover:underline font-semibold"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="text-center py-12 text-sm text-[#553322]/70">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-sm text-[#553322]/70">
            No orders match the selected filters or search terms.
          </div>
        ) : (
          <>
            {/* ================================== */}
            {/* MOBILE VIEW - ORDER CARDS */}
            {/* ================================== */}
            <div className="flex flex-col gap-3 md:hidden">

              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="w-full min-w-0 rounded-2xl border border-[#C69A45]/40 bg-[#F8E7CB]/50 p-3 shadow-sm"
                >

                  {/* Order ID and Status */}
                  <div className="flex flex-col gap-2 pb-3 border-b border-[#C69A45]/30">

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Order ID
                      </p>

                      <p className="font-mono font-bold text-sm text-[#7B211F] break-all">
                        {order.order_number}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <OrderStatusBadge
                        status={order.order_status}
                        size="sm"
                      />

                      <PaymentStatusBadge
                        status={order.payment_status}
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 py-3">

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Customer
                      </p>

                      <p className="text-sm font-semibold text-[#553322] break-words">
                        {order.customer?.full_name || 'N/A'}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Phone
                      </p>

                      <p className="text-sm font-medium text-[#553322] break-all">
                        {order.customer?.phone || 'N/A'}
                      </p>
                    </div>

                    <div className="col-span-2 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Product
                      </p>

                      <p className="text-sm font-medium text-[#553322] break-words">
                        {order.product?.name || BUSINESS_CONFIG.productName}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Quantity
                      </p>

                      <p className="text-sm font-bold text-[#553322]">
                        {order.quantity} Box(es)
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Order Date
                      </p>

                      <p className="text-sm font-medium text-[#553322]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Order Type
                      </p>

                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#553322]">
                        {isPickupOrder(order) ? (
                          <>
                            <Store className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>Pickup</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4 text-indigo-700 shrink-0" />
                            <span>Delivery</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#553322]/60 mb-1">
                        Total Amount
                      </p>

                      <p className="text-sm font-bold text-[#7B211F] break-words">
                        {formatAmount(order)}
                      </p>
                    </div>
                  </div>

                  {/* Update Button */}
                  <div className="pt-3 border-t border-[#C69A45]/30">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full py-2.5 rounded-xl bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] text-sm font-semibold transition inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Order</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* ================================== */}
            {/* DESKTOP VIEW - ORIGINAL TABLE */}
            {/* ================================== */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#C69A45]/30 text-[#7B211F] font-serif uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer Name</th>
                    <th className="py-3 px-3">Customer Phone</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Qty</th>
                    <th className="py-3 px-3">Order Date</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Order Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#C69A45]/20">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#F8E7CB]/60 transition"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-[#7B211F] break-all">
                        {order.order_number}
                      </td>

                      <td className="py-3 px-3 font-medium">
                        {order.customer?.full_name || 'N/A'}
                      </td>

                      <td className="py-3 px-3 font-mono text-[#553322]/80">
                        {order.customer?.phone || 'N/A'}
                      </td>

                      <td className="py-3 px-3 max-w-[150px] truncate">
                        {order.product?.name || BUSINESS_CONFIG.productName}
                      </td>

                      <td className="py-3 px-3 font-bold whitespace-nowrap">
                        {order.quantity} Box(es)
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1">
                          {isPickupOrder(order) ? (
                            <>
                              <Store className="w-3.5 h-3.5 text-amber-700" />
                              <span>Pickup</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-3.5 h-3.5 text-indigo-700" />
                              <span>Delivery</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold text-[#7B211F] whitespace-nowrap">
                        {formatAmount(order)}
                      </td>

                      <td className="py-3 px-3">
                        <PaymentStatusBadge
                          status={order.payment_status}
                          size="sm"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <OrderStatusBadge
                          status={order.order_status}
                          size="sm"
                        />
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] text-xs font-semibold transition inline-flex items-center gap-1 shadow-sm whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
