export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type VisionType = 'single_vision' | 'bifocal' | 'progressive';

export interface LensAddon {
  id: string;
  name: string;
  price: number; // in INR e.g. 0, 299, 499, 599, 899, 999, 1249, 1499, 2499, 2999
  originalPrice?: number; // Sliced 2x MRP in INR e.g. 599, 999, 1199, 1999, 2499, 2999, 4999, 5999
  visionType?: VisionType;
  description: string;
  shortDescription?: string;
  features: string[];
  tag?: string;
  badge?: string;
}

export const SINGLE_VISION_LENS_ADDONS: LensAddon[] = [
  {
    id: 'none',
    name: 'Standard Frame / Demo Lenses',
    price: 0,
    originalPrice: 0,
    visionType: 'single_vision',
    description: 'Complimentary high-clarity optical demo lenses pre-fitted into your frame (Zero power).',
    shortDescription: 'Clear optical demo lenses included',
    features: ['Zero power demo lenses', 'Scratch-resistant hard coat', 'Ready for prescription fitting or fashion wear']
  },
  {
    id: 'sl-antiglare',
    name: 'SL Anti Glare',
    price: 299,
    originalPrice: 599,
    visionType: 'single_vision',
    description: 'Multi-layer anti-reflective (AR) coating designed to cancel harsh reflections, headlight halos during night driving, and overhead glare.',
    shortDescription: 'Eliminates glare & reflections for night driving & clear optics',
    features: ['Dual-side anti-reflective coating', 'Prevents night-driving headlight halos', 'Crystal-clear lens transparency', 'Easy-clean surface'],
    tag: 'Popular'
  },
  {
    id: 'sl-blupro',
    name: 'SL BluPro UV',
    price: 499,
    originalPrice: 999,
    visionType: 'single_vision',
    description: 'Precision blue light filtration with complete 100% UV400 shield. Blocks harmful high-energy blue-violet rays emitted by laptops, smartphones, and monitors.',
    shortDescription: 'Blocks harmful screen blue light & 100% UV400 radiation',
    features: ['Screens & digital device eye-strain relief', '100% UV400 broad spectrum protection', 'Cuts screen fatigue & headaches', 'Natural color balance'],
    tag: 'Screen Essential'
  },
  {
    id: 'sl-bluultra',
    name: 'SL BluUltra UV',
    price: 899,
    originalPrice: 1799,
    visionType: 'single_vision',
    description: 'Premium high-index ultra-thin lenses with advanced blue light defense, super-hydrophobic smudge repellent, and anti-static dust repelling nanotechnology.',
    shortDescription: 'Advanced ultra-thin blue filter + anti-smudge nano shield',
    features: ['High-index lightweight thin profile', 'Super hydrophobic water & grease repelling', 'Oleophobic anti-fingerprint coating', 'Ultra-durable anti-scratch shield'],
    tag: 'Best Seller'
  },
  {
    id: 'sl-photouv',
    name: 'SL PhotoUV (Gen 8 Photochromic lenses)',
    price: 1299,
    originalPrice: 2599,
    visionType: 'single_vision',
    description: 'Next-generation smart adaptive light transition lenses. 100% transparent indoors, then automatically shifts to rich dark sunglass tint within seconds under sunlight.',
    shortDescription: 'Smart 2-in-1: Clear indoors, auto-darkens to dark sunglasses outdoors',
    features: ['Gen 8 rapid photochromic transition', 'Seamless indoor-to-outdoor adaptation', '100% UV400 & glare blocking when tinted', 'One pair for reading and outdoor sunlight'],
    tag: 'Premium 2-in-1'
  }
];

