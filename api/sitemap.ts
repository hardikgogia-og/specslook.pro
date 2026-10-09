import fs from 'fs';
import path from 'path';
import { dbService } from '../src/server/db.ts';
import { initialProducts } from '../src/data/seedData.ts';

function sendXmlResponse(res: any, xml: string) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
  res.setHeader('X-Robots-Tag', 'all');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = 200;
  if (typeof res.status === 'function') {
    res.status(200);
  }
  if (typeof res.send === 'function') {
    return res.send(xml);
  }
  return res.end(xml);
}

export default function handler(req: any, res: any) {
  try {
    let products: any[] = [];
    try {
      products = dbService.getProducts();
    } catch (dbErr) {
      console.warn('[sitemap] dbService error, falling back to seedData:', dbErr);
    }

    if (!Array.isArray(products) || products.length === 0) {
      products = initialProducts;
    }

    const today = new Date().toISOString().split('T')[0];

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
      .filter((p: any) => p && p.slug && p.name)
      .map((p: any) => ({
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

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${(u as any).lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sendXmlResponse(res, xml);
  } catch (err: any) {
    console.error('Error generating dynamic sitemap on Vercel:', err);

    // Fallback to static sitemap on disk
    try {
      const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');
      const distPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
      const targetPath = fs.existsSync(publicPath) ? publicPath : (fs.existsSync(distPath) ? distPath : null);
      if (targetPath) {
        const fileContent = fs.readFileSync(targetPath, 'utf8');
        return sendXmlResponse(res, fileContent);
      }
    } catch (diskErr) {
      console.warn('Fallback disk read failed for sitemap:', diskErr);
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.statusCode = 500;
    if (typeof res.status === 'function') res.status(500);
    if (typeof res.send === 'function') return res.send('Error generating dynamic sitemap');
    return res.end('Error generating dynamic sitemap');
  }
}
