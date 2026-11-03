
import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../../lib/types';
import { updateOrderStatus, updatePaymentStatus } from '../../lib/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../common/StatusBadge';
import { BUSINESS_CONFIG } from '../../lib/constants';
import {
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  Flame,
  Store,
  Truck,
  CheckCheck,
  XCircle,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onOrderUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelPrompt, setCancelPrompt] = useState(false);

  if (!order) return null;

  // Normalize fulfillment type to recognize different stored values.
  const deliveryType = String(order.delivery_type || '')
    .toLowerCase()
    .replace(/[\s_-]/g, '');

  const isPickup =
    deliveryType === 'pickup' ||
    deliveryType === 'selfpickup';

  // Database stores Delivered for both completed delivery and pickup.
  // Display Picked Up for completed pickup orders.
  const isPickedUp =
    isPickup && order.order_status === 'Delivered';

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const updated = await updateOrderStatus(
        order.id,
        newStatus
      );

      onOrderUpdated(updated);
      setCancelPrompt(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentChange = async (newPayment: PaymentStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const updated = await updatePaymentStatus(order.id, newPayment);
      onOrderUpdated(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppCustomer = () => {
    const rawNumber = (order.customer?.phone || '').replace(/\D/g, '');

    if (!rawNumber) {
      setError('Customer phone number is not available.');
      return;
    }

    const message = encodeURIComponent(
      `Hello ${order.customer?.full_name || 'Customer'}, regarding your Traditional Indian Snacks order ${order.order_number}.`
    );

    window.open(`https://wa.me/${rawNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 rounded-3xl bg-[#FFF3DD] border-2 border-[#C69A45] shadow-2xl p-6 sm:p-8 text-[#553322]">

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#C69A45]/30">
          <div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#C69A45] font-semibold">
              Admin Order Inspection
            </span>

            <h3 className="text-2xl font-serif font-bold text-[#7B211F]">
              {order.order_number}
            </h3>

            <p className="text-xs text-[#553322]/70 mt-0.5">
              Received: {new Date(order.created_at).toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7B211F] hover:bg-[#F8E7CB] rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="my-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900">
            {error}
          </div>
        )}

        {/* Status and Payment */}
        <div className="my-4 p-4 rounded-2xl bg-[#F8E7CB]/80 border border-[#C69A45]/40 flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#553322]/80">
              Status:
            </span>

            {isPickedUp ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800">
                <CheckCheck className="w-4 h-4" />
                Picked Up
              </span>
            ) : (
              <OrderStatusBadge
                status={order.order_status}
                size="md"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#553322]/80">
              Payment:
            </span>

            <PaymentStatusBadge
              status={order.payment_status}
              size="md"
            />
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white/80 p-4 rounded-2xl border border-[#C69A45]/30 mb-4 space-y-2 text-xs sm:text-sm">
          <h4 className="font-serif font-bold text-[#7B211F] text-sm border-b border-[#C69A45]/20 pb-1.5">
            Customer Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <p>
              <strong>Name:</strong>{' '}
              {order.customer?.full_name || 'N/A'}
            </p>

            <p>
              <strong>Phone:</strong>{' '}
              {order.customer?.phone || 'N/A'}
            </p>

            <p>
              <strong>Fulfillment:</strong>{' '}
              {isPickup ? 'Self Pickup' : 'Home Delivery'}
            </p>

            <p>
              <strong>Slot:</strong>{' '}
              {order.preferred_date} ({order.preferred_time})
            </p>
          </div>

          {!isPickup && (
            <p className="pt-1">
              <strong>Delivery Address:</strong>{' '}
              {order.delivery_address || 'Not provided'}
            </p>
          )}

          {order.instructions && (
            <p className="pt-1 text-[#7B211F] italic bg-[#FFF3DD] p-2 rounded-lg">
              <strong>Special Instructions:</strong>{' '}
              {order.instructions}
            </p>
          )}

          {order.customer?.phone && (
            <div className="flex gap-3 pt-2">
              <a
                href={`tel:${order.customer.phone}`}
                className="inline-flex items-center gap-1 text-xs text-[#7B211F] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>

              <button
                type="button"
                onClick={handleWhatsAppCustomer}
                className="inline-flex items-center gap-1 text-xs text-emerald-700"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
            </div>
          )}
        </div>

        {/* Order Items and Billing */}
        <div className="bg-white/80 p-4 rounded-2xl border border-[#C69A45]/30 mb-6 text-xs sm:text-sm space-y-2">
          <h4 className="font-serif font-bold text-[#7B211F] text-sm border-b border-[#C69A45]/20 pb-1.5">
            Order Items & Billing
          </h4>

          <div className="flex justify-between items-center py-1">
            <span>
              {order.product?.name || BUSINESS_CONFIG.productName} (
              {order.product?.unit || 'Box of 10 pcs'})
            </span>

            <span className="font-semibold">
              {order.quantity} Box(es)
            </span>
          </div>

          <div className="flex justify-between items-center py-1 text-[#553322]/80">
            <span>Configured Unit Price:</span>

            <span>
              {order.unit_price > 0
                ? `₹${order.unit_price} / box`
                : 'Contact us for price'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#C69A45]/20 font-bold text-sm text-[#7B211F]">
            <span>Total Billed Amount:</span>

            <span>
              {order.unit_price > 0
                ? `₹${order.total_amount.toFixed(2)}`
                : 'Awaiting confirmation'}
            </span>
          </div>
        </div>

        {/* Update Order Status */}
        <div className="space-y-4">
          <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#7B211F]">
            Update Order Status
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">

            {/* Confirm Order */}
            <button
              disabled={isLoading || order.order_status === 'Confirmed'}
              onClick={() => handleStatusChange('Confirmed')}
              className="p-2.5 rounded-xl border border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 disabled:opacity-40 font-semibold flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Order
            </button>

            {/* Preparing */}
            <button
              disabled={isLoading || order.order_status === 'Preparing'}
              onClick={() => handleStatusChange('Preparing')}
              className="p-2.5 rounded-xl border border-orange-400 bg-orange-50 text-orange-800 hover:bg-orange-100 disabled:opacity-40 font-semibold flex items-center justify-center gap-1.5"
            >
              <Flame className="w-4 h-4" />
              Preparing
            </button>

            {/* Pickup or Delivery Progress */}
            {isPickup ? (
              <button
                disabled={isLoading || order.order_status === 'Ready for Pickup'}
                onClick={() => handleStatusChange('Ready for Pickup')}
                className="p-2.5 rounded-xl border border-yellow-400 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 disabled:opacity-40 font-semibold flex items-center justify-center gap-1.5"
              >
                <Store className="w-4 h-4" />
                Ready for Pickup
              </button>
            ) : (
              <button
                disabled={isLoading || order.order_status === 'Out for Delivery'}
                onClick={() => handleStatusChange('Out for Delivery')}
                className="p-2.5 rounded-xl border border-indigo-400 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 disabled:opacity-40 font-semibold flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                Out for Delivery
              </button>
            )}

            {/* Picked Up or Delivered */}
            <button
              disabled={isLoading || order.order_status === 'Delivered'}
              onClick={() => handleStatusChange('Delivered')}
              className="p-2.5 rounded-xl border border-green-500 bg-green-50 text-green-900 hover:bg-green-100 disabled:opacity-40 font-semibold flex items-center justify-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />

              {isPickup ? 'Mark Picked Up' : 'Mark Delivered'}
            </button>
          </div>

          {/* Payment Control */}
          <div className="pt-2">
            <h5 className="text-[11px] font-semibold text-[#553322]/80 uppercase tracking-wider mb-2">
              Payment Control
            </h5>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                disabled={isLoading || order.payment_status === 'Paid'}
                onClick={() => handlePaymentChange('Paid')}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-40 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Mark as Paid
              </button>

              <button
                disabled={isLoading || order.payment_status === 'Unpaid'}
                onClick={() => handlePaymentChange('Unpaid')}
                className="py-1.5 px-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-40"
              >
                Mark as Unpaid
              </button>

              <button
                disabled={isLoading || order.payment_status === 'Refunded'}
                onClick={() => handlePaymentChange('Refunded')}
                className="py-1.5 px-3 rounded-lg bg-stone-600 text-white font-semibold hover:bg-stone-700 disabled:opacity-40"
              >
                Mark as Refunded
              </button>
            </div>
          </div>

          {/* Cancel Order */}
          <div className="pt-3 border-t border-[#C69A45]/20">
            {!cancelPrompt ? (
              <button
                type="button"
                disabled={isLoading || order.order_status === 'Cancelled'}
                onClick={() => setCancelPrompt(true)}
                className="text-xs text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 font-semibold"
              >
                <XCircle className="w-4 h-4" />
                Cancel this Order
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3 bg-rose-50 p-3 rounded-xl border border-rose-300">
                <div className="flex items-center gap-2 text-xs text-rose-900 font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Are you sure you want to cancel this order?
                </div>

                <button
                  disabled={isLoading}
                  onClick={() => handleStatusChange('Cancelled')}
                  className="px-3 py-1 bg-rose-700 text-white text-xs rounded-lg font-bold"
                >
                  Yes, Cancel
                </button>

                <button
                  onClick={() => setCancelPrompt(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-lg font-semibold"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
