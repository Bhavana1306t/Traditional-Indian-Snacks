import React from 'react';
import { OrderStatus, PaymentStatus } from '../../lib/types';
import { Clock, CheckCircle2, Flame, PackageCheck, Truck, CheckCheck, XCircle, CreditCard, AlertCircle } from 'lucide-react';

export const OrderStatusBadge: React.FC<{ status: OrderStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const getStyle = () => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-100/90 text-amber-900 border-amber-300',
          icon: Clock,
          label: 'Pending Confirmation',
        };
      case 'Confirmed':
        return {
          bg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
          icon: CheckCircle2,
          label: 'Order Confirmed',
        };
      case 'Preparing':
        return {
          bg: 'bg-orange-100/90 text-orange-900 border-orange-300',
          icon: Flame,
          label: 'Freshly Preparing',
        };
      case 'Ready for Pickup':
        return {
          bg: 'bg-yellow-100/90 text-yellow-900 border-yellow-300',
          icon: PackageCheck,
          label: 'Ready for Pickup',
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-indigo-100/90 text-indigo-900 border-indigo-300',
          icon: Truck,
          label: 'Out for Delivery',
        };
      case 'Delivered':
        return {
          bg: 'bg-green-100/90 text-green-900 border-green-400',
          icon: CheckCheck,
          label: 'Delivered',
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-100/90 text-rose-900 border-rose-300',
          icon: XCircle,
          label: 'Cancelled',
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs md:text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-sm ${style.bg} ${padding}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {style.label}
    </span>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const getStyle = () => {
    switch (status) {
      case 'Paid':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CreditCard,
          label: 'Payment Received (Paid)',
        };
      case 'Unpaid':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertCircle,
          label: 'Payment Pending',
        };
      case 'Refunded':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-300',
          icon: XCircle,
          label: 'Refunded',
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${style.bg} ${padding}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {style.label}
    </span>
  );
};

