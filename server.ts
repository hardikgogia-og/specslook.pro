import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { dbService } from './src/server/db.ts';

const app = express();
const PORT = 3000;

// Ensure public/uploads directory exists for system image uploads (safe on read-only environments like Vercel)
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch {
  // Graceful fallback for read-only serverless filesystems
}

// Enable CORS and rich JSON body parsing (including base64 product images from local system)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Normalize URL in case serverless / proxy rewrites stripped the /api prefix
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads') && !req.url.startsWith('/assets')) {
    if (
      req.url.startsWith('/products') ||
      req.url.startsWith('/categories') ||
      req.url.startsWith('/orders') ||
      req.url.startsWith('/stores') ||
      req.url.startsWith('/auth') ||
      req.url.startsWith('/admin') ||
      req.url.startsWith('/blogs') ||
      req.url.startsWith('/banners') ||
      req.url.startsWith('/coupons') ||
      req.url.startsWith('/reviews') ||
      req.url.startsWith('/health')
    ) {
      req.url = '/api' + req.url;
    }
  }
  next();
});

// Serve uploaded photos statically
app.use('/uploads', express.static(uploadsDir));

// Active admin session tokens (In-memory verification)
const activeAdminTokens = new Set<string>();

// Middleware to verify admin token (supports Bearer header and query param for downloads)
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split('Bearer ')[1].trim();
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }
  if (!activeAdminTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session token' });
  }
  next();
}

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Specslook Eyewear API', timestamp: new Date().toISOString() });
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES & SECURITY HARDENING
// -------------------------------------------------------------

interface IpLoginTracker {
  failedAttempts: number;
  lockedUntil?: number; // millisecond timestamp
  lastAttemptTime: number;
}

const ipLoginAttempts = new Map<string, IpLoginTracker>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req.ip || (req.socket && req.socket.remoteAddress) || '127.0.0.1';
}

// Check IP Lockout Status
app.get('/api/auth/admin/lockout-status', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const now = Date.now();
  const tracker = ipLoginAttempts.get(clientIp);

  if (tracker && tracker.lockedUntil && tracker.lockedUntil > now) {
    const remainingMs = tracker.lockedUntil - now;
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMins = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return res.json({
      locked: true,
      lockedUntil: tracker.lockedUntil,
      remainingMs,
      remainingHours,
      remainingMins,
      clientIp
    });
  }

  const failedCount = tracker?.failedAttempts || 0;
  return res.json({
    locked: false,
    attemptsRemaining: Math.max(0, 3 - failedCount),
    clientIp
  });
});

// Admin Login with 24-Hour IP Timeout Lockout after 3 Failed Attempts
app.post('/api/auth/admin/login', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const now = Date.now();
  let tracker = ipLoginAttempts.get(clientIp) || { failedAttempts: 0, lastAttemptTime: now };

  // Check if IP is currently under 24-hour timeout lockout
  if (tracker.lockedUntil && tracker.lockedUntil > now) {
    const remainingMs = tracker.lockedUntil - now;
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMins = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return res.status(429).json({
      error: `Security Lockout Active: IP address (${clientIp}) is locked for 24 hours due to 3 consecutive failed login attempts. Time remaining: ${remainingHours}h ${remainingMins}m.`,
      locked: true,
      lockedUntil: tracker.lockedUntil,
      remainingMs,
      remainingHours,
      remainingMins,
      clientIp
    });
  }

  // If previous lockout expired, reset failed counter
  if (tracker.lockedUntil && tracker.lockedUntil <= now) {
    tracker.failedAttempts = 0;
    delete tracker.lockedUntil;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // If master administrator credentials match, immediately bypass/clear lockout and grant access!
  if (cleanUser === 'honeygogia' && cleanPass === 'HoneyGogia1001') {
    ipLoginAttempts.delete(clientIp);
    const token = `sl_adm_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    activeAdminTokens.add(token);
    return res.json({
      token,
      user: {
        id: 'admin-01',
        username: 'honeygogia',
        role: 'superadmin',
        name: 'Honey Gogia',
        email: 'honeygogia@specslook.com'
      }
    });
  }

  const result = dbService.verifyAdmin(username, password);
  if (!result.success || !result.user) {
    tracker.failedAttempts = (tracker.failedAttempts || 0) + 1;
    tracker.lastAttemptTime = now;

    if (tracker.failedAttempts >= 3) {
      // 24-hour timeout lockout
      const LOCKOUT_MS = 24 * 60 * 60 * 1000;
      tracker.lockedUntil = now + LOCKOUT_MS;
      ipLoginAttempts.set(clientIp, tracker);

      return res.status(429).json({
        error: `Security Lockout Activated: 3 failed login attempts reached for IP ${clientIp}. Access has been locked for 24 hours.`,
        locked: true,
        lockedUntil: tracker.lockedUntil,
        remainingMs: LOCKOUT_MS,
        remainingHours: 24,
        remainingMins: 0,
        clientIp
      });
    }

    ipLoginAttempts.set(clientIp, tracker);
    const attemptsLeft = 3 - tracker.failedAttempts;
    return res.status(401).json({
      error: `Invalid admin credentials. Warning: ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before 24-hour IP lockout.`,
      attemptsRemaining: attemptsLeft,
      locked: false,
      clientIp
    });
  }

  // On successful authentication, reset lockout counter for this IP
  ipLoginAttempts.delete(clientIp);

  // Generate secure session token
  const token = `sl_adm_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
  activeAdminTokens.add(token);

  return res.json({
    token,
    user: result.user
  });
});

// Admin Profile Verification
app.get('/api/auth/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const profile = dbService.getAdminProfile();
  return res.json({ user: profile });
});

