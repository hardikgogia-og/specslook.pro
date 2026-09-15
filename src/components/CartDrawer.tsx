import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    navigateTo
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;
  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const shippingFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : 199;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    const res = await applyCouponCode(couponInput.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="font-extrabold text-base uppercase tracking-wider text-neutral-900">
                Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close Bag"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-neutral-100 px-5 py-3 border-b border-neutral-200">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-1.5">
              <span>
                {freeShippingLeft === 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Unlocked Free Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-red-600">₹{freeShippingLeft.toLocaleString('en-IN')}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-neutral-500 text-[11px]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg mb-1">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Explore our iconic Aviator, Wayfarer and Clubmaster collections crafted for timeless distinction.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="bg-neutral-900 hover:bg-red-600 text-white text-xs font-bold py-3 px-6 uppercase tracking-wider transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const isSecondaryVariant = !!(item.variant && item.product.variants && item.product.variants.findIndex(v => v.id === item.variant?.id) > 0);
                const itemImage = (isSecondaryVariant && item.variant?.images?.[0])
                  ? item.variant.images[0]
                  : (item.product.images?.[0] || item.variant?.images?.[0]);
                return (
                  <div
                    key={`${item.productId}-${item.variantId || 'novar'}-${item.lensAddon?.id || 'none'}-${index}`}
                    className="pt-4 first:pt-0 flex gap-3.5"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-neutral-100 p-2 shrink-0 rounded-xs flex items-center justify-center border border-neutral-200/60">
                      <img
                        src={itemImage}
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.variantId, item.lensAddon?.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-neutral-500 mt-0.5 space-y-0.5">
                          {item.variant && <div>Color: <span className="font-medium text-neutral-700">{item.variant.colorName}</span></div>}
                          {item.lensAddon ? (
                            <div className="text-[10px] text-neutral-700 bg-neutral-100/90 border border-neutral-200 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs mt-1">
                              <span className="font-semibold">{item.lensAddon.name}</span>
                              {item.lensAddon.price > 0 ? (
                                <span className="text-red-600 font-bold">+₹{item.lensAddon.price}</span>
                              ) : (
                                <span className="text-emerald-700 font-medium">Included</span>
                              )}
                            </div>
                          ) : item.selectedLensType ? (
                            <div className="text-[10px] text-neutral-600 bg-neutral-100 inline-block px-1.5 py-0.5 rounded-xs mt-1">
                              {item.selectedLensType}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-neutral-300 rounded-xs">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity - 1, item.lensAddon?.id)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity + 1, item.lensAddon?.id)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm text-neutral-900">
                            ₹{(((item.product.salePrice + (item.lensAddon?.price || 0))) * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.product.price > item.product.salePrice && (
                            <div className="text-[10px] text-neutral-400 line-through">
                              ₹{(((item.product.price + (item.lensAddon?.price || 0))) * item.quantity).toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Area with Coupons and Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/70 space-y-3.5">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xs flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Code: {appliedCoupon.code}</span>
                      <span className="text-emerald-700 font-bold">(-₹{appliedCoupon.discount.toLocaleString('en-IN')})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-500 hover:text-red-600 text-[11px] font-bold underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Discount Code (e.g. SPECS10)"
                        className="flex-1 bg-white border border-neutral-300 text-xs px-3 py-2 uppercase font-medium focus:outline-none focus:border-neutral-900"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className="bg-neutral-900 hover:bg-neutral-950 disabled:bg-neutral-400 text-white text-xs font-bold px-3.5 py-2 uppercase tracking-wider transition-colors"
                      >
                        {couponLoading ? 'Verifying...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-neutral-500">
                      <span>Popular codes:</span>
                      <button
                        type="button"
                        onClick={() => applyCouponCode('SPECS10')}
                        className="font-bold text-neutral-800 underline hover:text-red-600"
                      >
                        SPECS10
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => applyCouponCode('WELCOME500')}
                        className="font-bold text-neutral-800 underline hover:text-red-600"
                      >
                        WELCOME500
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-neutral-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Insured Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 uppercase font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span className="text-base text-red-600 font-black">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="drawer-proceed-to-checkout"
                onClick={handleProceedToCheckout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                🔒 256-Bit SSL Encryption • 100% Cash on Delivery (COD) Pan-India
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
