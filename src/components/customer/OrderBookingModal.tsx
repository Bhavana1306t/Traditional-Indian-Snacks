
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, DeliveryType } from '../../lib/types';
import { getProducts, createOrder } from '../../lib/api';
import { generateWhatsAppOrderMessage, openWhatsAppChat } from '../../lib/whatsapp';
import { BUSINESS_CONFIG } from '../../lib/constants';
import { DecorativeLotus } from '../common/DecorativeLotus';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Send,
  MessageCircle,
  AlertCircle,
  X,
  CheckCircle2,
  Truck,
  Store,
  FileText,
  Home
} from 'lucide-react';

interface OrderBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (order: Order) => void;
}

export const OrderBookingModal: React.FC<OrderBookingModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(2);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Morning (9:00 AM - 1:00 PM)');
  const [instructions, setInstructions] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);

    if (profile?.address) {
      setDeliveryAddress(profile.address);
    }

    getProducts()
      .then((prods) => {
        if (prods.length > 0) setProduct(prods[0]);
      })
      .catch((err) => console.error('Failed to load products:', err));
  }, [profile]);

  if (!isOpen) return null;

  const unitPrice = product ? Number(product.price) : 0;
  const isPriceSet = unitPrice > 0;
  const totalAmount = isPriceSet ? unitPrice * quantity : 0;

  const resetAndClose = () => {
    setCreatedOrder(null);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !profile) {
      setError('You must be logged in to place an order.');
      return;
    }

    if (!product) {
      setError('Product details could not be loaded.');
      return;
    }

    if (quantity < 1) {
      setError('Please select at least 1 box.');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setError('Please provide a complete delivery address for doorstep delivery.');
      return;
    }

    if (!preferredDate) {
      setError('Please select your preferred preparation date.');
      return;
    }

    setIsLoading(true);

    try {
      const newOrder = await createOrder({
        customer_id: profile.id,
        product_id: product.id,
        quantity,
        unit_price: unitPrice,
        total_amount: totalAmount,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress.trim() : null,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        instructions: instructions.trim() || null,
        order_status: 'Pending',
        payment_status: 'Unpaid',
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C69A45', '#7B211F', '#F8E7CB', '#FFE082'],
        });
      } catch {}

      setCreatedOrder(newOrder);

      if (onOrderCreated) {
        onOrderCreated(newOrder);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!createdOrder || !profile) return;

    const msg = generateWhatsAppOrderMessage(createdOrder, profile);
    const url = openWhatsAppChat(msg);

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain my-auto rounded-3xl bg-[#FFF3DD] border-2 border-[#C69A45] shadow-2xl p-3 sm:p-8 text-[#553322]">

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 -mx-3 -mt-3 px-3 pt-2 sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-8 pb-2 mb-3 sm:pb-3 sm:mb-4 bg-[#FFF3DD] border-b border-[#C69A45]/30 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              resetAndClose();
              navigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] text-xs font-serif font-bold border border-[#C69A45]/50 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200"
            title="Return to Home Page"
          >
            <Home className="w-3.5 h-3.5" />
            <span>← Back to Home</span>
          </button>

          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 text-[#7B211F] hover:bg-[#F8E7CB] rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {createdOrder ? (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-serif uppercase tracking-widest text-[#C69A45] font-semibold">
                Order Placed Successfully
              </span>

              <h3 className="text-2xl font-serif font-bold text-[#7B211F] mt-1">
                Order ID: {createdOrder.order_number}
              </h3>

              <p className="text-xs sm:text-sm text-[#553322]/80 mt-1 max-w-md mx-auto">
                Your order is currently <strong>Pending Confirmation</strong> with Lakshmipathi Raju. Send your order summary via WhatsApp for instant priority scheduling.
              </p>
            </div>

            <div className="bg-[#F8E7CB]/80 p-4 rounded-2xl border border-[#C69A45]/40 text-left text-xs sm:text-sm space-y-2">
              <div className="flex justify-between border-b border-[#C69A45]/20 pb-2">
                <span className="text-[#553322]/70">Product:</span>
                <span className="font-semibold text-[#7B211F]">
                  {BUSINESS_CONFIG.productName}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#C69A45]/20 pb-2">
                <span className="text-[#553322]/70">Quantity:</span>
                <span className="font-semibold">{createdOrder.quantity} Box(es)</span>
              </div>

              <div className="flex justify-between border-b border-[#C69A45]/20 pb-2">
                <span className="text-[#553322]/70">Fulfillment:</span>
                <span className="capitalize font-semibold">
                  {createdOrder.delivery_type === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#C69A45]/20 pb-2">
                <span className="text-[#553322]/70">Scheduled For:</span>
                <span className="font-semibold">
                  {createdOrder.preferred_date} ({createdOrder.preferred_time})
                </span>
              </div>

              <div className="flex justify-between pt-1 font-bold text-sm text-[#7B211F]">
                <span>Total Amount:</span>
                <span>
                  {createdOrder.unit_price > 0
                    ? `₹${createdOrder.total_amount.toFixed(2)}`
                    : 'To be confirmed by owner'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-left text-xs text-amber-900">
              <p className="font-semibold">Notice Regarding Payment:</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Payment will be collected after order confirmation. Final price and delivery charges will be confirmed directly by Lakshmipathi Raju.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-serif font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Send Order Summary to WhatsApp (+91 9948016716)</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    resetAndClose();
                    navigate('/');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] font-serif font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Home className="w-3.5 h-3.5 text-[#FFE082]" />
                  <span>Return to Home Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetAndClose();
                    navigate('/customer/dashboard');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F8E7CB] hover:bg-[#EDD4AE] text-[#7B211F] font-serif font-semibold text-xs transition-colors"
                >
                  Done & View in My Orders
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ORDER FORM */
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="text-center mb-4">
              <div className="inline-flex p-2.5 rounded-full bg-[#7B211F]/10 border border-[#C69A45]/40 mb-2">
                <DecorativeLotus size={28} color="#7B211F" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-[#7B211F]">
                Book Fresh Andhra Poornalu
              </h3>

              <p className="text-xs text-[#553322]/80 mt-0.5">
                Freshly fried in pure cow ghee for your family & special occasions.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8E7CB]/60 p-3 rounded-2xl border border-[#C69A45]/30 text-xs">
              <div>
                <span className="text-[#553322]/70 block font-medium">Customer Name:</span>
                <span className="font-bold text-[#7B211F] text-sm">
                  {profile?.full_name || 'Guest User'}
                </span>
              </div>

              <div>
                <span className="text-[#553322]/70 block font-medium">Email Address:</span>
                <span className="font-bold text-[#7B211F] text-sm break-all">
                  {user?.email || 'Not available'}
                </span>
              </div>
            </div>

            {/* Product and Quantity */}
            <div className="bg-white/80 p-3.5 rounded-2xl border border-[#C69A45]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#7B211F]">
                    {BUSINESS_CONFIG.productName}
                  </h4>
                  <p className="text-[11px] text-[#553322]/70">
                    {product?.unit || 'Box of 10 pcs'} • Crisp & Sweet
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-sm text-[#7B211F]">
                    {isPriceSet ? `₹${unitPrice} / box` : 'Contact us for price'}
                  </span>
                  <p className="text-[10px] text-[#553322]/60">
                    {isPriceSet ? 'Configured Price' : 'Awaiting admin pricing'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#C69A45]/20">
                <span className="text-xs font-semibold text-[#553322]">Quantity (Boxes):</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-[#F8E7CB] text-[#7B211F] font-bold hover:bg-[#EDD4AE] disabled:opacity-40 transition"
                  >
                    -
                  </button>

                  <span className="w-8 text-center font-bold text-sm text-[#7B211F]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-[#F8E7CB] text-[#7B211F] font-bold hover:bg-[#EDD4AE] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs font-bold text-[#7B211F]">
                <span>Estimated Total:</span>
                <span>
                  {isPriceSet ? `₹${totalAmount.toFixed(2)}` : 'Contact us for price'}
                </span>
              </div>
            </div>

            {/* Fulfillment Option */}
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Fulfillment Option
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
                    deliveryType === 'delivery'
                      ? 'bg-[#7B211F] text-[#FFF3DD] border-[#7B211F]'
                      : 'bg-white/70 text-[#553322] border-[#C69A45]/40 hover:bg-[#F8E7CB]'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Home Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
                    deliveryType === 'pickup'
                      ? 'bg-[#7B211F] text-[#FFF3DD] border-[#7B211F]'
                      : 'bg-white/70 text-[#553322] border-[#C69A45]/40 hover:bg-[#F8E7CB]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Self Pickup</span>
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            {deliveryType === 'delivery' && (
              <div>
                <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                  Doorstep Delivery Address *
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter complete delivery address with landmark and pincode..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-xs"
                  />
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                  Preferred Date *
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#C69A45]" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] text-xs focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                  Preferred Time Slot *
                </label>

                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 w-4 h-4 text-[#C69A45]" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] text-xs focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
                  >
                    <option value="Morning (9:00 AM - 1:00 PM)">
                      Morning (9:00 AM - 1:00 PM)
                    </option>
                    <option value="Afternoon (1:00 PM - 5:00 PM)">
                      Afternoon (1:00 PM - 5:00 PM)
                    </option>
                    <option value="Evening (5:00 PM - 8:30 PM)">
                      Evening (5:00 PM - 8:30 PM)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Special Instructions (Optional)
              </label>

              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-[#C69A45]" />
                <input
                  type="text"
                  placeholder="e.g. Festival gift packaging, extra crispy crust, etc."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
                />
              </div>
            </div>

            {/* Payment Notice */}
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Payment Policy:</strong> Payment will be collected only after order confirmation. Final pricing and any delivery charges will be confirmed by Lakshmipathi Raju before dispatch.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7B211F] to-[#9B302A] text-[#FFF3DD] font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Submitting Your Order...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Order for Confirmation</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
