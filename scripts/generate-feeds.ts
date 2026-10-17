import fs from 'fs';
import path from 'path';
import { dbService } from '../src/server/db.ts';
import { generateMerchantFeedXml } from '../src/server/merchantFeed.ts';
import { saveSitemapFiles } from '../src/server/sitemapGenerator.ts';

export function generateFeeds() {
  const products = dbService.getProducts();

  // 1. Google Merchant Center Feed XML
  const feedXml = generateMerchantFeedXml(products);

  // Target folders
  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // Write merchant-feed.xml
  fs.writeFileSync(path.join(publicDir, 'merchant-feed.xml'), feedXml, 'utf8');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'merchant-feed.xml'), feedXml, 'utf8');
  }
  console.log(`✅ Generated merchant-feed.xml (${feedXml.length} bytes, ${products.length} products)`);

  // 2. XML Sitemap (Product, Category, Static, and Blog URLs with Google Image extensions)
  const { urlCount, result } = saveSitemapFiles({ products });
  console.log(`✅ Generated sitemap.xml (${result.xml.length} bytes, ${urlCount} total canonical URLs)`);
}

if (process.argv[1]?.includes('generate-feeds')) {
  generateFeeds();
}
