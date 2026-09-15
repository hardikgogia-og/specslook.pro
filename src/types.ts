export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface LensAddon {
  id: string;
  name: string;
  price: number; // in INR e.g. 0, 299, 499, 899, 1299
  description: string;
  shortDescription?: string;
  features: string[];
  tag?: string;
}

export const EYEGLASS_LENS_ADDONS: LensAddon[] = [
  {
    id: 'none',
    name: 'Standard Frame / Demo Lenses',
    price: 0,
    description: 'Complimentary high-clarity optical demo lenses pre-fitted into your frame.',
    shortDescription: 'Clear optical demo lenses included',
    features: ['Zero power demo lenses', 'Scratch-resistant hard coat', 'Ready for prescription fitting or styling']
  },
  {
    id: 'sl-antiglare',
    name: 'SL Anti Glare',
    price: 299,
    description: 'Multi-layer anti-reflective (AR) coating designed to cancel harsh reflections, headlight halos during night driving, and overhead glare.',
    shortDescription: 'Eliminates glare & reflections for night driving & clear optics',
    features: ['Dual-side anti-reflective coating', 'Prevents night-driving headlight halos', 'Crystal-clear lens transparency', 'Easy-clean surface'],
    tag: 'Popular'
  },
  {
    id: 'sl-blupro',
    name: 'SL BluPro UV',
    price: 499,
    description: 'Precision blue light filtration with complete 100% UV400 shield. Blocks harmful high-energy blue-violet rays emitted by laptops, smartphones, and monitors.',
    shortDescription: 'Blocks harmful screen blue light & 100% UV400 radiation',
    features: ['Screens & digital device eye-strain relief', '100% UV400 broad spectrum protection', 'Cuts screen fatigue & headaches', 'Natural color balance'],
    tag: 'Screen Essential'
  },
  {
    id: 'sl-bluultra',
    name: 'SL BluUltra UV',
    price: 899,
    description: 'Premium high-index ultra-thin lenses with advanced blue light defense, super-hydrophobic smudge repellent, and anti-static dust repelling nanotechnology.',
    shortDescription: 'Advanced ultra-thin blue filter + anti-smudge nano shield',
    features: ['High-index lightweight thin profile', 'Super hydrophobic water & grease repelling', 'Oleophobic anti-fingerprint coating', 'Ultra-durable anti-scratch shield'],
    tag: 'Best Seller'
  },
  {
    id: 'sl-photouv',
    name: 'SL PhotoUV (Gen 8 Photochromic lenses)',
    price: 1299,
    description: 'Next-generation smart adaptive light transition lenses. 100% transparent indoors, then automatically shifts to rich dark sunglass tint within seconds under sunlight.',
    shortDescription: 'Smart 2-in-1: Clear indoors, auto-darkens to dark sunglasses outdoors',
    features: ['Gen 8 rapid photochromic transition', 'Seamless indoor-to-outdoor adaptation', '100% UV400 & glare blocking when tinted', 'One pair for reading and outdoor sunlight'],
    tag: 'Premium 2-in-1'
  }
];

export const SUNGLASS_LENS_ADDONS: LensAddon[] = [
  {
    id: 'sg-standard',
    name: 'Standard Non-Powered Sun Lenses',
    price: 0,
    description: 'Handcrafted 100% UV400 protective sun lenses with premium optical tint (No prescription power needed).',
    shortDescription: '100% UV400 Non-powered sun lenses included',
    features: ['Zero prescription power', '100% UV400 radiation protection', 'Glaze & glare blocking tint']
  },
  {
    id: 'sg-powered-tinted-uv420',
    name: 'Powered Tinted UV420 Glasses (Exactly same colour as the Sunglasses)',
    price: 899,
    description: 'Custom prescription-grinded optical lenses tinted to match the exact shade and colour of the sunglasses, with full UV420 high-energy ultraviolet protection.',
    shortDescription: 'Prescription power lenses tinted to match exact sunglass colour + UV420',
    features: [
      'Custom grinded to your eye prescription',
      'Exact same colour tint as the sunglasses',
      'UV420 high-energy ultraviolet protection',
      'Anti-reflective back coat & scratch shield'
    ],
    tag: 'Exclusive Power Addon'
  }
];

