import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  Product,
  ProductSpecification,
  Category,
  Order,
  Coupon,
  StoreLocation,
  BlogPost,
  Banner,
  Customer,
  AdminStats,
  Review,
  OrderStatus,
  PrescriptionSubmission,
  OptometristAppointment
} from '../types.ts';
import { initialProducts, initialCategories } from '../data/seedData.ts';

export interface GitSyncOptions {
  gitToken?: string;
  gitRepo?: string;
}

export function parseGitHubRepo(repoStr: string): { owner: string; repo: string } | null {
  if (!repoStr) return null;
  const clean = repoStr
    .trim()
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/^\/+|\/+$/g, '');
  const parts = clean.split('/');
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { owner: parts[0].trim(), repo: parts[1].trim() };
  }
  return null;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordSalt: string;
  passwordHash: string;
  role: 'superadmin' | 'admin';
  name: string;
  email: string;
}

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
  stores: StoreLocation[];
  blogs: BlogPost[];
  banners: Banner[];
  customers: Customer[];
  reviews: Review[];
  admin: AdminUser;
}

function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, 'sha512').toString('hex');
  return { salt: generatedSalt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const calculatedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return calculatedHash === expectedHash;
}

// Initial luxury seed data matching Ray-Ban aesthetic
function getInitialSeedData(): DatabaseSchema {
  const adminCredentials = hashPassword('HoneyGogia1001');

  const products: Product[] = initialProducts.map(p => ({ ...p, variants: [] }));
  const categories: Category[] = [...initialCategories];

  const coupons: Coupon[] = [
    {
      id: 'coup-01',
      code: 'SPECS10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 1999,
      maxDiscount: 1500,
      isActive: true,
      expiryDate: '2026-12-31',
      usageCount: 84
    },
    {
      id: 'coup-02',
      code: 'LOOK20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 4999,
      maxDiscount: 2500,
      isActive: true,
      expiryDate: '2026-12-31',
      usageCount: 41
    },
    {
      id: 'coup-03',
      code: 'WELCOME500',
      discountType: 'flat',
      discountValue: 500,
      minOrderValue: 2499,
      isActive: true,
      expiryDate: '2026-12-31',
      usageCount: 112
    }
  ];

  const stores: StoreLocation[] = [
    {
      id: 'store-sl1',
      name: 'SPECSLOOK SL1',
      city: 'Gurugram',
      address: 'Dreamz Mall, Sector 4 / 7, Gurugram, Haryana - 122001',
      phone: '+91 83688 53448',
      email: 'sl1.dreamz@specslook.com',
      timings: 'Mon - Sun: 10:30 AM - 9:30 PM',
      features: ['Mini Optical Studio', 'Comprehensive Zeiss Eye Exam', 'Custom Prescription Lens Lab', 'Complimentary Ultrasonic Cleaning'],
      image: '/assets/stores/sl1_store.jpg'
    },
    {
      id: 'store-sl2',
      name: 'SPECSLOOK SL2',
      city: 'Gurugram',
      address: 'Sec 5 Circle, Railway Road, Gurugram, Haryana - 122006',
      phone: '+91 83688 53448',
      email: 'sl2.sec5@specslook.com',
      timings: 'Mon - Sun: 10:30 AM - 9:30 PM',
      features: ['Iconic Aviator & Wayfarer Vault', '3D Facial Scanning & Fitting', 'Zero-Power Blue Cut Testing Bar', 'Same-Day Lens Dispensing'],
      image: '/assets/stores/sl2_store.jpg'
    },
    {
      id: 'store-sl3',
      name: 'SPECSLOOK SL3',
      city: 'Gurugram',
      address: 'Sector 85, Multi-Brand Eyewear Boulevard, Gurugram, Haryana - 122004',
      phone: '+91 83688 53448',
      email: 'sl3.sec85@specslook.com',
      timings: 'Mon - Sun: 10:30 AM - 9:30 PM',
      features: ['Handcrafted Titanium & Acetate Gallery', 'Certified Senior Optometrists', 'Polarized Glare Simulator', 'VIP Doorstep Trial Service'],
      image: '/assets/stores/sl3_store.jpg'
    },
    {
      id: 'store-sl4',
      name: 'SPECSLOOK SL4',
      city: 'Gurugram',
      address: 'Sector 103, Dwarka Expressway Corridor, Gurugram, Haryana - 122006',
      phone: '+91 83688 53448',
      email: 'sl4.sec103@specslook.com',
      timings: 'Mon - Sun: 10:30 AM - 9:30 PM',
      features: ['Express Precision Optical Lab', 'Junior Eyewear & Flexible Frames', 'High-Index Ultra-Thin Lenses', 'Contact Lens Solutions Bar'],
      image: '/assets/stores/sl4_store.jpg'
    },
    {
      id: 'store-sl5',
      name: 'SPECSLOOK SL5',
      city: 'Gurugram',
      address: 'Sector 89, New Gurugram Commercial Hub, Gurugram, Haryana - 122505',
      phone: '+91 83688 53448',
      email: 'sl5.sec89@specslook.com',
      timings: 'Mon - Sun: 10:30 AM - 9:30 PM',
      features: ['Haute Eyewear & Solar Atelier', 'Computer Vision Eye Strain Clinic', 'Bespoke Laser Monogramming', 'Valet Parking Available'],
      image: '/assets/stores/sl5_store.jpg'
    }
  ];

  const blogs: BlogPost[] = [
    {
      id: 'blog-01',
      slug: 'the-legendary-aviator-style-history',
      title: 'The Legendary Aviator: From 1937 Cockpits to Modern Haute Couture',
      excerpt: 'How military pilot requirements birthed the world’s most iconic eyewear silhouette that has transcended generations.',
      content: `The story of the Aviator began above the clouds. In the 1930s, as military aviation reached higher altitudes, pilots reported debilitating headaches and optical blindness caused by intense sunlight glare above cloud decks.

In response, optical engineers developed a revolutionary tear-drop shape designed to mimic the human eye socket's natural field of vision, preventing harsh rays from leaking past the perimeter. Coupled with emerald-green anti-glare crystal glass, the Aviator was officially born.

Decades later, from General MacArthur to Hollywood cinematic royalty, the Aviator remains the quintessential symbol of courage, precision, and effortless elegance. At Specslook, we preserve this authentic legacy with hand-plated Monel frames and precision-calibrated mineral glass.`,
      author: 'Aarav Mehta',
      authorRole: 'Head of Optical Heritage',
      publishedAt: '2026-08-28',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      category: 'Heritage & Design',
      tags: ['Aviator', 'History', 'Style Guide', 'Ray-Ban Legacy']
    },
    {
      id: 'blog-02',
      slug: 'polarized-vs-non-polarized-eyewear-guide',
      title: 'Polarized vs. Standard Lenses: The Optical Science You Need to Know',
      excerpt: 'Discover why standard dark tints only reduce brightness while polarized lenses eliminate blinding horizontal glare completely.',
      content: `Many assume that a darker sunglass lens automatically offers superior protection. In reality, standard dark lenses merely dim all incoming light uniformly—including the reflective glare bouncing off roads, water, snow, and windshields.

Polarized lenses incorporate a microscopic chemical filter arranged vertically. Because glare is polarized horizontally when bouncing off flat surfaces, the vertical filter acts like a Venetian blind, blocking 99.9% of blinding reflections without diminishing sharpness or natural color tones.

Whether you're navigating highway asphalt on bright afternoons or relaxing near coastal waters, polarized lenses reduce squinting, eradicate optical fatigue, and heighten contrast clarity.`,
      author: 'Dr. Neha Sharma',
      authorRole: 'Lead Optometrist',
      publishedAt: '2026-09-02',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
      category: 'Eye Health',
      tags: ['Polarized', 'UV Protection', 'Driving Optics']
    },
    {
      id: 'blog-03',
      slug: 'how-to-choose-frames-for-your-face-shape',
      title: 'How to Choose the Perfect Eyewear Frame for Your Face Shape',
      excerpt: 'A comprehensive rulebook for pairing Aviators, Wayfarers, Clubmasters and Round frames to flatter your facial contours.',
      content: `The golden rule of eyewear styling is contrast and proportion. The silhouette of your frames should counterbalance the natural contours of your face:

1. Round Faces: Opt for angular frames with sharp geometry—such as Wayfarers, Square silhouettes, or Browline Clubmasters—which add definition and lengthen facial proportions.

2. Square Jawlines: Soften strong angles with curved, circular, or teardrop Aviator profiles. Round Metal frames balance high cheekbones effortlessly.

3. Oval Faces: Blessed with natural symmetry, oval faces look stunning in virtually any classic shape, especially Hexagonal flat lenses and classic Aviators.

4. Heart Shapes: Frames that are slightly wider than your forehead, such as subtle Cat-Eye or light wire Aviators, draw harmonious balance downward.`,
      author: 'Kavita Roy',
      authorRole: 'Fashion Director',
      publishedAt: '2026-09-08',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
      category: 'Style & Trends',
      tags: ['Face Shape', 'Wayfarer', 'Clubmaster', 'Fitting']
    }
  ];

  const banners: Banner[] = [
    {
      id: 'banner-01',
      title: 'THE ICONIC COLLECTION',
      subtitle: 'Legendary teardrop Aviators & handcrafted Wayfarers. Timeless Italian elegance reborn for the modern connoisseur.',
      badge: 'SPECSLOOK HERITAGE',
      ctaText: 'EXPLORE THE ICONS',
      ctaLink: '/shop?category=Sunglasses',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=85',
      alignment: 'left',
      isActive: true,
      priority: 1
    },
    {
      id: 'banner-02',
      title: 'CHROMANCE POLARIZED',
      subtitle: 'Eliminate glare. Elevate contrast. Experience hyper-vibrant color calibration engineered with aerospace Japanese Titanium.',
      badge: 'ADVANCED OPTICS',
      ctaText: 'DISCOVER POLARIZED',
      ctaLink: '/shop?category=Polarized',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1600&q=85',
      alignment: 'center',
      isActive: true,
      priority: 2
    },
    {
      id: 'banner-03',
      title: 'BLUE-CUT SCREEN SHIELD',
      subtitle: 'Featherlight Japanese acetate frames with 40% HEV blue light filtration for modern coders, creators and leaders.',
      badge: 'ALL-DAY COMFORT',
      ctaText: 'SHOP EYEGLASSES',
      ctaLink: '/shop?category=Blue%20Light%20Blockers',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1600&q=85',
      alignment: 'left',
      isActive: true,
      priority: 3
    }
  ];

  const customers: Customer[] = [
    {
      id: 'cust-01',
      name: 'Rohan Malhotra',
      email: 'rohan.malhotra@gmail.com',
      phone: '+91 98112 34567',
      city: 'New Delhi',
      ordersCount: 2,
      totalSpent: 20980,
      lastOrderDate: '2026-09-08',
      createdAt: '2026-07-15'
    },
    {
      id: 'cust-02',
      name: 'Pooja Singhania',
      email: 'pooja.s@outlook.com',
      phone: '+91 99201 88344',
      city: 'Mumbai',
      ordersCount: 1,
      totalSpent: 9490,
      lastOrderDate: '2026-09-10',
      createdAt: '2026-08-01'
    },
    {
      id: 'cust-03',
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@techcorp.in',
      phone: '+91 97405 66789',
      city: 'Bengaluru',
      ordersCount: 1,
      totalSpent: 14990,
      lastOrderDate: '2026-09-11',
      createdAt: '2026-08-20'
    }
  ];

  const orders: Order[] = [
    {
      id: 'ord-892104',
      orderNumber: 'SL-892104',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      customer: {
        fullName: 'Rohan Malhotra',
        phone: '+91 98112 34567',
        email: 'rohan.malhotra@gmail.com',
        addressLine1: 'Villa 14, Golf Links Enclave',
        addressLine2: 'Near Lodhi Road',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110003',
        country: 'India'
      },
      items: [
        {
          productId: 'prod-001',
          productName: 'Specslook Aviator Classic Gold',
          sku: 'SL-AV-3025-GLD-58',
          variantName: 'Gold / Crystal Green G-15',
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
          price: 8990,
          quantity: 1,
          total: 8990
        },
        {
          productId: 'prod-006',
          productName: 'Specslook Blue-Cut Optics Elite',
          sku: 'SL-EG-7040-CLR',
          variantName: 'Crystal Clear / Anti-Blue',
          image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80',
          price: 5990,
          quantity: 1,
          total: 5990
        }
      ],
      subtotal: 14980,
      discount: 1498,
      couponCode: 'SPECS10',
      shippingFee: 0,
      total: 13482,
      paymentMethod: 'cashfree',
      paymentStatus: 'Paid',
      paymentTransactionId: 'cf_tx_9948210375',
      orderStatus: 'Delivered',
      courierName: 'BlueDart Express',
      trackingNumber: 'BD74829103IN',
      trackingUrl: 'https://www.bluedart.com',
      estimatedDeliveryDate: '2026-09-10',
      timeline: [
        { status: 'Pending', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), note: 'Order created via Cashfree Payment Gateway' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 4 * 86400000 + 3600000).toISOString(), note: 'Payment verified and inventory allocated' },
        { status: 'Processing', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), note: 'Lens calibrated and packed in signature velvet hard case' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Dispatched via BlueDart Express (Air Courier)' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), note: 'Handed over to customer with signature confirmation' }
      ],
      prescription: {
        mode: 'manual',
        submittedAt: new Date(Date.now() - 4 * 86400000 + 1200000).toISOString(),
        manualPower: {
          odSph: '-2.50',
          odCyl: '-0.50',
          odAxis: '90°',
          odAdd: 'None',
          osSph: '-2.25',
          osCyl: '-0.75',
          osAxis: '85°',
          osAdd: 'None',
          pd: '63 mm',
          notes: 'High-index blue filter lens configuration. Daily digital screen usage.'
        }
      }
    },
    {
      id: 'ord-892305',
      orderNumber: 'SL-892305',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      customer: {
        fullName: 'Pooja Singhania',
        phone: '+91 99201 88344',
        email: 'pooja.s@outlook.com',
        addressLine1: 'B-702, Sea Green Towers, Carter Road',
        addressLine2: 'Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400050',
        country: 'India'
      },
      items: [
        {
          productId: 'prod-002',
          productName: 'Specslook Original Wayfarer Classic',
          sku: 'SL-WF-2140-901',
          variantName: 'Polished Black / G-15 Green',
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80',
          price: 9490,
          quantity: 1,
          total: 9490
        }
      ],
      subtotal: 9490,
      discount: 500,
      couponCode: 'WELCOME500',
      shippingFee: 0,
      total: 8990,
      paymentMethod: 'cashfree',
      paymentStatus: 'Paid',
      paymentTransactionId: 'cf_tx_8830192384',
      orderStatus: 'Shipped',
      courierName: 'Delhivery Surface',
      trackingNumber: 'DEL773829104',
      trackingUrl: 'https://www.delhivery.com',
      estimatedDeliveryDate: '2026-09-13',
      timeline: [
        { status: 'Pending', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), note: 'Order placed by customer' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 2 * 86400000 + 1800000).toISOString(), note: 'Payment verified via Cashfree' },
        { status: 'Processing', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), note: 'Quality check passed and dispatched to hub' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), note: 'In transit to Mumbai Distribution Hub' }
      ],
      prescription: {
        mode: 'upload',
        submittedAt: new Date(Date.now() - 2 * 86400000 + 900000).toISOString(),
        fileName: 'Pooja_Singhania_Prescription_Slip.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        fileNotes: 'Prescription card issued by Dr. Mehta Eye Clinic Bandra Mumbai on 10-Sep-2026.'
      }
    },
    {
      id: 'ord-892711',
      orderNumber: 'SL-892711',
      createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
      customer: {
        fullName: 'Vikramaditya Rao',
        phone: '+91 97405 66789',
        email: 'vikram.rao@techcorp.in',
        addressLine1: 'Penthouse 4B, Palm Meadows',
        addressLine2: 'Airport Whitefield Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560066',
        country: 'India'
      },
      items: [
        {
          productId: 'prod-007',
          productName: 'Specslook Titanium Chromance Polarized',
          sku: 'SL-TI-8090-PWT',
          variantName: 'Titanium Pewter / Silver Chromance',
          image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=400&q=80',
          price: 14990,
          quantity: 1,
          total: 14990
        }
      ],
      subtotal: 14990,
      discount: 2500,
      couponCode: 'LOOK20',
      shippingFee: 0,
      total: 12490,
      paymentMethod: 'cashfree',
      paymentStatus: 'Paid',
      paymentTransactionId: 'cf_tx_7720918342',
      orderStatus: 'Processing',
      courierName: 'BlueDart Air',
      trackingNumber: 'BD99281033',
      estimatedDeliveryDate: '2026-09-14',
      timeline: [
        { status: 'Pending', timestamp: new Date(Date.now() - 18 * 3600000).toISOString(), note: 'Order created' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 17 * 3600000).toISOString(), note: 'Payment verified' },
        { status: 'Processing', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), note: 'Under precision optical calibration in lab' }
      ],
      prescription: {
        mode: 'optometrist_exam',
        submittedAt: new Date(Date.now() - 18 * 3600000 + 600000).toISOString(),
        optometristAppointment: {
          patientName: 'Vikramaditya Rao',
          patientAge: 34,
          storeId: 'store-sl1',
          storeName: 'SPECSLOOK SL1 - DREAMZ MALL, GURUGRAM',
          storeAddress: 'Shop No. 1, Dreamz Mall UG Floor, Sector 4-7 Circle, Gurugram, Haryana 122001',
          appointmentDate: '2026-09-16',
          timeSlot: '04:30 PM - 05:30 PM',
          contactNumber: '+91 97405 66789',
          status: 'Confirmed - Client Called',
          calledAt: new Date(Date.now() - 12 * 3600000).toISOString(),
          callNotes: 'Spoke with Mr. Rao. Confirmed 4:30 PM slot. Senior optometrist assigned for computerized keratometry and progressive lens fitting.',
          specialInstructions: 'Requires titanium frame temple adjustment for wide fit.'
        }
      }
    },
    {
      id: 'ord-893012',
      orderNumber: 'SL-893012',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      customer: {
        fullName: 'Amitabh Sen',
        phone: '+91 98300 12345',
        email: 'amitabh.sen@kolkata.org',
        addressLine1: 'Flat 3A, Alipore Park Road',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700027',
        country: 'India'
      },
      items: [
        {
          productId: 'prod-003',
          productName: 'Specslook Clubmaster Classic Browline',
          sku: 'SL-CM-3016-W0365',
          variantName: 'Ebony Gold / Crystal Green',
          image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=400&q=80',
          price: 9990,
          quantity: 1,
          total: 9990
        }
      ],
      subtotal: 9990,
      discount: 999,
      couponCode: 'SPECS10',
      shippingFee: 0,
      total: 8991,
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      estimatedDeliveryDate: '2026-09-16',
      timeline: [
        { status: 'Pending', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), note: 'Order placed with Cash on Delivery' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), note: 'Customer contact verified via SMS' }
      ],
      prescription: {
        mode: 'manual',
        submittedAt: new Date(Date.now() - 4 * 3600000 + 300000).toISOString(),
        manualPower: {
          odSph: '+1.75',
          odCyl: '0.00',
          odAxis: '0°',
          odAdd: '+1.50',
          osSph: '+2.00',
          osCyl: '0.00',
          osAxis: '0°',
          osAdd: '+1.50',
          pd: '64 mm',
          notes: 'Reading and close-work bifocals with anti-fatigue tint.'
        }
      }
    }
  ];

  const reviews: Review[] = [
    {
      id: 'rev-01',
      productId: 'prod-001',
      customerName: 'Siddharth Rao',
      rating: 5,
      title: 'Unbelievable Ray-Ban feel and optical clarity',
      comment: 'The gold plating is flawless and the G-15 crystal lenses make the harsh sun soothing while maintaining razor-sharp contrast. Feels identical to my heirloom pair from Milan.',
      verifiedPurchase: true,
      createdAt: '2026-08-20'
    },
    {
      id: 'rev-02',
      productId: 'prod-001',
      customerName: 'Ananya Deshmukh',
      rating: 5,
      title: 'Packaging is pure luxury',
      comment: 'Arrived within 48 hours via BlueDart in a heavy magnetic gift box, velvet case, and microfiber cloth. Fits perfectly without sliding.',
      verifiedPurchase: true,
      createdAt: '2026-08-25'
    },
    {
      id: 'rev-03',
      productId: 'prod-002',
      customerName: 'Kabir Varma',
      rating: 5,
      title: 'The Italian acetate has serious heft',
      comment: 'You can immediately tell this is real Mazzucchelli acetate, not cheap injection plastic. The hinges are 7-barrel solid metal. 10/10.',
      verifiedPurchase: true,
      createdAt: '2026-09-01'
    }
  ];

  const admin: AdminUser = {
    id: 'admin-01',
    username: 'honeygogia',
    passwordSalt: adminCredentials.salt,
    passwordHash: adminCredentials.hash,
    role: 'superadmin',
    name: 'Honey Gogia',
    email: 'honeygogia@specslook.com'
  };

  return {
    products,
    categories,
    orders,
    coupons,
    stores,
    blogs,
    banners,
    customers,
    reviews,
    admin
  };
}

