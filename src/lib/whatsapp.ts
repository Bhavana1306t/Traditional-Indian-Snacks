import { Order, Profile } from './types';
import { BUSINESS_CONFIG } from './constants';

export function generateWhatsAppOrderMessage(order: Order, customer: Profile): string {
  const deliveryTypeFormatted = order.delivery_type === 'delivery' ? 'Home Delivery' : 'Self Pickup';
  const priceDisplay = order.unit_price > 0 
    ? `₹${order.total_amount.toFixed(2)} (₹${order.unit_price} x ${order.quantity})`
    : 'Awaiting confirmation from owner';

  return `*TRADITIONAL INDIAN SNACKS - NEW ORDER* 🪔
===============================
*Order ID:* ${order.order_number}
*Customer Name:* ${customer.full_name}
*Mobile Number:* ${customer.phone}
-------------------------------
*Product:* ${BUSINESS_CONFIG.productName}
*Quantity:* ${order.quantity} Box(es)
*Order Type:* ${deliveryTypeFormatted}
*Preferred Date:* ${order.preferred_date}
*Preferred Time:* ${order.preferred_time}
${order.delivery_type === 'delivery' && order.delivery_address ? `*Delivery Address:* ${order.delivery_address}\n` : ''}*Estimated Total:* ${priceDisplay}
${order.instructions ? `*Special Notes:* ${order.instructions}\n` : ''}-------------------------------
*Status:* Order Submitted (${order.order_status})
*Owner:* ${BUSINESS_CONFIG.owner} (${BUSINESS_CONFIG.phone})
Taste • Tradition • Together
===============================
Please confirm my order. Thank you!`;
}

export function openWhatsAppChat(message: string, rawPhone = BUSINESS_CONFIG.rawWhatsapp): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${rawPhone}?text=${encodedMessage}`;
}

export function openDirectWhatsApp(customText = 'Hello Lakshmipathi Raju garu, I want to inquire about ordering Traditional Andhra Poornalu.'): string {
  const encoded = encodeURIComponent(customText);
  return `https://wa.me/${BUSINESS_CONFIG.rawWhatsapp}?text=${encoded}`;
}
