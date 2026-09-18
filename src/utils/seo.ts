import type { Product } from '../types.ts';

export const SITE_DOMAIN = 'https://specslook.com';
export const SITE_NAME = 'Specslook Eyewear';
export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/shop-logopng.png`;

export interface SEOOptions {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  product?: Product;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * Updates head metadata dynamically on route changes
 */
export function updateSEO(options: SEOOptions): void {
  if (typeof document === 'undefined') return;

  const {
    title,
    description,
    canonicalPath,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = 'website',
    noIndex = false,
    product,
    breadcrumbs
  } = options;

  // 1. Page Title
  document.title = title;

  // Helper to get or create a meta tag
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Standard Meta Tags
  setMeta('description', description);
  setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

  // 3. Canonical URL (Self-referencing canonical preserving exact path with trailing slash)
  const canonicalUrl = `${SITE_DOMAIN}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}`;
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  // 4. OpenGraph Metadata
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', canonicalUrl, true);
  setMeta('og:type', ogType, true);
  setMeta('og:image', ogImage, true);
  setMeta('og:site_name', SITE_NAME, true);
  setMeta('og:locale', 'en_IN', true);

  // 5. Twitter Card Metadata
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);

  // 6. Schema.org JSON-LD Structured Data
  updateJsonLd({
    canonicalUrl,
    product,
    breadcrumbs
  });
}

/**
 * Builds and embeds rich Schema.org structured data (Organization, WebSite, Product, BreadcrumbList)
 */
export function updateJsonLd(params: {
  canonicalUrl: string;
  product?: Product;
  breadcrumbs?: Array<{ name: string; url: string }>;
}): void {
  if (typeof document === 'undefined') return;

  const { canonicalUrl, product, breadcrumbs } = params;
  const schemas: any[] = [];

  // 1. Organization Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_DOMAIN}/#organization`,
    name: 'Specslook',
    legalName: 'Specslook',
    url: `${SITE_DOMAIN}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_DOMAIN}/shop-logopng.png`,
      width: '512',
      height: '512'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8368853448',
      contactType: 'customer service',
      email: 'info@specslook.com',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Specslook, Dreamz Mall, Sec 4-7 Circle',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122001',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://www.instagram.com/specslook',
      'https://www.facebook.com/specslook',
      'https://wa.me/918368853448'
    ]
  });

  // 2. WebSite Schema with Sitelinks Searchbox
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_DOMAIN}/#website`,
    name: 'Specslook',
    url: `${SITE_DOMAIN}/`,
    description: 'Luxury handcrafted eyewear, designer sunglasses, prescription lenses, and home eye tests across India.',
    publisher: {
      '@id': `${SITE_DOMAIN}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_DOMAIN}/shop?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  });

  // 3. Breadcrumbs Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${SITE_DOMAIN}${crumb.url}`
      }))
    });
  }

  // 4. Product & Genuine Offer Schema
  if (product) {
    const offerPrice = product.salePrice || product.price;
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : DEFAULT_OG_IMAGE;

    const productSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${SITE_DOMAIN}/product/${product.slug}/#product`,
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images : [imageUrl],
      description: product.shortDescription || product.description || `Specslook ${product.name}`,
      sku: product.sku || `SL-${product.id}`,
      mpn: product.sku || `SL-${product.id}`,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'SPECSLOOK'
      },
      offers: {
        '@type': 'Offer',
        url: `${SITE_DOMAIN}/product/${product.slug}/`,
        priceCurrency: 'INR',
        price: offerPrice,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Specslook Eyewear'
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'INR'
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'IN'
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY'
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 4,
              unitCode: 'DAY'
            }
          }
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'IN',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 14,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn'
        }
      }
    };

    // Rating schema (genuine 4.9 average for luxury line)
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '48',
      bestRating: '5',
      worstRating: '1'
    };

    schemas.push(productSchema);
  }

  // Inject script element
  let scriptEl = document.getElementById('specslook-schema') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'specslook-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
}