// Admin Logout
app.post('/api/auth/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1].trim();
    activeAdminTokens.delete(token);
  }
  return res.json({ success: true });
});

// -------------------------------------------------------------
// PRODUCTS ROUTES
// -------------------------------------------------------------

// Get all products with filters and search
app.get('/api/products', (req: Request, res: Response) => {
  const {
    category,
    shape,
    gender,
    polarized,
    search,
    featured,
    bestSeller,
    newArrival,
    minPrice,
    maxPrice,
    sort
  } = req.query;

  const products = dbService.getProducts({
    category: category ? String(category) : undefined,
    shape: shape ? String(shape) : undefined,
    gender: gender ? String(gender) : undefined,
    polarized: polarized !== undefined ? polarized === 'true' : undefined,
    search: search ? String(search) : undefined,
    featured: featured === 'true',
    bestSeller: bestSeller === 'true',
    newArrival: newArrival === 'true',
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort ? String(sort) : undefined
  });

  return res.json(products);
});

// Get single product with reviews and related items
app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
  const product = dbService.getProductByIdOrSlug(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const reviews = dbService.getProductReviews(product.id);
  const related = dbService.getProducts({ category: product.category })
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return res.json({
    product,
    reviews,
    related
  });
});

// Admin Create Product
app.post('/api/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const product = dbService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to create product' });
  }
});

// Admin Update Product
app.put('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbService.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(updated);
});

// Admin Delete Product
app.delete('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbService.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ success: true, message: 'Product deleted successfully' });
});

