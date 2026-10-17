#!/usr/bin/env node
import { dbService } from '../src/server/db.ts';
import { saveSitemapFiles } from '../src/server/sitemapGenerator.ts';

/**
 * Automated CLI script to generate Specslook sitemap.xml
 * Can be run via: npm run generate:sitemap or tsx scripts/generate-sitemap.ts
 */
export function runSitemapGeneration() {
  console.log('🗺️  Starting automated XML sitemap generation for Specslook.com...');
  const startTime = Date.now();

  try {
    const products = dbService.getProducts();
    const { urlCount, result, publicPath, distPath } = saveSitemapFiles({ products });

    console.log(`✅ Successfully generated sitemap.xml in ${Date.now() - startTime}ms:`);
    console.log(`   • Total indexed URLs: ${urlCount}`);
    console.log(`   • Core static pages:  ${result.staticCount}`);
    console.log(`   • Category pages:     ${result.categoryCount}`);
    console.log(`   • Individual products:${result.productCount}`);
    console.log(`   • Eyecare blog posts: ${result.blogCount}`);
    console.log(`   • Written to:         ${publicPath}`);
    if (distPath) {
      console.log(`   • Mirrored to:        ${distPath}`);
    }
    console.log('🚀 Ready to submit in Google Search Console: https://www.specslook.com/sitemap.xml');
  } catch (err: any) {
    console.error('❌ Failed to generate sitemap.xml:', err);
    process.exit(1);
  }
}

if (process.argv[1]?.includes('generate-sitemap')) {
  runSitemapGeneration();
}
