import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, Coupon, StoreLocation, BlogPost, Banner, ProductVariant, LensAddon } from '../types.ts';
import {
  initialProducts,
  initialCategories,
  initialStores,
  initialBlogs,
  initialBanners,
  initialCoupons
} from '../data/seedData.ts';
import { getBlogImage } from '../data/blogImages.ts';
import { getStoreImage } from '../data/storeImages.ts';
import { initAnalytics, trackAddToCart, trackPageView } from '../utils/analytics.ts';
import {
  syncCatalogToGitHubDirect,
  fetchCatalogFromGitHub,
  getStoredGitHubCredentials,
  parseGitHubRepo
} from '../utils/githubGitService.ts';

export type AppView =
  | 'home'
  | 'shop'
  | 'product'
  | 'try-on'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'account'
  | 'about'
  | 'stores'
  | 'franchise'
  | 'contact'
  | 'blog'
  | 'blog-post'
  | 'home-eyetest'
  | 'terms'
  | 'privacy'
  | 'admin';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Navigation
  currentView: AppView;
  viewParams: Record<string, any>;
  navigateTo: (view: AppView, params?: Record<string, any>) => void;

  // Products & Data
  products: Product[];
  categories: Category[];
  stores: StoreLocation[];
  blogs: BlogPost[];
  banners: Banner[];
  loadingData: boolean;
  refreshProducts: () => Promise<void>;

  // Data Mutations (Admin & Store Sync)
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  addStore: (store: Omit<StoreLocation, 'id'>) => Promise<StoreLocation>;
  updateStore: (id: string, updates: Partial<StoreLocation>) => Promise<StoreLocation | null>;
  deleteStore: (id: string) => Promise<boolean>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number,
    lensTypeOrAddon?: string | LensAddon,
    lensAddon?: LensAddon
  ) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, qty: number, lensAddonId?: string) => void;
  removeFromCart: (productId: string, variantId?: string, lensAddonId?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupon
  appliedCoupon: { code: string; discount: number; message: string } | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Orders
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Admin Auth - Secure session-backed state
  adminToken: string | null;
  adminUser: any | null;
  adminAuthLoading: boolean;
  verifyAdminSession: () => Promise<boolean>;
  loginAdmin: (token: string, user: any) => void;
  logoutAdmin: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Virtual Try-On
  isTryOnOpen: boolean;
  tryOnProduct: Product | null;
  openTryOn: (product?: Product) => void;
  closeTryOn: () => void;
}

