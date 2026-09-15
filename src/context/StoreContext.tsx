import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, Coupon, StoreLocation, BlogPost, Banner, ProductVariant, LensAddon } from '../types.ts';
import {
  initialProducts,
  initialCategories,
  initialStores,
  initialBlogs,
  initialBanners
} from '../data/seedData.ts';

export type AppView =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'account'
  | 'about'
  | 'stores'
  | 'contact'
  | 'blog'
  | 'blog-post'
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

  // Admin Auth
  adminToken: string | null;
  adminUser: any | null;
  loginAdmin: (token: string, user: any) => void;
  logoutAdmin: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  // Data initialized with fallback seed data for instant Vercel/offline reliability
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialCategories;
  });

  const [stores, setStores] = useState<StoreLocation[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_stores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialStores;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('specslook_blogs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialBlogs;
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

  // Coupon & Orders
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Admin Auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('specslook_admin_token');
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('specslook_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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

  // Fetch initial data with resilient fallback
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [pRes, cRes, sRes, bRes, bnRes] = await Promise.allSettled([
        fetch('/api/products').then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        }),
        fetch('/api/categories').then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        }),
        fetch('/api/stores').then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        }),
        fetch('/api/blogs').then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        }),
        fetch('/api/banners').then(async r => {
          if (!r.ok) return null;
          const data = await r.json();
          return Array.isArray(data) ? data : null;
        })
      ]);

      if (pRes.status === 'fulfilled' && pRes.value && pRes.value.length > 0) {
        setProducts(pRes.value);
        try { localStorage.setItem('specslook_products', JSON.stringify(pRes.value)); } catch {}
      }
      if (cRes.status === 'fulfilled' && cRes.value && cRes.value.length > 0) {
        setCategories(cRes.value);
        try { localStorage.setItem('specslook_categories', JSON.stringify(cRes.value)); } catch {}
      }
      if (sRes.status === 'fulfilled' && sRes.value && sRes.value.length > 0) {
        setStores(sRes.value);
        try { localStorage.setItem('specslook_stores', JSON.stringify(sRes.value)); } catch {}
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
    fetchData();

    // Check URL pathname, search query, and hash for seamless client-side routing
    const syncRouteFromUrl = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      const hash = window.location.hash.replace('#', '').replace(/\/+$/, '');
      const search = new URLSearchParams(window.location.search);

      // 1. Admin route: /admin or #admin
      if (path === '/admin' || hash === 'admin' || search.get('view') === 'admin') {
        setCurrentView('admin');
        setViewParams({});
        return;
      }

      // 2. Product route: /product/:slug or /products/:slug or ?product=:slug
      const productMatch = path.match(/^\/(?:product|products)\/([^/]+)/i);
      const hashProductMatch = hash.match(/^(?:product|products)\/([^/]+)/i);
      const productSlugOrId = productMatch?.[1] || hashProductMatch?.[1] || search.get('product') || search.get('slug') || search.get('id');
      if (productSlugOrId) {
        setCurrentView('product');
        setViewParams({ slug: decodeURIComponent(productSlugOrId), id: decodeURIComponent(productSlugOrId) });
        return;
      }

      // 3. Shop route: /shop, /catalog, #shop
      if (path === '/shop' || path === '/catalog' || hash === 'shop' || search.get('view') === 'shop') {
        const category = search.get('category') || undefined;
        setCurrentView('shop');
        setViewParams(category ? { category } : {});
        return;
      }

      // 4. Stores route: /stores or #stores
      if (path === '/stores' || hash === 'stores' || search.get('view') === 'stores') {
        setCurrentView('stores');
        setViewParams({});
        return;
      }

      // 5. Static & auxiliary pages
      if (path === '/about' || hash === 'about') {
        setCurrentView('about');
        setViewParams({});
        return;
      }
      if (path === '/contact' || hash === 'contact') {
        setCurrentView('contact');
        setViewParams({});
        return;
      }
      if (path === '/blog' || hash === 'blog') {
        setCurrentView('blog');
        setViewParams({});
        return;
      }
      if (path === '/checkout' || path === '/cart' || hash === 'checkout') {
        setCurrentView('checkout');
        setViewParams({});
        return;
      }
      if (path === '/tracking' || hash === 'tracking') {
        setCurrentView('tracking');
        setViewParams({});
        return;
      }
      if (path === '/account' || hash === 'account') {
        setCurrentView('account');
        setViewParams({});
        return;
      }

      // Default home
      if (path === '/' || path === '') {
        setCurrentView('home');
        setViewParams({});
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

    // Synchronize browser URL bar for shareable links and clean navigation
    let targetUrl = '/';
    if (view === 'admin') {
      targetUrl = '/admin';
    } else if (view === 'product') {
      const slugOrId = params.slug || params.id || '';
      targetUrl = slugOrId ? `/product/${encodeURIComponent(slugOrId)}` : '/shop';
    } else if (view === 'shop') {
      targetUrl = params.category ? `/shop?category=${encodeURIComponent(params.category)}` : '/shop';
    } else if (view === 'stores') {
      targetUrl = '/stores';
    } else if (view === 'about') {
      targetUrl = '/about';
    } else if (view === 'contact') {
      targetUrl = '/contact';
    } else if (view === 'blog') {
      targetUrl = '/blog';
    } else if (view === 'checkout') {
      targetUrl = '/checkout';
    } else if (view === 'tracking') {
      targetUrl = '/tracking';
    } else if (view === 'account') {
      targetUrl = '/account';
    } else {
      targetUrl = '/';
    }

    try {
      if (window.location.pathname !== targetUrl && window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ view, params }, '', targetUrl);
      }
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
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to apply coupon' };
      }

      setAppliedCoupon({
        code: data.code,
        discount: data.discount,
        message: data.message
      });
      showToast(data.message);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: 'Network error verifying coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Admin Auth
  const loginAdmin = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    try {
      localStorage.setItem('specslook_admin_token', token);
      localStorage.setItem('specslook_admin_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome back, ${user.name || 'Admin'}`);
  };

  const logoutAdmin = () => {
    if (adminToken) {
      fetch('/api/auth/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }).catch(console.error);
    }
    setAdminToken(null);
    setAdminUser(null);
    try {
      localStorage.removeItem('specslook_admin_token');
      localStorage.removeItem('specslook_admin_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Logged out of Admin Portal', 'info');
  };

  // Category Mutations (Syncs with server when online, persists locally)
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<Category> => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now().toString(36)}`
    };
    try {
      if (adminToken) {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify(catData)
        });
        if (res.ok) {
          const created = await res.json();
          setCategories(prev => {
            const next = [...prev, created];
            try { localStorage.setItem('specslook_categories', JSON.stringify(next)); } catch {}
            return next;
          });
          return created;
        }
      }
    } catch {
      console.warn('Category saved locally (offline sync)');
    }
    setCategories(prev => {
      const next = [...prev, newCat];
      try { localStorage.setItem('specslook_categories', JSON.stringify(next)); } catch {}
      return next;
    });
    return newCat;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    try {
      if (adminToken) {
        await fetch(`/api/categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify(updates)
        });
      }
    } catch {
      console.warn('Category updated locally (offline sync)');
    }
    let updated: Category | null = null;
    setCategories(prev => {
      const next = prev.map(c => {
        if (c.id === id) {
          updated = { ...c, ...updates };
          return updated;
        }
        return c;
      });
      try { localStorage.setItem('specslook_categories', JSON.stringify(next)); } catch {}
      return next;
    });
    return updated;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      if (adminToken) {
        await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      }
    } catch {
      console.warn('Category deleted locally (offline sync)');
    }
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      try { localStorage.setItem('specslook_categories', JSON.stringify(next)); } catch {}
      return next;
    });
    return true;
  };

  // Store Mutations (Syncs with server when online, persists locally)
  const addStore = async (storeData: Omit<StoreLocation, 'id'>): Promise<StoreLocation> => {
    const newStore: StoreLocation = {
      ...storeData,
      id: `store-${Date.now().toString(36)}`
    };
    try {
      if (adminToken) {
        const res = await fetch('/api/stores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify(storeData)
        });
        if (res.ok) {
          const created = await res.json();
          setStores(prev => {
            const next = [...prev, created];
            try { localStorage.setItem('specslook_stores', JSON.stringify(next)); } catch {}
            return next;
          });
          return created;
        }
      }
    } catch {
      console.warn('Store saved locally (offline sync)');
    }
    setStores(prev => {
      const next = [...prev, newStore];
      try { localStorage.setItem('specslook_stores', JSON.stringify(next)); } catch {}
      return next;
    });
    return newStore;
  };

  const updateStore = async (id: string, updates: Partial<StoreLocation>): Promise<StoreLocation | null> => {
    try {
      if (adminToken) {
        await fetch(`/api/stores/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify(updates)
        });
      }
    } catch {
      console.warn('Store updated locally (offline sync)');
    }
    let updated: StoreLocation | null = null;
    setStores(prev => {
      const next = prev.map(s => {
        if (s.id === id) {
          updated = { ...s, ...updates };
          return updated;
        }
        return s;
      });
      try { localStorage.setItem('specslook_stores', JSON.stringify(next)); } catch {}
      return next;
    });
    return updated;
  };

  const deleteStore = async (id: string): Promise<boolean> => {
    try {
      if (adminToken) {
        await fetch(`/api/stores/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      }
    } catch {
      console.warn('Store deleted locally (offline sync)');
    }
    setStores(prev => {
      const next = prev.filter(s => s.id !== id);
      try { localStorage.setItem('specslook_stores', JSON.stringify(next)); } catch {}
      return next;
    });
    return true;
  };

  // Product Mutations (Syncs with server when online, persists locally)
  const addProduct = async (prodData: Omit<Product, 'id'>): Promise<Product> => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now().toString(36)}`
    };
    try {
      if (adminToken) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify(prodData)
        });
        if (res.ok) {
          const created = await res.json();
          setProducts(prev => {
            const next = [created, ...prev];
            try { localStorage.setItem('specslook_products', JSON.stringify(next)); } catch {}
            return next;
          });
          return created;
        }
      }
    } catch {
      console.warn('Product saved locally (offline sync)');
    }
    setProducts(prev => {
      const next = [newProd, ...prev];
      try { localStorage.setItem('specslook_products', JSON.stringify(next)); } catch {}
      return next;
    });
    return newProd;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      if (adminToken) {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify(updates)
        });
      }
    } catch {
      console.warn('Product updated locally (offline sync)');
    }
    let updated: Product | null = null;
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          updated = { ...p, ...updates };
          return updated;
        }
        return p;
      });
      try { localStorage.setItem('specslook_products', JSON.stringify(next)); } catch {}
      return next;
    });
    return updated;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      if (adminToken) {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      }
    } catch {
      console.warn('Product deleted locally (offline sync)');
    }
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      try { localStorage.setItem('specslook_products', JSON.stringify(next)); } catch {}
      return next;
    });
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
        refreshProducts: fetchData,
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
        loginAdmin,
        logoutAdmin,
        toasts,
        showToast
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