// Helper to save base64 uploaded image from local system to disk
function saveUploadedBase64Image(payload: string, rawFilename?: string): { url: string; filename: string; size: number } {
  if (!payload || typeof payload !== 'string') {
    throw new Error('Invalid image payload');
  }

  // If already an HTTP URL or local static URL, return as-is
  if (payload.startsWith('http://') || payload.startsWith('https://') || payload.startsWith('/uploads/')) {
    return { url: payload, filename: rawFilename || 'product-image.jpg', size: 0 };
  }

  try {
    let extension = 'jpg';
    let buffer: Buffer;

    const matches = payload.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      buffer = Buffer.from(base64Data, 'base64');
      if (mimeType.includes('png')) extension = 'png';
      else if (mimeType.includes('webp')) extension = 'webp';
      else if (mimeType.includes('gif')) extension = 'gif';
      else if (mimeType.includes('svg')) extension = 'svg';
    } else {
      buffer = Buffer.from(payload, 'base64');
    }

    // Clean name prefix
    const cleanBase = rawFilename
      ? path.basename(rawFilename, path.extname(rawFilename)).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30)
      : 'specslook_product';

    const uniqueName = `${cleanBase}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
    const targetFile = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(targetFile, buffer);

    // Also mirror to dist/uploads if production dist folder exists
    const distUploadsDir = path.join(process.cwd(), 'dist', 'uploads');
    try {
      if (fs.existsSync(path.join(process.cwd(), 'dist'))) {
        if (!fs.existsSync(distUploadsDir)) {
          fs.mkdirSync(distUploadsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(distUploadsDir, uniqueName), buffer);
      }
    } catch (mirrorErr) {
      console.warn('Could not mirror upload to dist/uploads (non-fatal):', mirrorErr);
    }

    return {
      url: `/uploads/${uniqueName}`,
      filename: uniqueName,
      size: buffer.length
    };
  } catch (err: any) {
    console.error('Error writing uploaded file to disk, falling back to data URI:', err);
    // Fallback gracefully to data URI so user upload never fails
    return {
      url: payload,
      filename: rawFilename || 'uploaded-product.jpg',
      size: payload.length
    };
  }
}

// Handle Photo Uploads from Admin System (Single or Multiple)
app.post('/api/upload', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { imageBase64, filename, images } = req.body;

    // Support batch uploads array
    if (Array.isArray(images) && images.length > 0) {
      const results = images.map((item: any) =>
        saveUploadedBase64Image(item.imageBase64 || item.url || item, item.filename)
      );
      return res.json({
        success: true,
        images: results
      });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image payload provided' });
    }

    const saved = saveUploadedBase64Image(imageBase64, filename);
    return res.json({
      success: true,
      url: saved.url,
      name: saved.filename,
      size: saved.size
    });
  } catch (err: any) {
    console.error('Upload route error:', err);
    return res.status(500).json({ error: err.message || 'Failed to process uploaded photo' });
  }
});

// Admin: Direct Photo Upload for an existing Product (Saves photo & enters image into database)
app.post('/api/products/:id/upload-image', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { imageBase64, filename, isPrimary } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image payload provided' });
    }

    const product = dbService.getProductByIdOrSlug(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const saved = saveUploadedBase64Image(imageBase64, filename);

    // Enter the image into the product's images in database
    const currentImages = Array.isArray(product.images) ? [...product.images] : [];
    const updatedImages = isPrimary
      ? [saved.url, ...currentImages.filter(img => img !== saved.url)]
      : [...currentImages, saved.url];

    const updatedProduct = dbService.updateProduct(product.id, { images: updatedImages });

    return res.json({
      success: true,
      url: saved.url,
      product: updatedProduct,
      message: 'Photo uploaded from system and saved into product database successfully'
    });
  } catch (err: any) {
    console.error('Direct product photo upload error:', err);
    return res.status(500).json({ error: err.message || 'Failed to upload photo into database' });
  }
});

// -------------------------------------------------------------
// ORDERS & CHECKOUT ROUTES
// -------------------------------------------------------------

// Customer: Create New Order (COD or Cashfree)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customer, items, couponCode, paymentMethod, paymentStatus, paymentTransactionId } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.addressLine1) {
      return res.status(400).json({ error: 'Incomplete customer delivery address details' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty. Please add items before placing order' });
    }

    const order = dbService.createOrder({
      customer,
      items,
      couponCode,
      paymentMethod: paymentMethod === 'cashfree' ? 'cashfree' : 'cod',
      paymentStatus,
      paymentTransactionId
    });

    return res.status(201).json(order);
  } catch (err: any) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

// Customer: Track Order by Order ID or Phone
app.get('/api/orders/track/:query', (req: Request, res: Response) => {
  const q = req.params.query.trim().toLowerCase();
  const order = dbService.getOrders().find(o =>
    o.orderNumber.toLowerCase() === q ||
    o.id.toLowerCase() === q ||
    o.customer.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''))
  );

  if (!order) {
    return res.status(404).json({ error: 'No order found with the provided details' });
  }
  return res.json(order);
});

// Customer: View past orders by email
app.get('/api/orders/customer/:email', (req: Request, res: Response) => {
  const orders = dbService.getOrdersByCustomerEmail(req.params.email);
  return res.json(orders);
});

// Admin: Get all orders with search & status filter
app.get('/api/orders', requireAdminAuth, (req: Request, res: Response) => {
  const { status, search } = req.query;
  const orders = dbService.getOrders({
    status: status ? String(status) : undefined,
    search: search ? String(search) : undefined
  });
  return res.json(orders);
});

// Admin: Export orders to CSV
app.get('/api/orders/export/csv', requireAdminAuth, (req: Request, res: Response) => {
  const csvData = dbService.exportOrdersCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=specslook-orders-${Date.now()}.csv`);
  return res.send(csvData);
});