class DatabaseService {
  private data: DatabaseSchema;
  private lastMtime: number = 0;

  constructor() {
    this.data = this.loadData();
  }

  /**
   * Automatically re-parses data/specslook_db.json if modified on disk
   * (e.g. after a git pull, admin edit, or external tool synchronization).
   */
  public reloadIfModified(): boolean {
    try {
      const rootDbFile = path.join(process.cwd(), 'data', 'specslook_db.json');
      const publicDbFile = path.join(process.cwd(), 'public', 'data', 'specslook_db.json');
      const targetFile = fs.existsSync(rootDbFile) ? rootDbFile : (fs.existsSync(publicDbFile) ? publicDbFile : null);
      if (targetFile) {
        const stats = fs.statSync(targetFile);
        if (stats.mtimeMs > this.lastMtime) {
          console.log(`[dbService] Detected modification in ${targetFile} (mtime: ${stats.mtimeMs} > ${this.lastMtime}). Reloading fresh catalog...`);
          this.data = this.loadData();
          return true;
        }
      }
    } catch (err) {
      console.warn('[dbService] reloadIfModified check note:', err);
    }
    return false;
  }

  public getAllData(): DatabaseSchema {
    this.reloadIfModified();
    return this.data;
  }

  private loadData(): DatabaseSchema {
    try {
      const rootDbFile = path.join(process.cwd(), 'data', 'specslook_db.json');
      const publicDbFile = path.join(process.cwd(), 'public', 'data', 'specslook_db.json');
      const targetFile = fs.existsSync(rootDbFile) ? rootDbFile : (fs.existsSync(publicDbFile) ? publicDbFile : null);

      if (targetFile) {
        const stats = fs.statSync(targetFile);
        this.lastMtime = stats.mtimeMs;

        const raw = fs.readFileSync(targetFile, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure admin credentials always match honeygogia & HoneyGogia1001
        const correctAdmin = hashPassword('HoneyGogia1001');
        parsed.admin = {
          id: 'admin-01',
          username: 'honeygogia',
          passwordSalt: correctAdmin.salt,
          passwordHash: correctAdmin.hash,
          role: 'superadmin',
          name: 'Honey Gogia',
          email: 'honeygogia@specslook.com'
        };

        // Ensure products have valid variants array
        if (Array.isArray(parsed.products)) {
          parsed.products.forEach((p: Product) => {
            if (!Array.isArray(p.variants)) {
              p.variants = [];
            }
          });
        }

        const seedData = getInitialSeedData();
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
          seedData.categories.forEach(sc => {
            const exists = parsed.categories.some((c: Category) => c.slug === sc.slug || c.id === sc.id || c.name?.toLowerCase() === sc.name?.toLowerCase());
            if (!exists) {
              parsed.categories.push(sc);
            }
          });
        } else {
          parsed.categories = [...seedData.categories];
        }

        if (!Array.isArray(parsed.products) || parsed.products.length === 0) {
          parsed.products = [...seedData.products];
        }

        if (Array.isArray(parsed.coupons)) {
          seedData.coupons.forEach(sc => {
            const exists = parsed.coupons.some((c: Coupon) => c && c.code && c.code.toUpperCase() === sc.code.toUpperCase());
            if (!exists) {
              parsed.coupons.push(sc);
            }
          });
        } else {
          parsed.coupons = [...seedData.coupons];
        }

        return parsed;
      }
    } catch (err) {
      console.error('Error reading static specslook_db.json on startup:', err);
    }

    return getInitialSeedData();
  }

