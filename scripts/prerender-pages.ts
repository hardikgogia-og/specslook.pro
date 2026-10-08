import fs from 'fs';
import path from 'path';
import { dbService } from '../src/server/db.ts';
import { initialProducts } from '../src/data/seedData.ts';
import { renderProductHtml } from '../src/server/productPrerender.ts';
import { renderFranchiseHtml } from '../src/server/franchisePrerender.ts';

const SITE_DOMAIN = 'https://specslook.com';

interface StaticPageMeta {
  path: string;
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const STATIC_PAGES: StaticPageMeta[] = [
  {
    path: 'about',
    title: 'About Specslook | Heritage Craftsmanship & Master Optics',
    description: 'Learn about Specslook heritage, precision Japanese titanium fabrication, bespoke optical lenses, and our flagship ateliers.',
    canonicalPath: '/about/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about/' }
    ]
  },
  {
    path: 'store',
    title: 'Specslook Flagship Stores & Optical Ateliers | Delhi NCR',
    description: 'Locate Specslook flagship boutiques in Gurugram, Delhi NCR with master optometrists, Zeiss lens fittings, and personal styling.',
    canonicalPath: '/store/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Stores', url: '/store/' }
    ]
  },
  {
    path: 'home/home-eyetest',
    title: 'Specslook Home Eye Test | Certified Optometrist at Doorstep',
    description: 'Book a professional 14-point computerized eye examination at your home or office with 100+ designer frames to try on.',
    canonicalPath: '/home/home-eyetest/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Home Eye Test', url: '/home/home-eyetest/' }
    ]
  },
  {
    path: 'contact-us',
    title: 'Contact Specslook | Concierge Care & Optical Support',
    description: 'Get in touch with Specslook eyewear concierge team for prescription guidance, orders, appointments, and warranty assistance.',
    canonicalPath: '/contact-us/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contact Us', url: '/contact-us/' }
    ]
  },
  {
    path: 'shop',
    title: 'Eyewear Collection & Designer Frames | Specslook',
    description: 'Explore Specslook complete collection of luxury spectacles, designer sunglasses, and clip-on attachments with prescription lenses.',
    canonicalPath: '/shop/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Shop', url: '/shop/' }
    ]
  },
  {
    path: 'blog',
    title: 'Eyewear Journal & Style Guides | Specslook',
    description: 'Read optical guides, eyewear styling advice, sunglasses history, and lens technology insights by Specslook specialists.',
    canonicalPath: '/blog/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Journal', url: '/blog/' }
    ]
  },
  {
    path: 'terms-and-conditions',
    title: 'Terms & Conditions | Specslook',
    description: 'Read the official Terms and Conditions governing eyewear purchases, custom prescription lenses, Home Eye Test appointments, and warranties at Specslook.',
    canonicalPath: '/terms-and-conditions/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Terms and Conditions', url: '/terms-and-conditions/' }
    ]
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy & Data Protection Charter | Specslook',
    description: 'Discover how Specslook protects your personal information, optical prescriptions, and transaction data under Indian data protection regulations.',
    canonicalPath: '/privacy-policy/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy-policy/' }
    ]
  },
  {
    path: 'product-category/eyeglasses',
    title: 'Designer Eyeglasses & Optical Frames | Specslook',
    description: 'Browse handcrafted optical frames, blue-light blocking glasses, and prescription spectacles made with Japanese titanium.',
    canonicalPath: '/product-category/eyeglasses/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Eyeglasses', url: '/product-category/eyeglasses/' }
    ]
  },
  {
    path: 'product-category/sunglasses',
    title: 'Designer Sunglasses & Polarized Shades | Specslook',
    description: 'Shop luxury aviator sunglasses, wayfarers, and hexagonal polarized shades with 100% UV400 protection and glare elimination.',
    canonicalPath: '/product-category/sunglasses/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Sunglasses', url: '/product-category/sunglasses/' }
    ]
  },
  {
    path: 'product-category/eyewear/womeneyewear',
    title: "Women's Eyewear & Designer Frames | Specslook",
    description: "Shop exquisite women's eyeglasses, cat-eye frames, round spectacles, and titanium opticals with prescription lenses.",
    canonicalPath: '/product-category/eyewear/womeneyewear/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Eyewear', url: '/product-category/eyeglasses/' },
      { name: 'Women Eyewear', url: '/product-category/eyewear/womeneyewear/' }
    ]
  },
  {
    path: 'product-category/eyewear/meneyewear',
    title: "Men's Eyewear & Executive Optical Frames | Specslook",
    description: "Shop handcrafted men's spectacles, titanium browlines, and classic rectangular optical frames with anti-reflective lenses.",
    canonicalPath: '/product-category/eyewear/meneyewear/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Eyewear', url: '/product-category/eyeglasses/' },
      { name: 'Men Eyewear', url: '/product-category/eyewear/meneyewear/' }
    ]
  },
  {
    path: 'product-category/eyewear/kidseyewear',
    title: "Kids Eyewear & Flex-TR90 Frames | Specslook",
    description: 'Flexible, shatterproof TR90 optical frames for kids with blue light blocking lenses and hypoallergenic nose pads.',
    canonicalPath: '/product-category/eyewear/kidseyewear/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Eyewear', url: '/product-category/eyeglasses/' },
      { name: 'Kids Eyewear', url: '/product-category/eyewear/kidseyewear/' }
    ]
  },
  {
    path: 'product-category/sunglasses/women',
    title: "Women's Sunglasses & Polarized Shades | Specslook",
    description: "Explore luxury women's sunglasses, oversized glam frames, hexagonal polarized shades, and UV400 optics.",
    canonicalPath: '/product-category/sunglasses/women/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Sunglasses', url: '/product-category/sunglasses/' },
      { name: 'Women Sunglasses', url: '/product-category/sunglasses/women/' }
    ]
  },
  {
    path: 'product-category/sunglasses/men',
    title: "Men's Sunglasses & Polarized Aviators | Specslook",
    description: "Shop men's aviator sunglasses, polarized driving shades, wayfarers, and sports sunglasses with UV400 lenses.",
    canonicalPath: '/product-category/sunglasses/men/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Sunglasses', url: '/product-category/sunglasses/' },
      { name: 'Men Sunglasses', url: '/product-category/sunglasses/men/' }
    ]
  },
  {
    path: 'product-category/sunglasses/kids',
    title: 'Kids Polarized Sunglasses & UV400 Shades | Specslook',
    description: 'Safe, durable, 100% UV400 polarized sunglasses for children with soft-touch rubberized frames and impact-resistant lenses.',
    canonicalPath: '/product-category/sunglasses/kids/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Sunglasses', url: '/product-category/sunglasses/' },
      { name: 'Kids Sunglasses', url: '/product-category/sunglasses/kids/' }
    ]
  },
  {
    path: 'product-category/attachments',
    title: 'Magnetic Clip-On Sunglasses & Eyewear Attachments | Specslook',
    description: 'Explore 6-in-1 magnetic clip-on frames and polarized clip-on attachments for instant transition from prescription to sunglasses.',
    canonicalPath: '/product-category/attachments/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Attachments', url: '/product-category/attachments/' }
    ]
  },
  {
    path: 'product-category/polarized',
    title: 'Polarized Sunglasses & PolarVue Optics | Specslook',
    description: 'Eliminate glare and enhance contrast with patented PolarVue polarized lenses in Japanese titanium and acetate frames.',
    canonicalPath: '/product-category/polarized/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Polarized', url: '/product-category/polarized/' }
    ]
  },
  {
    path: 'product-category/blue-light-blockers',
    title: 'Blue Light Blocking Glasses & Computer Spectacles | Specslook',
    description: 'Protect your eyes from digital screen glare with precision blue light filtering glasses and UV400 coating.',
    canonicalPath: '/product-category/blue-light-blockers/',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Blue Light Blockers', url: '/product-category/blue-light-blockers/' }
    ]
  }
];