export const BIFOCAL_LENS_ADDONS: LensAddon[] = [
  {
    id: 'bf-hard-multicoat',
    name: 'Hard Multicoat Bifocal Lenses',
    price: 599,
    originalPrice: 1199,
    visionType: 'bifocal',
    description: 'Dual-vision lenses with distinct D-segment for distance and near reading vision, reinforced with a hard multicoat scratch guard.',
    shortDescription: 'Distance + reading in one lens with hard multicoat scratch guard',
    features: ['Precision D-segment reading window', 'Hard multicoat scratch resistance', 'Anti-reflective clear glare reduction', 'Durable high-impact resin'],
    tag: 'Standard Bifocal'
  },
  {
    id: 'bf-blupro',
    name: 'BluPro UV Bifocal Lenses',
    price: 999,
    originalPrice: 1999,
    visionType: 'bifocal',
    description: 'Dual-focal bifocal lenses with advanced blue light filtration shield protecting against digital screens, mobile phones, and 100% UV rays.',
    shortDescription: 'Distance & reading in one pair with screen blue ray filter + UV400',
    features: ['Distance & near reading in one frame', 'Blue light filter for digital devices', '100% UV400 broad spectrum protection', 'Multi-layer anti-glare coating'],
    tag: 'Digital Screen Bifocal'
  },
  {
    id: 'bf-bluultra',
    name: 'BluUltra UV Bifocal Lenses',
    price: 1249,
    originalPrice: 2499,
    visionType: 'bifocal',
    description: 'Premium ultra-thin high-index bifocals equipped with hydrophobic grease & water repelling nano-coating and maximum blue ray filtration.',
    shortDescription: 'Ultra-thin high-index bifocal + hydrophobic smudge repellent',
    features: ['Ultra-thin high-index lightweight profile', 'Enhanced blue ray & 100% UV400 shield', 'Super hydrophobic water & oil repellent', 'Widened clarity D-segment window'],
    tag: 'Best Seller Bifocal'
  }
];

export const PROGRESSIVE_LENS_ADDONS: LensAddon[] = [
  {
    id: 'prog-hmc',
    name: 'HMC Progressive Lenses',
    price: 1499,
    originalPrice: 2999,
    visionType: 'progressive',
    description: 'No-line multifocal lenses with smooth seamless transition between distance, intermediate (computer), and near reading vision.',
    shortDescription: 'Zero line / no visible segment with seamless focus at all distances',
    features: ['Zero line / no visible dividing segment', 'Seamless focus: distance, computer & reading', 'Hard multicoat anti-scratch defense', 'Wide reading sweet-spot'],
    tag: 'All-in-One Multifocal'
  },
  {
    id: 'prog-blupro',
    name: 'BluPro Progressive (Median Corridor)',
    price: 2499,
    originalPrice: 4999,
    visionType: 'progressive',
    description: 'Advanced median corridor progressive design with digital screen blue filter and widened intermediate desktop view for natural head posture.',
    shortDescription: 'Median corridor for smooth natural transition + digital blue block',
    features: ['Median optical corridor for smooth eye movement', 'Computer & screen blue block filtration', '100% UV400 radiation shield', 'Faster adaptation & minimal swim effect'],
    tag: 'Popular Progressive'
  },
  {
    id: 'prog-bluultra',
    name: 'BluUltra Digital Progressive (Freeform German Technology)',
    price: 2999,
    originalPrice: 5999,
    visionType: 'progressive',
    description: 'State-of-the-art freeform back-surface digital progressive lenses engineered with German optical precision for distortion-free panoramic vision.',
    shortDescription: 'German freeform digital precision optics + ultra-wide panoramic corridor',
    features: ['German freeform precision point-by-point digital optics', 'Ultra-wide panoramic peripheral vision field', 'Instant adaptation with zero swim effect', 'Ultra-thin high-index & hydrophobic nano shield'],
    tag: 'German Tech Flagship'
  }
];

export const EYEGLASS_LENS_ADDONS: LensAddon[] = [
  ...SINGLE_VISION_LENS_ADDONS,
  ...BIFOCAL_LENS_ADDONS,
  ...PROGRESSIVE_LENS_ADDONS
];

