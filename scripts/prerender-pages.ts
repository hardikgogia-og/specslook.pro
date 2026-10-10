import fs from 'fs';
import path from 'path';
import { dbService } from '../src/server/db.ts';
import { renderHomeHtml, renderCategoryHtml, renderStaticPageHtml, render404Html, CATEGORY_CONFIGS } from '../src/server/pagePrerender.ts';
import { renderFranchiseHtml } from '../src/server/franchisePrerender.ts';
import { renderProductHtml } from '../src/server/productPrerender.ts';

function writeHtml(targetPath: string, content: string) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, content, 'utf8');
}

export function prerenderAllPages() {
  const distDir = path.join(process.cwd(), 'dist');
  const distIndexHtml = path.join(distDir, 'index.html');

  if (!fs.existsSync(distIndexHtml)) {
    console.warn('dist/index.html not found, skipping static page prerender');
    return;
  }

  const baseHtml = fs.readFileSync(distIndexHtml, 'utf8');
  const products = dbService.getProducts();

  console.log(`🚀 Starting static site prerendering for Googlebot & Sitelinks (${products.length} products)...`);

  // 1. Prerender Homepage into dist/index.html
  const homeHtml = renderHomeHtml(baseHtml, products);
  writeHtml(distIndexHtml, homeHtml);
  console.log('  ✅ Prerendered Home (dist/index.html) with SiteNavigationElement Schema');

  // 2. Prerender Category Pages (Eyeglasses, Shades/Sunglasses, and Subcategories)
  for (const [, config] of Object.entries(CATEGORY_CONFIGS)) {
    const categoryHtml = renderCategoryHtml(baseHtml, config, products);
    
    // Primary canonical path, e.g. dist/product-category/eyeglasses/index.html
    const targetFile = path.join(distDir, ...config.canonicalPath.split('/').filter(Boolean), 'index.html');
    writeHtml(targetFile, categoryHtml);
    console.log(`  ✅ Prerendered Category: ${config.canonicalPath}`);

    // Also mirror to legacy/short category paths if defined (e.g. dist/eyeglasses/index.html, dist/sunglasses/index.html)
    if (config.categoryKey === 'eyeglasses') {
      writeHtml(path.join(distDir, 'eyeglasses', 'index.html'), categoryHtml);
      writeHtml(path.join(distDir, 'eyewear', 'index.html'), categoryHtml);
    } else if (config.categoryKey === 'sunglasses') {
      writeHtml(path.join(distDir, 'sunglasses', 'index.html'), categoryHtml);
      writeHtml(path.join(distDir, 'shades', 'index.html'), categoryHtml);
    }
  }

  // 2.5 Prerender 404 Not Found Page (dist/404.html for genuine 404/410 responses)
  const notFoundHtml = render404Html(baseHtml);
  writeHtml(path.join(distDir, '404.html'), notFoundHtml);
  console.log('  ✅ Prerendered Custom 404.html (noindex, nofollow, store navigation)');


  // 3. Prerender Static & Service Landing Pages
  const staticPages: Array<{ key: 'about' | 'home-eyetest' | 'stores' | 'contact' | 'shop'; paths: string[] }> = [
    { key: 'about', paths: ['about', 'about-us'] },
    { key: 'home-eyetest', paths: ['home/home-eyetest', 'home-eyetest', 'eyetest'] },
    { key: 'stores', paths: ['store', 'stores'] },
    { key: 'contact', paths: ['contact-us', 'contact'] },
    { key: 'shop', paths: ['shop'] }
  ];

  for (const page of staticPages) {
    const html = renderStaticPageHtml(baseHtml, page.key, products);
    for (const p of page.paths) {
      writeHtml(path.join(distDir, ...p.split('/'), 'index.html'), html);
    }
    console.log(`  ✅ Prerendered Static: /${page.paths[0]}/`);
  }

  // 4. Prerender Franchise Page
  const franchiseHtml = renderFranchiseHtml(baseHtml);
  writeHtml(path.join(distDir, 'franchise', 'index.html'), franchiseHtml);
  console.log('  ✅ Prerendered Franchise: /franchise/');

  // 5. Prerender Individual Product Pages into dist/product/{slug}/index.html
  let productCount = 0;
  for (const product of products) {
    if (!product.slug) continue;
    const prodHtml = renderProductHtml(baseHtml, product);
    writeHtml(path.join(distDir, 'product', product.slug, 'index.html'), prodHtml);
    productCount++;
  }
  console.log(`  ✅ Prerendered ${productCount} Product Pages with Schema.org Product + Offer`);

  console.log('✨ All pages successfully pre-rendered for Google Search & Sitelinks!');
}

if (process.argv[1]?.includes('prerender-pages')) {
  prerenderAllPages();
}
