import type { Product } from '../types.ts';
import { resolvePublicImageUrl } from './merchantFeed.ts';

const SITE_DOMAIN = 'https://specslook.com';
const LOGO_URL = `${SITE_DOMAIN}/shop-logopng.png`;

export interface CategoryPageConfig {
  categoryKey: string;
  slug: string;
  canonicalPath: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  breadcrumbName: string;
  filterFn: (p: Product) => boolean;
}

export const CATEGORY_CONFIGS: Record<string, CategoryPageConfig> = {
  eyeglasses: {
    categoryKey: 'eyeglasses',
    slug: 'eyeglasses',
    canonicalPath: '/product-category/eyeglasses/',
    title: 'Designer Eyeglasses & Optical Frames | Specslook',
    description: 'Shop handcrafted luxury eyeglasses, Japanese titanium frames, cat-eye spectacles, and blue-light lenses for men, women, and kids with doorstep eye test.',
    h1: 'Handcrafted Eyeglasses & Precision Optical Frames',
    intro: 'Engineered for exceptional clarity and featherlight comfort. Explore bespoke optical frames crafted with aerospace-grade Japanese titanium, Italian acetate, and anti-reflective blue-light protection.',
    breadcrumbName: 'Eyeglasses',
    filterFn: (p: Product) => p.category?.toLowerCase() === 'eyeglasses'
  },
  sunglasses: {
    categoryKey: 'sunglasses',
    slug: 'sunglasses',
    canonicalPath: '/product-category/sunglasses/',
    title: 'Designer Sunglasses, Polarized Shades & Aviators | Specslook',
    description: 'Explore luxury aviator sunglasses, classic wayfarers, and hexagonal polarized shades with 100% UV400 protection. Premium frames with doorstep home try-on.',
    h1: 'Designer Sunglasses & Polarized Shades',
    intro: 'Iconic silhouettes engineered with PolarVue™ polarized lenses and 100% UV400 protection. From timeless aviators to bold wayfarers, discover luxury sunglasses built to stand out in the sun.',
    breadcrumbName: 'Shades & Sunglasses',
    filterFn: (p: Product) => p.category?.toLowerCase() === 'sunglasses'
  },
  'eyewear-men': {
    categoryKey: 'eyewear-men',
    slug: 'eyewear/meneyewear',
    canonicalPath: '/product-category/eyewear/meneyewear/',
    title: "Men's Eyeglasses & Executive Optical Frames | Specslook",
    description: "Shop handcrafted men's spectacles, titanium browlines, and classic rectangular optical frames with prescription lenses and home eye testing.",
    h1: "Men's Designer Eyeglasses & Executive Frames",
    intro: "Distinguished eyewear crafted for modern professionals. Explore ultralight titanium, classic wayfarer, and browline silhouettes.",
    breadcrumbName: "Men's Eyeglasses",
    filterFn: (p: Product) => p.category?.toLowerCase() === 'eyeglasses' && (p.specifications?.gender === 'Men' || p.specifications?.gender === 'Unisex')
  },
  'eyewear-women': {
    categoryKey: 'eyewear-women',
    slug: 'eyewear/womeneyewear',
    canonicalPath: '/product-category/eyewear/womeneyewear/',
    title: "Women's Eyewear & Designer Frames | Specslook",
    description: "Shop exquisite women's eyeglasses, cat-eye frames, round spectacles, and champagne crystal opticals with premium prescription lenses.",
    h1: "Women's Designer Eyeglasses & Fashion Frames",
    intro: "Refined, featherweight optical frames designed to flatter every face shape. Featuring feminine cat-eye, champagne crystal, and rose gold accents.",
    breadcrumbName: "Women's Eyeglasses",
    filterFn: (p: Product) => p.category?.toLowerCase() === 'eyeglasses' && (p.specifications?.gender === 'Women' || p.specifications?.gender === 'Unisex')
  },
  'eyewear-kids': {
    categoryKey: 'eyewear-kids',
    slug: 'eyewear/kidseyewear',
    canonicalPath: '/product-category/eyewear/kidseyewear/',
    title: "Kids' Eyeglasses & Flexible TR90 Frames | Specslook",
    description: "Shop shatterproof kids' spectacles, flexible TR90 study glasses, and blue-light screen protective eyeglasses with anti-slip silicone ear-grips.",
    h1: "Kids' Flexible Eyeglasses & Study Frames",
    intro: "Bendy, unbreakable TR90 optical frames built for active young learners with certified blue-light filter lenses.",
    breadcrumbName: "Kids' Eyeglasses",
    filterFn: (p: Product) => p.category?.toLowerCase() === 'eyeglasses' && p.specifications?.gender === 'Kids'
  },
  'sunglasses-men': {
    categoryKey: 'sunglasses-men',
    slug: 'sunglasses/men',
    canonicalPath: '/product-category/sunglasses/men/',
    title: "Men's Sunglasses & Polarized Aviator Shades | Specslook",
    description: "Shop masculine aviator sunglasses, square shades, matte black wayfarers, and polarized driving glasses with UV400 defense.",
    h1: "Men's Polarized Sunglasses & Pilot Shades",
    intro: "Engineered for road, sky, and sea. Rugged polarized lenses with anti-glare coatings and timeless masculine styling.",
    breadcrumbName: "Men's Sunglasses",
    filterFn: (p: Product) => p.category?.toLowerCase() === 'sunglasses' && (p.specifications?.gender === 'Men' || p.specifications?.gender === 'Unisex')
  },
  'sunglasses-women': {
    categoryKey: 'sunglasses-women',
    slug: 'sunglasses/women',
    canonicalPath: '/product-category/sunglasses/women/',
    title: "Women's Sunglasses & Glamour Butterfly Shades | Specslook",
    description: "Shop oversized butterfly sunglasses, hexagonal rose gold shades, and gradient polarized women's eyewear with 100% UV400 protection.",
    h1: "Women's Designer Sunglasses & Fashion Shades",
    intro: "Statement sunglasses crafted with luxury metalwork, gradient tint lenses, and glamorous oversized profiles.",
    breadcrumbName: "Women's Sunglasses",
    filterFn: (p: Product) => p.category?.toLowerCase() === 'sunglasses' && (p.specifications?.gender === 'Women' || p.specifications?.gender === 'Unisex')
  },
  'sunglasses-kids': {
    categoryKey: 'sunglasses-kids',
    slug: 'sunglasses/kids',
    canonicalPath: '/product-category/sunglasses/kids/',
    title: "Kids' Sunglasses & UV400 Beach Shades | Specslook",
    description: "Shop shatterproof polarized sunglasses for children, junior aviator shades, and colorful beach wayfarers with full UV400 eye safety.",
    h1: "Kids' UV400 Polarized Sunglasses",
    intro: "Certified 100% UV protection and glare elimination for developing eyes in impact-resistant, kid-friendly materials.",
    breadcrumbName: "Kids' Sunglasses",
    filterFn: (p: Product) => p.category?.toLowerCase() === 'sunglasses' && p.specifications?.gender === 'Kids'
  },
  attachments: {
    categoryKey: 'attachments',
    slug: 'attachments',
    canonicalPath: '/product-category/attachments/',
    title: 'Magnetic Clip-On Eyeglasses & Polarized Attachments | Specslook',
    description: 'Explore 6-in-1 magnetic clip-on frames and polarized clip-on sunglass attachments for optical eyeglasses. Convert clear frames into dark sunglasses instantly.',
    h1: 'Magnetic Clip-On Glasses & Optical Attachments',
    intro: 'Innovative 2-in-1 and 6-in-1 optical frames featuring seamless magnetic polarized attachments for instant sunglass transformation.',
    breadcrumbName: 'Attachments & Clip-Ons',
    filterFn: (p: Product) => p.category?.toLowerCase() === 'attachments' || p.name.toLowerCase().includes('clip-on')
  },
  polarized: {
    categoryKey: 'polarized',
    slug: 'polarized',
    canonicalPath: '/product-category/polarized/',
    title: 'Polarized Sunglasses & Glare-Free Optics | Specslook',
    description: 'Shop PolarVue™ high-definition polarized sunglasses. Eliminate reflective surface glare from water, snow, and asphalt with 100% UV400 filters.',
    h1: 'PolarVue™ High-Definition Polarized Shades',
    intro: 'Precision multi-layer polarized lenses that neutralize horizontal glare while enhancing natural contrast and color clarity.',
    breadcrumbName: 'Polarized Shades',
    filterFn: (p: Product) => (p.category?.toLowerCase() === 'sunglasses' && (p.name.toLowerCase().includes('polar') || p.description.toLowerCase().includes('polar'))) || p.slug.includes('polar')
  }
};