export const SUNGLASS_SINGLE_VISION_LENS_ADDONS: LensAddon[] = [
  {
    id: 'sg-single-uv400',
    name: 'Single Vision UV400 Lenses',
    price: 899,
    originalPrice: 1799,
    visionType: 'single_vision',
    description: 'Custom prescription single vision lenses tinted to match your sunglasses frame with 100% UV400 ultraviolet radiation protection.',
    shortDescription: 'Prescription single vision with 100% UV400 block + matching sunglasses tint',
    features: [
      '100% UV400 ultraviolet radiation protection',
      'Custom prescription single vision (Distance or Reading)',
      'Matching tint shade to sunglasses frame',
      'Hard multicoat anti-scratch defense'
    ],
    tag: 'UV400 Protected'
  },
  {
    id: 'sg-single-japanese',
    name: 'UV400 Thin (Japanese Lenses)',
    price: 1199,
    originalPrice: 2399,
    visionType: 'single_vision',
    description: 'Ultra-thin high-index Japanese optical lenses engineered with superior UV400 sun defense, crystal clarity, and hydrophobic smudge repellent.',
    shortDescription: 'Japanese high-index ultra-thin resin + UV400 & hydrophobic coating',
    features: [
      'Japanese high-index optical resin',
      'Ultra-thin lightweight profile for all powers',
      '100% UV400 high-energy sun protection',
      'Hydrophobic water, grease & dust repelling coating'
    ],
    tag: 'Japanese Optics'
  }
];

export const SUNGLASS_PROGRESSIVE_LENS_ADDONS: LensAddon[] = [
  {
    id: 'sg-prog-regular',
    name: 'Regular Progressive UV400',
    price: 2999,
    originalPrice: 5999,
    visionType: 'progressive',
    description: 'Seamless multifocal distance, intermediate, and near reading progressive lenses equipped with 100% UV400 protection without any dividing lines.',
    shortDescription: 'Seamless progressive (Distance & Reading) with UV400 + zero lines',
    features: [
      'Seamless multi-distance focus (Distance & Reading)',
      '100% UV400 broad spectrum sun shield',
      'Anti-reflective back surface glare reduction',
      'Zero visible bifocal line on sunglasses'
    ],
    tag: 'Regular Progressive'
  },
  {
    id: 'sg-prog-goa-freeform',
    name: 'Freeform Progressive (Prime Lenses Made in GOA)',
    price: 4799,
    originalPrice: 9599,
    visionType: 'progressive',
    description: 'High-precision digital back-surface freeform progressive lenses manufactured at the flagship Prime Optical facility in Goa for edge-to-edge panoramic clarity.',
    shortDescription: 'Digital freeform Prime Lenses made in Goa + ultra-wide panoramic corridor',
    features: [
      'Prime Lenses precision-crafted in Goa facility',
      'Digital point-by-point back-surface freeform optics',
      'Ultra-wide distortion-free panoramic corridor',
      '100% UV400 shield & hydrophobic scratch-proof coating'
    ],
    tag: 'Prime Lenses (Goa)'
  }
];

export const SUNGLASS_LENS_ADDONS: LensAddon[] = [
  {
    id: 'sg-standard',
    name: 'Standard Non-Powered Sun Lenses',
    price: 0,
    originalPrice: 0,
    description: 'Handcrafted 100% UV400 protective sun lenses with premium optical tint (No prescription power needed).',
    shortDescription: '100% UV400 Non-powered sun lenses included',
    features: ['Zero prescription power', '100% UV400 radiation protection', 'Glaze & glare blocking tint']
  },
  ...SUNGLASS_SINGLE_VISION_LENS_ADDONS,
  ...SUNGLASS_PROGRESSIVE_LENS_ADDONS
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
  image?: string;
  price: number; // Unit price including lens add-on
  basePrice?: number; // Base frame price
  lensAddonName?: string;
  lensAddonPrice?: number;
  selectedLensType?: string;
  lensAddon?: LensAddon;
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
  status: 'Pending Confirmation' | 'Confirmed - Client Called' | 'Completed' | 'Cancelled' | 'Completed - Exam Done in Store' | string;
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
