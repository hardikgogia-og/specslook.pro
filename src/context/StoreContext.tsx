import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, Coupon, StoreLocation, BlogPost, Banner, ProductVariant, LensAddon } from '../types.ts';

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

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

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

  // Fetch initial data
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [pRes, cRes, sRes, bRes, bnRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/stores'),
        fetch('/api/blogs'),
        fetch('/api/banners')
      ]);

      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      if (sRes.ok) setStores(await sRes.json());
      if (bRes.ok) setBlogs(await bRes.json());
      if (bnRes.ok) setBanners(await bnRes.json());
    } catch (err) {
      console.error('Error fetching store data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Check URL pathname and hash for /admin
    const syncRouteFromUrl = () => {
      const path = window.location.pathname.replace(/\/+$/, '');
      const hash = window.location.hash.replace('#', '');
      if (path === '/admin' || hash === 'admin') {
        setCurrentView('admin');
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
    if (view === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
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