// Synchronous route resolver to eliminate visual jumping / flashing before hydration
const getInitialRoute = (): { view: AppView; params: Record<string, any> } => {
  if (typeof window === 'undefined') return { view: 'home', params: {} };
  const rawPath = window.location.pathname;
  const path = rawPath.replace(/\/+$/, '') || '/';
  const hash = window.location.hash.replace('#', '').replace(/\/+$/, '');
  const search = new URLSearchParams(window.location.search);

  if (path === '/admin' || hash === 'admin' || search.get('view') === 'admin') {
    return { view: 'admin', params: {} };
  }
  if (path === '/try-on' || path === '/virtual-try-on' || hash === 'try-on' || hash === 'virtual-try-on' || search.get('view') === 'try-on') {
    return { view: 'try-on', params: {} };
  }
  const productMatch = path.match(/^\/(?:product|products)\/([^/]+)/i);
  const hashProductMatch = hash.match(/^(?:product|products)\/([^/]+)/i);
  const productSlugOrId = productMatch?.[1] || hashProductMatch?.[1] || search.get('product') || search.get('slug') || search.get('id');
  if (productSlugOrId) {
    const decoded = decodeURIComponent(productSlugOrId);
    return { view: 'product', params: { slug: decoded, id: decoded } };
  }
  if (path === '/franchise' || hash === 'franchise' || search.get('view') === 'franchise') return { view: 'franchise', params: {} };
  if (path === '/home-eyetest' || path === '/home/home-eyetest' || hash === 'home-eyetest') return { view: 'home-eyetest', params: {} };
  if (path === '/terms' || path === '/terms-and-conditions' || hash === 'terms') return { view: 'terms', params: {} };
  if (path === '/privacy' || path === '/privacy-policy' || hash === 'privacy') return { view: 'privacy', params: {} };
  if (path === '/checkout' || hash === 'checkout') return { view: 'checkout', params: {} };
  if (path === '/tracking' || hash === 'tracking') return { view: 'tracking', params: {} };
  if (path === '/account' || hash === 'account') return { view: 'account', params: {} };
  if (path === '/stores' || path === '/store' || hash === 'stores') return { view: 'stores', params: {} };
  if (path === '/blog' || path === '/blogs' || hash === 'blog') return { view: 'blog', params: {} };
  if (path === '/about' || hash === 'about') return { view: 'about', params: {} };
  if (path === '/contact' || path === '/contact-us' || hash === 'contact') return { view: 'contact', params: {} };
  if (path === '/shop' || hash === 'shop') return { view: 'shop', params: {} };
  return { view: 'home', params: {} };
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation initialized synchronously from browser URL
  const initialRoute = getInitialRoute();
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
  const [viewParams, setViewParams] = useState<Record<string, any>>(initialRoute.params);

  // Data initialized with fallback seed data for instant Vercel/offline reliability
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initialProducts to ensure 6-in-1 Attachments and all seed products are present
          const merged = [...parsed];
          initialProducts.forEach(ip => {
            if (!merged.some(p => p.id === ip.id || p.slug === ip.slug)) {
              merged.push(ip);
            }
          });
          return merged;
        }
      }
    } catch {}
    return initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initialCategories to ensure Attachments and all categories are present
          const merged = [...parsed];
          initialCategories.forEach(ic => {
            if (!merged.some(c => c.id === ic.id || c.slug === ic.slug)) {
              merged.push(ic);
            }
          });
          return merged;
        }
      }
    } catch {}
    return initialCategories;
  });

  const [stores, setStores] = useState<StoreLocation[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_stores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: StoreLocation) => ({
            ...s,
            image: getStoreImage(s)
          }));
        }
      }
    } catch {}
    return initialStores.map((s: StoreLocation) => ({
      ...s,
      image: getStoreImage(s)
    }));
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_blogs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b: BlogPost) => ({
            ...b,
            image: getBlogImage(b),
            imageUrl: getBlogImage(b)
          }));
        }
      }
    } catch {}
    return initialBlogs.map((b: BlogPost) => ({
      ...b,
      image: getBlogImage(b),
      imageUrl: getBlogImage(b)
    }));
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialBanners;
  });

  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Cart & Wishlist from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Virtual Try-On Modal & Product State
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);

  const openTryOn = (product?: Product) => {
    if (product) {
      setTryOnProduct(product);
    } else if (!tryOnProduct && products.length > 0) {
      setTryOnProduct(products[0]);
    }
    setIsTryOnOpen(true);
  };

  const closeTryOn = () => {
    setIsTryOnOpen(false);
  };

  // Coupon & Orders
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Admin Auth - Resilient cross-device & page-refresh session
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('specslook_admin_token') || localStorage.getItem('specslook_admin_token') || null;
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    try {
      const saved = sessionStorage.getItem('specslook_admin_user') || localStorage.getItem('specslook_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminAuthLoading, setAdminAuthLoading] = useState<boolean>(true);

  // Verifies admin session with the server using httpOnly session cookie or Bearer token
  const verifyAdminSession = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/admin/me', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          setAdminUser(data.user);
          const t = data.token || 'sl_adm_session_active';
          setAdminToken(t);
          try {
            sessionStorage.setItem('specslook_admin_token', t);
            localStorage.setItem('specslook_admin_token', t);
            sessionStorage.setItem('specslook_admin_user', JSON.stringify(data.user));
            localStorage.setItem('specslook_admin_user', JSON.stringify(data.user));
          } catch {}
          return true;
        }
      }
      // If server returns 401 explicitly, clear session; if 404 (e.g. static Vercel), preserve stored session if valid
      if (res.status === 401) {
        setAdminUser(null);
        setAdminToken(null);
        try {
          sessionStorage.removeItem('specslook_admin_token');
          localStorage.removeItem('specslook_admin_token');
          sessionStorage.removeItem('specslook_admin_user');
          localStorage.removeItem('specslook_admin_user');
        } catch {}
        return false;
      }
      return !!adminToken;
    } catch {
      // Offline / serverless cold-start: preserve local admin session
      return !!adminToken;
    } finally {
      setAdminAuthLoading(false);
    }
  };

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sync Cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('specslook_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync Wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('specslook_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Refresh products directly with multi-tier resilience:
  // 1. API endpoint /api/products (Server/Dev)
  // 2. Direct static database asset /data/specslook_db.json (Vercel/Static hosting/Zero backend)
  const refreshProducts = async (force: boolean = false): Promise<void> => {
    const timestamp = Date.now();
    const url = force ? `/api/products?_t=${timestamp}` : '/api/products';

    // 1. Server API /api/products
    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            try { localStorage.setItem('specslook_products', JSON.stringify(data)); } catch {}
            return;
          }
        }
      }
    } catch (err) {
      console.warn('StoreContext: refreshProducts server fetch note:', err);
    }

    // 2. Direct static database JSON fallback (works universally on all devices, Vercel, static hosting)
    try {
      const staticRes = await fetch(`/data/specslook_db.json?_t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        }
      });
      if (staticRes.ok) {
        const contentType = staticRes.headers.get('content-type') || '';
        if (contentType.includes('application/json') || contentType.includes('text/plain')) {
          const dbData = await staticRes.json();
          if (dbData && Array.isArray(dbData.products) && dbData.products.length > 0) {
            setProducts(dbData.products);
            try { localStorage.setItem('specslook_products', JSON.stringify(dbData.products)); } catch {}
            if (Array.isArray(dbData.categories) && dbData.categories.length > 0) {
              setCategories(dbData.categories);
              try { localStorage.setItem('specslook_categories', JSON.stringify(dbData.categories)); } catch {}
            }
            if (Array.isArray(dbData.stores) && dbData.stores.length > 0) {
              setStores(dbData.stores);
              try { localStorage.setItem('specslook_stores', JSON.stringify(dbData.stores)); } catch {}
            }
            if (Array.isArray(dbData.blogs) && dbData.blogs.length > 0) {
              setBlogs(dbData.blogs);
              try { localStorage.setItem('specslook_blogs', JSON.stringify(dbData.blogs)); } catch {}
            }
            if (Array.isArray(dbData.banners) && dbData.banners.length > 0) {
              setBanners(dbData.banners);
              try { localStorage.setItem('specslook_banners', JSON.stringify(dbData.banners)); } catch {}
            }
            return;
          }
        }
      }
    } catch (staticErr) {
      console.warn('StoreContext: static specslook_db.json fallback note:', staticErr);
    }

    // 3. Direct GitHub fallback (with or without stored credentials)
    try {
      const creds = getStoredGitHubCredentials();
      const repo = creds?.repo || 'hardikgogia175/specslook';
      if (creds?.token && creds?.repo) {
        const gitData = await fetchCatalogFromGitHub(creds.token, creds.repo);
        if (gitData?.schema?.products && Array.isArray(gitData.schema.products) && gitData.schema.products.length > 0) {
          setProducts(gitData.schema.products);
          try { localStorage.setItem('specslook_products', JSON.stringify(gitData.schema.products)); } catch {}
          return;
        }
      } else if (repo) {
        // Direct public repository read without requiring any admin login
        const parsed = parseGitHubRepo(repo);
        if (parsed) {
          const rawUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/main/data/specslook_db.json?_t=${timestamp}`;
          const rawRes = await fetch(rawUrl, { cache: 'no-store' });
          if (rawRes.ok) {
            const rawJson = await rawRes.json();
            if (rawJson && Array.isArray(rawJson.products) && rawJson.products.length > 0) {
              setProducts(rawJson.products);
              try { localStorage.setItem('specslook_products', JSON.stringify(rawJson.products)); } catch {}
              return;
            }
          }
        }
      }
    } catch (gitErr) {
      console.warn('StoreContext: refreshProducts GitHub fetch note:', gitErr);
    }
  };

  // Fetch initial data with resilient fallback and dynamic cache-busting
  const fetchData = async () => {
    setLoadingData(true);
    try {
      await refreshProducts();
    } catch (err) {
      console.warn('StoreContext: initial product refresh note:', err);
    }

    try {
      const [cRes, sRes, bRes, bnRes] = await Promise.allSettled([
        fetch('/api/categories', { headers: { Accept: 'application/json' } }).then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        }),
        fetch('/api/stores', { headers: { Accept: 'application/json' } }).then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        }),
        fetch('/api/blogs', { headers: { Accept: 'application/json' } }).then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        }),
        fetch('/api/banners', { headers: { Accept: 'application/json' } }).then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        })
      ]);

      if (cRes.status === 'fulfilled' && cRes.value && cRes.value.length > 0) {
        const fetchedCategories: Category[] = cRes.value;
        const merged = [...fetchedCategories];
        initialCategories.forEach(ic => {
          if (!merged.some(c => c.id === ic.id || c.slug === ic.slug)) {
            merged.push(ic);
          }
        });
        setCategories(merged);
        try { localStorage.setItem('specslook_categories', JSON.stringify(merged)); } catch {}
      }
      if (sRes.status === 'fulfilled' && sRes.value && sRes.value.length > 0) {
        const mappedStores = sRes.value.map((s: StoreLocation) => ({
          ...s,
          image: getStoreImage(s)
        }));
        setStores(mappedStores);
        try { localStorage.setItem('specslook_stores', JSON.stringify(mappedStores)); } catch {}
      }
      if (bRes.status === 'fulfilled' && bRes.value && bRes.value.length > 0) {
        setBlogs(bRes.value);
        try { localStorage.setItem('specslook_blogs', JSON.stringify(bRes.value)); } catch {}
      }
      if (bnRes.status === 'fulfilled' && bnRes.value && bnRes.value.length > 0) {
        setBanners(bnRes.value);
        try { localStorage.setItem('specslook_banners', JSON.stringify(bnRes.value)); } catch {}
      }
    } catch (err) {
      console.warn('StoreContext: network fetch failed, continuing with cached/seed data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    // Only check admin authentication if admin credentials exist in storage or user is on /admin route
    const hasAdminSession = () => {
      try {
        return !!(
          sessionStorage.getItem('specslook_admin_token') ||
          localStorage.getItem('specslook_admin_token') ||
          window.location.pathname.startsWith('/admin')
        );
      } catch {
        return false;
      }
    };

    if (hasAdminSession()) {
      verifyAdminSession();
    } else {
      setAdminAuthLoading(false);
    }

    // Defer non-critical background data refresh to idle time to preserve FCP/LCP
    const runDeferredTasks = () => {
      fetchData();
      initAnalytics();
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runDeferredTasks, { timeout: 2000 });
    } else {
      setTimeout(runDeferredTasks, 300);
    }

    // Cooldown visibility refresh to avoid duplicate requests on tab/focus toggling
    let lastRefresh = Date.now();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastRefresh > 60000) {
        lastRefresh = Date.now();
        refreshProducts();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);

    // Cross-tab synchronization via storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'specslook_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // Custom cross-component event listener
    const handleCustomProductSync = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProducts(e.detail);
      } else {
        refreshProducts();
      }
    };
    window.addEventListener('specslook-products-updated', handleCustomProductSync);

    // Check URL pathname, search query, and hash for seamless client-side routing
    const syncRouteFromUrl = () => {
      const rawPath = window.location.pathname;
      const path = rawPath.replace(/\/+$/, '') || '/';
      const hash = window.location.hash.replace('#', '').replace(/\/+$/, '');
      const search = new URLSearchParams(window.location.search);

      // 1. Admin route: /admin or #admin
      if (path === '/admin' || hash === 'admin' || search.get('view') === 'admin') {
        setCurrentView('admin');
        setViewParams({});
        trackPageView('/admin', 'Admin Dashboard');
        return;
      }

      // 2. Product route: /product/:slug, /product/:slug/, /products/:slug, ?product=:slug
      const productMatch = path.match(/^\/(?:product|products)\/([^/]+)/i);
      const hashProductMatch = hash.match(/^(?:product|products)\/([^/]+)/i);
      const productSlugOrId = productMatch?.[1] || hashProductMatch?.[1] || search.get('product') || search.get('slug') || search.get('id');
      if (productSlugOrId) {
        const decoded = decodeURIComponent(productSlugOrId);
        setCurrentView('product');
        setViewParams({ slug: decoded, id: decoded });
        trackPageView(`/product/${decoded}/`);
        return;
      }

      // 3. WordPress preserved Category URLs: /product-category/...
      const categoryMatch = rawPath.match(/^\/product-category\/([^/]+)(?:\/([^/]+))?/i);
      if (categoryMatch) {
        const primaryCat = categoryMatch[1]?.toLowerCase().replace(/\/+$/, '') || '';
        const subCat = categoryMatch[2]?.toLowerCase().replace(/\/+$/, '') || '';

        let resolvedCategory: string | undefined;
        let resolvedGender: string | undefined;

        if (primaryCat === 'eyewear' || primaryCat === 'eyeglasses') {
          resolvedCategory = 'Eyeglasses';
          if (subCat.includes('women')) resolvedGender = 'Women';
          else if (subCat.includes('men')) resolvedGender = 'Men';
          else if (subCat.includes('kid')) resolvedGender = 'Kids';
        } else if (primaryCat === 'sunglasses') {
          resolvedCategory = 'Sunglasses';
          if (subCat.includes('women')) resolvedGender = 'Women';
          else if (subCat.includes('men')) resolvedGender = 'Men';
          else if (subCat.includes('kid')) resolvedGender = 'Kids';
        } else if (primaryCat === 'attachments') {
          resolvedCategory = 'Attachments';
        } else if (primaryCat === 'polarized') {
          resolvedCategory = 'Sunglasses';
        } else if (primaryCat === 'blue-light-blockers' || primaryCat === 'blue-light') {
          resolvedCategory = 'Eyeglasses';
        } else {
          resolvedCategory = primaryCat;
        }

        setCurrentView('shop');
        setViewParams({ category: resolvedCategory, gender: resolvedGender, subcategory: subCat || undefined });
        trackPageView(rawPath, `${resolvedCategory || 'Shop'} Collection`);
        return;
      }

      // 4. Try-On route: /try-on, /virtual-try-on, #try-on
      if (path === '/try-on' || path === '/virtual-try-on' || hash === 'try-on' || hash === 'virtual-try-on' || search.get('view') === 'try-on') {
        setCurrentView('try-on');
        setViewParams({});
        trackPageView('/try-on/', '3D Virtual Try-On Studio');
        return;
      }

      // 5. Shop route: /shop, /catalog, #shop
      if (path === '/shop' || path === '/catalog' || hash === 'shop' || search.get('view') === 'shop') {
        const category = search.get('category') || undefined;
        const gender = search.get('gender') || undefined;
        setCurrentView('shop');
        setViewParams(category ? { category, gender } : (gender ? { gender } : {}));
        trackPageView('/shop', 'All Eyewear');
        return;
      }

      // 5. Preserved Store route: /store/, /store, /stores/, /stores
      if (path === '/store' || path === '/stores' || hash === 'stores' || search.get('view') === 'stores') {
        setCurrentView('stores');
        setViewParams({});
        trackPageView('/store/', 'Flagship Boutiques');
        return;
      }

      // 5.5. Franchise route: /franchise, /franchise/
      if (path === '/franchise' || hash === 'franchise' || search.get('view') === 'franchise') {
        setCurrentView('franchise');
        setViewParams({});
        trackPageView('/franchise/', 'Specslook Franchise Opportunities');
        return;
      }

      // 6. Preserved Home Eye Test: /home/home-eyetest/, /home/home-eyetest, /home-eyetest
      if (path === '/home/home-eyetest' || path === '/home-eyetest' || hash === 'home-eyetest' || search.get('view') === 'home-eyetest') {
        setCurrentView('home-eyetest');
        setViewParams({});
        trackPageView('/home/home-eyetest/', 'Home Eye Test');
        return;
      }

      // 7. Preserved Static & auxiliary pages
      if (path === '/about' || hash === 'about') {
        setCurrentView('about');
        setViewParams({});
        trackPageView('/about/', 'About Specslook');
        return;
      }
      if (path === '/contact-us' || path === '/contact' || hash === 'contact') {
        setCurrentView('contact');
        setViewParams({});
        trackPageView('/contact-us/', 'Contact Specslook');
        return;
      }
      const blogMatch = path.match(/^\/blog\/([^/]+)/i);
      if (blogMatch) {
        const blogSlug = decodeURIComponent(blogMatch[1]);
        setCurrentView('blog-post');
        setViewParams({ slug: blogSlug });
        trackPageView(`/blog/${blogSlug}/`, 'Eyewear Journal');
        return;
      }
      if (path === '/blog' || hash === 'blog') {
        setCurrentView('blog');
        setViewParams({});
        trackPageView('/blog/', 'Eyewear Journal');
        return;
      }
      if (path === '/checkout' || path === '/cart' || hash === 'checkout') {
        setCurrentView('checkout');
        setViewParams({});
        trackPageView('/checkout/', 'Secure Checkout');
        return;
      }
      if (path === '/tracking' || hash === 'tracking') {
        setCurrentView('tracking');
        setViewParams({});
        trackPageView('/tracking/', 'Track Order');
        return;
      }
      if (path === '/account' || hash === 'account') {
        setCurrentView('account');
        setViewParams({});
        trackPageView('/account/', 'My Account');
        return;
      }
      if (
        path === '/terms-and-conditions' ||
        path === '/terms' ||
        hash === 'terms' ||
        hash === 'terms-and-conditions'
      ) {
        setCurrentView('terms');
        setViewParams({});
        trackPageView('/terms-and-conditions/', 'Terms and Conditions');
        return;
      }
      if (
        path === '/privacy-policy' ||
        path === '/privacy' ||
        hash === 'privacy' ||
        hash === 'privacy-policy'
      ) {
        setCurrentView('privacy');
        setViewParams({});
        trackPageView('/privacy-policy/', 'Privacy Policy');
        return;
      }

      // Default home: /
      if (path === '/' || path === '') {
        setCurrentView('home');
        setViewParams({});
        trackPageView('/', 'Specslook | Luxury Eyewear & Sunglasses');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);

    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      window.removeEventListener('hashchange', syncRouteFromUrl);
    };
  }, []);

  const navigateTo = (view: AppView, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);

    // Synchronize browser URL bar for shareable links preserving exact WordPress URL structure with trailing slashes
    let targetUrl = '/';
    if (view === 'admin') {
      targetUrl = '/admin';
    } else if (view === 'product') {
      const slugOrId = params.slug || params.id || '';
      targetUrl = slugOrId ? `/product/${encodeURIComponent(slugOrId)}/` : '/shop/';
    } else if (view === 'blog-post') {
      const slug = params.slug || '';
      targetUrl = slug ? `/blog/${encodeURIComponent(slug)}/` : '/blog/';
    } else if (view === 'shop') {
      if (params.category === 'Eyeglasses' && params.gender === 'Women') {
        targetUrl = '/product-category/eyewear/womeneyewear/';
      } else if (params.category === 'Eyeglasses' && params.gender === 'Men') {
        targetUrl = '/product-category/eyewear/meneyewear/';
      } else if (params.category === 'Eyeglasses' && params.gender === 'Kids') {
        targetUrl = '/product-category/eyewear/kidseyewear/';
      } else if (params.category === 'Sunglasses' && params.gender === 'Women') {
        targetUrl = '/product-category/sunglasses/women/';
      } else if (params.category === 'Sunglasses' && params.gender === 'Men') {
        targetUrl = '/product-category/sunglasses/men/';
      } else if (params.category === 'Sunglasses' && params.gender === 'Kids') {
        targetUrl = '/product-category/sunglasses/kids/';
      } else if (params.category === 'Sunglasses') {
        targetUrl = '/product-category/sunglasses/';
      } else if (params.category === 'Eyeglasses') {
        targetUrl = '/product-category/eyeglasses/';
      } else if (params.category === 'Attachments') {
        targetUrl = '/product-category/attachments/';
      } else if (params.category === 'Polarized' || params.polarized) {
        targetUrl = '/product-category/polarized/';
      } else if (params.category === 'Blue Light Blockers') {
        targetUrl = '/product-category/blue-light-blockers/';
      } else if (params.category) {
        targetUrl = `/shop?category=${encodeURIComponent(params.category)}`;
      } else {
        targetUrl = '/shop/';
      }
    } else if (view === 'try-on') {
      targetUrl = '/try-on/';
    } else if (view === 'stores') {
      targetUrl = '/store/';
    } else if (view === 'franchise') {
      targetUrl = '/franchise/';
    } else if (view === 'home-eyetest') {
      targetUrl = '/home/home-eyetest/';
    } else if (view === 'about') {
      targetUrl = '/about/';
    } else if (view === 'contact') {
      targetUrl = '/contact-us/';
    } else if (view === 'blog') {
      targetUrl = '/blog/';
    } else if (view === 'checkout') {
      targetUrl = '/checkout/';
    } else if (view === 'tracking') {
      targetUrl = '/tracking/';
    } else if (view === 'account') {
      targetUrl = '/account/';
    } else if (view === 'terms') {
      targetUrl = '/terms-and-conditions/';
    } else if (view === 'privacy') {
      targetUrl = '/privacy-policy/';
    } else {
      targetUrl = '/';
    }

    try {
      if (window.location.pathname !== targetUrl && window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ view, params }, '', targetUrl);
      }
      trackPageView(targetUrl);
    } catch {
      // Graceful fallback for strict sandbox environments
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity = 1,
    lensTypeOrAddon: string | LensAddon = 'Classic Mineral Lens',
    explicitLensAddon?: LensAddon
  ) => {
    let lensType = 'Classic Mineral Lens';
    let lensAddon: LensAddon | undefined = explicitLensAddon;

    if (lensTypeOrAddon && typeof lensTypeOrAddon === 'object') {
      lensAddon = lensTypeOrAddon as LensAddon;
      lensType = lensAddon.name || 'Custom Optical Lenses';
    } else if (typeof lensTypeOrAddon === 'string') {
      lensType = lensTypeOrAddon;
    }

    const isAttachment = Boolean(product.category?.toLowerCase().includes('attachment') || product.category?.toLowerCase().includes('clip'));
    const defaultAddonName = product.category?.toLowerCase().includes('sunglass')
      ? 'Standard Non-Powered Sun Lenses'
      : (product.category?.toLowerCase().includes('eyeglass') || isAttachment ? 'Standard Frame / Demo Lenses' : 'Standard');

    const finalAddon: LensAddon = lensAddon && lensAddon.id ? lensAddon : {
      id: 'none',
      name: defaultAddonName,
      price: 0,
      description: 'Included with frame',
      features: ['Included']
    };

    setCart(prev => {
      const variantId = variant?.id;
      const lensAddonId = finalAddon.id || 'none';
      const existingIdx = prev.findIndex(
        item =>
          item.productId === product.id &&
          item.variantId === variantId &&
          (item.lensAddon?.id || 'none') === lensAddonId
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          variantId,
          variant,
          quantity,
          selectedLensType: lensType,
          lensAddon: finalAddon
        }
      ];
    });

    showToast(`Added ${product.name} to bag`);
    setIsCartOpen(true);

    try {
      trackAddToCart(product, quantity, variant, finalAddon);
    } catch (err) {
      console.warn('trackAddToCart error:', err);
    }
  };

  const updateCartQuantity = (productId: string, variantId: string | undefined, qty: number, lensAddonId?: string) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId, lensAddonId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        const matchesProduct = item.productId === productId && item.variantId === variantId;
        const matchesLens = !lensAddonId || (item.lensAddon?.id || 'none') === lensAddonId;
        if (matchesProduct && matchesLens) {
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantId?: string, lensAddonId?: string) => {
    setCart(prev =>
      prev.filter(item => {
        const matchesProduct = item.productId === productId && item.variantId === variantId;
        const matchesLens = !lensAddonId || (item.lensAddon?.id || 'none') === lensAddonId;
        return !(matchesProduct && matchesLens);
      })
    );
    showToast('Item removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.salePrice + (item.lensAddon?.price || 0)) * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`Saved to your wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Coupon operations
  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }

    const cleanCode = code.trim().toUpperCase();

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, cartSubtotal })
      });

      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        data = null;
      }

      if (res.ok && data && data.code) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          message: data.message
        });
        showToast(data.message);
        return { success: true, message: data.message };
      }

      if (data && data.error) {
        return { success: false, message: data.error };
      }
    } catch (err: any) {
      console.warn('Network request to /api/coupons/apply failed, checking local coupon fallback:', err);
    }

    // Client-side fallback if server is cold starting, offline, or experiencing network timeout
    const localCoupon = initialCoupons.find(c => c && c.code && c.code.toUpperCase() === cleanCode);
    if (localCoupon) {
      if (!localCoupon.isActive) {
        return { success: false, message: 'This coupon is currently inactive' };
      }
      if (new Date(localCoupon.expiryDate) < new Date()) {
        return { success: false, message: 'This coupon has expired' };
      }
      if (cartSubtotal < localCoupon.minOrderValue) {
        return {
          success: false,
          message: `Coupon applies on minimum order value of ₹${localCoupon.minOrderValue.toLocaleString('en-IN')}`
        };
      }

      let discount = 0;
      if (localCoupon.discountType === 'percentage') {
        discount = Math.round((cartSubtotal * localCoupon.discountValue) / 100);
        if (localCoupon.maxDiscount && discount > localCoupon.maxDiscount) {
          discount = localCoupon.maxDiscount;
        }
      } else {
        discount = localCoupon.discountValue;
      }

      const msg = `Coupon ${localCoupon.code} applied! You saved ₹${discount.toLocaleString('en-IN')}`;
      setAppliedCoupon({
        code: localCoupon.code,
        discount,
        message: msg
      });
      showToast(msg);
      return { success: true, message: msg };
    }

    return { success: false, message: 'Invalid coupon code. Try SPECS10 or WELCOME500' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Admin Auth - Secure persistent session across reloads
  const loginAdmin = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    setAdminAuthLoading(false);
    try {
      sessionStorage.setItem('specslook_admin_token', token);
      localStorage.setItem('specslook_admin_token', token);
      if (user) {
        sessionStorage.setItem('specslook_admin_user', JSON.stringify(user));
        localStorage.setItem('specslook_admin_user', JSON.stringify(user));
      }
    } catch {}
    showToast(`Welcome back, ${user.name || 'Admin'}`);
  };

  const logoutAdmin = () => {
    fetch('/api/auth/admin/logout', {
      method: 'POST',
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      credentials: 'include'
    }).catch(console.error);

    setAdminToken(null);
    setAdminUser(null);
    setAdminAuthLoading(false);
    try {
      sessionStorage.removeItem('specslook_admin_token');
      localStorage.removeItem('specslook_admin_token');
      sessionStorage.removeItem('specslook_admin_user');
      localStorage.removeItem('specslook_admin_user');
    } catch {}
    showToast('Logged out of Admin Portal', 'info');
  };

  // Category Mutations (Authoritative sync with server database)
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<Category> => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      },
      credentials: 'include',
      body: JSON.stringify(catData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create category (${res.status})`);
    }
    const created: Category = await res.json();
    setCategories(prev => {
      const next = [...prev, created];
      try { localStorage.setItem('specslook_categories', JSON.stringify(next)); } catch {}
      return next;
    });
    return created;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      },
      credentials: 'include',
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update category (${res.status})`);
    }
    const updated: Category = await res.json();
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? updated : c);
      try { localStorage.setItem('specslook_categories', JSON.stringify(next)); } catch {}
      return next;
    });
    return updated;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      },
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to delete category (${res.status})`);
    }
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      try { localStorage.setItem('specslook_categories', JSON.stringify(next)); } catch {}
      return next;
    });
    return true;
  };

  // Store Mutations (Authoritative sync with server database)
  const addStore = async (storeData: Omit<StoreLocation, 'id'>): Promise<StoreLocation> => {
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      },
      credentials: 'include',
      body: JSON.stringify(storeData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create store (${res.status})`);
    }
    const created: StoreLocation = await res.json();
    setStores(prev => {
      const next = [...prev, created];
      try { localStorage.setItem('specslook_stores', JSON.stringify(next)); } catch {}
      return next;
    });
    return created;
  };

  const updateStore = async (id: string, updates: Partial<StoreLocation>): Promise<StoreLocation | null> => {
    const res = await fetch(`/api/stores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      },
      credentials: 'include',
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update store (${res.status})`);
    }
    const updated: StoreLocation = await res.json();
    setStores(prev => {
      const next = prev.map(s => s.id === id ? updated : s);
      try { localStorage.setItem('specslook_stores', JSON.stringify(next)); } catch {}
      return next;
    });
    return updated;
  };

  const deleteStore = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/stores/${id}`, {
      method: 'DELETE',
      headers: {
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      },
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to delete store (${res.status})`);
    }
    setStores(prev => {
      const next = prev.filter(s => s.id !== id);
      try { localStorage.setItem('specslook_stores', JSON.stringify(next)); } catch {}
      return next;
    });
    return true;
  };

  // Helper to dynamically extract GitHub PAT and Repository from localStorage for Git-based headless store persistence
  const getGitSyncHeaders = (): Record<string, string> => {
    try {
      const pat = localStorage.getItem('specslook_github_pat') || localStorage.getItem('specslook_github_token') || '';
      const repo = localStorage.getItem('specslook_github_repo') || '';
      const headers: Record<string, string> = {};
      if (pat.trim()) headers['x-github-token'] = pat.trim();
      if (repo.trim()) headers['x-github-repo'] = repo.trim();
      return headers;
    } catch {
      return {};
    }
  };

  // Product Mutations (Authoritative sync with server database & direct GitHub REST API)
  const addProduct = async (prodData: Omit<Product, 'id'>): Promise<Product> => {
    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const created: Product = {
      ...prodData,
      id: newId,
      slug: prodData.slug || prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    } as Product;

    // 1. Immediately update state and localStorage so changes persist across reload
    const nextList = [created, ...products.filter(p => p.id !== created.id && p.slug !== created.slug)];
    setProducts(nextList);
    try { localStorage.setItem('specslook_products', JSON.stringify(nextList)); } catch {}
    window.dispatchEvent(new CustomEvent('specslook-products-updated', { detail: nextList }));

    // 2. Direct GitHub sync from client
    try {
      const creds = getStoredGitHubCredentials();
      if (creds?.token && creds?.repo) {
        await syncCatalogToGitHubDirect({
          action: 'create',
          productName: created.name || created.id,
          allProducts: nextList,
          categories,
          stores,
          token: creds.token,
          repo: creds.repo
        });
      }
    } catch (gitErr: any) {
      console.error('GitHub direct commit error on addProduct:', gitErr);
      throw gitErr;
    }

    // 3. Fallback server sync for local / Cloud Run backend
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          ...getGitSyncHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(prodData)
      });
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const serverProd = await res.json().catch(() => null);
          if (serverProd && serverProd.id) {
            setProducts(prev => prev.map(p => p.id === newId ? serverProd : p));
          }
        }
      }
    } catch (serverErr) {
      console.log('Backend sync note on addProduct (expected on static Vercel):', serverErr);
    }

    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    // 1. Immediately update state and localStorage
    let updatedProduct: Product | null = null;
    const nextList = products.map(p => {
      if (p.id === id || p.slug === id) {
        updatedProduct = { ...p, ...updates };
        return updatedProduct;
      }
      return p;
    });

    if (!updatedProduct) {
      updatedProduct = { id, ...updates } as Product;
      nextList.unshift(updatedProduct);
    }

    setProducts(nextList);
    try { localStorage.setItem('specslook_products', JSON.stringify(nextList)); } catch {}
    window.dispatchEvent(new CustomEvent('specslook-products-updated', { detail: nextList }));

    // 2. Direct GitHub sync from client
    try {
      const creds = getStoredGitHubCredentials();
      if (creds?.token && creds?.repo) {
        await syncCatalogToGitHubDirect({
          action: 'update',
          productName: updatedProduct.name || updatedProduct.id,
          allProducts: nextList,
          categories,
          stores,
          token: creds.token,
          repo: creds.repo
        });
      }
    } catch (gitErr: any) {
      console.error('GitHub direct commit error on updateProduct:', gitErr);
      throw gitErr;
    }

    // 3. Fallback server sync for local / Cloud Run backend
    try {
      const cleanId = encodeURIComponent(id);
      const res = await fetch(`/api/products/${cleanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          ...getGitSyncHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const serverProd = await res.json().catch(() => null);
          if (serverProd && serverProd.id) {
            updatedProduct = serverProd;
          }
        }
      }
    } catch (serverErr) {
      console.log('Backend sync note on updateProduct (expected on static Vercel):', serverErr);
    }

    return updatedProduct;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    // 1. Immediately update state and localStorage
    const targetProduct = products.find(p => p.id === id || p.slug === id);
    const nextList = products.filter(p => p.id !== id && p.slug !== id);
    setProducts(nextList);
    try { localStorage.setItem('specslook_products', JSON.stringify(nextList)); } catch {}
    window.dispatchEvent(new CustomEvent('specslook-products-updated', { detail: nextList }));

    // 2. Direct GitHub sync from client
    try {
      const creds = getStoredGitHubCredentials();
      if (creds?.token && creds?.repo) {
        await syncCatalogToGitHubDirect({
          action: 'delete',
          productName: targetProduct?.name || id,
          allProducts: nextList,
          categories,
          stores,
          token: creds.token,
          repo: creds.repo
        });
      }
    } catch (gitErr: any) {
      console.error('GitHub direct commit error on deleteProduct:', gitErr);
      throw gitErr;
    }

    // 3. Fallback server sync for local / Cloud Run backend
    try {
      const cleanId = encodeURIComponent(id);
      await fetch(`/api/products/${cleanId}`, {
        method: 'DELETE',
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          ...getGitSyncHeaders()
        },
        credentials: 'include'
      });
    } catch (serverErr) {
      console.log('Backend sync note on deleteProduct (expected on static Vercel):', serverErr);
    }

    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        viewParams,
        navigateTo,
        products,
        categories,
        stores,
        blogs,
        banners,
        loadingData,
        refreshProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        addStore,
        updateStore,
        deleteStore,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartItemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        lastPlacedOrder,
        setLastPlacedOrder,
        adminToken,
        adminUser,
        adminAuthLoading,
        verifyAdminSession,
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast,
        isTryOnOpen,
        tryOnProduct,
        openTryOn,
        closeTryOn
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
