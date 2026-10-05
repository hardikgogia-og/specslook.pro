import type { Product } from '../types.ts';

const SITE_DOMAIN = 'https://specslook.com';

/**
 * Escapes characters for safe inclusion inside XML attributes/nodes
 */
export function escapeXml(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Safely wraps text in CDATA, guarding against nested CDATA closing markers
 */
export function wrapCdata(str: string | undefined | null): string {
  if (!str) return '';
  const safe = String(str).replace(/]]>/g, ']]&gt;');
  return `<![CDATA[${safe}]]>`;
}

/**
 * Resolves a product image into an absolute HTTPS public URL suitable for Google Merchant Center
 */
export function resolvePublicImageUrl(img: string | undefined | null): string {
  if (!img || typeof img !== 'string') {
    return `${SITE_DOMAIN}/shop-logopng.png`;
  }
  const trimmed = img.trim();
  if (trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('http://')) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }
  if (trimmed.startsWith('/')) {
    return `${SITE_DOMAIN}${trimmed}`;
  }
  return `${SITE_DOMAIN}/${trimmed}`;
}

/**
 * Maps Specslook categories to standard Google Product Categories
 */
export function getGoogleProductCategory(product: Product): string {
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (cat.includes('sunglass') || sub.includes('sunglass') || name.includes('sunglass')) {
    return 'Apparel & Accessories > Clothing Accessories > Sunglasses';
  }
  if (cat.includes('contact') || sub.includes('contact') || name.includes('contact lens')) {
    return 'Health & Beauty > Personal Care > Vision Care > Contact Lenses';
  }
  // Default for Eyeglasses, Frames, Reading Glasses, Computer Glasses, Blue Light Blockers
  return 'Apparel & Accessories > Clothing Accessories > Eye Care > Eyeglasses';
}

/**
 * Maps Specslook gender/specifications to Google Shopping gender taxonomy
 */
export function getGoogleGender(product: Product): 'unisex' | 'male' | 'female' | 'men' | 'women' {
  const specGender = (product.specifications?.gender || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (specGender.includes('women') || cat.includes('women') || sub.includes('women') || name.includes('women') || name.includes('cateye')) {
    return 'female';
  }
  if (specGender.includes('men') || cat.includes('men') || sub.includes('men') || name.includes(' men ') || name.includes('mens')) {
    return 'male';
  }
  return 'unisex';
}

/**
 * Validates whether a GTIN is a genuine 8, 12, 13, or 14-digit numeric string
 */
export function isValidGtin(gtin: string | undefined | null): boolean {
  if (!gtin || typeof gtin !== 'string') return false;
  const clean = gtin.trim().replace(/[-\s]/g, '');
  return /^\d{8}$|^\d{12}$|^\d{13}$|^\d{14}$/.test(clean);
}

/**
 * Diagnostic analysis of product database for Google Merchant Center readiness
 */
export interface MerchantDiagnosticResult {
  totalProducts: number;
  includedInFeed: number;
  missingImages: Array<{ id: string; name: string }>;
  missingPrices: Array<{ id: string; name: string }>;
  missingTitles: Array<{ id: string; name: string }>;
  missingValidUrls: Array<{ id: string; name: string }>;
  outOfStock: Array<{ id: string; name: string; stock: number }>;
  productsSummary: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    stock: number;
    availability: string;
    image: string;
    isEligible: boolean;
    issues: string[];
  }>;
}

export function getMerchantDiagnostics(products: Product[]): MerchantDiagnosticResult {
  const missingImages: Array<{ id: string; name: string }> = [];
  const missingPrices: Array<{ id: string; name: string }> = [];
  const missingTitles: Array<{ id: string; name: string }> = [];
  const missingValidUrls: Array<{ id: string; name: string }> = [];
  const outOfStock: Array<{ id: string; name: string; stock: number }> = [];

  const productsSummary = products.map((p) => {
    const issues: string[] = [];

    // Title check
    if (!p.name || !p.name.trim()) {
      missingTitles.push({ id: p.id, name: p.name || '(Empty Name)' });
      issues.push('Missing Title');
    }

    // Price check
    if (typeof p.price !== 'number' || isNaN(p.price) || p.price <= 0) {
      missingPrices.push({ id: p.id, name: p.name || p.id });
      issues.push('Invalid or Missing Price');
    }

    // URL/Slug check
    if (!p.slug || !p.slug.trim()) {
      missingValidUrls.push({ id: p.id, name: p.name || p.id });
      issues.push('Missing Canonical Slug/URL');
    }

    // Image check
    const primaryImg = p.images && p.images.length > 0 ? p.images[0] : '';
    if (!primaryImg || primaryImg.trim().length === 0 || primaryImg.startsWith('data:')) {
      missingImages.push({ id: p.id, name: p.name || p.id });
      issues.push('Missing Public Image URL');
    }

    // Stock check
    const stock = typeof p.stock === 'number' ? p.stock : 0;
    if (stock <= 0) {
      outOfStock.push({ id: p.id, name: p.name || p.id, stock });
    }

    const availability = stock > 0 ? 'in_stock' : 'out_of_stock';
    const isEligible = issues.length === 0;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice && p.salePrice < p.price ? p.salePrice : undefined,
      stock,
      availability,
      image: resolvePublicImageUrl(primaryImg),
      isEligible,
      issues
    };
  });

  const includedInFeed = productsSummary.filter(p => p.isEligible).length;

  return {
    totalProducts: products.length,
    includedInFeed,
    missingImages,
    missingPrices,
    missingTitles,
    missingValidUrls,
    outOfStock,
    productsSummary
  };
}

