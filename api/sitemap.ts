import { dbService } from '../src/server/db.ts';

export default function handler(req: any, res: any) {
  try {
    const products = dbService.getProducts();
    const today = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://specslook.com/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://specslook.com/shop/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>
  <url><loc>https://specslook.com/about/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://specslook.com/store/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
  <url><loc>https://specslook.com/franchise/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/home/home-eyetest/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/contact-us/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://specslook.com/blog/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.75</priority></url>
  <url><loc>https://specslook.com/terms-and-conditions/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://specslook.com/privacy-policy/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://specslook.com/product-category/eyeglasses/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/product-category/eyewear/womeneyewear/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/product-category/eyewear/meneyewear/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/product-category/eyewear/kidseyewear/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>
  <url><loc>https://specslook.com/product-category/sunglasses/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/product-category/sunglasses/women/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/product-category/sunglasses/men/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://specslook.com/product-category/sunglasses/kids/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>
  <url><loc>https://specslook.com/product-category/attachments/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>
  <url><loc>https://specslook.com/product-category/polarized/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>
  <url><loc>https://specslook.com/product-category/blue-light-blockers/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>
${products.map(p => `  <url><loc>https://specslook.com/product/${encodeURIComponent(p.slug)}/</loc><lastmod>${p.createdAt ? p.createdAt.split('T')[0] : today}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>`).join('\n')}
  <url><loc>https://specslook.com/blog/the-legendary-aviator-style-history/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://specslook.com/blog/polarized-vs-non-polarized-eyewear-guide/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://specslook.com/blog/how-to-choose-frames-for-your-face-shape/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('Error generating dynamic sitemap on Vercel:', err);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(500).send('Error generating dynamic sitemap');
  }
}