// Admin: Update Order Status (Pending -> Confirmed -> Processing -> Shipped -> Delivered / Cancelled)
app.put('/api/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { status, courierName, trackingNumber, note } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updated = dbService.updateOrderStatus(req.params.id, status, courierName, trackingNumber, note);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(updated);
});

// Customer: Submit prescription details / book optometrist eye exam appointment post-checkout
app.post('/api/orders/:id/prescription', (req: Request, res: Response) => {
  try {
    const { prescription } = req.body;
    if (!prescription || !prescription.mode) {
      return res.status(400).json({ error: 'Prescription details and mode are required' });
    }

    const updated = dbService.updateOrderPrescription(req.params.id, prescription);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(updated);
  } catch (err: any) {
    console.error('Error updating order prescription:', err);
    return res.status(500).json({ error: err.message || 'Failed to update prescription' });
  }
});

// Admin: Edit or verify optical powers & prescription details
app.put('/api/orders/:id/prescription', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { prescription } = req.body;
    if (!prescription || !prescription.mode) {
      return res.status(400).json({ error: 'Prescription payload with valid mode is required' });
    }

    const updated = dbService.updateOrderPrescription(req.params.id, prescription);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json(updated);
  } catch (err: any) {
    console.error('Error in admin prescription update:', err);
    return res.status(500).json({ error: err.message || 'Failed to update prescription' });
  }
});

// Admin: Update Optometrist Appointment call status and notes
app.put('/api/orders/:id/appointment', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status, callNotes } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = dbService.updateAppointmentStatus(req.params.id, status, callNotes);
    if (!updated) {
      return res.status(404).json({ error: 'Order or optometrist appointment not found' });
    }

    return res.json(updated);
  } catch (err: any) {
    console.error('Error updating appointment:', err);
    return res.status(500).json({ error: err.message || 'Failed to update appointment' });
  }
});

// Admin: Get all appointments & prescriptions
app.get('/api/admin/appointments', requireAdminAuth, (req: Request, res: Response) => {
  const allOrders = dbService.getOrders();
  const appointments = allOrders
    .filter(o => !!o.prescription)
    .map(o => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      orderDate: o.createdAt,
      customerName: o.customer.fullName,
      customerPhone: o.customer.phone,
      customerEmail: o.customer.email,
      customerCity: o.customer.city,
      items: o.items.map(i => ({
        productName: i.productName,
        lensAddonName: (i as any).lensAddon?.name || (i as any).selectedLensType || 'Standard Lenses'
      })),
      prescription: o.prescription!
    }));

  return res.json(appointments);
});

// -------------------------------------------------------------
// PAYMENT: CASH ON DELIVERY (COD) WORKFLOW
// -------------------------------------------------------------

// Verification endpoint for COD delivery confirmation
app.get('/api/payment/cod-info', (req: Request, res: Response) => {
  return res.json({
    method: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay on delivery via Cash or UPI QR scan at doorstep',
    acceptedUpiApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED UPI', 'Amazon Pay'],
    currency: 'INR',
    fee: 0,
    status: 'ACTIVE'
  });
});

// -------------------------------------------------------------
// COUPONS & DISCOUNTS ROUTES
// -------------------------------------------------------------

// Customer Apply Coupon
app.post('/api/coupons/apply', (req: Request, res: Response) => {
  const { code, cartSubtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Please enter a coupon code' });
  }

  const coupon = dbService.getCouponByCode(code);
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid coupon code. Try SPECS10 or WELCOME500' });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ error: 'This coupon is currently inactive' });
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    return res.status(400).json({ error: 'This coupon has expired' });
  }

  if (cartSubtotal < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Coupon applies on minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')}`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return res.json({
    code: coupon.code,
    discount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    message: `Coupon ${coupon.code} applied! You saved ₹${discount.toLocaleString('en-IN')}`
  });
});