// Attachments Category (e.g. 6-in-1, 2-in-1 clip-ons): Optical base frame takes eyeglasses lens add-ons,
// excluding Photochromic since magnetic sunglass clip-ons provide instant sun conversion
export const ATTACHMENT_LENS_ADDONS: LensAddon[] = EYEGLASS_LENS_ADDONS.filter(
  addon => addon.id !== 'sl-photouv'
);

export const LENS_ADDONS: LensAddon[] = EYEGLASS_LENS_ADDONS;

export interface ProductSpecification {
  frameMaterial: string;
  lensMaterial: string;
  lensWidthMm: number;
  bridgeMm: number;
  templeLengthMm: number;
  uvProtection: string; // e.g. "100% UV400"
  isPolarized: boolean;
  frameShape: 'Aviator' | 'Wayfarer' | 'Clubmaster' | 'Round' | 'Square' | 'Hexagonal' | 'Cat-Eye' | 'Oval' | 'Geometric' | 'Rectangular';
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
  weightGrams?: number;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  frameColor: string;
  lensColor: string;
  images: string[];
  stock: number;
  sku: string;
  size?: 'Standard (50mm)' | 'Large (54mm)' | 'Small (47mm)' | string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  price: number; // MRP in INR
  salePrice: number; // discounted price in INR
  description: string;
  shortDescription: string;
  category: string; // e.g. "Sunglasses", "Eyeglasses", "Polarized"
  subcategory?: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  stock: number;
  images: string[];
  specifications: ProductSpecification;
  variants: ProductVariant[];
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  selectedLensType?: string; // e.g. "Zero Power (Plano)", "Blue Cut Filter", "Polarized Tint"
  lensAddon?: LensAddon;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  variantName?: string;
  image: string;
  price: number; // Unit price including lens add-on
  basePrice?: number; // Base frame price
  lensAddonName?: string;
  lensAddonPrice?: number;
  quantity: number;
  total: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export type PrescriptionMode = 'upload' | 'manual' | 'optometrist_exam' | 'zero_power';

export interface ManualEyePower {
  // Right Eye (OD - Oculus Dexter)
  odSph: string;
  odCyl: string;
  odAxis: string;
  odAdd?: string;
  // Left Eye (OS - Oculus Sinister)
  osSph: string;
  osCyl: string;
  osAxis: string;
  osAdd?: string;
  // Pupillary Distance
  pd?: string;
  notes?: string;
}

export interface OptometristAppointment {
  patientName: string;
  patientAge: string | number;
  storeId: string;
  storeName: string;
  storeAddress: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00 AM - 12:00 PM"
  contactNumber: string;
  status: 'Pending Confirmation' | 'Confirmed - Client Called' | 'Completed' | 'Cancelled';
  calledAt?: string;
  callNotes?: string;
  specialInstructions?: string;
}

export interface PrescriptionSubmission {
  mode: PrescriptionMode;
  submittedAt: string;
  fileUrl?: string; // Base64 data URL or uploaded URL
  fileName?: string;
  fileNotes?: string;
  manualPower?: ManualEyePower;
  optometristAppointment?: OptometristAppointment;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SL-849102"
  createdAt: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'cashfree' | 'cod';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  timeline: OrderTimeline[];
  notes?: string;
  prescription?: PrescriptionSubmission;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  expiryDate: string;
  usageCount: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  featured: boolean;
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  timings: string;
  features: string[];
  image: string;
  mapEmbedUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  alignment: 'left' | 'center' | 'right';
  isActive: boolean;
  priority: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockCount: number;
  recentOrders: Order[];
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  statusDistribution: { status: OrderStatus; count: number }[];
}
