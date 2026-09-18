import type { Product, CartItem, Order, ProductVariant, LensAddon } from '../types.ts';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// Retrieve Measurement ID from Vite env, window config, or process env
export function getGaMeasurementId(): string | null {
  try {
    const fromEnv = (import.meta.env?.NEXT_PUBLIC_GA_MEASUREMENT_ID as string) ||
                    (import.meta.env?.VITE_GA_MEASUREMENT_ID as string) ||
                    ((window as any)?.__ENV__?.NEXT_PUBLIC_GA_MEASUREMENT_ID as string);
    return fromEnv?.trim() ? fromEnv.trim() : null;
  } catch {
    return null;
  }
}

// Retrieve Meta Pixel ID from Vite env, window config, or process env
export function getMetaPixelId(): string | null {
  try {
    const fromEnv = (import.meta.env?.NEXT_PUBLIC_META_PIXEL_ID as string) ||
                    (import.meta.env?.VITE_META_PIXEL_ID as string) ||
                    ((window as any)?.__ENV__?.NEXT_PUBLIC_META_PIXEL_ID as string);
    return fromEnv?.trim() ? fromEnv.trim() : null;
  } catch {
    return null;
  }
}

let isGaInitialized = false;
let isPixelInitialized = false;

/**
 * Dynamically initialize Google Analytics 4 and Meta Pixel if IDs are configured.
 * If IDs are empty or missing, this is a clean no-op and does not throw or interfere with normal execution.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics 4
  const gaId = getGaMeasurementId();
  if (gaId && !isGaInitialized) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        send_page_view: false, // We manually send page_views on route sync
        currency: 'INR'
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);
      isGaInitialized = true;
    } catch {
      // Silently catch any initialization error to prevent breaking UI
    }
  }

  // 2. Meta Pixel
  const pixelId = getMetaPixelId();
  if (pixelId && !isPixelInitialized) {
    try {
      if (!window.fbq) {
        const n: any = (window.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        });
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const first = document.getElementsByTagName('script')[0];
        first?.parentNode?.insertBefore(script, first);
      }
      window.fbq?.('init', pixelId);
      isPixelInitialized = true;
    } catch {
      // Silently catch any initialization error to prevent breaking UI
    }
  }
}

/**
 * Track Page Views across Google Analytics and Meta Pixel
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;

  try {
    if (isGaInitialized && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: path
      });
    }

    if (isPixelInitialized && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  } catch {
    // Fail silently
  }
}

/**
 * Track Product View (ViewContent)
 */
export function trackViewContent(product: Product): void {
  if (typeof window === 'undefined' || !product) return;

  try {
    const price = product.salePrice || product.price;

    // GA4 view_item
    if (isGaInitialized && typeof window.gtag === 'function') {
      window.gtag('event', 'view_item', {
        currency: 'INR',
        value: price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_brand: product.brand || 'SPECSLOOK',
            item_category: product.category,
            item_category2: product.subcategory || undefined,
            price: price,
            quantity: 1
          }
        ]
      });
    }

    // Meta Pixel ViewContent
    if (isPixelInitialized && typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id, product.slug],
        content_type: 'product',
        value: price,
        currency: 'INR'
      });
    }
  } catch {
    // Fail silently
  }
}

/**
 * Track Add to Cart (AddToCart)
 */
export function trackAddToCart(
  product: Product,
  quantity: number = 1,
  variant?: ProductVariant,
  lensAddon?: LensAddon
): void {
  if (typeof window === 'undefined' || !product) return;

  try {
    const basePrice = product.salePrice || product.price;
    const addonPrice = lensAddon?.price || 0;
    const unitPrice = basePrice + addonPrice;
    const totalValue = unitPrice * quantity;

    // GA4 add_to_cart
    if (isGaInitialized && typeof window.gtag === 'function') {
      window.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: totalValue,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_brand: product.brand || 'SPECSLOOK',
            item_category: product.category,
            item_variant: variant?.colorName || undefined,
            price: unitPrice,
            quantity: quantity
          }
        ]
      });
    }

    // Meta Pixel AddToCart
    if (isPixelInitialized && typeof window.fbq === 'function') {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id, product.slug],
        content_type: 'product',
        value: totalValue,
        currency: 'INR',
        num_items: quantity
      });
    }
  } catch {
    // Fail silently
  }
}

/**
 * Track Initiate Checkout (InitiateCheckout)
 */
export function trackInitiateCheckout(items: CartItem[], total: number, couponCode?: string): void {
  if (typeof window === 'undefined') return;

  try {
    // GA4 begin_checkout
    if (isGaInitialized && typeof window.gtag === 'function') {
      window.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: total,
        coupon: couponCode || undefined,
        items: items.map(item => ({
          item_id: item.product.id,
          item_name: item.product.name,
          item_brand: item.product.brand || 'SPECSLOOK',
          item_category: item.product.category,
          item_variant: item.variant?.colorName || undefined,
          price: (item.product.salePrice || item.product.price) + (item.lensAddon?.price || 0),
          quantity: item.quantity
        }))
      });
    }

    // Meta Pixel InitiateCheckout
    if (isPixelInitialized && typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map(i => i.product.id),
        content_type: 'product',
        value: total,
        currency: 'INR',
        num_items: items.reduce((sum, i) => sum + i.quantity, 0)
      });
    }
  } catch {
    // Fail silently
  }
}

/**
 * Track Purchase (Purchase)
 */
export function trackPurchase(order: Order): void {
  if (typeof window === 'undefined' || !order) return;

  try {
    const totalValue = order.total || 0;

    // GA4 purchase
    if (isGaInitialized && typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        value: totalValue,
        currency: 'INR',
        shipping: order.shippingFee || 0,
        coupon: order.couponCode || undefined,
        items: order.items.map(item => ({
          item_id: item.productId,
          item_name: item.productName,
          item_brand: 'SPECSLOOK',
          item_variant: item.variantName || undefined,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }

    // Meta Pixel Purchase
    if (isPixelInitialized && typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_ids: order.items.map(i => i.productId),
        content_type: 'product',
        value: totalValue,
        currency: 'INR',
        num_items: order.items.reduce((sum, i) => sum + i.quantity, 0)
      });
    }
  } catch {
    // Fail silently
  }
}