function injectPageMeta(baseHtml: string, meta: StaticPageMeta): string {
  let html = baseHtml;
  const canonicalUrl = `${SITE_DOMAIN}${meta.canonicalPath}`;
  const ogImage = `${SITE_DOMAIN}/shop-logopng.png`;

  // 1. Replace <title>
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  } else {
    html = html.replace('</head>', `<title>${meta.title}</title>\n</head>`);
  }

  // 2. Replace <meta name="description">
  const cleanDesc = meta.description.replace(/"/g, '&quot;');
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${cleanDesc}" />`);
  } else {
    html = html.replace('</head>', `<meta name="description" content="${cleanDesc}" />\n</head>`);
  }

  // 3. Replace <link rel="canonical">
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // 4. Update OpenGraph and Twitter tags
  html = html.replace(/<meta\s+property=["']og:(title|description|url|image|type)["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:(title|description|image|card)["'][^>]*>/gi, '');

  const socialMeta = `
    <meta property="og:type" content="${meta.ogType || 'website'}" />
    <meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${cleanDesc}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="Specslook Eyewear" />
    <meta property="og:locale" content="en_IN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${cleanDesc}" />
    <meta name="twitter:image" content="${ogImage}" />
  `;
  html = html.replace('</head>', `${socialMeta}\n</head>`);

  // 5. Breadcrumbs Schema if provided
  if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
    const breadcrumbsJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumbs`,
      itemListElement: meta.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${SITE_DOMAIN}${crumb.url}`
      }))
    };
    const schemaScript = `<script type="application/ld+json" id="specslook-breadcrumbs-schema">\n${JSON.stringify(breadcrumbsJsonLd, null, 2)}\n</script>`;
    html = html.replace('</head>', `${schemaScript}\n</head>`);
  }

  return html;
}