/**
 * Replace HTML head tags (Title, Description, Canonical, OpenGraph, Twitter, Schema) cleanly
 */
function replaceHeadMetadata(
  baseHtml: string,
  meta: {
    title: string;
    description: string;
    canonicalUrl: string;
    jsonLd: any;
    ogImage?: string;
  }
): string {
  let html = baseHtml;
  const ogImg = meta.ogImage || `${SITE_DOMAIN}/shop-logopng.png`;

  // 1. Title
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  } else {
    html = html.replace('</head>', `<title>${meta.title}</title>\n</head>`);
  }

  // 2. Description
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${meta.description}" />`);
  } else {
    html = html.replace('</head>', `<meta name="description" content="${meta.description}" />\n</head>`);
  }

  // 3. Canonical
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${meta.canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${meta.canonicalUrl}" />\n</head>`);
  }

  // 4. OpenGraph
  if (/<meta\s+property=["']og:title["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${meta.title}" />`);
  }
  if (/<meta\s+property=["']og:description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${meta.description}" />`);
  }
  if (/<meta\s+property=["']og:url["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${meta.canonicalUrl}" />`);
  }
  if (/<meta\s+property=["']og:image["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${ogImg}" />`);
  }

  // 5. Twitter Card
  if (/<meta\s+name=["']twitter:title["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${meta.title}" />`);
  }
  if (/<meta\s+name=["']twitter:description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${meta.description}" />`);
  }
  if (/<meta\s+name=["']twitter:image["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${ogImg}" />`);
  }

  // 6. Schema JSON-LD
  const scriptTag = `<script type="application/ld+json" id="specslook-schema">\n${JSON.stringify(meta.jsonLd, null, 2)}\n</script>`;
  if (/<script[^>]*id=["']specslook-schema["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script[^>]*id=["']specslook-schema["'][^>]*>[\s\S]*?<\/script>/i, scriptTag);
  } else {
    html = html.replace('</head>', `${scriptTag}\n</head>`);
  }

  return html;
}

/**
 * Prerender Homepage with SiteNavigationElement schema for Google Sitelinks
 */
export function renderHomeHtml(baseHtml: string, products: Product[]): string {
  const canonicalUrl = `${SITE_DOMAIN}/`;
  const pageTitle = 'Specslook | Premium Luxury Eyewear, Sunglasses & Shades';
  const pageDesc = 'Discover handcrafted luxury eyewear, Japanese titanium frames, designer sunglasses, polarized shades, and computerized home eye testing across India.';

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_DOMAIN}/#organization`,
        name: 'Specslook',
        legalName: 'Specslook Eyewear',
        url: canonicalUrl,
        logo: LOGO_URL,
        telephone: '+91-8368853448',
        email: 'info@specslook.com',
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
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_DOMAIN}/#website`,
        name: 'Specslook',
        url: canonicalUrl,
        description: pageDesc,
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
      },
      // Google Sitelinks Navigation Schema
      {
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
            description: 'Visit Specslook optical boutiques and styling showrooms in Gurugram',
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
      }
    ]
  };

  const eyeglassesSample = products.filter(p => p.category?.toLowerCase() === 'eyeglasses').slice(0, 4);
  const sunglassesSample = products.filter(p => p.category?.toLowerCase() === 'sunglasses').slice(0, 4);

  const semanticHomeContent = `
    <div id="specslook-home-prerender" class="max-w-7xl mx-auto px-4 py-8 text-neutral-900 font-sans">
      <!-- Top Site Header & Navigation Bar -->
      <nav class="border-b border-neutral-200 pb-4 mb-8 flex flex-wrap items-center justify-between gap-4" aria-label="Main Navigation">
        <a href="/" class="text-2xl font-black tracking-tight text-neutral-950 uppercase flex items-center gap-2">
          <img src="/shop-logopng.png" alt="Specslook Eyewear Logo" width="140" height="36" class="h-9 w-auto inline-block" />
          <span>Specslook</span>
        </a>
        <div class="flex flex-wrap items-center gap-4 text-xs font-bold tracking-wider uppercase text-neutral-800">
          <a href="/" class="text-red-600 hover:text-red-700">Home</a>
          <a href="/product-category/eyeglasses/" class="hover:text-red-600">Eyeglasses</a>
          <a href="/product-category/sunglasses/" class="hover:text-red-600">Shades &amp; Sunglasses</a>
          <a href="/product-category/attachments/" class="hover:text-red-600">Clip-On Attachments</a>
          <a href="/home/home-eyetest/" class="hover:text-red-600">Home Eye Test</a>
          <a href="/store/" class="hover:text-red-600">Stores</a>
          <a href="/about/" class="hover:text-red-600">About Us</a>
          <a href="/franchise/" class="hover:text-red-600 text-amber-700">Franchise</a>
        </div>
      </nav>

      <!-- Hero Header Section -->
      <header class="text-center py-10 bg-neutral-100 rounded-sm mb-12 px-4">
        <p class="text-xs font-black uppercase text-red-600 tracking-widest mb-2">Master Optics &bull; Handcrafted Eyewear</p>
        <h1 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 mb-4">Specslook Luxury Eyewear, Sunglasses &amp; Shades</h1>
        <p class="text-base sm:text-lg text-neutral-700 max-w-3xl mx-auto mb-6">
          Handcrafted with Japanese titanium and Italian Mazzucchelli acetate. Book a computerized 14-point home eye exam or explore iconic polarized sunglasses across India.
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase">
          <a href="/product-category/eyeglasses/" class="bg-neutral-950 text-white px-6 py-3 rounded-xs hover:bg-neutral-800 transition-colors">Shop Eyeglasses</a>
          <a href="/product-category/sunglasses/" class="bg-red-600 text-white px-6 py-3 rounded-xs hover:bg-red-700 transition-colors">Shop Shades &amp; Sunglasses</a>
          <a href="/home/home-eyetest/" class="bg-white text-neutral-900 border border-neutral-300 px-6 py-3 rounded-xs hover:border-neutral-900 transition-colors">Book Home Eye Test</a>
        </div>
      </header>

      <!-- Primary Categories Navigation Grid -->
      <section class="mb-14" aria-labelledby="featured-categories-heading">
        <h2 id="featured-categories-heading" class="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950 mb-6 text-center">Explore By Eyewear Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <a href="/product-category/eyeglasses/" class="p-6 border border-neutral-200 rounded-sm hover:border-red-600 transition-all bg-white group">
            <h3 class="font-bold text-neutral-950 group-hover:text-red-600 uppercase text-sm mb-1">Eyeglasses</h3>
            <p class="text-xs text-neutral-500">Prescription frames &amp; titanium optics</p>
          </a>
          <a href="/product-category/sunglasses/" class="p-6 border border-neutral-200 rounded-sm hover:border-red-600 transition-all bg-white group">
            <h3 class="font-bold text-neutral-950 group-hover:text-red-600 uppercase text-sm mb-1">Shades &amp; Sunglasses</h3>
            <p class="text-xs text-neutral-500">Polarized aviators &amp; wayfarers</p>
          </a>
          <a href="/product-category/attachments/" class="p-6 border border-neutral-200 rounded-sm hover:border-red-600 transition-all bg-white group">
            <h3 class="font-bold text-neutral-950 group-hover:text-red-600 uppercase text-sm mb-1">Clip-On Attachments</h3>
            <p class="text-xs text-neutral-500">Magnetic 6-in-1 sunglass clips</p>
          </a>
          <a href="/home/home-eyetest/" class="p-6 border border-red-200 bg-red-50/40 rounded-sm hover:border-red-600 transition-all group">
            <h3 class="font-bold text-red-700 uppercase text-sm mb-1">Home Eye Test</h3>
            <p class="text-xs text-neutral-600">14-point exam at your doorstep</p>
          </a>
        </div>
      </section>

      <!-- Featured Eyeglasses Showcase -->
      <section class="mb-14" aria-labelledby="eyeglasses-showcase-heading">
        <div class="flex items-center justify-between mb-6">
          <h2 id="eyeglasses-showcase-heading" class="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">Featured Eyeglasses</h2>
          <a href="/product-category/eyeglasses/" class="text-xs font-bold text-red-600 hover:underline uppercase">View All Eyeglasses &rarr;</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          ${eyeglassesSample.map(p => `
            <article class="border border-neutral-200 rounded-sm p-4 bg-white flex flex-col justify-between">
              <a href="/product/${encodeURIComponent(p.slug)}/">
                <img src="${resolvePublicImageUrl(p.images?.[0] || null)}" alt="${p.name}" width="300" height="200" class="w-full h-44 object-contain mb-3 bg-neutral-50 rounded-xs" loading="lazy" />
                <h3 class="font-bold text-sm text-neutral-900 hover:text-red-600 line-clamp-1 mb-1">${p.name}</h3>
              </a>
              <p class="text-xs text-neutral-500 line-clamp-2 mb-3">${p.shortDescription || p.description}</p>
              <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span class="font-black text-sm text-neutral-950">&#8377;${(p.salePrice || p.price).toFixed(2)}</span>
                <a href="/product/${encodeURIComponent(p.slug)}/" class="text-[11px] font-bold text-red-600 uppercase hover:underline">View Specs &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Featured Sunglasses & Shades Showcase -->
      <section class="mb-14" aria-labelledby="sunglasses-showcase-heading">
        <div class="flex items-center justify-between mb-6">
          <h2 id="sunglasses-showcase-heading" class="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950">Featured Shades &amp; Sunglasses</h2>
          <a href="/product-category/sunglasses/" class="text-xs font-bold text-red-600 hover:underline uppercase">View All Shades &rarr;</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          ${sunglassesSample.map(p => `
            <article class="border border-neutral-200 rounded-sm p-4 bg-white flex flex-col justify-between">
              <a href="/product/${encodeURIComponent(p.slug)}/">
                <img src="${resolvePublicImageUrl(p.images?.[0] || null)}" alt="${p.name}" width="300" height="200" class="w-full h-44 object-contain mb-3 bg-neutral-50 rounded-xs" loading="lazy" />
                <h3 class="font-bold text-sm text-neutral-900 hover:text-red-600 line-clamp-1 mb-1">${p.name}</h3>
              </a>
              <p class="text-xs text-neutral-500 line-clamp-2 mb-3">${p.shortDescription || p.description}</p>
              <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
                <span class="font-black text-sm text-neutral-950">&#8377;${(p.salePrice || p.price).toFixed(2)}</span>
                <a href="/product/${encodeURIComponent(p.slug)}/" class="text-[11px] font-bold text-red-600 uppercase hover:underline">Explore Shades &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Site Footer Navigation -->
      <footer class="mt-14 pt-8 border-t border-neutral-200 text-xs text-neutral-600">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 class="font-bold uppercase text-neutral-900 mb-2">Eyewear Catalog</h4>
            <ul class="space-y-1">
              <li><a href="/product-category/eyeglasses/" class="hover:text-red-600">All Eyeglasses</a></li>
              <li><a href="/product-category/eyewear/meneyewear/" class="hover:text-red-600">Men's Optical</a></li>
              <li><a href="/product-category/eyewear/womeneyewear/" class="hover:text-red-600">Women's Eyeglasses</a></li>
              <li><a href="/product-category/eyewear/kidseyewear/" class="hover:text-red-600">Kids' Frames</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold uppercase text-neutral-900 mb-2">Shades &amp; Sun</h4>
            <ul class="space-y-1">
              <li><a href="/product-category/sunglasses/" class="hover:text-red-600">All Sunglasses</a></li>
              <li><a href="/product-category/sunglasses/men/" class="hover:text-red-600">Men's Shades</a></li>
              <li><a href="/product-category/sunglasses/women/" class="hover:text-red-600">Women's Shades</a></li>
              <li><a href="/product-category/polarized/" class="hover:text-red-600">PolarVue™ Polarized</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold uppercase text-neutral-900 mb-2">Services</h4>
            <ul class="space-y-1">
              <li><a href="/home/home-eyetest/" class="hover:text-red-600">Home Eye Test</a></li>
              <li><a href="/store/" class="hover:text-red-600">Flagship Boutiques</a></li>
              <li><a href="/franchise/" class="hover:text-red-600">Franchise Program</a></li>
              <li><a href="/blog/" class="hover:text-red-600">Eyewear Journal</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold uppercase text-neutral-900 mb-2">Specslook Ateliers</h4>
            <p>Dreamz Mall, Sec 4-7 Circle, Gurugram, Haryana 122001</p>
            <p class="mt-1">Phone: +91 83688 53448</p>
            <p>Email: info@specslook.com</p>
          </div>
        </div>
        <p class="text-center text-neutral-500 pt-4 border-t border-neutral-100">&copy; 2026 Specslook Eyewear. All rights reserved.</p>
      </footer>
    </div>
  `;

  let html = replaceHeadMetadata(baseHtml, {
    title: pageTitle,
    description: pageDesc,
    canonicalUrl,
    jsonLd: homeJsonLd
  });

  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${semanticHomeContent}</div>`);
  }

  return html;
}

/**
 * Prerender Category Pages (Eyeglasses, Sunglasses/Shades, Subcategories)
 */
export function renderCategoryHtml(baseHtml: string, config: CategoryPageConfig, allProducts: Product[]): string {
  const categoryProducts = allProducts.filter(config.filterFn);
  const canonicalUrl = `${SITE_DOMAIN}${config.canonicalPath}`;

  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_DOMAIN}/#organization`,
        name: 'Specslook',
        url: `${SITE_DOMAIN}/`,
        logo: LOGO_URL
      },
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        url: canonicalUrl,
        name: config.title,
        description: config.description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_DOMAIN}/#website`,
          name: 'Specslook',
          url: `${SITE_DOMAIN}/`
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
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
              name: config.breadcrumbName,
              item: canonicalUrl
            }
          ]
        },
        mainEntity: {
          '@type': 'ItemList',
          name: config.h1,
          numberOfItems: categoryProducts.length,
          itemListElement: categoryProducts.map((p, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_DOMAIN}/product/${encodeURIComponent(p.slug)}/`,
            name: p.name,
            image: resolvePublicImageUrl(p.images?.[0] || null)
          }))
        }
      }
    ]
  };

  const semanticCategoryContent = `
    <div id="specslook-category-prerender" class="max-w-7xl mx-auto px-4 py-8 text-neutral-900 font-sans">
      <!-- Breadcrumbs -->
      <nav class="text-xs text-neutral-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
        <a href="/" class="hover:text-red-600">Home</a>
        <span>&bull;</span>
        <span class="text-neutral-900 font-semibold">${config.breadcrumbName}</span>
      </nav>

      <!-- Category Header -->
      <header class="mb-10 text-center sm:text-left border-b border-neutral-200 pb-8">
        <p class="text-xs font-black uppercase text-red-600 tracking-widest mb-1.5">Specslook Collection</p>
        <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 mb-3">${config.h1}</h1>
        <p class="text-sm sm:text-base text-neutral-600 max-w-3xl">${config.intro}</p>
        <div class="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span class="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-xs">${categoryProducts.length} Premium Designs</span>
          <span class="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-xs">Free Insured Shipping</span>
          <span class="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-xs">Doorstep Try-On Available</span>
        </div>
      </header>

      <!-- Product Catalog Grid -->
      <section aria-label="${config.breadcrumbName} Products">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${categoryProducts.map(p => {
            const price = p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
            const originalPrice = p.salePrice && p.salePrice < p.price ? p.price : null;
            const imgUrl = resolvePublicImageUrl(p.images?.[0] || null);
            return `
              <article class="border border-neutral-200 rounded-sm p-4 bg-white flex flex-col justify-between hover:border-neutral-400 transition-colors">
                <a href="/product/${encodeURIComponent(p.slug)}/" class="block">
                  <div class="w-full h-48 bg-neutral-50 rounded-xs mb-3 flex items-center justify-center overflow-hidden">
                    <img src="${imgUrl}" alt="${p.name}" width="320" height="220" class="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                  <div class="text-[10px] font-bold uppercase text-red-600 tracking-wider mb-1">${p.specifications?.gender || p.category}</div>
                  <h2 class="font-bold text-sm text-neutral-900 hover:text-red-600 line-clamp-1 mb-1.5">${p.name}</h2>
                </a>
                <p class="text-xs text-neutral-500 line-clamp-2 mb-4">${p.shortDescription || p.description}</p>
                <div class="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span class="font-black text-sm text-neutral-950">&#8377;${price.toFixed(2)}</span>
                    ${originalPrice ? `<span class="text-xs text-neutral-400 line-through ml-2">&#8377;${originalPrice.toFixed(2)}</span>` : ''}
                  </div>
                  <a href="/product/${encodeURIComponent(p.slug)}/" class="text-xs font-bold text-red-600 hover:underline uppercase">View Details &rarr;</a>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Additional Navigation Links for Crawlers -->
      <section class="mt-14 pt-8 border-t border-neutral-200">
        <h3 class="text-sm font-bold uppercase text-neutral-900 mb-3">Explore Related Eyewear Categories</h3>
        <div class="flex flex-wrap gap-2 text-xs">
          <a href="/product-category/eyeglasses/" class="px-3 py-1.5 border border-neutral-200 hover:border-red-600 rounded-xs">All Eyeglasses</a>
          <a href="/product-category/sunglasses/" class="px-3 py-1.5 border border-neutral-200 hover:border-red-600 rounded-xs">Shades &amp; Sunglasses</a>
          <a href="/product-category/eyewear/meneyewear/" class="px-3 py-1.5 border border-neutral-200 hover:border-red-600 rounded-xs">Men's Eyeglasses</a>
          <a href="/product-category/eyewear/womeneyewear/" class="px-3 py-1.5 border border-neutral-200 hover:border-red-600 rounded-xs">Women's Eyeglasses</a>
          <a href="/product-category/sunglasses/men/" class="px-3 py-1.5 border border-neutral-200 hover:border-red-600 rounded-xs">Men's Sunglasses</a>
          <a href="/product-category/sunglasses/women/" class="px-3 py-1.5 border border-neutral-200 hover:border-red-600 rounded-xs">Women's Sunglasses</a>
          <a href="/product-category/polarized/" class="px-3 py-1.5 border border-neutral-200 hover:border-red-600 rounded-xs">PolarVue™ Polarized</a>
          <a href="/home/home-eyetest/" class="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 rounded-xs">Book Home Eye Test</a>
        </div>
      </section>
    </div>
  `;

  let html = replaceHeadMetadata(baseHtml, {
    title: config.title,
    description: config.description,
    canonicalUrl,
    jsonLd: categoryJsonLd
  });

  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${semanticCategoryContent}</div>`);
  }

  return html;
}

/**
 * Prerender Key Content Pages (About, Home Eye Test, Stores, Contact, Shop)
 */
export function renderStaticPageHtml(baseHtml: string, pageKey: 'about' | 'home-eyetest' | 'stores' | 'contact' | 'shop', allProducts: Product[]): string {
  let title = 'Specslook | Luxury Eyewear & Sunglasses';
  let description = 'Handcrafted luxury optical frames and designer sunglasses with doorstep home eye test.';
  let canonicalPath = '/';
  let h1 = 'Specslook Eyewear';
  let content = '';

  if (pageKey === 'about') {
    title = 'About Specslook | Heritage Craftsmanship & Master Optics';
    description = 'Learn about Specslook heritage, precision Japanese titanium fabrication, bespoke optical lenses, and our flagship ateliers.';
    canonicalPath = '/about/';
    h1 = 'Specslook Heritage & Optical Mastery';
    content = `
      <p class="text-base text-neutral-700 leading-relaxed mb-6">
        Founded on the principle that luxury vision care should unite timeless aesthetics with uncompromising optical precision, Specslook crafts architectural frames from Japanese titanium and Italian Mazzucchelli acetate.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 text-sm">
        <div class="border border-neutral-200 p-5 rounded-xs">
          <h3 class="font-bold text-neutral-900 mb-2">Japanese Beta-Titanium</h3>
          <p class="text-neutral-600">Featherweight durability, hypoallergenic skin contact, and memory-flex temples.</p>
        </div>
        <div class="border border-neutral-200 p-5 rounded-xs">
          <h3 class="font-bold text-neutral-900 mb-2">Zeiss Vision Partnership</h3>
          <p class="text-neutral-600">Every prescription lens is computerized and verified with certified optical diagnostics.</p>
        </div>
        <div class="border border-neutral-200 p-5 rounded-xs">
          <h3 class="font-bold text-neutral-900 mb-2">Doorstep Service</h3>
          <p class="text-neutral-600">14-point computerized eye exams delivered to your home or office with 100+ frames to try.</p>
        </div>
      </div>
    `;
  } else if (pageKey === 'home-eyetest') {
    title = 'Specslook Home Eye Test | Certified Optometrist at Doorstep';
    description = 'Book a professional 14-point computerized eye examination at your home or office with 100+ designer frames to try on across Delhi NCR.';
    canonicalPath = '/home/home-eyetest/';
    h1 = 'Doorstep 14-Point Computerized Home Eye Test';
    content = `
      <p class="text-base text-neutral-700 leading-relaxed mb-6">
        Experience hospital-grade eye examinations in the comfort of your living room. Our certified senior optometrists arrive with portable digital refractometers, trial lens kits, and over 100 designer frames.
      </p>
      <div class="bg-neutral-100 p-6 rounded-xs my-8 text-sm space-y-3">
        <h3 class="font-bold text-neutral-950 uppercase text-xs">Included In Your Home Eye Examination:</h3>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-700">
          <li>Digital auto-refraction vision measurement</li>
          <li>Astigmatism and cylindrical power alignment</li>
          <li>Near vision &amp; digital blue-light screen fatigue check</li>
          <li>100+ luxury titanium and acetate frames brought directly to you</li>
          <li>Instant prescription generation with digital optometrist stamp</li>
        </ul>
      </div>
    `;
  } else if (pageKey === 'stores') {
    title = 'Specslook Flagship Stores & Optical Ateliers | Delhi NCR';
    description = 'Locate Specslook flagship boutiques in Gurugram, Delhi NCR with master optometrists, Zeiss lens fittings, and personal styling.';
    canonicalPath = '/store/';
    h1 = 'Specslook Flagship Boutiques & Optical Ateliers';
    content = `
      <p class="text-base text-neutral-700 leading-relaxed mb-6">
        Visit our luxury optical ateliers in Gurugram, Delhi NCR for bespoke frame styling, precision pupil distance measurement, and walk-in clinical examinations.
      </p>
      <div class="border border-neutral-200 p-6 rounded-xs my-6 bg-white">
        <h3 class="font-bold text-lg text-neutral-950 mb-1">Gurugram Flagship Boutique</h3>
        <p class="text-sm text-neutral-600 mb-2">Specslook, Dreamz Mall, Sec 4-7 Circle, Gurugram, Haryana 122001</p>
        <p class="text-xs text-neutral-500">Phone: +91 83688 53448 &bull; Hours: 10:30 AM - 9:30 PM (Daily)</p>
      </div>
    `;
  } else if (pageKey === 'contact') {
    title = 'Contact Specslook | Concierge Care & Optical Support';
    description = 'Get in touch with Specslook eyewear concierge team for prescription guidance, orders, appointments, and warranty assistance.';
    canonicalPath = '/contact-us/';
    h1 = 'Specslook Concierge Optical Care';
    content = `
      <p class="text-base text-neutral-700 leading-relaxed mb-6">
        Reach our optical stylists and customer support specialists for prescription questions, order tracking, and store appointments.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-sm">
        <div class="border border-neutral-200 p-5 rounded-xs">
          <h3 class="font-bold text-neutral-900 mb-1">WhatsApp &amp; Phone Support</h3>
          <p class="text-neutral-700">+91 83688 53448</p>
        </div>
        <div class="border border-neutral-200 p-5 rounded-xs">
          <h3 class="font-bold text-neutral-900 mb-1">Email Concierge</h3>
          <p class="text-neutral-700">info@specslook.com</p>
        </div>
      </div>
    `;
  } else if (pageKey === 'shop') {
    title = 'Shop All Eyewear, Sunglasses & Frames | Specslook';
    description = 'Explore the complete Specslook collection of handcrafted eyeglasses, polarized shades, aviators, and magnetic clip-on frames.';
    canonicalPath = '/shop/';
    h1 = 'Specslook Complete Eyewear Collection';
    content = `
      <p class="text-base text-neutral-700 leading-relaxed mb-8">
        Browse our full catalog of ${allProducts.length} precision-crafted spectacles, designer shades, and optical accessories.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        ${allProducts.slice(0, 8).map(p => `
          <article class="border border-neutral-200 rounded-sm p-4 bg-white">
            <a href="/product/${encodeURIComponent(p.slug)}/">
              <img src="${resolvePublicImageUrl(p.images?.[0] || null)}" alt="${p.name}" width="280" height="180" class="w-full h-36 object-contain mb-2" loading="lazy" />
              <h3 class="font-bold text-xs text-neutral-900 line-clamp-1">${p.name}</h3>
              <p class="font-black text-xs text-neutral-950 mt-1">&#8377;${(p.salePrice || p.price).toFixed(2)}</p>
            </a>
          </article>
        `).join('')}
      </div>
    `;
  }

  const canonicalUrl = `${SITE_DOMAIN}${canonicalPath}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_DOMAIN}/#organization`,
        name: 'Specslook',
        url: `${SITE_DOMAIN}/`,
        logo: LOGO_URL
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_DOMAIN}/#website`,
          name: 'Specslook',
          url: `${SITE_DOMAIN}/`
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
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
              name: h1,
              item: canonicalUrl
            }
          ]
        }
      }
    ]
  };

  const semanticHtml = `
    <div id="specslook-static-prerender" class="max-w-5xl mx-auto px-4 py-12 text-neutral-900 font-sans">
      <nav class="text-xs text-neutral-500 mb-6 flex items-center gap-2">
        <a href="/" class="hover:text-red-600">Home</a>
        <span>&bull;</span>
        <span class="text-neutral-900 font-semibold">${h1}</span>
      </nav>
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 mb-3">${h1}</h1>
      </header>
      <main>${content}</main>
      <footer class="mt-14 pt-8 border-t border-neutral-200 text-xs text-neutral-600">
        <div class="flex flex-wrap gap-4 font-bold uppercase">
          <a href="/" class="hover:text-red-600">Home</a>
          <a href="/product-category/eyeglasses/" class="hover:text-red-600">Eyeglasses</a>
          <a href="/product-category/sunglasses/" class="hover:text-red-600">Shades &amp; Sunglasses</a>
          <a href="/home/home-eyetest/" class="hover:text-red-600">Home Eye Test</a>
          <a href="/about/" class="hover:text-red-600">About Us</a>
        </div>
      </footer>
    </div>
  `;

  let html = replaceHeadMetadata(baseHtml, {
    title,
    description,
    canonicalUrl,
    jsonLd
  });

  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${semanticHtml}</div>`);
  }

  return html;
}