/**
 * Generates official Google Merchant Center RSS 2.0 Product Feed XML
 * Follows Google Shopping XML specification with xmlns:g="http://base.google.com/ns/1.0"
 */
export function generateMerchantFeedXml(products: Product[]): string {
  const itemsXml: string[] = [];

  for (const p of products) {
    // 1. Mandatory core fields
    if (!p.id || !p.name || !p.slug) continue;
    if (typeof p.price !== 'number' || isNaN(p.price) || p.price <= 0) continue;

    const id = escapeXml(p.id);
    const title = wrapCdata(p.name);
    const rawDesc = p.description || p.shortDescription || `${p.name} luxury eyewear handcrafted with Japanese titanium & Italian acetate.`;
    const description = wrapCdata(rawDesc);
    const link = `${SITE_DOMAIN}/product/${encodeURIComponent(p.slug)}/`;

    // 2. Images: Primary image must be HTTPS public URL
    const primaryImg = p.images && p.images.length > 0 ? p.images[0] : null;
    const imageLink = escapeXml(resolvePublicImageUrl(primaryImg));

    // Additional images (up to 10)
    const additionalImagesXml: string[] = [];
    if (Array.isArray(p.images) && p.images.length > 1) {
      for (let i = 1; i < Math.min(p.images.length, 11); i++) {
        const addImg = p.images[i];
        if (addImg && !addImg.startsWith('data:')) {
          additionalImagesXml.push(`      <g:additional_image_link>${escapeXml(resolvePublicImageUrl(addImg))}</g:additional_image_link>`);
        }
      }
    }

    // 3. Pricing: INR format e.g. "1499.00 INR"
    const priceFormatted = `${p.price.toFixed(2)} INR`;
    let salePriceXml = '';
    if (typeof p.salePrice === 'number' && !isNaN(p.salePrice) && p.salePrice > 0 && p.salePrice < p.price) {
      salePriceXml = `\n      <g:sale_price>${p.salePrice.toFixed(2)} INR</g:sale_price>`;
    }

    // 4. Inventory Availability
    const stock = typeof p.stock === 'number' ? p.stock : 0;
    const availability = stock > 0 ? 'in_stock' : 'out_of_stock';

    // 5. Taxonomy & categorization
    const brand = 'Specslook';
    const condition = 'new';
    const googleCategory = escapeXml(getGoogleProductCategory(p));

    const categoryHierarchy = ['Eyewear', p.category, p.subcategory].filter(Boolean).join(' > ');
    const productType = escapeXml(categoryHierarchy);

    // 6. Identifiers (SKU, MPN, GTIN)
    const sku = p.sku ? escapeXml(p.sku) : id;
    const mpn = p.sku ? escapeXml(p.sku) : id;

    // Check genuine GTIN
    const rawGtin = (p as any).gtin || (p as any).barcode;
    let gtinXml = '';
    if (isValidGtin(rawGtin)) {
      gtinXml = `\n      <g:gtin>${escapeXml(rawGtin.trim())}</g:gtin>`;
    } else {
      // NEVER invent GTINs - declare identifier_exists: no per Google Shopping policy
      gtinXml = `\n      <g:identifier_exists>no</g:identifier_exists>`;
    }

    // 7. Demographics & attributes
    const gender = getGoogleGender(p);
    const ageGroup = (p.category || '').toLowerCase().includes('kid') || (p.name || '').toLowerCase().includes('kid') ? 'kids' : 'adult';
    const color = p.specifications?.frameMaterial ? escapeXml(p.specifications.frameMaterial) : '';

    itemsXml.push(`    <item>
      <g:id>${id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>${additionalImagesXml.length > 0 ? '\n' + additionalImagesXml.join('\n') : ''}
      <g:price>${priceFormatted}</g:price>${salePriceXml}
      <g:availability>${availability}</g:availability>
      <g:brand>${brand}</g:brand>
      <g:condition>${condition}</g:condition>
      <g:product_type>${productType}</g:product_type>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:sku>${sku}</g:sku>
      <g:mpn>${mpn}</g:mpn>${gtinXml}
      <g:gender>${gender}</g:gender>
      <g:age_group>${ageGroup}</g:age_group>${color ? `\n      <g:material>${color}</g:material>` : ''}
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Free Express Delivery</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Specslook Official Google Merchant Product Feed</title>
    <link>${SITE_DOMAIN}</link>
    <description>Specslook luxury handcrafted prescription eyeglasses, designer sunglasses, and polarized optics with doorstep home eye test across India.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml.join('\n')}
  </channel>
</rss>`;
}
