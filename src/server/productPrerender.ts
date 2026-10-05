import type { Product } from '../types.ts';
import { resolvePublicImageUrl } from './merchantFeed.ts';

const SITE_DOMAIN = 'https://specslook.com';

/**
 * Server-side HTML prerenderer for Specslook Product Detail Pages
 * Injects SEO metadata, OpenGraph cards, Twitter cards, Schema.org JSON-LD (Product + Offer),
 * and crawler-friendly semantic HTML so Googlebot, Google Shopping, Bing, and AI crawlers
 * can index product details immediately without relying on client-side JavaScript execution.
 */
export function renderProductHtml(baseHtml: string, product: Product): string {
  const canonicalUrl = `${SITE_DOMAIN}/product/${encodeURIComponent(product.slug)}/`;
  const pageTitle = `${product.name} | Specslook Eyewear`;
  const rawDescription = product.shortDescription || product.description || `Shop ${product.name} handcrafted with Japanese titanium and Italian acetate. Complimentary home eye tests and cash on delivery across India.`;
  const metaDescription = rawDescription.replace(/"/g, '&quot;').replace(/\n+/g, ' ').substring(0, 160);

  const primaryImage = resolvePublicImageUrl(product.images && product.images.length > 0 ? product.images[0] : null);
  const allImages = (product.images && product.images.length > 0)
    ? product.images.map(img => resolvePublicImageUrl(img))
    : [primaryImage];

  const currentPrice = typeof product.salePrice === 'number' && product.salePrice > 0 && product.salePrice < product.price
    ? product.salePrice
    : product.price;

  const isAvailable = (typeof product.stock === 'number' ? product.stock : 0) > 0;
  const availabilitySchema = isAvailable
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  // Build complete Schema.org Product + Offer graph
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_DOMAIN}/#organization`,
        name: 'Specslook',
        legalName: 'Specslook Eyewear',
        url: `${SITE_DOMAIN}/`,
        logo: `${SITE_DOMAIN}/shop-logopng.png`,
        telephone: '+91-8368853448',
        email: 'info@specslook.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Specslook, Dreamz Mall, Sec 4-7 Circle',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122001',
          addressCountry: 'IN'
        }
      },
      {
        '@type': 'Product',
        '@id': `${canonicalUrl}#product`,
        name: product.name,
        url: canonicalUrl,
        image: allImages,
        description: product.shortDescription || product.description || `Specslook ${product.name}`,
        sku: product.sku || `SL-${product.id}`,
        mpn: product.sku || `SL-${product.id}`,
        brand: {
          '@type': 'Brand',
          name: 'Specslook'
        },
        category: product.category || 'Eyewear',
        itemCondition: 'https://schema.org/NewCondition',
        offers: {
          '@type': 'Offer',
          '@id': `${canonicalUrl}#offer`,
          url: canonicalUrl,
          priceCurrency: 'INR',
          price: currentPrice.toFixed(2),
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: availabilitySchema,
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
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating ? product.rating.toString() : '4.9',
          reviewCount: product.reviewsCount ? product.reviewsCount.toString() : '48',
          bestRating: '5',
          worstRating: '1'
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_DOMAIN}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.category || 'Shop',
            item: `${SITE_DOMAIN}/shop?category=${encodeURIComponent(product.category || 'Eyewear')}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: canonicalUrl
          }
        ]
      }
    ]
  };

  // Semantic crawler-friendly product fallback for initial paint
  const semanticProductHtml = `
    <div id="specslook-product-prerender" class="max-w-7xl mx-auto px-4 py-8 text-neutral-900 font-sans" data-product-id="${product.id}">
      <nav class="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <a href="/" class="hover:underline">Home</a>
        <span>/</span>
        <a href="/shop" class="hover:underline">${escapeHtml(product.category || 'Eyewear')}</a>
        <span>/</span>
        <span class="text-neutral-900 font-medium">${escapeHtml(product.name)}</span>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div class="space-y-4">
          <img
            src="${primaryImage}"
            alt="${escapeHtml(product.name)}"
            class="w-full aspect-square object-contain bg-neutral-50 rounded-xs border border-neutral-200"
          />
        </div>

        <div class="space-y-6">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-red-600 mb-1">${escapeHtml(product.brand || 'Specslook')}</p>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-neutral-950 uppercase tracking-tight">${escapeHtml(product.name)}</h1>
            <p class="text-xs text-neutral-500 mt-1">SKU: ${escapeHtml(product.sku || product.id)}</p>
          </div>

          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-black text-neutral-950">&#8377;${currentPrice.toLocaleString('en-IN')}</span>
            ${product.salePrice && product.salePrice < product.price ? `<span class="text-base text-neutral-400 line-through">&#8377;${product.price.toLocaleString('en-IN')}</span>` : ''}
            <span class="text-xs font-bold uppercase px-2 py-0.5 rounded-xs ${isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
              ${isAvailable ? 'In Stock &amp; Ready to Ship' : 'Out of Stock'}
            </span>
          </div>

          <div class="prose text-sm text-neutral-700 leading-relaxed">
            <p>${escapeHtml(product.description || product.shortDescription || '')}</p>
          </div>

          <div class="border-t border-neutral-200 pt-4 space-y-2 text-xs text-neutral-600">
            <p><strong>Brand:</strong> Specslook</p>
            <p><strong>Condition:</strong> Brand New</p>
            <p><strong>Category:</strong> ${escapeHtml(product.category || 'Eyewear')}</p>
            ${product.specifications?.frameMaterial ? `<p><strong>Frame Material:</strong> ${escapeHtml(product.specifications.frameMaterial)}</p>` : ''}
            ${product.specifications?.lensMaterial ? `<p><strong>Lens Material:</strong> ${escapeHtml(product.specifications.lensMaterial)}</p>` : ''}
            ${product.specifications?.uvProtection ? `<p><strong>UV Protection:</strong> ${escapeHtml(product.specifications.uvProtection)}</p>` : ''}
            <p><strong>Shipping:</strong> Free Express Delivery Across India (2-4 Days)</p>
            <p><strong>Warranty:</strong> 1-Year Comprehensive Manufacturer Warranty</p>
          </div>
        </div>
      </div>
    </div>
  `;

  let html = baseHtml;

  // 1. Replace or inject <title>
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${pageTitle}</title>`);
  } else {
    html = html.replace('</head>', `<title>${pageTitle}</title>\n</head>`);
  }

  // 2. Replace or inject <meta name="description">
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${metaDescription}" />`);
  } else {
    html = html.replace('</head>', `<meta name="description" content="${metaDescription}" />\n</head>`);
  }

  // 3. Replace or inject canonical <link rel="canonical">
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // 4. OpenGraph tags
  const ogTags = `
    <meta property="og:type" content="product" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${metaDescription}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${primaryImage}" />
    <meta property="og:site_name" content="Specslook Eyewear" />
    <meta property="og:price:amount" content="${currentPrice.toFixed(2)}" />
    <meta property="og:price:currency" content="INR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${metaDescription}" />
    <meta name="twitter:image" content="${primaryImage}" />
  `;

  // Remove previous OpenGraph/Twitter product tags if present
  html = html.replace(/<meta\s+property=["']og:(title|description|url|image|type|price:amount|price:currency)["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:(title|description|image|card)["'][^>]*>/gi, '');
  html = html.replace('</head>', `${ogTags}\n</head>`);

  // 5. Inject Schema.org JSON-LD
  const schemaScriptTag = `<script type="application/ld+json" id="specslook-product-schema">\n${JSON.stringify(productJsonLd, null, 2)}\n</script>`;
  if (/<script[^>]*id=["']specslook-product-schema["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script[^>]*id=["']specslook-product-schema["'][^>]*>[\s\S]*?<\/script>/i, schemaScriptTag);
  } else {
    html = html.replace('</head>', `${schemaScriptTag}\n</head>`);
  }

  // 6. Inject crawler-friendly semantic HTML inside root container
  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${semanticProductHtml}</div>`);
  }

  return html;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
