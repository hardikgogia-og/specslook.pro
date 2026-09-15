import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, Calendar, ArrowRight, Printer, Share2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { PostCheckoutPrescription } from '../components/PostCheckoutPrescription.tsx';

export const OrderConfirmationView: React.FC = () => {
  const { lastPlacedOrder, navigateTo } = useStore();

  useEffect(() => {
    // Fire celebratory confetti on mounting
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!lastPlacedOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Package className="w-12 h-12 text-neutral-400 mb-3" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">No active order found</h2>
        <p className="text-xs text-neutral-500 mb-6">You haven't placed an order in this session.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-neutral-900 text-white text-xs font-bold py-3 px-6 uppercase tracking-wider hover:bg-red-600 transition-colors"
        >
          Browse Frames
        </button>
      </div>
    );
  }

  const order = lastPlacedOrder;

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white p-8 border border-neutral-200 rounded-xs shadow-sm text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1">
            ORDER CONFIRMED & SECURED
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-neutral-900 tracking-tight">
            Thank You, {order.customer.fullName}!
          </h1>
          <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto">
            Your Specslook handcrafted eyewear order has been successfully scheduled. We will send updates to{' '}
            <strong className="text-neutral-900">{order.customer.email}</strong> and SMS to{' '}
            <strong className="text-neutral-900">+91 {order.customer.phone}</strong>.
          </p>

          <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600">
            <div>
              <span className="text-neutral-400 block uppercase text-[10px] font-bold">Order Number</span>
              <span className="font-mono font-bold text-neutral-900 text-sm">{order.orderNumber}</span>
            </div>
            <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
            <div>
              <span className="text-neutral-400 block uppercase text-[10px] font-bold">Payment Method</span>
              <span className="font-bold text-neutral-900 uppercase">
                {order.paymentMethod === 'cashfree' ? 'Paid via Cashfree' : 'Cash on Delivery (COD)'}
              </span>
            </div>
            <div className="h-8 w-px bg-neutral-200 hidden sm:block" />
            <div>
              <span className="text-neutral-400 block uppercase text-[10px] font-bold">Estimated Delivery</span>
              <span className="font-bold text-neutral-900">{order.estimatedDeliveryDate}</span>
            </div>
          </div>
        </div>

        {/* STEP 2: POST-CHECKOUT PRESCRIPTION / OPTOMETRIST EXAM SECTION */}
        <div className="mb-6">
          <PostCheckoutPrescription order={order} />
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-xs shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-neutral-900">
              Purchased Eyewear ({order.items.length})
            </h2>
            <button
              onClick={() => window.print()}
              className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="divide-y divide-neutral-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 flex items-center gap-4">
                <div className="w-16 h-16 bg-neutral-100 p-1.5 rounded-xs border border-neutral-200 shrink-0">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex-1 text-xs">
                  <h3 className="font-bold text-neutral-900">{item.productName}</h3>
                  <div className="text-[11px] text-neutral-500">
                    SKU: {item.sku} {item.variantName && `• ${item.variantName}`}
                  </div>
                  <div className="text-neutral-600 mt-0.5">Quantity: {item.quantity}</div>
                </div>
                <div className="text-right text-xs font-bold text-neutral-900">
                  ₹{item.total.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address & Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 text-xs">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">Shipping Address</h3>
              <p className="text-neutral-600 leading-relaxed">
                {order.customer.fullName}<br />
                {order.customer.addressLine1}<br />
                {order.customer.addressLine2 && <>{order.customer.addressLine2}<br /></>}
                {order.customer.city}, {order.customer.state} - {order.customer.pinCode}<br />
                Phone: +91 {order.customer.phone}
              </p>
            </div>

            <div className="space-y-1.5 bg-neutral-50 p-4 rounded-xs border border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({order.couponCode})</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Insured Express Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total Paid / Due</span>
                <span className="text-red-600">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => navigateTo('tracking', { query: order.orderNumber })}
              className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold py-3 px-6 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-red-500" />
              <span>Track This Shipment</span>
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto text-xs font-bold text-neutral-800 hover:text-red-600 flex items-center justify-center gap-1.5 py-3 px-4"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