export function prerenderAllPages() {
  const distDir = path.join(process.cwd(), 'dist');
  const distHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(distHtmlPath)) {
    console.warn('[prerenderAllPages] dist/index.html not found! Skipping static prerender.');
    return;
  }

  const baseHtml = fs.readFileSync(distHtmlPath, 'utf8');

  // 1. Prerender Dedicated Franchise Page
  try {
    const franchiseDir = path.join(distDir, 'franchise');
    if (!fs.existsSync(franchiseDir)) fs.mkdirSync(franchiseDir, { recursive: true });
    const franchiseHtml = renderFranchiseHtml(baseHtml);
    fs.writeFileSync(path.join(franchiseDir, 'index.html'), franchiseHtml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'franchise.html'), franchiseHtml, 'utf8');
    console.log('✅ Generated static dist/franchise/index.html and dist/franchise.html');
  } catch (err) {
    console.warn('Franchise prerender error:', err);
  }

  // 2. Prerender Static Pages & Categories
  for (const page of STATIC_PAGES) {
    try {
      const pageDir = path.join(distDir, page.path);
      if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
      const pageHtml = injectPageMeta(baseHtml, page);
      fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf8');
      const parentDir = path.dirname(path.join(distDir, `${page.path}.html`));
      if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
      fs.writeFileSync(path.join(distDir, `${page.path}.html`), pageHtml, 'utf8');
      console.log(`✅ Generated static dist/${page.path}/index.html and .html`);
    } catch (err) {
      console.warn(`Error prerendering static page ${page.path}:`, err);
    }
  }

  // 3. Prerender ALL Products with Schema.org Product+Offer and Canonical URLs
  let products: any[] = [];
  try {
    products = dbService.getProducts();
  } catch {
    products = initialProducts;
  }
  if (!Array.isArray(products) || products.length === 0) {
    products = initialProducts;
  }

  let prerenderedProductCount = 0;
  const productBaseDir = path.join(distDir, 'product');
  if (!fs.existsSync(productBaseDir)) fs.mkdirSync(productBaseDir, { recursive: true });

  for (const product of products) {
    if (!product || !product.slug) continue;
    try {
      const productDir = path.join(productBaseDir, product.slug);
      if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });
      const productHtml = renderProductHtml(baseHtml, product);
      fs.writeFileSync(path.join(productDir, 'index.html'), productHtml, 'utf8');
      fs.writeFileSync(path.join(productBaseDir, `${product.slug}.html`), productHtml, 'utf8');
      prerenderedProductCount++;
    } catch (prodErr) {
      console.warn(`Error prerendering product ${product.slug}:`, prodErr);
    }
  }

  console.log(`✅ Generated static HTML for ${prerenderedProductCount} products in dist/product/{slug}/index.html & .html with full Product Schema JSON-LD & Canonical tags!`);
}

if (process.argv[1] && process.argv[1].includes('prerender-pages')) {
  prerenderAllPages();
}
