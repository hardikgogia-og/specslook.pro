import fs from 'fs';
import path from 'path';
import { dbService } from '../src/server/db.ts';
import { generateMerchantFeedXml } from '../src/server/merchantFeed.ts';

function run() {
  const products = dbService.getProducts();
  const today = new Date().toISOString().split('T')[0];

  // 1. Google Merchant Center Feed XML
  const feedXml = generateMerchantFeedXml(products);

  // 2. Dynamic XML Sitemap
  const staticUrls = [
    { loc: 'https://specslook.com/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://specslook.com/shop/', priority: '0.95', changefreq: 'daily' },
    { loc: 'https://specslook.com/about/', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://specslook.com/store/', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://specslook.com/franchise/', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://specslook.com/home/home-eyetest/', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://specslook.com/contact-us/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://specslook.com/blog/', priority: '0.75', changefreq: 'weekly' },
    { loc: 'https://specslook.com/terms-and-conditions/', priority: '0.6', changefreq: 'monthly' },
    { loc: 'https://specslook.com/privacy-policy/', priority: '0.6', changefreq: 'monthly' },
    { loc: 'https://specslook.com/product-category/eyeglasses/', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/eyewear/womeneyewear/', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/eyewear/meneyewear/', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/eyewear/kidseyewear/', priority: '0.85', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/sunglasses/', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/sunglasses/women/', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/sunglasses/men/', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/sunglasses/kids/', priority: '0.85', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/attachments/', priority: '0.85', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/polarized/', priority: '0.85', changefreq: 'daily' },
    { loc: 'https://specslook.com/product-category/blue-light-blockers/', priority: '0.85', changefreq: 'daily' }
  ];

  const productUrls = products
    .filter(p => p.slug && p.name)
    .map(p => ({
      loc: `https://specslook.com/product/${encodeURIComponent(p.slug)}/`,
      lastmod: p.createdAt ? p.createdAt.split('T')[0] : today,
      changefreq: 'weekly',
      priority: '0.85'
    }));

  const blogUrls = [
    { loc: 'https://specslook.com/blog/the-legendary-aviator-style-history/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://specslook.com/blog/polarized-vs-non-polarized-eyewear-guide/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://specslook.com/blog/how-to-choose-frames-for-your-face-shape/', priority: '0.7', changefreq: 'monthly' }
  ];

  const allUrls = [...staticUrls, ...productUrls, ...blogUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${(u as any).lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Target folders
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // Write to public/
  fs.writeFileSync(path.join(publicDir, 'merchant-feed.xml'), feedXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');

  // Write to dist/ if it exists
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'merchant-feed.xml'), feedXml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  }

  console.log(`✅ Generated merchant-feed.xml (${feedXml.length} bytes, ${products.length} products)`);
  console.log(`✅ Generated sitemap.xml (${sitemapXml.length} bytes, ${allUrls.length} URLs)`);
}

run();
