import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../lib/types';
import { getOrders } from '../../lib/api';
import { BUSINESS_CONFIG } from '../../lib/constants';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from '../../components/common/StatusBadge';
import { OrderTimeline } from '../../components/customer/OrderTimeline';
import { ProfileEditor } from '../../components/customer/ProfileEditor';
import { DecorativeLotus } from '../../components/common/DecorativeLotus';
import { openDirectWhatsApp } from '../../lib/whatsapp';
import {
  ShoppingBag,
  PlusCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  LogOut,
  ChevronRight,
  RefreshCw,
  Eye,
  Store,
  Truck,
  Home,
} from 'lucide-react';

interface CustomerDashboardProps {
  onOpenOrderModal: () => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardProps> = ({
  onOpenOrderModal,
}) => {
  const { profile, user, logout } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Reference to the tracking section
  const trackingSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCustomerOrders();
  }, [profile?.id, user?.id]);

  const loadCustomerOrders = async () => {
    if (!profile?.id && !user?.id) return;

    setIsLoading(true);

    try {
      const targetId = profile?.id || user?.id;
      const data = await getOrders(targetId);

      setOrders(data);

      if (data.length > 0) {
        setSelectedOrderForTracking((current) => {
          if (!current) return data[0];

          // Keep the selected order updated with the latest data
          return data.find((order) => order.id === current.id) || data[0];
        });
      } else {
        setSelectedOrderForTracking(null);
      }
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Track button handler
  const handleTrackOrder = (order: Order) => {
    setSelectedOrderForTracking(order);

    // Scroll to the tracking timeline
    requestAnimationFrame(() => {
      trackingSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  };

  const activeOrdersCount = orders.filter(
    (o) => !['Delivered', 'Cancelled'].includes(o.order_status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 lg:pt-10 pb-10 space-y-8 bg-[#FFF3DD] text-[#553322]">

      {/* Back to Home Page Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] text-xs font-serif font-bold border border-[#C69A45]/50 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 group/back"
          title="Return to Public Storefront"
        >
          <Home className="w-4 h-4 text-[#C69A45] group-hover/back:-translate-x-0.5 transition-transform" />
          <span>← Back to Home Page</span>
        </Link>

        <span className="text-xs text-[#553322]/70 font-serif hidden sm:inline">
          Traditional Indian Snacks • Customer Dashboard
        </span>
      </div>

      {/* 1. Welcome Header Banner */}
      <div className="bg-[#7B211F] text-[#FFF3DD] rounded-3xl p-6 sm:p-8 border-2 border-[#C69A45] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#5A1715] border border-[#C69A45]/50 shadow-md">
            <DecorativeLotus size={36} color="#C69A45" />
          </div>

          <div>
            <span className="text-xs uppercase font-serif tracking-widest text-[#C69A45] font-semibold">
              Customer Portal
            </span>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF3DD]">
              Namaskaram, {profile?.full_name || 'Valued Customer'}!
            </h1>

            <p className="text-xs text-[#F8E7CB]/80 mt-1 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C69A45]" />
              <span>
                Verified Account: <strong>{profile?.phone}</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenOrderModal}
            className="flex-1 md:flex-initial px-6 py-3 rounded-full bg-gradient-to-r from-[#FFE082] via-[#C69A45] to-[#B88728] text-[#553322] font-serif font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#7B211F]" />
            <span>Place New Order</span>
          </button>

          <a
            href={openDirectWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact Owner</span>
          </a>

          <button
            onClick={logout}
            className="p-3 rounded-full bg-[#5A1715] hover:bg-[#3D0D0B] text-rose-300 border border-[#C69A45]/40 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F8E7CB] p-5 rounded-2xl border border-[#C69A45]/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-serif uppercase tracking-wider text-[#553322]/70 font-semibold">
              Total Orders Placed
            </span>
            <p className="text-2xl font-serif font-bold text-[#7B211F] mt-1">
              {orders.length}
            </p>
          </div>
          <ShoppingBag className="w-8 h-8 text-[#C69A45]" />
        </div>

        <div className="bg-[#F8E7CB] p-5 rounded-2xl border border-[#C69A45]/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-serif uppercase tracking-wider text-[#553322]/70 font-semibold">
              Active Orders
            </span>
            <p className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {activeOrdersCount}
            </p>
          </div>
          <Clock className="w-8 h-8 text-emerald-600" />
        </div>

        <div className="bg-[#F8E7CB] p-5 rounded-2xl border border-[#C69A45]/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-serif uppercase tracking-wider text-[#553322]/70 font-semibold">
              Default Address
            </span>
            <p className="text-xs font-medium text-[#553322] mt-1 line-clamp-1">
              {profile?.address || 'Not specified yet'}
            </p>
          </div>
          <MapPin className="w-8 h-8 text-[#C69A45]" />
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-[#C69A45]/40 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`font-serif text-sm font-bold tracking-wider px-4 py-2 rounded-xl transition ${
            activeTab === 'orders'
              ? 'bg-[#7B211F] text-[#FFF3DD] shadow-md'
              : 'text-[#553322] hover:bg-[#F8E7CB]'
          }`}
        >
          My Orders & Order History ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`font-serif text-sm font-bold tracking-wider px-4 py-2 rounded-xl transition ${
            activeTab === 'profile'
              ? 'bg-[#7B211F] text-[#FFF3DD] shadow-md'
              : 'text-[#553322] hover:bg-[#F8E7CB]'
          }`}
        >
          Profile & Address Settings
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      {activeTab === 'profile' ? (
        <ProfileEditor />
      ) : (
        <div className="space-y-8">
          {/* Selected Order Live Tracking Component */}
          {selectedOrderForTracking && (
            <div ref={trackingSectionRef}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-bold text-lg text-[#7B211F] flex items-center gap-2">
                  <DecorativeLotus size={20} color="#7B211F" />
                  <span>Selected Order Real-time Progress</span>
                </h3>

                <span className="text-xs text-[#553322]/70">
                  Tracking Order #{selectedOrderForTracking.order_number}
                </span>
              </div>

              <OrderTimeline
                order={selectedOrderForTracking}
                onRefresh={loadCustomerOrders}
              />
            </div>
          )}

          {/* Orders Table & List */}
          <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-[#C69A45]/30 mb-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#7B211F]">
                  My Order History
                </h3>

                <p className="text-xs text-[#553322]/70">
                  Detailed view of all your Andhra Poornalu bookings
                </p>
              </div>

              <button
                onClick={loadCustomerOrders}
                className="p-2 rounded-xl hover:bg-[#F8E7CB] text-[#7B211F] transition flex items-center gap-1.5 text-xs font-semibold"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isLoading ? 'animate-spin' : ''
                  }`}
                />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-10 text-[#7B211F]">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F8E7CB] flex items-center justify-center text-[#7B211F]">
                  <ShoppingBag className="w-8 h-8 text-[#C69A45]" />
                </div>

                <h4 className="font-serif font-bold text-lg text-[#7B211F]">
                  No Orders Placed Yet
                </h4>

                <p className="text-xs text-[#553322]/70 max-w-sm mx-auto">
                  Experience authentic Andhra homemade Poornam Boorelu prepared
                  in pure cow ghee. Book your first batch now!
                </p>

                <button
                  onClick={onOpenOrderModal}
                  className="px-6 py-2.5 rounded-full bg-[#7B211F] text-[#FFF3DD] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#5A1715] transition"
                >
                  Place Your First Order
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#C69A45]/30 text-[#7B211F] font-serif uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Product</th>
                      <th className="py-3 px-3">Qty</th>
                      <th className="py-3 px-3">Order Date</th>
                      <th className="py-3 px-3">Fulfillment</th>
                      <th className="py-3 px-3">Total Amount</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Order Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#C69A45]/20">
                    {orders.map((order) => {
                      const isSelected =
                        selectedOrderForTracking?.id === order.id;

                      return (
                        <tr
                          key={order.id}
                          className={`hover:bg-[#F8E7CB]/50 transition ${
                            isSelected
                              ? 'bg-[#F8E7CB]/80 font-medium'
                              : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold text-[#7B211F]">
                            {order.order_number}
                          </td>

                          <td className="py-3 px-3">
                            {order.product?.name || BUSINESS_CONFIG.productName}
                          </td>

                          <td className="py-3 px-3 font-semibold">
                            {order.quantity} Box(es)
                          </td>

                          <td className="py-3 px-3 text-xs text-[#553322]/80">
                            {new Date(order.created_at).toLocaleDateString(
                              'en-IN'
                            )}
                          </td>

                          <td className="py-3 px-3 capitalize">
                            <span className="inline-flex items-center gap-1 text-xs">
                              {order.delivery_type === 'delivery' ? (
                                <>
                                  <Truck className="w-3.5 h-3.5 text-indigo-700" />
                                  <span>Home Delivery</span>
                                </>
                              ) : (
                                <>
                                  <Store className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Pickup</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-bold text-[#7B211F]">
                            {order.unit_price > 0
                              ? `₹${order.total_amount.toFixed(2)}`
                              : 'Contact us'}
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
                              type="button"
                              onClick={() => handleTrackOrder(order)}
                              className="px-3 py-1 rounded-lg bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] text-xs font-semibold transition inline-flex items-center gap-1 shadow-sm"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Track</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};