/**
 * Server-side HTML prerenderer for Specslook Franchise Page
 * Injects SEO metadata, OpenGraph cards, Twitter cards, Schema.org JSON-LD (FAQPage & BusinessOpportunity),
 * and crawler-friendly semantic HTML so Googlebot, Bing, and AI crawlers can index /franchise as a dedicated page.
 */

export function renderFranchiseHtml(baseHtml: string): string {
  const franchiseTitle = 'Specslook Franchise Opportunities | Turnkey Optical Store Ownership';
  const franchiseDesc = 'Open a high-ROI Specslook optical showroom or boutique with turnkey setup, inventory support, optometrist training, and contractual 24-month buyback guarantee.';
  const franchiseUrl = 'https://specslook.com/franchise/';
  const ogImage = 'https://specslook.com/shop-logopng.png';

  const franchiseJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://specslook.com/#organization',
        name: 'Specslook',
        legalName: 'Specslook Eyewear',
        url: 'https://specslook.com/',
        logo: 'https://specslook.com/shop-logopng.png',
        telephone: '+91-8368853448',
        email: 'info@specslook.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Specslook, Dreamz Mall, Sec 4-7 Circle',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122001',
          addressCountry: 'IN'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${franchiseUrl}#webpage`,
        url: franchiseUrl,
        name: franchiseTitle,
        description: franchiseDesc,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://specslook.com/#website',
          name: 'Specslook',
          url: 'https://specslook.com/'
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://specslook.com/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Franchise Opportunities',
              item: franchiseUrl
            }
          ]
        },
        mainEntity: {
          '@type': 'Offer',
          name: 'Specslook Turnkey Optical Franchise Partnership',
          description: 'High-ROI optical retail franchise opportunities with contractual 24-month buyback guarantee, 65+ company-owned store network, and 250+ clinical network.',
          priceCurrency: 'INR',
          price: '1500000',
          areaServed: 'IN'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What are the franchise models available with Specslook?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Specslook offers two primary turnkey franchise models: 1) Specslook Mini Express (FOFO - Franchise Owned Franchise Operated) starting from ₹15 Lakhs for 200-400 sq.ft stores with 6-9 month estimated ROI, and 2) Specslook Flagship (FOCO - Franchise Owned Company Operated) starting from ₹20-35 Lakhs for 500-800 sq.ft stores with 8-11 month estimated ROI.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is the Specslook 24-Month Buyback Guarantee?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Every franchise agreement contains a legally binding 24-month buyback clause ensuring that if store performance does not reach contracted financial projections, Specslook will buy back qualifying inventory and infrastructure assets, dramatically reducing franchisee risk.'
            }
          },
          {
            '@type': 'Question',
            name: 'How many stores does Specslook operate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'According to industry surveys by the Sarvya Bharat Optical Association, Specslook operates over 65 standalone company-owned stores worldwide and collaborates across a network of over 250 clinical optical dispensaries.'
            }
          },
          {
            '@type': 'Question',
            name: 'What turnkey support is provided to Specslook optical franchise partners?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Specslook provides 100% turnkey store buildout design, computerized Zeiss optical testing equipment, optometrist hiring and certification, cloud billing POS, AI inventory replenishment, and national marketing campaigns.'
            }
          }
        ]
      }
    ]
  };

  const semanticFranchiseContent = `
    <div id="specslook-franchise-prerender" class="max-w-7xl mx-auto px-4 py-12 text-neutral-900 font-sans">
      <header class="mb-10 text-center">
        <p class="text-xs font-black uppercase text-red-600 tracking-widest mb-2">Official Franchise Program 2026</p>
        <h1 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 mb-4">Specslook Franchise Opportunities &amp; Turnkey Optical Store Ownership</h1>
        <p class="text-base sm:text-lg text-neutral-700 max-w-3xl mx-auto">
          Partner with India&#39;s highest-ROI optical chain. Verified by Sarvya Bharat Optical Association: <strong>65+ Standalone Company Stores</strong> worldwide &amp; <strong>250+ Clinical Stores</strong>. Contractual <strong>24-Month Buyback Guarantee</strong>.
        </p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        <div class="border border-neutral-200 rounded-sm p-6 bg-neutral-50">
          <h2 class="text-xl font-black uppercase text-neutral-950 mb-2">Specslook Mini Express (FOFO Model)</h2>
          <p class="text-sm text-neutral-600 mb-4">Franchise Owned, Franchise Operated store designed for high footfall urban locations.</p>
          <ul class="text-sm space-y-2 text-neutral-700">
            <li><strong>Total Investment:</strong> ₹15 Lakhs</li>
            <li><strong>Carpet Area:</strong> 200 - 400 sq.ft</li>
            <li><strong>Break-Even Horizon:</strong> 6 - 9 Months</li>
            <li><strong>Gross Profit Margin:</strong> 62% - 70%</li>
            <li><strong>Contractual Protection:</strong> 24-Month Buyback Clause</li>
          </ul>
        </div>

        <div class="border border-red-200 rounded-sm p-6 bg-red-50/40">
          <h2 class="text-xl font-black uppercase text-red-700 mb-2">Specslook Flagship Boutique (FOCO Model)</h2>
          <p class="text-sm text-neutral-600 mb-4">Franchise Owned, Company Operated luxury boutique with full clinical eye examination lounge.</p>
          <ul class="text-sm space-y-2 text-neutral-700">
            <li><strong>Total Investment:</strong> ₹20 - ₹35 Lakhs</li>
            <li><strong>Carpet Area:</strong> 500 - 800 sq.ft</li>
            <li><strong>Break-Even Horizon:</strong> 8 - 11 Months</li>
            <li><strong>Gross Profit Margin:</strong> 68% - 75%</li>
            <li><strong>Clinical Inclusions:</strong> 14-Point Zeiss Computerized Vision Suite</li>
          </ul>
        </div>
      </section>

      <section class="my-10 border-t border-neutral-200 pt-8">
        <h2 class="text-2xl font-black uppercase text-neutral-950 mb-4">Why Partner With Specslook?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-neutral-700">
          <div>
            <h3 class="font-bold text-neutral-900 mb-1">Contractual 24-Month Buyback</h3>
            <p>Your capital is legally hedged. In the rare event of underperformance, Specslook repurchases inventory and displays.</p>
          </div>
          <div>
            <h3 class="font-bold text-neutral-900 mb-1">Full Turnkey Supply Chain</h3>
            <p>From architectural blueprints to automated inventory replenishment, optical frames and prescription lenses arrive pre-cut.</p>
          </div>
          <div>
            <h3 class="font-bold text-neutral-900 mb-1">Master Optician Staff Training</h3>
            <p>We recruit and certify qualified optometrists and sales consultants using proven retail operating standards.</p>
          </div>
        </div>
      </section>

      <footer class="mt-12 p-6 bg-neutral-950 text-white rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 class="font-bold text-white text-base">Begin Your Franchise Application</h3>
          <p class="text-xs text-neutral-400">Speak directly with Specslook Executive Expansion Directors.</p>
        </div>
        <div class="text-xs space-y-1 sm:text-right">
          <p><strong>WhatsApp / Phone:</strong> +91 83688 53448</p>
          <p><strong>Email:</strong> info@specslook.com</p>
          <p><strong>Showroom HQ:</strong> Dreamz Mall, Sec 4-7 Circle, Gurugram, Haryana</p>
        </div>
      </footer>
    </div>
  `;

  let html = baseHtml;

  // 1. Replace or inject <title>
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${franchiseTitle}</title>`);
  } else {
    html = html.replace('</head>', `<title>${franchiseTitle}</title>\n</head>`);
  }

  // 2. Replace or inject <meta name="description">
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${franchiseDesc}" />`);
  } else {
    html = html.replace('</head>', `<meta name="description" content="${franchiseDesc}" />\n</head>`);
  }

  // 3. Replace or inject <link rel="canonical">
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${franchiseUrl}" />`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${franchiseUrl}" />\n</head>`);
  }

  // 4. OpenGraph tags
  if (/<meta\s+property=["']og:title["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${franchiseTitle}" />`);
  } else {
    html = html.replace('</head>', `<meta property="og:title" content="${franchiseTitle}" />\n</head>`);
  }

  if (/<meta\s+property=["']og:description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${franchiseDesc}" />`);
  } else {
    html = html.replace('</head>', `<meta property="og:description" content="${franchiseDesc}" />\n</head>`);
  }

  if (/<meta\s+property=["']og:url["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${franchiseUrl}" />`);
  } else {
    html = html.replace('</head>', `<meta property="og:url" content="${franchiseUrl}" />\n</head>`);
  }

  // 5. Twitter card tags
  if (/<meta\s+name=["']twitter:title["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${franchiseTitle}" />`);
  } else {
    html = html.replace('</head>', `<meta name="twitter:title" content="${franchiseTitle}" />\n</head>`);
  }

  if (/<meta\s+name=["']twitter:description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${franchiseDesc}" />`);
  } else {
    html = html.replace('</head>', `<meta name="twitter:description" content="${franchiseDesc}" />\n</head>`);
  }

  // 6. Inject Schema.org JSON-LD
  const scriptTag = `<script type="application/ld+json" id="specslook-schema">\n${JSON.stringify(franchiseJsonLd, null, 2)}\n</script>`;
  if (/<script[^>]*id=["']specslook-schema["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script[^>]*id=["']specslook-schema["'][^>]*>[\s\S]*?<\/script>/i, scriptTag);
  } else {
    html = html.replace('</head>', `${scriptTag}\n</head>`);
  }

  // 7. Inject crawler-friendly semantic HTML inside root container
  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${semanticFranchiseContent}</div>`);
  }

  return html;
}
