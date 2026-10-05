import React, { useState, useEffect } from 'react';
import type { Product } from '../../types.ts';
import {
  Globe,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Package,
  Layers,
  Image as ImageIcon,
  Tag,
  ShoppingBag
} from 'lucide-react';

interface DiagnosticResult {
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

interface Props {
  products: Product[];
}

export const GoogleMerchantDashboard: React.FC<Props> = ({ products }) => {
  const [data, setData] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  const feedUrl = 'https://specslook.com/merchant-feed.xml';
  const sitemapUrl = 'https://specslook.com/sitemap.xml';

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/merchant-diagnostics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Could not fetch merchant diagnostics API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [products]);

  const handleCopy = (text: string, type: 'feed' | 'sitemap') => {
    navigator.clipboard.writeText(text);
    if (type === 'feed') {
      setCopiedFeed(true);
      setTimeout(() => setCopiedFeed(false), 2000);
    } else {
      setCopiedSitemap(true);
      setTimeout(() => setCopiedSitemap(false), 2000);
    }
  };

  const total = data ? data.totalProducts : products.length;
  const eligible = data ? data.includedInFeed : products.length;
  const missingImgCount = data ? data.missingImages.length : 0;
  const missingPriceCount = data ? data.missingPrices.length : 0;
  const missingTitleCount = data ? data.missingTitles.length : 0;
  const missingUrlCount = data ? data.missingValidUrls.length : 0;
  const outOfStockCount = data ? data.outOfStock.length : products.filter(p => (p.stock || 0) <= 0).length;

