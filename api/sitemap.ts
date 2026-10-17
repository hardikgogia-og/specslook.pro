import fs from 'fs';
import path from 'path';
import { dbService } from '../src/server/db.ts';
import { initialProducts } from '../src/data/seedData.ts';
import { generateSitemapXml, SITE_DOMAIN } from '../src/server/sitemapGenerator.ts';

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

    // Production host is canonical https://www.specslook.com
    const rawHost = (req.headers && (req.headers['x-forwarded-host'] || req.headers['host'])) || 'www.specslook.com';
    const baseUrl = rawHost.includes('specslook.com')
      ? SITE_DOMAIN
      : (rawHost.startsWith('localhost') ? `http://${rawHost}` : `https://${rawHost}`);

    const result = generateSitemapXml(products, { baseUrl, includeImages: true });
    return sendXmlResponse(res, result.xml);
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
