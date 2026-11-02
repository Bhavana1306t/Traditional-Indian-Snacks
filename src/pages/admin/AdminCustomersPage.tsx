import React, { useState, useEffect } from 'react';
import { Profile, Order } from '../../lib/types';
import { getCustomers, getOrders } from '../../lib/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Search,
  Phone,
  Calendar,
  ShoppingBag,
  RefreshCw,
  ShieldCheck,
  Eye,
  X,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface CustomerWithStats extends Profile {
  totalOrders: number;
  recentOrderDate: string | null;
  orders: Order[];
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [inspectCustomer, setInspectCustomer] = useState<CustomerWithStats | null>(null);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    setIsLoading(true);
    try {
      const [profs, ords] = await Promise.all([getCustomers(), getOrders()]);

      const mapped: CustomerWithStats[] = profs.map((p) => {
        const userOrders = ords.filter((o) => o.customer_id === p.id);
        const sorted = userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return {
          ...p,
          totalOrders: userOrders.length,
          recentOrderDate: sorted.length > 0 ? sorted[0].created_at : null,
          orders: sorted,
        };
      });

      setCustomers(mapped);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
    } else {
      const q = searchQuery.toLowerCase().trim();
      setFilteredCustomers(
        customers.filter(
          (c) =>
            c.full_name.toLowerCase().includes(q) ||
            (c.phone || '').includes(q) ||
            (c.address || '').toLowerCase().includes(q)
        )
      );
    }
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C69A45]/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
            Registered customer directory with verified phone numbers & order histories
          </p>
        </div>

        <button
          onClick={loadCustomerData}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] text-xs font-semibold border border-[#C69A45]/50 transition flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-[#FFF3DD] p-4 rounded-2xl border border-[#C69A45]/40 shadow-sm flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#C69A45]" />
          <input
            type="text"
            placeholder="Search customers by name, phone number, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#C69A45]/50 bg-white/90 text-xs sm:text-sm text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
          />
        </div>
        <span className="text-xs text-[#553322]/70 hidden sm:inline">
          Total Customers: <strong>{customers.length}</strong>
        </span>
      </div>

      {/* Customer Table */}
      <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 shadow-md">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#553322]/70">
            No customers found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#C69A45]/30 text-[#7B211F] font-serif uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Verified Phone</th>
                  <th className="py-3 px-3">Registered On</th>
                  <th className="py-3 px-3">Default Address</th>
                  <th className="py-3 px-3">Total Orders</th>
                  <th className="py-3 px-3">Most Recent Order</th>
                  <th className="py-3 px-3 text-right">Order History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C69A45]/20">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#F8E7CB]/60 transition">
                    <td className="py-3 px-3 font-semibold text-[#7B211F] text-sm">
                      {cust.full_name}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">
                      <span className="inline-flex items-center gap-1.5 text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{cust.phone || 'Phone verified'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#553322]/80">
                      {new Date(cust.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-3 max-w-[180px] truncate text-[#553322]/70">
                      {cust.address || 'Not specified'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F8E7CB] text-[#7B211F] font-bold border border-[#C69A45]/30">
                        {cust.totalOrders}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#553322]/80">
                      {cust.recentOrderDate ? new Date(cust.recentOrderDate).toLocaleDateString('en-IN') : 'None'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setInspectCustomer(cust)}
                        className="px-3 py-1.5 rounded-lg bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Orders ({cust.totalOrders})</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Order History Drilldown Modal */}
      {inspectCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-6 rounded-3xl bg-[#FFF3DD] border-2 border-[#C69A45] shadow-2xl p-6 sm:p-8 text-[#553322]">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#C69A45]/30">
              <div>
                <span className="text-[11px] uppercase font-mono tracking-wider text-[#C69A45] font-semibold">
                  Customer History Audit
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#7B211F]">
                  {inspectCustomer.full_name}
                </h3>
                <p className="text-xs text-[#553322]/80 mt-0.5 flex items-center gap-2">
                  <span>Phone: <strong>{inspectCustomer.phone}</strong></span>
                  <span>•</span>
                  <span>Registered: {new Date(inspectCustomer.created_at).toLocaleDateString('en-IN')}</span>
                </p>
                {inspectCustomer.address && (
                  <p className="text-xs text-[#553322]/70 mt-1">
                    Address: {inspectCustomer.address}
                  </p>
                )}
              </div>

              <button
                onClick={() => setInspectCustomer(null)}
                className="p-2 text-[#7B211F] hover:bg-[#F8E7CB] rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Orders List */}
            <div className="mt-4">
              <h4 className="font-serif font-bold text-sm text-[#7B211F] mb-3">
                All Orders Placed by {inspectCustomer.full_name} ({inspectCustomer.orders.length})
              </h4>

              {inspectCustomer.orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#553322]/70">
                  This customer has not placed any orders yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {inspectCustomer.orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3.5 rounded-2xl bg-[#F8E7CB]/70 border border-[#C69A45]/30 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#7B211F] text-sm block">
                          {o.order_number}
                        </span>
                        <span className="text-[#553322]/80">
                          {o.quantity} Box(es) • {o.delivery_type === 'delivery' ? 'Home Delivery' : 'Pickup'}
                        </span>
                        <span className="text-[11px] text-[#553322]/60 block mt-0.5">
                          Scheduled: {o.preferred_date} ({o.preferred_time})
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={o.order_status} size="sm" />
                          <PaymentStatusBadge status={o.payment_status} size="sm" />
                        </div>
                        <span className="font-bold text-[#7B211F]">
                          {o.unit_price > 0 ? `₹${o.total_amount.toFixed(2)}` : 'Contact us'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