  // Persists updates to both data/specslook_db.json and public/data/specslook_db.json
  // so any client device worldwide can immediately access the latest catalog.
  private saveData(dataToSave?: DatabaseSchema) {
    const payload = dataToSave || this.data;
    try {
      const rootDbFile = path.join(process.cwd(), 'data', 'specslook_db.json');
      const publicDbDir = path.join(process.cwd(), 'public', 'data');
      const publicDbFile = path.join(publicDbDir, 'specslook_db.json');

      const jsonStr = JSON.stringify(payload, null, 2);
      fs.writeFileSync(rootDbFile, jsonStr, 'utf-8');

      if (!fs.existsSync(publicDbDir)) {
        fs.mkdirSync(publicDbDir, { recursive: true });
      }
      fs.writeFileSync(publicDbFile, jsonStr, 'utf-8');

      const stats = fs.statSync(rootDbFile);
      this.lastMtime = stats.mtimeMs;
      console.log(`[dbService] Successfully saved ${payload.products?.length || 0} products to disk at ${rootDbFile} and ${publicDbFile}`);
    } catch (err) {
      console.warn('[dbService] Could not write specslook_db.json to disk (e.g. read-only serverless filesystem):', err);
    }
  }

  /**
   * Syncs inventory changes directly to the remote Git repository using GitHub REST API.
   * Fetches the current SHA, updates products in memory, base64 encodes the payload,
   * and executes a PUT commit to data/specslook_db.json.
   */
  public async syncToGitHubContents(
    action: 'create' | 'update' | 'delete',
    productIdentifier: string,
    gitOptions?: GitSyncOptions
  ): Promise<{ success: boolean; sha?: string; message?: string }> {
    const rawToken = gitOptions?.gitToken?.trim();
    const rawRepo = gitOptions?.gitRepo?.trim();

    if (!rawToken || !rawRepo) {
      console.log(`[GitHub REST API] In-memory update applied for "${productIdentifier}" (${action}). Notice: x-github-token or x-github-repo header omitted.`);
      return { success: true, message: 'Updated in server memory' };
    }

    const parsedRepo = parseGitHubRepo(rawRepo);
    if (!parsedRepo) {
      throw new Error(`Invalid GitHub repository path "${rawRepo}". Expected format: "owner/repo" (e.g. "username/repository")`);
    }

    const { owner, repo } = parsedRepo;
    const cleanToken = rawToken.replace(/^(bearer|token)\s+/i, '').trim();
    const filePath = 'data/specslook_db.json';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    console.log(`[GitHub REST API] Fetching current sha from: ${apiUrl}`);

    let currentSha: string | undefined;
    let remotePayload: DatabaseSchema = { ...this.data };

    try {
      const getRes = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Specslook-Headless-Store/1.0'
        }
      });

      if (getRes.status === 200) {
        const fileData: any = await getRes.json();
        currentSha = fileData.sha;
        if (fileData.content) {
          try {
            // Strip any newlines or spaces GitHub inserts in base64 string
            const cleanedB64 = fileData.content.replace(/[\r\n\s]/g, '');
            const decodedJson = Buffer.from(cleanedB64, 'base64').toString('utf-8');
            remotePayload = JSON.parse(decodedJson);
          } catch (decodeErr) {
            console.warn('[GitHub REST API] Could not decode existing remote content, using current in-memory database:', decodeErr);
            remotePayload = { ...this.data };
          }
        }
      } else if (getRes.status === 404) {
        console.log(`[GitHub REST API] ${filePath} not found in ${owner}/${repo}. Initializing new file.`);
        remotePayload = { ...this.data };
      } else {
        const errJson: any = await getRes.json().catch(() => ({}));
        const errMsg = errJson.message || `HTTP ${getRes.status}`;
        console.error('[GitHub REST API GET Error]:', getRes.status, errJson);
        throw new Error(`GitHub API error (${getRes.status}): ${errMsg}. Verify that your PAT token has "contents:write" permission on ${owner}/${repo}.`);
      }
    } catch (networkErr: any) {
      if (networkErr.message?.includes('GitHub API error') || networkErr.message?.includes('Invalid GitHub repository')) {
        throw networkErr;
      }
      console.error('[GitHub REST API Network Error]:', networkErr);
      throw new Error(`Failed to reach GitHub API: ${networkErr.message}`);
    }

    // Synchronize current products in memory to remotePayload
    remotePayload.products = [...this.data.products];
    if (!remotePayload.categories || remotePayload.categories.length === 0) {
      remotePayload.categories = [...this.data.categories];
    }

    // Base64 encode the new payload safely using Buffer
    const newJsonString = JSON.stringify(remotePayload, null, 2);
    const newBase64Payload = Buffer.from(newJsonString, 'utf-8').toString('base64');

    const actionText = action === 'create' ? 'Add product' : (action === 'update' ? 'Update product' : 'Delete product');
    const commitMessage = `chore(inventory): ${actionText} "${productIdentifier}" via Specslook Admin`;

    const putBody: any = {
      message: commitMessage,
      content: newBase64Payload
    };
    if (currentSha) {
      putBody.sha = currentSha;
    }

    console.log(`[GitHub REST API] Committing payload to ${apiUrl}...`);

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Specslook-Headless-Store/1.0'
      },
      body: JSON.stringify(putBody)
    });

    if (!putRes.ok) {
      const putErrJson: any = await putRes.json().catch(() => ({}));
      console.error('[GitHub REST API PUT Error]:', putRes.status, putErrJson);
      throw new Error(`GitHub commit failed (${putRes.status}): ${putErrJson.message || 'Check repository access and PAT token permissions'}`);
    }

    const putResult: any = await putRes.json().catch(() => ({}));
    const newSha = putResult?.content?.sha || putResult?.commit?.sha || currentSha;
    console.log(`[GitHub REST API Success] Committed to ${owner}/${repo} at data/specslook_db.json (New SHA: ${newSha})`);

    return {
      success: true,
      sha: newSha,
      message: `Committed update to GitHub repository ${owner}/${repo}`
    };
  }

  /**
   * Quick connection test for admin UI
   */
  public async testGitHubConnection(gitOptions: GitSyncOptions): Promise<{
    connected: boolean;
    owner: string;
    repo: string;
    fileExists: boolean;
    sha?: string;
    productCount?: number;
    message: string;
  }> {
    const rawToken = gitOptions?.gitToken?.trim();
    const rawRepo = gitOptions?.gitRepo?.trim();

    if (!rawToken || !rawRepo) {
      throw new Error('Please provide both GitHub Personal Access Token (PAT) and Repository Path (owner/repo).');
    }

    const parsed = parseGitHubRepo(rawRepo);
    if (!parsed) {
      throw new Error(`Invalid repository format "${rawRepo}". Use "owner/repo" (e.g. "username/repository").`);
    }

    const { owner, repo } = parsed;
    const cleanToken = rawToken.replace(/^(bearer|token)\s+/i, '').trim();
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/data/specslook_db.json`;

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Specslook-Headless-Store/1.0'
      }
    });

    if (res.status === 200) {
      const data: any = await res.json();
      let count = 0;
      if (data.content) {
        try {
          const cleaned = data.content.replace(/[\r\n\s]/g, '');
          const decoded = Buffer.from(cleaned, 'base64').toString('utf-8');
          const parsedDb = JSON.parse(decoded);
          if (Array.isArray(parsedDb.products)) count = parsedDb.products.length;
        } catch {}
      }
      return {
        connected: true,
        owner,
        repo,
        fileExists: true,
        sha: data.sha,
        productCount: count,
        message: `Successfully connected to repository ${owner}/${repo}! "data/specslook_db.json" found (${count} products, sha: ${data.sha?.slice(0, 7)}).`
      };
    } else if (res.status === 404) {
      const repoCheck = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Specslook-Headless-Store/1.0'
        }
      });
      if (repoCheck.status === 200) {
        return {
          connected: true,
          owner,
          repo,
          fileExists: false,
          message: `Connected to repository ${owner}/${repo}! "data/specslook_db.json" will be automatically created and committed upon your first inventory action.`
        };
      } else {
        const repoErr: any = await repoCheck.json().catch(() => ({}));
        throw new Error(`Repository "${owner}/${repo}" not found or token lacks access (${repoCheck.status}: ${repoErr.message || 'Not Found'})`);
      }
    } else {
      const err: any = await res.json().catch(() => ({}));
      throw new Error(`GitHub API error (${res.status}): ${err.message || 'Authentication failed'}`);
    }
  }

  // Admin Authentication
  public verifyAdmin(username: string, passwordAttempt: string): { success: boolean; user?: Omit<AdminUser, 'passwordHash' | 'passwordSalt'> } {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (passwordAttempt || '').trim();

    if (cleanUser === 'honeygogia' && cleanPass === 'HoneyGogia1001') {
      return {
        success: true,
        user: {
          id: 'admin-01',
          username: 'honeygogia',
          role: 'superadmin',
          name: 'Honey Gogia',
          email: 'honeygogia@specslook.com'
        }
      };
    }

    if (cleanUser !== this.data.admin?.username?.toLowerCase()) {
      return { success: false };
    }
    const isValid = this.data.admin?.passwordSalt && this.data.admin?.passwordHash &&
      verifyPassword(cleanPass, this.data.admin.passwordSalt, this.data.admin.passwordHash);
    if (!isValid) {
      return { success: false };
    }
    const { passwordHash, passwordSalt, ...safeUser } = this.data.admin;
    return { success: true, user: safeUser };
  }

  public getAdminProfile() {
    const { passwordHash, passwordSalt, ...safeUser } = this.data.admin;
    return safeUser;
  }

  // Products
  public getProducts(filters?: {
    category?: string;
    shape?: string;
    gender?: string;
    polarized?: boolean;
    search?: string;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Product[] {
    this.reloadIfModified();
    let result = [...this.data.products];

    if (!filters) return result;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'All') {
      const cat = filters.category.toLowerCase().trim();
      result = result.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const pSub = (p.subcategory || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        if (pCat === cat || pSub === cat) return true;
        // Attachments / 6-in-1 / clip-on matching
        if ((cat.includes('attachment') || cat.includes('6in1') || cat.includes('6-in-1') || cat.includes('clip-on')) &&
            (pCat.includes('attachment') || pSub.includes('clip-on') || pName.includes('clip-on') || pName.includes('6-in-1'))) {
          return true;
        }
        // Specific category slugs
        if (cat === 'sunglasses' && pCat === 'sunglasses') return true;
        if (cat === 'eyeglasses' && pCat === 'eyeglasses') return true;
        if (cat === 'polarized' && (pCat === 'polarized' || p.specifications?.isPolarized)) return true;
        if (cat.includes('blue-light') && (pCat.includes('blue') || pSub.includes('blue'))) return true;
        if (cat === 'eyeglasses-men' && pCat === 'eyeglasses' && (p.specifications?.gender === 'Men' || p.specifications?.gender === 'Unisex')) return true;
        if (cat === 'eyeglasses-women' && pCat === 'eyeglasses' && (p.specifications?.gender === 'Women' || p.specifications?.gender === 'Unisex')) return true;
        if (cat === 'eyeglasses-kids' && pCat === 'eyeglasses' && p.specifications?.gender === 'Kids') return true;
        if (cat === 'sunglasses-men' && pCat === 'sunglasses' && (p.specifications?.gender === 'Men' || p.specifications?.gender === 'Unisex')) return true;
        if (cat === 'sunglasses-women' && pCat === 'sunglasses' && (p.specifications?.gender === 'Women' || p.specifications?.gender === 'Unisex')) return true;
        if (cat === 'sunglasses-kids' && pCat === 'sunglasses' && p.specifications?.gender === 'Kids') return true;
        return false;
      });
    }

    if (filters.shape && filters.shape !== 'All') {
      result = result.filter(p => p.specifications.frameShape.toLowerCase() === filters.shape!.toLowerCase());
    }

    if (filters.gender && filters.gender !== 'All') {
      result = result.filter(p => p.specifications.gender === filters.gender || p.specifications.gender === 'Unisex');
    }

    if (typeof filters.polarized === 'boolean') {
      result = result.filter(p => p.specifications.isPolarized === filters.polarized);
    }

    if (typeof filters.minPrice === 'number') {
      result = result.filter(p => p.salePrice >= filters.minPrice!);
    }

    if (typeof filters.maxPrice === 'number') {
      result = result.filter(p => p.salePrice <= filters.maxPrice!);
    }

    if (filters.featured) {
      result = result.filter(p => p.featured);
    }

    if (filters.bestSeller) {
      result = result.filter(p => p.bestSeller);
    }

    if (filters.newArrival) {
      result = result.filter(p => p.newArrival);
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price-low':
          result.sort((a, b) => a.salePrice - b.salePrice);
          break;
        case 'price-high':
          result.sort((a, b) => b.salePrice - a.salePrice);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          // featured default
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }
    }

    return result;
  }

  public getProductByIdOrSlug(idOrSlug: string): Product | undefined {
    if (!idOrSlug) return undefined;
    this.reloadIfModified();
    const clean = decodeURIComponent(idOrSlug).trim().toLowerCase();
    return this.data.products.find(p =>
      (p.id && p.id.toLowerCase() === clean) ||
      (p.slug && p.slug.toLowerCase() === clean) ||
      (p.sku && p.sku.toLowerCase() === clean)
    );
  }

  public async createProduct(
    productData: Omit<Product, 'id' | 'createdAt'>,
    gitOptions?: GitSyncOptions
  ): Promise<Product> {
    const id = `prod-${Date.now().toString(36)}`;
    const newProduct: Product = {
      ...productData,
      id,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      variants: [],
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.saveData();

    // Synchronize to GitHub repository data/specslook_db.json via GitHub Contents REST API
    await this.syncToGitHubContents('create', newProduct.name || newProduct.id, gitOptions);

    return newProduct;
  }

  public async updateProduct(
    id: string,
    updates: Partial<Product>,
    gitOptions?: GitSyncOptions
  ): Promise<Product | null> {
    if (!id) return null;
    const cleanId = decodeURIComponent(id).trim().toLowerCase();
    const index = this.data.products.findIndex(p =>
      (p.id && p.id.toLowerCase() === cleanId) ||
      (p.slug && p.slug.toLowerCase() === cleanId) ||
      (p.sku && p.sku.toLowerCase() === cleanId)
    );
    if (index === -1) return null;

    // Preserve and merge specifications safely
    const updatedSpecifications = {
      ...(this.data.products[index].specifications || {}),
      ...(updates.specifications || {})
    };

    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      specifications: updatedSpecifications as ProductSpecification,
      variants: []
    };
    this.saveData();

    // Synchronize to GitHub repository data/specslook_db.json via GitHub Contents REST API
    await this.syncToGitHubContents('update', this.data.products[index].name || cleanId, gitOptions);

    return this.data.products[index];
  }

  public async deleteProduct(id: string, gitOptions?: GitSyncOptions): Promise<boolean> {
    if (!id) return false;
    const cleanId = decodeURIComponent(id).trim().toLowerCase();
    const targetProduct = this.data.products.find(p =>
      p.id.toLowerCase() === cleanId || p.slug.toLowerCase() === cleanId
    );
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p =>
      p.id.toLowerCase() !== cleanId && p.slug.toLowerCase() !== cleanId
    );
    const deleted = this.data.products.length < initialLen;
    if (deleted) {
      this.saveData();
      await this.syncToGitHubContents('delete', targetProduct?.name || cleanId, gitOptions);
    }
    return deleted;
  }

  // Categories
  public getCategories(): Category[] {
    return this.data.categories.map(c => {
      const cSlug = (c.slug || '').toLowerCase();
      const cName = (c.name || '').toLowerCase();
      const count = this.data.products.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const pSub = (p.subcategory || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        if (pCat === cName || pCat === cSlug || pSub === cName || pSub === cSlug) return true;
        if ((cSlug === 'attachments' || cName.includes('attachment')) &&
            (pCat.includes('attachment') || pSub.includes('clip-on') || pName.includes('clip-on') || pName.includes('6-in-1'))) return true;
        if (cSlug === 'polarized' && (pCat === 'polarized' || p.specifications?.isPolarized)) return true;
        if (cSlug.includes('blue-light') && (pCat.includes('blue') || pSub.includes('blue'))) return true;
        if (cSlug === 'eyeglasses-men' && pCat === 'eyeglasses' && (p.specifications?.gender === 'Men' || p.specifications?.gender === 'Unisex')) return true;
        if (cSlug === 'eyeglasses-women' && pCat === 'eyeglasses' && (p.specifications?.gender === 'Women' || p.specifications?.gender === 'Unisex')) return true;
        if (cSlug === 'eyeglasses-kids' && pCat === 'eyeglasses' && p.specifications?.gender === 'Kids') return true;
        if (cSlug === 'sunglasses-men' && pCat === 'sunglasses' && (p.specifications?.gender === 'Men' || p.specifications?.gender === 'Unisex')) return true;
        if (cSlug === 'sunglasses-women' && pCat === 'sunglasses' && (p.specifications?.gender === 'Women' || p.specifications?.gender === 'Unisex')) return true;
        if (cSlug === 'sunglasses-kids' && pCat === 'sunglasses' && p.specifications?.gender === 'Kids') return true;
        return false;
      }).length;
      return { ...c, itemCount: count > 0 ? count : (c.itemCount || 0) };
    });
  }

  public createCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now().toString(36)}`
    };
    this.data.categories.push(newCat);
    this.saveData();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.saveData();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const len = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length < len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Orders
  public getOrders(filters?: { status?: string; search?: string }): Order[] {
    let result = [...this.data.orders];
    if (!filters) return result;

    if (filters.status && filters.status !== 'All') {
      result = result.filter(o => o.orderStatus === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderByIdOrNumber(idOrNum: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrNum || o.orderNumber.toLowerCase() === idOrNum.toLowerCase());
  }

  public getOrdersByCustomerEmail(email: string): Order[] {
    return this.data.orders.filter(o => o.customer.email.toLowerCase() === email.toLowerCase());
  }

  public createOrder(orderInput: {
    customer: Order['customer'];
    items: Order['items'];
    couponCode?: string;
    paymentMethod: 'cashfree' | 'cod';
    paymentStatus?: 'Paid' | 'Pending';
    paymentTransactionId?: string;
  }): Order {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `SL-${randomSuffix}`;
    const id = `ord-${Date.now().toString(36)}`;

    // Calculate subtotal
    const subtotal = orderInput.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Apply coupon if valid
    let discount = 0;
    if (orderInput.couponCode) {
      const coupon = this.getCouponByCode(orderInput.couponCode);
      if (coupon && coupon.isActive && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        coupon.usageCount += 1;
      }
    }

    const shippingFee = subtotal >= 999 ? 0 : 199;
    const total = Math.max(0, subtotal - discount + shippingFee);

    if (!orderInput.customer) {
      throw new Error('Customer information is required');
    }

    if (!Array.isArray(orderInput.items) || orderInput.items.length === 0) {
      throw new Error('Order items are required');
    }

    // Decrement stock safely
    orderInput.items.forEach(item => {
      const product = this.getProductByIdOrSlug(item.productId);
      if (product) {
        product.stock = Math.max(0, (product.stock || 0) - (item.quantity || 1));
        if (item.sku && Array.isArray(product.variants)) {
          const variant = product.variants.find(v => v && v.sku === item.sku);
          if (variant) {
            variant.stock = Math.max(0, (variant.stock || 0) - (item.quantity || 1));
          }
        }
      }
    });

    const isPaid = orderInput.paymentStatus === 'Paid';

    const order: Order = {
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: orderInput.customer,
      items: orderInput.items,
      subtotal,
      discount,
      couponCode: orderInput.couponCode,
      shippingFee,
      total,
      paymentMethod: orderInput.paymentMethod,
      paymentStatus: isPaid ? 'Paid' : 'Pending',
      paymentTransactionId: orderInput.paymentTransactionId || (isPaid ? `cf_tx_${Date.now()}` : undefined),
      orderStatus: isPaid ? 'Confirmed' : 'Pending',
      estimatedDeliveryDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Order placed via ${orderInput.paymentMethod === 'cashfree' ? 'Cashfree Gateway' : 'Cash on Delivery'}`
        }
      ]
    };

    if (isPaid) {
      order.timeline.push({
        status: 'Confirmed',
        timestamp: new Date().toISOString(),
        note: 'Payment captured successfully and order verified.'
      });
    }

    if (!Array.isArray(this.data.orders)) {
      this.data.orders = [];
    }
    this.data.orders.unshift(order);

    // Update customer registry safely
    if (!Array.isArray(this.data.customers)) {
      this.data.customers = [];
    }
    const customerEmail = (order.customer.email || '').trim();
    const existingCust = customerEmail
      ? this.data.customers.find(c => c && c.email && c.email.toLowerCase() === customerEmail.toLowerCase())
      : undefined;

    if (existingCust) {
      existingCust.ordersCount = (existingCust.ordersCount || 0) + 1;
      existingCust.totalSpent = (existingCust.totalSpent || 0) + total;
      existingCust.lastOrderDate = new Date().toISOString().split('T')[0];
    } else {
      this.data.customers.push({
        id: `cust-${Date.now().toString(36)}`,
        name: order.customer.fullName || 'Customer',
        email: order.customer.email || '',
        phone: order.customer.phone || '',
        city: order.customer.city || '',
        ordersCount: 1,
        totalSpent: total,
        lastOrderDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      });
    }

    try {
      this.saveData();
    } catch (saveErr) {
      console.warn('Non-fatal error persisting order to disk:', saveErr);
    }
    return order;
  }

  public updateOrderStatus(id: string, newStatus: OrderStatus, courierName?: string, trackingNumber?: string, note?: string): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.orderStatus = newStatus;
    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    if (newStatus === 'Delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'Paid';
    }

    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${newStatus}${trackingNumber ? ` via ${courierName} (AWB: ${trackingNumber})` : ''}`
    });

    this.saveData();
    return order;
  }

  public updateOrderPrescription(id: string, prescription: PrescriptionSubmission): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.prescription = prescription;

    let note = 'Prescription details submitted';
    if (prescription.mode === 'optometrist_exam' && prescription.optometristAppointment) {
      note = `Optometrist eye exam scheduled for patient ${prescription.optometristAppointment.patientName} (${prescription.optometristAppointment.patientAge} yrs) at ${prescription.optometristAppointment.storeName} on ${prescription.optometristAppointment.appointmentDate} (${prescription.optometristAppointment.timeSlot})`;
    } else if (prescription.mode === 'manual') {
      note = `Manual eye power entered (Right SPH: ${prescription.manualPower?.odSph || '0.00'}, Left SPH: ${prescription.manualPower?.osSph || '0.00'})`;
    } else if (prescription.mode === 'upload') {
      note = `Prescription document uploaded (${prescription.fileName || 'file'})`;
    }

    order.timeline.push({
      status: order.orderStatus,
      timestamp: new Date().toISOString(),
      note
    });

    this.saveData();
    return order;
  }

  public updateAppointmentStatus(
    id: string,
    status: OptometristAppointment['status'],
    callNotes?: string
  ): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order || !order.prescription?.optometristAppointment) return null;

    order.prescription.optometristAppointment.status = status;
    order.prescription.optometristAppointment.calledAt = new Date().toISOString();
    if (callNotes) {
      order.prescription.optometristAppointment.callNotes = callNotes;
    }

    order.timeline.push({
      status: order.orderStatus,
      timestamp: new Date().toISOString(),
      note: `Store Optometrist Appointment status updated to: ${status}${callNotes ? ` - Call note: ${callNotes}` : ''}`
    });

    this.saveData();
    return order;
  }

  // Coupons
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public getCouponByCode(code: string): Coupon | undefined {
    if (!code || typeof code !== 'string') return undefined;
    const clean = code.trim().toUpperCase();
    if (!Array.isArray(this.data.coupons)) {
      this.data.coupons = [];
    }
    return this.data.coupons.find(c => c && c.code && c.code.toUpperCase() === clean);
  }

  public createCoupon(coupon: Omit<Coupon, 'id' | 'usageCount'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      code: coupon.code.toUpperCase().trim(),
      id: `coup-${Date.now().toString(36)}`,
      usageCount: 0
    };
    this.data.coupons.push(newCoupon);
    this.saveData();
    return newCoupon;
  }

  public updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const idx = this.data.coupons.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.coupons[idx] = { ...this.data.coupons[idx], ...updates };
    this.saveData();
    return this.data.coupons[idx];
  }

  public deleteCoupon(id: string): boolean {
    const len = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    if (this.data.coupons.length < len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Stores
  public getStores(): StoreLocation[] {
    return this.data.stores;
  }

  public createStore(store: Omit<StoreLocation, 'id'>): StoreLocation {
    const newStore: StoreLocation = {
      ...store,
      id: `store-${Date.now().toString(36)}`
    };
    this.data.stores.push(newStore);
    this.saveData();
    return newStore;
  }

  public updateStore(id: string, updates: Partial<StoreLocation>): StoreLocation | null {
    const idx = this.data.stores.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.stores[idx] = { ...this.data.stores[idx], ...updates };
    this.saveData();
    return this.data.stores[idx];
  }

  public deleteStore(id: string): boolean {
    const len = this.data.stores.length;
    this.data.stores = this.data.stores.filter(s => s.id !== id);
    if (this.data.stores.length < len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Blogs
  public getBlogs(): BlogPost[] {
    return this.data.blogs;
  }

  public getBlogBySlug(slug: string): BlogPost | undefined {
    return this.data.blogs.find(b => b.slug === slug || b.id === slug);
  }

  public createBlog(blog: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost {
    const newBlog: BlogPost = {
      ...blog,
      id: `blog-${Date.now().toString(36)}`,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    this.data.blogs.unshift(newBlog);
    this.saveData();
    return newBlog;
  }

  public updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const idx = this.data.blogs.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.blogs[idx] = { ...this.data.blogs[idx], ...updates };
    this.saveData();
    return this.data.blogs[idx];
  }

  public deleteBlog(id: string): boolean {
    const len = this.data.blogs.length;
    this.data.blogs = this.data.blogs.filter(b => b.id !== id);
    if (this.data.blogs.length < len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Banners
  public getBanners(): Banner[] {
    return [...this.data.banners].sort((a, b) => a.priority - b.priority);
  }

  public createBanner(banner: Omit<Banner, 'id'>): Banner {
    const newBanner: Banner = {
      ...banner,
      id: `banner-${Date.now().toString(36)}`
    };
    this.data.banners.push(newBanner);
    this.saveData();
    return newBanner;
  }

  public updateBanner(id: string, updates: Partial<Banner>): Banner | null {
    const idx = this.data.banners.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.banners[idx] = { ...this.data.banners[idx], ...updates };
    this.saveData();
    return this.data.banners[idx];
  }

  public deleteBanner(id: string): boolean {
    const len = this.data.banners.length;
    this.data.banners = this.data.banners.filter(b => b.id !== id);
    if (this.data.banners.length < len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Reviews
  public getProductReviews(productId: string): Review[] {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  public addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.data.reviews.unshift(newRev);

    // Recalculate product rating
    const prodReviews = this.data.reviews.filter(r => r.productId === reviewData.productId);
    const prod = this.getProductByIdOrSlug(reviewData.productId);
    if (prod) {
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Math.round(avg * 10) / 10;
      prod.reviewsCount = prodReviews.length;
    }

    this.saveData();
    return newRev;
  }

  // Customers
  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  // Admin Analytics
  public getAdminStats(): AdminStats {
    const totalRevenue = this.data.orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = this.data.orders.length;
    const totalProducts = this.data.products.length;
    const totalCustomers = this.data.customers.length;
    const pendingOrders = this.data.orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
    const lowStockCount = this.data.products.filter(p => p.stock <= 15).length;

    const statusCounts: Record<OrderStatus, number> = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    this.data.orders.forEach(o => {
      if (statusCounts[o.orderStatus] !== undefined) {
        statusCounts[o.orderStatus]++;
      }
    });

    const statusDistribution = (Object.keys(statusCounts) as OrderStatus[]).map(status => ({
      status,
      count: statusCounts[status]
    }));

    const monthlyRevenue = [
      { month: 'Apr', revenue: 142000, orders: 16 },
      { month: 'May', revenue: 189000, orders: 22 },
      { month: 'Jun', revenue: 224000, orders: 28 },
      { month: 'Jul', revenue: 310000, orders: 36 },
      { month: 'Aug', revenue: 285000, orders: 32 },
      { month: 'Sep', revenue: totalRevenue, orders: totalOrders }
    ];

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockCount,
      recentOrders: this.data.orders.slice(0, 8),
      monthlyRevenue,
      statusDistribution
    };
  }

  // CSV Export
  public exportOrdersCSV(): string {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'City',
      'State',
      'PIN',
      'Items Count',
      'Subtotal',
      'Discount',
      'Total',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Courier',
      'AWB Number'
    ];

    const rows = this.data.orders.map(o => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.email}"`,
      `"${o.customer.city}"`,
      `"${o.customer.state}"`,
      `"${o.customer.pinCode}"`,
      o.items.reduce((s, i) => s + i.quantity, 0),
      o.subtotal,
      o.discount,
      o.total,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.paymentStatus}"`,
      `"${o.orderStatus}"`,
      `"${o.courierName || ''}"`,
      `"${o.trackingNumber || ''}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const dbService = new DatabaseService();
