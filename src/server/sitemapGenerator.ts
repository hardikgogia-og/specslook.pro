import fs from 'fs';
import path from 'path';
import type { Product } from '../types.ts';
import { dbService } from './db.ts';
import { escapeXml, resolvePublicImageUrl } from './merchantFeed.ts';
import { CATEGORY_CONFIGS } from './pagePrerender.ts';

export const SITE_DOMAIN = 'https://www.specslook.com';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  images?: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
}

export interface SitemapGenerationResult {
  xml: string;
  urlCount: number;
  staticCount: number;
  categoryCount: number;
  productCount: number;
  blogCount: number;
}

/**
 * Builds the complete list of canonical indexable URLs for Specslook.com
 */
export function getSitemapEntries(products: Product[], baseUrl = SITE_DOMAIN): {
  staticEntries: SitemapEntry[];
  categoryEntries: SitemapEntry[];
  productEntries: SitemapEntry[];
  blogEntries: SitemapEntry[];
  allEntries: SitemapEntry[];
} {
  const today = new Date().toISOString().split('T')[0];

  // 1. Static Core Landing Pages
  const staticEntries: SitemapEntry[] = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
    { loc: `${baseUrl}/shop/`, priority: '0.95', changefreq: 'daily', lastmod: today },
    { loc: `${baseUrl}/franchise/`, priority: '0.90', changefreq: 'weekly', lastmod: today },
    { loc: `${baseUrl}/home/home-eyetest/`, priority: '0.90', changefreq: 'weekly', lastmod: today },
    { loc: `${baseUrl}/store/`, priority: '0.85', changefreq: 'weekly', lastmod: today },
    { loc: `${baseUrl}/about/`, priority: '0.80', changefreq: 'weekly', lastmod: today },
    { loc: `${baseUrl}/blog/`, priority: '0.75', changefreq: 'weekly', lastmod: today },
    { loc: `${baseUrl}/contact-us/`, priority: '0.70', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/terms-and-conditions/`, priority: '0.60', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/privacy-policy/`, priority: '0.60', changefreq: 'monthly', lastmod: today }
  ];

  // 2. Category Pages (Derived directly from CATEGORY_CONFIGS to ensure 100% alignment with prerendered routes)
  const categoryEntries: SitemapEntry[] = Object.values(CATEGORY_CONFIGS).map(cfg => {
    const isTopCategory = cfg.canonicalPath.split('/').filter(Boolean).length <= 2;
    return {
      loc: `${baseUrl}${cfg.canonicalPath}`,
      priority: isTopCategory ? '0.90' : '0.85',
      changefreq: 'daily',
      lastmod: today
    };
  });

  // 3. Educational & Optical Eyecare Blog Articles
  const blogEntries: SitemapEntry[] = [
    { loc: `${baseUrl}/blog/the-legendary-aviator-style-history/`, priority: '0.70', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/blog/polarized-vs-non-polarized-eyewear-guide/`, priority: '0.70', changefreq: 'monthly', lastmod: today },
    { loc: `${baseUrl}/blog/how-to-choose-frames-for-your-face-shape/`, priority: '0.70', changefreq: 'monthly', lastmod: today }
  ];

  // 4. Individual Product Pages (with Google Image Sitemap extension for Google Search & Shopping)
  const productEntries: SitemapEntry[] = products
    .filter(p => p && p.slug && p.name)
    .map(p => {
      const canonicalProductUrl = `${baseUrl}/product/${encodeURIComponent(p.slug)}/`;
      const productImages: Array<{ loc: string; title?: string; caption?: string }> = [];

      if (p.images && p.images.length > 0) {
        // Include up to 4 high-res product photos for Google Image indexation
        p.images.slice(0, 4).forEach(img => {
          const resolvedImg = resolvePublicImageUrl(img);
          if (resolvedImg) {
            productImages.push({
              loc: resolvedImg,
              title: p.name,
              caption: `Specslook ${p.name} - ${p.shortDescription || p.description || 'Luxury Eyewear'}`
            });
          }
        });
      }

      const modDate = p.updatedAt
        ? p.updatedAt.split('T')[0]
        : (p.createdAt ? p.createdAt.split('T')[0] : today);

      return {
        loc: canonicalProductUrl,
        lastmod: modDate,
        changefreq: 'weekly',
        priority: '0.85',
        images: productImages.length > 0 ? productImages : undefined
      };
    });

  // De-duplicate in case of any overlap
  const seen = new Set<string>();
  const allEntries: SitemapEntry[] = [];

  for (const entry of [...staticEntries, ...categoryEntries, ...blogEntries, ...productEntries]) {
    if (!seen.has(entry.loc)) {
      seen.add(entry.loc);
      allEntries.push(entry);
    }
  }

  return {
    staticEntries,
    categoryEntries,
    productEntries,
    blogEntries,
    allEntries
  };
}

/**
 * Generates standards-compliant XML string for sitemap.xml with Google Image extensions
 */
export function generateSitemapXml(
  products: Product[],
  options: { baseUrl?: string; includeImages?: boolean } = {}
): SitemapGenerationResult {
  const { baseUrl = SITE_DOMAIN, includeImages = true } = options;
  const { staticEntries, categoryEntries, productEntries, blogEntries, allEntries } = getSitemapEntries(products, baseUrl);

  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...allEntries.map(entry => {
      let urlXml = `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>`;

      if (includeImages && entry.images && entry.images.length > 0) {
        for (const img of entry.images) {
          urlXml += `\n    <image:image>\n      <image:loc>${escapeXml(img.loc)}</image:loc>`;
          if (img.title) {
            urlXml += `\n      <image:title>${escapeXml(img.title)}</image:title>`;
          }
          if (img.caption) {
            urlXml += `\n      <image:caption>${escapeXml(img.caption)}</image:caption>`;
          }
          urlXml += `\n    </image:image>`;
        }
      }

      urlXml += '\n  </url>';
      return urlXml;
    }),
    '</urlset>'
  ];

  return {
    xml: xmlLines.join('\n'),
    urlCount: allEntries.length,
    staticCount: staticEntries.length,
    categoryCount: categoryEntries.length,
    productCount: productEntries.length,
    blogCount: blogEntries.length
  };
}

/**
 * Automatically persists the generated sitemap to public/ and dist/
 */
export function saveSitemapFiles(options: { products?: Product[]; baseUrl?: string } = {}): {
  success: boolean;
  urlCount: number;
  publicPath: string;
  distPath?: string;
  result: SitemapGenerationResult;
} {
  const products = options.products || dbService.getProducts();
  const result = generateSitemapXml(products, { baseUrl: options.baseUrl || SITE_DOMAIN });

  const publicDir = path.join(process.cwd(), 'public');
  const distDir = path.join(process.cwd(), 'dist');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicPath, result.xml, 'utf8');

  let distPath: string | undefined;
  if (fs.existsSync(distDir)) {
    distPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distPath, result.xml, 'utf8');
  }

  return {
    success: true,
    urlCount: result.urlCount,
    publicPath,
    distPath,
    result
  };
}