// Admin Coupon Management
app.get('/api/coupons', requireAdminAuth, (req: Request, res: Response) => {
  return res.json(dbService.getCoupons());
});

app.post('/api/coupons', requireAdminAuth, (req: Request, res: Response) => {
  const coupon = dbService.createCoupon(req.body);
  return res.status(201).json(coupon);
});

app.put('/api/coupons/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbService.updateCoupon(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Coupon not found' });
  return res.json(updated);
});

app.delete('/api/coupons/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbService.deleteCoupon(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Coupon not found' });
  return res.json({ success: true });
});

// -------------------------------------------------------------
// CATEGORIES, STORES, BLOGS, BANNERS ROUTES
// -------------------------------------------------------------

// Categories
app.get('/api/categories', (req: Request, res: Response) => {
  return res.json(dbService.getCategories());
});

app.post('/api/categories', requireAdminAuth, (req: Request, res: Response) => {
  const cat = dbService.createCategory(req.body);
  return res.status(201).json(cat);
});

app.put('/api/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbService.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  return res.json(updated);
});

app.delete('/api/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbService.deleteCategory(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  return res.json({ success: true });
});

// Stores
app.get('/api/stores', (req: Request, res: Response) => {
  return res.json(dbService.getStores());
});

app.post('/api/stores', requireAdminAuth, (req: Request, res: Response) => {
  const store = dbService.createStore(req.body);
  return res.status(201).json(store);
});

app.put('/api/stores/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbService.updateStore(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Store not found' });
  return res.json(updated);
});

app.delete('/api/stores/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbService.deleteStore(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Store not found' });
  return res.json({ success: true });
});

// Blogs
app.get('/api/blogs', (req: Request, res: Response) => {
  return res.json(dbService.getBlogs());
});

app.get('/api/blogs/:slug', (req: Request, res: Response) => {
  const blog = dbService.getBlogBySlug(req.params.slug);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  return res.json(blog);
});

app.post('/api/blogs', requireAdminAuth, (req: Request, res: Response) => {
  const blog = dbService.createBlog(req.body);
  return res.status(201).json(blog);
});

app.put('/api/blogs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbService.updateBlog(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Blog not found' });
  return res.json(updated);
});

app.delete('/api/blogs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbService.deleteBlog(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Blog not found' });
  return res.json({ success: true });
});

// Banners
app.get('/api/banners', (req: Request, res: Response) => {
  return res.json(dbService.getBanners());
});

app.post('/api/banners', requireAdminAuth, (req: Request, res: Response) => {
  const banner = dbService.createBanner(req.body);
  return res.status(201).json(banner);
});

app.put('/api/banners/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = dbService.updateBanner(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Banner not found' });
  return res.json(updated);
});

app.delete('/api/banners/:id', requireAdminAuth, (req: Request, res: Response) => {
  const deleted = dbService.deleteBanner(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Banner not found' });
  return res.json({ success: true });
});

// Reviews
app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const { customerName, rating, title, comment } = req.body;
  if (!customerName || !rating || !comment) {
    return res.status(400).json({ error: 'Customer name, rating, and comment are required' });
  }
  const review = dbService.addReview({
    productId: req.params.id,
    customerName,
    rating: Number(rating),
    title: title || 'Verified Experience',
    comment,
    verifiedPurchase: true
  });
  return res.status(201).json(review);
});

// Customers list for Admin
app.get('/api/admin/customers', requireAdminAuth, (req: Request, res: Response) => {
  return res.json(dbService.getCustomers());
});

// Admin Dashboard Analytics
app.get('/api/admin/stats', requireAdminAuth, (req: Request, res: Response) => {
  return res.json(dbService.getAdminStats());
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / PRODUCTION STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Specslook Luxury Eyewear Server active on port ${PORT}`);
  });
}

// In standalone/container environments, start the server.
// On Vercel, the app is imported and served via serverless functions.
if (!process.env.VERCEL) {
  startServer();
}

export { app };
export default app;
