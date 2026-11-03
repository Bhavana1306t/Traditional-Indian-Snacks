import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order, OrderStatusHistory, OrderStatus } from '../../lib/types';
import { getOrderTimeline } from '../../lib/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../common/StatusBadge';
import { DecorativeLotus } from '../common/DecorativeLotus';
import { Check, Clock, Flame, Store, Truck, CheckCheck, XCircle, AlertCircle, RefreshCw, Home } from 'lucide-react';

interface OrderTimelineProps {
  order: Order;
  onRefresh?: () => void;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order, onRefresh }) => {
  const [history, setHistory] = useState<OrderStatusHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTimeline();
  }, [order.id, order.order_status]);

  const loadTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await getOrderTimeline(order.id);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load timeline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Build steps according to delivery_type
  const isPickup = order.delivery_type === 'pickup';
  const steps: { key: OrderStatus; title: string; desc: string; icon: any }[] = [
    {
      key: 'Pending',
      title: 'Order Placed',
      desc: 'Order submitted, awaiting kitchen verification',
      icon: Clock,
    },
    {
      key: 'Confirmed',
      title: 'Order Confirmed',
      desc: 'Owner Lakshmipathi Raju confirmed and scheduled your batch',
      icon: Check,
    },
    {
      key: 'Preparing',
      title: 'Freshly Preparing',
      desc: 'Handcrafted with organic jaggery, chana dal and fried in pure cow ghee',
      icon: Flame,
    },
    ...(isPickup
      ? [
          {
            key: 'Ready for Pickup' as OrderStatus,
            title: 'Ready for Pickup',
            desc: 'Hot and packed at our kitchen counter for your collection',
            icon: Store,
          },
        ]
      : [
          {
            key: 'Out for Delivery' as OrderStatus,
            title: 'Out for Delivery',
            desc: 'Dispatched to your doorstep address with special care',
            icon: Truck,
          },
        ]),
    {
      key: 'Delivered',
      title: isPickup ? 'Picked Up / Completed' : 'Delivered to Doorstep',
      desc: 'Enjoy your traditional Andhra homemade Poornalu with your loved ones!',
      icon: CheckCheck,
    },
  ];

  // Helper to determine status step index
  const statusOrder: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    isPickup ? 'Ready for Pickup' : 'Out for Delivery',
    'Delivered',
  ];

  const currentStepIndex = statusOrder.indexOf(order.order_status);
  const isCancelled = order.order_status === 'Cancelled';

  return (
    <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/50 p-6 md:p-8 shadow-xl text-[#553322]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#C69A45]/30">
        <div>
          <span className="text-xs uppercase font-serif tracking-widest text-[#C69A45] font-semibold">
            Live Order Tracking
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#7B211F] mt-0.5">
            {order.order_number}
          </h3>
          <p className="text-xs text-[#553322]/70 mt-1">
            Placed on: {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] text-xs font-serif font-bold border border-[#C69A45]/40 transition shadow-sm hover:scale-105 active:scale-95"
            title="Return to Public Storefront"
          >
            <Home className="w-3.5 h-3.5 text-[#C69A45]" />
            <span>Back to Home</span>
          </Link>
          <OrderStatusBadge status={order.order_status} size="md" />
          <PaymentStatusBadge status={order.payment_status} size="sm" />
          {onRefresh && (
            <button
              onClick={() => {
                loadTimeline();
                onRefresh();
              }}
              title="Refresh tracking status"
              className="p-2 rounded-full hover:bg-[#F8E7CB] text-[#7B211F] transition border border-[#C69A45]/30"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Cancelled Banner if applicable */}
      {isCancelled && (
        <div className="my-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center gap-3 text-rose-900">
          <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div>
            <h4 className="font-serif font-bold text-base">This Order Has Been Cancelled</h4>
            <p className="text-xs text-rose-800">
              For inquiries or assistance, please contact Lakshmipathi Raju at +91 9948016716.
            </p>
          </div>
        </div>
      )}

      {/* Progress Stepper Timeline */}
      {!isCancelled && (
        <div className="py-8">
          <div className="relative">
            {/* Progress Bar Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#EDD4AE] -translate-y-1/2 z-0" />
            <div
              className="hidden md:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#7B211F] to-[#C69A45] -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%`,
              }}
            />

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isCompleted = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={st.key} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center">
                    {/* Circle Node */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                        isCompleted
                          ? 'bg-[#7B211F] text-[#FFF3DD] ring-4 ring-[#C69A45]/40'
                          : isCurrent
                          ? 'bg-[#C69A45] text-[#553322] ring-4 ring-[#C69A45]/60 animate-pulse'
                          : 'bg-[#F8E7CB] text-[#553322]/40 border-2 border-[#C69A45]/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 md:flex-initial">
                      <p
                        className={`font-serif text-sm font-bold ${
                          isCurrent
                            ? 'text-[#7B211F]'
                            : isCompleted
                            ? 'text-[#553322]'
                            : 'text-[#553322]/50'
                        }`}
                      >
                        {st.title}
                      </p>
                      <p className="text-[11px] text-[#553322]/70 leading-snug hidden sm:block mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Order Snapshot Grid */}
      <div className="mt-6 pt-6 border-t border-[#C69A45]/30 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
        {/* Item Info */}
        <div className="bg-[#F8E7CB]/60 p-4 rounded-2xl border border-[#C69A45]/30">
          <h5 className="font-serif font-bold text-[#7B211F] mb-2 flex items-center gap-1.5">
            <DecorativeLotus size={16} color="#7B211F" />
            <span>Product Details</span>
          </h5>
          <p className="font-bold text-[#553322]">{order.product?.name || 'Andhra Poornalu (Poornam Boorelu)'}</p>
          <p className="text-xs text-[#553322]/70 mt-1">Quantity: <strong>{order.quantity} Box(es)</strong></p>
          <p className="text-xs text-[#553322]/70">
            Total Amount: <strong>{order.unit_price > 0 ? `₹${order.total_amount}` : 'Contact us for price'}</strong>
          </p>
        </div>

        {/* Schedule & Fulfillment */}
        <div className="bg-[#F8E7CB]/60 p-4 rounded-2xl border border-[#C69A45]/30">
          <h5 className="font-serif font-bold text-[#7B211F] mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#7B211F]" />
            <span>Fulfillment Info</span>
          </h5>
          <p className="capitalize font-semibold text-[#553322]">
            Type: {order.delivery_type === 'delivery' ? 'Home Delivery' : 'Kitchen Pickup'}
          </p>
          <p className="text-xs text-[#553322]/70 mt-1">Date: <strong>{order.preferred_date}</strong></p>
          <p className="text-xs text-[#553322]/70">Time: <strong>{order.preferred_time}</strong></p>
          {order.delivery_address && (
            <p className="text-xs text-[#553322]/80 mt-1.5 break-words">
              <strong>Address:</strong> {order.delivery_address}
            </p>
          )}
        </div>

        {/* Kitchen Notes */}
        <div className="bg-[#F8E7CB]/60 p-4 rounded-2xl border border-[#C69A45]/30">
          <h5 className="font-serif font-bold text-[#7B211F] mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#7B211F]" />
            <span>Instructions & Notes</span>
          </h5>
          <p className="text-xs text-[#553322]/80 italic">
            {order.instructions ? `"${order.instructions}"` : 'No special packaging notes.'}
          </p>
          <div className="mt-3 text-[11px] text-amber-900 bg-amber-100/60 p-2 rounded-lg border border-amber-300">
            Payment will be collected after order confirmation.
          </div>
        </div>
      </div>

      {/* History Audit Trail */}
      {history.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#C69A45]/30">
          <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#7B211F] mb-3">
            Status Audit Log
          </h5>
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white/60 border border-[#C69A45]/20"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C69A45]" />
                  <span className="font-semibold text-[#7B211F]">{h.new_status}</span>
                  {h.notes && <span className="text-[#553322]/70">— {h.notes}</span>}
                </div>
                <span className="text-[#553322]/60 text-[11px]">
                  {new Date(h.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

