export const BUSINESS_CONFIG = {
  name: 'Traditional Indian Snacks',
  tagline: 'Taste • Tradition • Together',
  owner: 'Lakshmipathi Raju',
  phone: '+91 9948016716',
  rawPhone: '919948016716',
  whatsappNumber: '+91 9948016716',
  rawWhatsapp: '919948016716',
  email: 'Admin@gmail.com',
  address: 'Andhra Pradesh, India',
  productName: 'Andhra Poornalu (Poornam Boorelu)',
  description: 'Authentic Andhra-style Poornalu prepared with traditional taste and care. Crispy golden outer layer with a rich sweet filling of chana dal, pure jaggery, cardamom, and coconut.',
  initialPriceText: 'Contact us for price',
  operatingHours: '8:00 AM – 9:00 PM (All 7 Days)',
  deliveryAreas: 'Doorstep Delivery & Fresh Kitchen Pickup available'
};

export const ORDER_STATUS_STEPS = [
  { key: 'Pending', label: 'Order Placed', desc: 'Awaiting confirmation from kitchen' },
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Ingredients prepared & batch scheduled' },
  { key: 'Preparing', label: 'Freshly Preparing', desc: 'Poornalu being freshly made in pure ghee' },
  { key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Packed hot and ready at our counter' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'On its way to your doorstep' },
  { key: 'Delivered', label: 'Delivered / Completed', desc: 'Enjoy your traditional sweet treat!' },
  { key: 'Cancelled', label: 'Cancelled', desc: 'Order was cancelled' }
] as const;
