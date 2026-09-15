import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  Check,
  Ruler,
  MessageSquare,
  ArrowLeft,
  Share2,
  Lock,
  Eye,
  FileText,
  Calendar
} from 'lucide-react';
import { Product, ProductVariant, Review, LensAddon, EYEGLASS_LENS_ADDONS, SUNGLASS_LENS_ADDONS, ATTACHMENT_LENS_ADDONS } from '../types.ts';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export const ProductDetailView: React.FC = () => {
  const { products, viewParams, navigateTo, addToCart, toggleWishlist, isInWishlist, showToast, setIsCartOpen } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Active selections
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedLensAddon, setSelectedLensAddon] = useState<LensAddon>(EYEGLASS_LENS_ADDONS[0]);
  const [quantity, setQuantity] = useState(1);

  // Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerTitle, setReviewerTitle] = useState('');
  const [reviewerComment, setReviewerComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Helper to resolve lens add-on based on category
  const getInitialAddon = (catName?: string) => {
    const isAtt = Boolean(catName && (catName.toLowerCase().includes('attachment') || catName.toLowerCase().includes('clip')));
    const isSun = Boolean(catName && catName.toLowerCase().includes('sunglass'));
    const isEye = Boolean(catName && catName.toLowerCase().includes('eyeglass'));
    if (isAtt) return ATTACHMENT_LENS_ADDONS[0];
    if (isSun) return SUNGLASS_LENS_ADDONS[0];
    if (isEye) return EYEGLASS_LENS_ADDONS[0];
    return {
      id: 'none',
      name: 'Standard Option',
      price: 0,
      description: 'Standard product option',
      features: []
    };
  };

  useEffect(() => {
    // 1. Determine target identifier from viewParams, window pathname, search params, or hash
    let target = (viewParams.slug || viewParams.id || '').toString().trim();

    if (!target && typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/^\/(?:product|products)\/([^/]+)/i);
      if (match && match[1]) {
        target = decodeURIComponent(match[1].trim());
      } else {
        const search = new URLSearchParams(window.location.search);
        const qTarget = search.get('product') || search.get('slug') || search.get('id');
        if (qTarget) {
          target = decodeURIComponent(qTarget.trim());
        } else {
          const hash = window.location.hash.replace('#', '');
          const hashMatch = hash.match(/^(?:product|products)\/([^/]+)/i);
          if (hashMatch && hashMatch[1]) {
            target = decodeURIComponent(hashMatch[1].trim());
          }
        }
      }
    }

    // 2. Find product directly in memory from StoreContext (instant, offline, resilient)
    let found: Product | undefined;
    if (products && products.length > 0) {
      if (target) {
        const lowerTarget = target.toLowerCase();
        found = products.find(p =>
          p.slug.toLowerCase() === lowerTarget ||
          p.id.toLowerCase() === lowerTarget ||
          (p.sku && p.sku.toLowerCase() === lowerTarget)
        );

        // Fuzzy fallback if exact slug didn't match
        if (!found) {
          found = products.find(p =>
            p.slug.toLowerCase().includes(lowerTarget) ||
            lowerTarget.includes(p.slug.toLowerCase()) ||
            p.name.toLowerCase().includes(lowerTarget)
          );
        }
      }

      // If still not matched, fallback to first catalog product so page NEVER renders empty/broken
      if (!found) {
        found = products[0];
      }
    }

    if (found) {
      setProduct(found);
      setSelectedVariantIndex(0);
      setActiveImageIndex(0);
      setSelectedLensAddon(getInitialAddon(found.category));
      setRelated(products.filter(p => p.id !== found!.id && (p.category === found!.category || p.brand === found!.brand)).slice(0, 4));
      setLoading(false);
    }

    // 3. Attempt background fetch to get latest database updates or user reviews
    const fetchTarget = target || found?.slug || found?.id;
    if (fetchTarget) {
      fetch(`/api/products/${encodeURIComponent(fetchTarget)}`)
        .then(async res => {
          if (!res.ok) return null;
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) return null;
          return res.json();
        })
        .then(data => {
          if (data && data.product) {
            setProduct(data.product);
            if (data.reviews && data.reviews.length > 0) {
              setReviews(data.reviews);
            }
            if (data.related && data.related.length > 0) {
              setRelated(data.related);
            }
          }
        })
        .catch(err => {
          console.warn('Background product sync: using client memory catalog:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [viewParams.id, viewParams.slug, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Loading Optics...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Eyewear model not found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="text-xs font-bold uppercase tracking-wider text-red-600 hover:underline"
        >
          Return to All Frames &rarr;
        </button>
      </div>
    );
  }

  const isEyeglasses = Boolean(product.category && product.category.toLowerCase().includes('eyeglass'));
  const isSunglasses = Boolean(product.category && product.category.toLowerCase().includes('sunglass'));
  const isAttachment = Boolean(
    product.category && (
      product.category.toLowerCase().includes('attachment') ||
      product.category.toLowerCase().includes('clip')
    )
  );
  const availableLensAddons: LensAddon[] = isAttachment
    ? ATTACHMENT_LENS_ADDONS
    : isEyeglasses
      ? EYEGLASS_LENS_ADDONS
      : isSunglasses
        ? SUNGLASS_LENS_ADDONS
        : [];

  const activeVariant: ProductVariant = product.variants[selectedVariantIndex] || product.variants[0];
  // If customer explicitly clicks a secondary color variant (index > 0), lead with that variant's images;
  // otherwise, respect the admin-curated product.images gallery order as the primary presentation
  const allImages = (selectedVariantIndex > 0 && activeVariant?.images && activeVariant.images.length > 0)
    ? activeVariant.images
    : (product.images && product.images.length > 0 ? product.images : (activeVariant?.images || []));

  const currentImage = allImages[activeImageIndex] || product.images[0] || activeVariant?.images?.[0];
  const inWishlist = isInWishlist(product.id);
  const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);

  const effectiveUnitPrice = product.salePrice + selectedLensAddon.price;

  const handleAddToCart = () => {
    addToCart(product, activeVariant, quantity, selectedLensAddon.name, selectedLensAddon);
  };

  const handleBuyNow = () => {
    addToCart(product, activeVariant, quantity, selectedLensAddon.name, selectedLensAddon);
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Specslook Eyewear`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;
    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewerName,
          rating: reviewerRating,
          title: reviewerTitle,
          comment: reviewerComment
        })
      });

      const newReview = await res.json();
      if (res.ok) {
        setReviews(prev => [newReview, ...prev]);
        setShowReviewForm(false);
        setReviewerName('');
        setReviewerTitle('');
        setReviewerComment('');
        showToast('Thank you! Your review has been published.');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-neutral-200 text-xs font-medium text-neutral-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-neutral-900">Home</button>
          <span>/</span>
          <button onClick={() => navigateTo('shop', { category: product.category })} className="hover:text-neutral-900">{product.category}</button>
          <span>/</span>
          <span className="text-neutral-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={() => navigateTo('shop')}
          className="flex items-center gap-1 text-neutral-700 hover:text-red-600 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Main Product Showcase Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: Product Images Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-4/3 bg-neutral-100 border border-neutral-200 rounded-xs overflow-hidden flex items-center justify-center p-6 sm:p-10 group">
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 uppercase tracking-wider shadow-sm">
                  {discountPercent}% OFF
                </div>
              )}
              {product.specifications.isPolarized && (
                <div className="absolute top-4 right-4 bg-neutral-950 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest border border-neutral-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  POLARIZED CHROMANCE
                </div>
              )}

              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
              />

              {/* Action shortcuts */}
              <button
                onClick={handleShare}
                aria-label="Share product"
                className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white text-neutral-700 rounded-full shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-18 bg-neutral-100 border p-1 rounded-xs shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-neutral-900 ring-2 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Frame angle" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust and Delivery Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 text-center">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs">
                <Truck className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-neutral-900 uppercase">Express Air Shipping</div>
                <div className="text-[10px] text-neutral-500">2-4 days across India</div>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs">
                <RotateCcw className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-neutral-900 uppercase">14-Day Free Returns</div>
                <div className="text-[10px] text-neutral-500">Doorstep pickup</div>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs">
                <ShieldCheck className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <div className="text-[11px] font-bold text-neutral-900 uppercase">Optical Warranty</div>
                <div className="text-[10px] text-neutral-500">1-Year authenticity card</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Ordering Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-1">
                <span>{product.brand} • {product.category}</span>
                <span className="text-neutral-400">SKU: {activeVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
                {product.name}
              </h1>

              {/* Star Rating Strip */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-900">{product.rating}</span>
                <span className="text-xs text-neutral-400">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Pricing Area */}
            <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-xs flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                    ₹{product.salePrice.toLocaleString('en-IN')}
                  </span>
                  {product.price > product.salePrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Inclusive of all taxes & complimentary insured protective hard case.
                </span>
              </div>

              <div className="text-right">
                <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                  product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                </span>
              </div>
            </div>

            {/* Color Variant Selector */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900 uppercase">
                    Color: <span className="font-medium text-neutral-600">{activeVariant.colorName}</span>
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Lens: {activeVariant.lensColor}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setActiveImageIndex(0);
                      }}
                      className={`relative p-1 rounded-full border-2 transition-all ${
                        selectedVariantIndex === idx
                          ? 'border-neutral-950 scale-110'
                          : 'border-transparent hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-neutral-300 shadow-inner"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lens Technology & Power Options (Only for Eyeglasses and Sunglasses) */}
            {availableLensAddons.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>
                      {isAttachment
                        ? 'Base Optical Frame Lens Add-ons (Clip-ons convert to sunglasses)'
                        : isSunglasses
                          ? 'Sunglasses Lens & Power Options'
                          : 'Glass Add-ons & Lens Package'}
                    </span>
                  </label>
                  <span className="text-[11px] text-red-600 font-bold">
                    {selectedLensAddon.price > 0 ? `+₹${selectedLensAddon.price.toLocaleString('en-IN')}` : 'Base Price'}
                  </span>
                </div>

                <div className="space-y-2">
                  {availableLensAddons.map((opt) => {
                    const isSelected = selectedLensAddon.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedLensAddon(opt)}
                        className={`p-3 border rounded-xs cursor-pointer transition-all flex flex-col gap-1.5 ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-900/5 ring-1 ring-neutral-950 shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-neutral-300'}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-bold text-neutral-900">{opt.name}</span>
                            {opt.tag && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-red-100 text-red-700 rounded-xs">
                                {opt.tag}
                              </span>
                            )}
                          </div>
                          <span className={`text-xs font-bold shrink-0 ${opt.price > 0 ? 'text-neutral-900' : 'text-emerald-600'}`}>
                            {opt.price > 0 ? `+₹${opt.price.toLocaleString('en-IN')}` : 'FREE / INCLUDED'}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-500 pl-6 leading-relaxed">
                          {opt.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pl-6 pt-0.5">
                          {opt.features.map((feat, fIdx) => (
                            <span key={fIdx} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-xs font-medium">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* POST-CHECKOUT LENS POWER NOTICE (For Eyeglasses and Attachments OR when Sunglasses Power Addon is chosen) */}
                {(isEyeglasses || isAttachment) && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xs text-xs space-y-1.5 mt-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        ℹ️
                      </span>
                      <span className="font-extrabold text-amber-950 uppercase tracking-wide text-[11px]">
                        Power for lenses add-on will be asked post check-out
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed pl-7">
                      {isAttachment
                        ? "Your optical base frame will be custom-fitted with your exact prescription power (or clear zero-power demo lenses). The magnetic sunglasses clips snap over smoothly anytime! Right after checkout, you can select:"
                        : "You don't need your power numbers right now. Right after completing checkout, you will get 3 easy options:"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pl-7 pt-0.5 text-[10px] font-semibold text-amber-950">
                      <div className="bg-white/90 border border-amber-200 px-2 py-1 rounded-xs flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-700 shrink-0" />
                        <span>Upload Prescription</span>
                      </div>
                      <div className="bg-white/90 border border-amber-200 px-2 py-1 rounded-xs flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-700 shrink-0" />
                        <span>Select Power Dropdown</span>
                      </div>
                      <div className="bg-white/90 border border-amber-200 px-2 py-1 rounded-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-700 shrink-0" />
                        <span>Free Store Eye Exam</span>
                      </div>
                    </div>
                  </div>
                )}

                {isSunglasses && selectedLensAddon.id === 'sg-powered-tinted-uv420' && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xs text-xs space-y-1.5 mt-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        ℹ️
                      </span>
                      <span className="font-extrabold text-amber-950 uppercase tracking-wide text-[11px]">
                        Prescription Power will be asked post check-out
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed pl-7">
                      Right after completing checkout, you can upload your prescription or select dropdown power. Our optical lab will custom-grind and tint your UV420 lenses to match the exact colour of this sunglass frame!
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-7 pt-0.5 text-[10px] font-semibold text-amber-950">
                      <div className="bg-white/90 border border-amber-200 px-2 py-1 rounded-xs flex items-center gap-1">
                        <FileText className="w-3 h-3 text-amber-700 shrink-0" />
                        <span>Upload Prescription</span>
                      </div>
                      <div className="bg-white/90 border border-amber-200 px-2 py-1 rounded-xs flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-700 shrink-0" />
                        <span>Select Power Dropdown</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Total Item Calculation Strip */}
            <div className="p-3 bg-neutral-100/90 border border-neutral-200 rounded-xs flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-900 uppercase tracking-wider">Total Item Price: </span>
                <span className="text-neutral-600 font-medium">
                  ₹{product.salePrice.toLocaleString('en-IN')} {selectedLensAddon.price > 0 && `+ ₹${selectedLensAddon.price.toLocaleString('en-IN')} (${selectedLensAddon.code})`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-neutral-900">
                  ₹{(effectiveUnitPrice * quantity).toLocaleString('en-IN')}
                </span>
                {quantity > 1 && <span className="text-[10px] text-neutral-500 block">({quantity} × ₹{effectiveUnitPrice.toLocaleString('en-IN')})</span>}
              </div>
            </div>

            {/* Frame Dimensions Guide */}
            <div className="bg-neutral-100/70 p-3.5 border border-neutral-200 rounded-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-neutral-600" />
                <span className="font-bold text-neutral-800">Dimensions:</span>
                <span className="text-neutral-600">
                  {product.specifications.lensWidthMm}-{product.specifications.bridgeMm}-{product.specifications.templeLengthMm} mm
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                Fit: Standard
              </span>
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 rounded-xs bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-3 text-neutral-600 hover:bg-neutral-100 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  id="detail-add-to-bag"
                  onClick={handleAddToCart}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-950 text-white text-xs sm:text-sm font-extrabold py-3.5 px-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`p-3.5 border rounded-xs transition-colors ${
                    inWishlist ? 'border-red-600 text-red-600 bg-red-50' : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-600' : ''}`} />
                </button>
              </div>

              {/* Instant Buy with Cash on Delivery */}
              <button
                id="detail-buy-now"
                onClick={handleBuyNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold py-3.5 px-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Truck className="w-4 h-4 text-white" />
                <span>Buy Now • Cash on Delivery</span>
              </button>

              {/* COD Assurance Badge */}
              <div className="bg-emerald-50 border border-emerald-300/80 p-3 rounded-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  COD
                </div>
                <div className="text-xs">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>Cash on Delivery Available</span>
                    <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-xs font-semibold">100% VERIFIED</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Pay at your doorstep via Cash or UPI QR upon delivery. Zero advance payment required.
                  </div>
                </div>
              </div>

              {/* Post-Checkout Lens Power Guidance Strip */}
              {(isEyeglasses || (isSunglasses && selectedLensAddon.id === 'sg-powered-tinted-uv420')) && (
                <div className="bg-neutral-100/90 border border-neutral-200 p-3 rounded-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Zero Hassle Lens Power Setup</span>
                      <span className="bg-neutral-900 text-white text-[9px] px-1.5 py-0.2 rounded-xs font-semibold">POST-CHECKOUT</span>
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      {isSunglasses
                        ? 'Prescription power for Tinted UV420 lenses will be asked post check-out. You can upload prescription or enter dropdown numbers.'
                        : 'Power for lenses add-on will be asked post check-out. You can upload prescription, enter dropdown power, or get examined by our optometrist.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description Paragraph */}
            <div className="pt-4 border-t border-neutral-200">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-2">Description</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="mt-16 pt-12 border-t border-neutral-200">
          <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900 mb-6">
            Detailed Optical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[11px] uppercase text-neutral-500 font-bold block">Frame Material</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">{product.specifications.frameMaterial}</span>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[11px] uppercase text-neutral-500 font-bold block">Lens Material</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">{product.specifications.lensMaterial}</span>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[11px] uppercase text-neutral-500 font-bold block">UV Protection</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">{product.specifications.uvProtection}</span>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[11px] uppercase text-neutral-500 font-bold block">Polarized Optics</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">
                {product.specifications.isPolarized ? 'Yes — High Contrast Glare Cancellation' : 'Classic Untinted / Standard UV'}
              </span>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[11px] uppercase text-neutral-500 font-bold block">Frame Shape</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">{product.specifications.frameShape}</span>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[11px] uppercase text-neutral-500 font-bold block">Weight</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">{product.specifications.weightGrams} grams</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900">
                Customer Reviews ({reviews.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-800">{product.rating} out of 5 stars</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-neutral-900 hover:bg-neutral-950 text-white text-xs font-bold py-2.5 px-5 uppercase tracking-wider transition-colors rounded-xs"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-10 p-6 bg-neutral-50 border border-neutral-300 rounded-xs space-y-4 max-w-xl">
              <h3 className="font-extrabold text-sm uppercase text-neutral-900">Write Your Feedback</h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Honey Gogia"
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Rating</label>
                <select
                  value={reviewerRating}
                  onChange={(e) => setReviewerRating(Number(e.target.value))}
                  className="text-xs p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 font-semibold"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Poor)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Bad)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewerTitle}
                  onChange={(e) => setReviewerTitle(e.target.value)}
                  placeholder="e.g. Best Aviators I have ever worn"
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="Share details regarding fit, optical clarity, lens glare and comfort..."
                  className="w-full text-xs p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-6 uppercase tracking-wider transition-colors disabled:bg-red-400"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4 divide-y divide-neutral-100">
            {reviews.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4">Be the first to review this iconic frame.</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-900">{rev.customerName}</span>
                      {rev.verifiedPurchase && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-xs flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400">{rev.createdAt}</span>
                  </div>

                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>

                  {rev.title && <h4 className="font-bold text-xs text-neutral-900">{rev.title}</h4>}
                  <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <h2 className="text-xl font-black uppercase tracking-tight text-neutral-900 mb-8">
              You May Also Admire
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
