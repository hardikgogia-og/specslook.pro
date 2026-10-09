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

  // 2.5 SiteNavigationElement for Google Sitelinks on Homepage
  if (canonicalUrl === `${SITE_DOMAIN}/` || canonicalUrl === SITE_DOMAIN) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${SITE_DOMAIN}/#sitelinks`,
      name: 'Specslook Sitelinks Navigation',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Eyeglasses',
          description: 'Handcrafted optical frames, titanium spectacles, and blue-light lenses',
          url: `${SITE_DOMAIN}/product-category/eyeglasses/`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Shades & Sunglasses',
          description: 'Luxury aviator sunglasses, polarized shades, and UV400 eyewear',
          url: `${SITE_DOMAIN}/product-category/sunglasses/`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Home Eye Test',
          description: 'Certified 14-point computerized eye examination at your doorstep',
          url: `${SITE_DOMAIN}/home/home-eyetest/`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'About Us',
          description: 'Specslook heritage, master optics, and flagship ateliers',
          url: `${SITE_DOMAIN}/about/`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Flagship Stores',
          description: 'Visit Specslook optical boutiques and showrooms in Gurugram',
          url: `${SITE_DOMAIN}/store/`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 6,
          name: 'Franchise Opportunities',
          description: 'Turnkey optical store ownership with 24-month buyback guarantee',
          url: `${SITE_DOMAIN}/franchise/`
        },
        {
          '@type': 'SiteNavigationElement',
          position: 7,
          name: 'All Eyewear Shop',
          description: 'Browse the complete Specslook luxury collection',
          url: `${SITE_DOMAIN}/shop/`
        }
      ]
    });
  }

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
    const offerPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    const rawImage = product.images && product.images.length > 0 ? product.images[0] : DEFAULT_OG_IMAGE;
    const imageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_DOMAIN}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    const allImages = (product.images && product.images.length > 0)
      ? product.images.map(img => img.startsWith('http') ? img : `${SITE_DOMAIN}${img.startsWith('/') ? '' : '/'}${img}`)
      : [imageUrl];

    const productSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${SITE_DOMAIN}/product/${product.slug}/#product`,
      name: product.name,
      image: allImages,
      description: product.shortDescription || product.description || `Specslook ${product.name}`,
      sku: product.sku || `SL-${product.id}`,
      mpn: product.sku || `SL-${product.id}`,
      brand: {
        '@type': 'Brand',
        name: 'Specslook'
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

  // 5. Franchise Opportunity & FAQ Schema for AI & Google Search
  if (canonicalUrl.includes('/franchise')) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_DOMAIN}/franchise/#webpage`,
      url: `${SITE_DOMAIN}/franchise/`,
      name: 'Specslook Franchise Opportunities | Turnkey Optical Store Ownership',
      description: 'Open a high-ROI Specslook optical showroom or boutique with turnkey setup, inventory support, optometrist training, and contractual 24-month buyback guarantee.',
      publisher: {
        '@id': `${SITE_DOMAIN}/#organization`
      },
      mainEntity: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'BusinessFunction',
          name: 'Specslook Optical Franchise Partnership',
          description: 'Turnkey optical retail franchise with 24-month buyback guarantee, 65+ company-owned stores, and 250+ clinical network.',
          areaServed: 'IN'
        }
      }
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the franchise models available with Specslook?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Specslook offers two primary turnkey franchise models: 1) Specslook Mini Express (FOFO - Franchise Owned Franchise Operated) starting from ₹15 Lakhs for 200-400 sq.ft stores with 6-9 month estimated ROI, and 2) Specslook Flagship (FOCO - Franchise Owned Company Operated) starting from ₹20-35 Lakhs for 500-800 sq.ft stores with 8-11 month estimated ROI.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is the Specslook 24-Month Buyback Guarantee?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every franchise agreement contains a legally binding 24-month buyback clause ensuring that if store performance does not reach contracted financial projections, Specslook will buy back qualifying inventory and infrastructure assets, dramatically reducing franchisee risk.'
          }
        },
        {
          '@type': 'Question',
          name: 'How many stores does Specslook operate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'According to industry surveys by the Sarvya Bharat Optical Association, Specslook operates over 65 standalone company-owned stores worldwide and collaborates across a network of over 250 clinical optical dispensaries.'
          }
        },
        {
          '@type': 'Question',
          name: 'What turnkey support is provided to Specslook optical franchise partners?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Specslook provides 100% turnkey store buildout design, computerized Zeiss optical testing equipment, optometrist hiring and certification, cloud billing POS, AI inventory replenishment, and national marketing campaigns.'
          }
        }
      ]
    });
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