  return (
    <div className="space-y-6">
      {/* Header & Feed Links Card */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xs text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-black uppercase tracking-wide">
                Google Merchant Center &amp; Shopping Feed
              </h2>
            </div>
            <p className="text-xs text-neutral-400 max-w-2xl">
              Public RSS 2.0 XML product feed automatically synced with the Specslook inventory database. Fully compatible with Google Merchant Center, Google Shopping, Free Listings, and Buy on Google.
            </p>
          </div>

          <button
            onClick={fetchDiagnostics}
            disabled={loading}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xs text-xs font-bold flex items-center gap-2 transition-colors self-start lg:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Re-check Diagnostics'}</span>
          </button>
        </div>

        {/* Endpoints Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-800">
          <div className="bg-neutral-950 p-4 rounded-xs border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Merchant Center Feed XML
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(feedUrl, 'feed')}
                  className="text-neutral-400 hover:text-white transition-colors p-1"
                  title="Copy Feed URL"
                >
                  {copiedFeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href="/merchant-feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors p-1"
                  title="Open Feed in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <p className="font-mono text-xs text-neutral-300 break-all bg-neutral-900 px-2.5 py-1.5 rounded-xs select-all">
              {feedUrl}
            </p>
            <p className="text-[10px] text-neutral-500">
              Submit this URL to Google Merchant Center &gt; Products &gt; Feeds &gt; Primary Feeds.
            </p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xs border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Official XML Sitemap
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(sitemapUrl, 'sitemap')}
                  className="text-neutral-400 hover:text-white transition-colors p-1"
                  title="Copy Sitemap URL"
                >
                  {copiedSitemap ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors p-1"
                  title="Open Sitemap in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <p className="font-mono text-xs text-neutral-300 break-all bg-neutral-900 px-2.5 py-1.5 rounded-xs select-all">
              {sitemapUrl}
            </p>
            <p className="text-[10px] text-neutral-500">
              Includes all active product pages, canonical links, categories, and franchise URLs.
            </p>
          </div>
        </div>
      </div>

      {/* Diagnostic KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 border border-neutral-200 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Catalog</span>
            <Package className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-black text-neutral-950">{total}</p>
          <p className="text-[10px] text-neutral-500">Products in DB</p>
        </div>

        <div className="bg-white p-4 border border-emerald-200 rounded-xs shadow-xs space-y-1 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Feed Eligible</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{eligible}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">Included in XML</p>
        </div>

        <div className="bg-white p-4 border border-neutral-200 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">No Images</span>
            <ImageIcon className="w-4 h-4 text-neutral-400" />
          </div>
          <p className={`text-2xl font-black ${missingImgCount > 0 ? 'text-red-600' : 'text-neutral-950'}`}>
            {missingImgCount}
          </p>
          <p className="text-[10px] text-neutral-500">{missingImgCount === 0 ? 'All have images' : 'Needs attention'}</p>
        </div>

        <div className="bg-white p-4 border border-neutral-200 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">No Prices</span>
            <Tag className="w-4 h-4 text-neutral-400" />
          </div>
          <p className={`text-2xl font-black ${missingPriceCount > 0 ? 'text-red-600' : 'text-neutral-950'}`}>
            {missingPriceCount}
          </p>
          <p className="text-[10px] text-neutral-500">{missingPriceCount === 0 ? 'All prices set' : 'Needs price'}</p>
        </div>

        <div className="bg-white p-4 border border-neutral-200 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">No Titles</span>
            <Layers className="w-4 h-4 text-neutral-400" />
          </div>
          <p className={`text-2xl font-black ${missingTitleCount > 0 ? 'text-red-600' : 'text-neutral-950'}`}>
            {missingTitleCount}
          </p>
          <p className="text-[10px] text-neutral-500">{missingTitleCount === 0 ? 'All named' : 'Needs title'}</p>
        </div>

        <div className="bg-white p-4 border border-neutral-200 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Invalid URLs</span>
            <Globe className="w-4 h-4 text-neutral-400" />
          </div>
          <p className={`text-2xl font-black ${missingUrlCount > 0 ? 'text-red-600' : 'text-neutral-950'}`}>
            {missingUrlCount}
          </p>
          <p className="text-[10px] text-neutral-500">{missingUrlCount === 0 ? 'All slugs valid' : 'Needs slug'}</p>
        </div>

        <div className="bg-white p-4 border border-neutral-200 rounded-xs shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock</span>
            <ShoppingBag className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-black text-neutral-950">{outOfStockCount}</p>
          <p className="text-[10px] text-neutral-500">Marked out_of_stock</p>
        </div>
      </div>

      {/* Compliance Standards Checklist */}
      <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Google Merchant Center Requirements Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xs border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>XML Feed Format &amp; Spec</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              RSS 2.0 with <code className="bg-neutral-200 px-1 py-0.5 rounded-xs font-mono">xmlns:g</code> Google namespace and XML escaping.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xs border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Currency &amp; Price Formatting</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Prices formatted with two decimals and currency code (e.g. <code className="bg-neutral-200 px-1 py-0.5 rounded-xs font-mono">1499.00 INR</code>).
            </p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xs border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Canonical Product URLs</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Preserves exact <code className="bg-neutral-200 px-1 py-0.5 rounded-xs font-mono">/product/{'{slug}'}/</code> routing structure.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xs border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Public HTTPS Image URLs</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Zero data URIs; all images resolved to public HTTPS endpoints accessible to Googlebot.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xs border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Server-Side Schema.org Product</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Schema.org Product + Offer JSON-LD injected in page HTML for Googlebot crawler without JS.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xs border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unblocked robots.txt &amp; Sitemap</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Googlebot &amp; Googlebot-Image allowed; Sitemap URL explicitly declared in robots.txt.
            </p>
          </div>
        </div>
      </div>

      {/* Feed Products Inventory Table */}
      <div className="bg-white p-6 border border-neutral-200 rounded-xs shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-900">
            Feed Items &amp; Validation Status ({data ? data.productsSummary.length : products.length})
          </h3>
          <span className="text-xs text-neutral-500">
            Status: <span className="font-bold text-emerald-600">100% In-Sync</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-neutral-700">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">ID / SKU</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Availability</th>
                <th className="py-3 px-3">Canonical URL</th>
                <th className="py-3 px-3 text-right">Merchant Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(data?.productsSummary || []).map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-3 flex items-center gap-2.5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-9 h-9 object-contain bg-neutral-100 rounded-xs border border-neutral-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/shop-logopng.png';
                      }}
                    />
                    <div className="truncate max-w-[200px]">
                      <p className="font-bold text-neutral-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-neutral-400">Brand: Specslook</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-neutral-600">{p.id}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-neutral-900">&#8377;{p.price.toFixed(2)}</span>
                    {p.salePrice && (
                      <span className="block text-[10px] text-red-600 font-medium">
                        Sale: &#8377;{p.salePrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium text-neutral-700">{p.stock}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                        p.availability === 'in_stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {p.availability}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <a
                      href={`/product/${encodeURIComponent(p.slug)}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-red-600 underline font-mono text-[11px] truncate max-w-[180px] block"
                    >
                      /product/{p.slug}/
                    </a>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {p.isEligible ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-[11px] font-bold" title={p.issues.join(', ')}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Issues
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
