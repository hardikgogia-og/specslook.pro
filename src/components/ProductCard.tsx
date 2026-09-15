import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../types.ts';
import { useStore } from '../context/StoreContext.tsx';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];
  // Prioritize the admin-configured primary product image for the initial presentation,
  // switching to variant-specific imagery when a secondary color swatch is actively clicked
  const displayImage = (selectedVariantIndex > 0 && activeVariant?.images?.[0])
    ? activeVariant.images[0]
    : (product.images?.[0] || activeVariant?.images?.[0]);
  const secondaryImage = (selectedVariantIndex > 0 && activeVariant?.images?.[1])
    ? activeVariant.images[1]
    : (product.images?.[1] || displayImage);
  const inWishlist = isInWishlist(product.id);

  const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white border border-neutral-200/80 rounded-sm overflow-hidden hover:shadow-xl hover:border-neutral-900 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Bar */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-red-600 text-white font-bold text-[10px] tracking-wider px-2 py-0.5 uppercase shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.specifications.isPolarized && (
          <span className="bg-neutral-950 text-white font-medium text-[9px] tracking-widest px-1.5 py-0.5 uppercase flex items-center gap-1 border border-neutral-800">
            <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
            POLARIZED
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-neutral-100 text-neutral-800 font-semibold text-[9px] tracking-wider px-1.5 py-0.5 uppercase border border-neutral-300 flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            BESTSELLER
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`wishlist-btn-${product.id}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        aria-label="Save to Wishlist"
        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-red-600 hover:bg-white shadow-xs transition-colors"
      >
        <Heart
          className={`w-4 h-4 transition-transform active:scale-125 ${
            inWishlist ? 'fill-red-600 text-red-600' : 'text-neutral-600'
          }`}
        />
      </button>

      {/* Product Image Area */}
      <div
        className="relative aspect-4/3 w-full bg-neutral-100/60 overflow-hidden cursor-pointer flex items-center justify-center p-4"
        onClick={() => navigateTo('product', { slug: product.slug, id: product.id })}
      >
        <img
          src={isHovered && secondaryImage ? secondaryImage : displayImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-x-0 bottom-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('product', { slug: product.slug, id: product.id });
            }}
            className="w-full bg-neutral-900/90 hover:bg-neutral-950 text-white text-xs font-semibold py-2 px-3 flex items-center justify-center gap-1.5 tracking-wider uppercase transition-colors shadow-md backdrop-blur-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Shape and Category Tag */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-neutral-500 font-medium mb-1">
            <span>{product.specifications.frameShape} • {product.category}</span>
            <span className="text-[10px] text-neutral-400">{product.specifications.gender}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => navigateTo('product', { slug: product.slug, id: product.id })}
            className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* SKU & Short Specs */}
          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {activeVariant?.colorName || product.shortDescription}
          </p>
        </div>

        {/* Color Swatches */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                title={v.colorName}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedVariantIndex === idx
                    ? 'ring-2 ring-neutral-900 ring-offset-1 scale-110'
                    : 'border-neutral-300 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
            <span className="text-[10px] text-neutral-400 ml-1">
              +{product.variants.length} colors
            </span>
          </div>
        )}

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-neutral-900 tracking-tight">
                ₹{product.salePrice.toLocaleString('en-IN')}
              </span>
              {product.price > product.salePrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Free Express Delivery</span>
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, activeVariant);
            }}
            aria-label="Add to Bag"
            className="bg-neutral-900 hover:bg-red-600 text-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-colors shadow-xs group/btn active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};
