import React, { useState, useEffect } from 'react';
import { Truck, Search, CheckCircle2, Clock, PackageCheck, AlertCircle, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import { useStore } from '../context/StoreContext.tsx';

export const OrderTrackingView: React.FC = () => {
  const { viewParams, navigateTo } = useStore();
  const [searchQuery, setSearchQuery] = useState(viewParams.query || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.error || 'No matching order found for the provided information');
      }
    } catch (err) {
      setError('Connection failure while searching for order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewParams.query) {
      fetchOrder(viewParams.query);
    }
  }, [viewParams.query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchQuery);
  };

  const statusSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepStatus = (step: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'Cancelled') {
      return step === 'Pending' ? 'completed' : 'cancelled';
    }
    const stepIdx = statusSteps.indexOf(step);
    const currentIdx = statusSteps.indexOf(currentStatus);
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white p-8 border border-neutral-200 rounded-xs shadow-xs mb-8 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1">
            REAL-TIME TRACKING
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-neutral-900 tracking-tight">
            Track Your Specslook Shipment
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto mb-6">
            Enter your Order Number (e.g. <span className="font-mono font-bold text-neutral-800">ORD-1001</span>) or 10-digit registered mobile number.
          </p>

          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order Number or Phone (e.g. ORD-1001)"
                className="w-full text-xs pl-9 pr-3 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="bg-neutral-900 hover:bg-red-600 disabled:bg-neutral-400 text-white text-xs font-bold px-6 uppercase tracking-wider transition-colors"
            >
              {loading ? 'Locating...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center justify-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Tracking Progress Card */}
        {order && (
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-xs shadow-xs space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono font-black text-lg text-neutral-900">{order.orderNumber}</h2>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-xs ${
                    order.orderStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.orderStatus === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[11px] text-neutral-400 uppercase font-bold">Estimated Delivery</div>
                <div className="text-sm font-extrabold text-neutral-900 flex items-center sm:justify-end gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>{order.estimatedDeliveryDate}</span>
                </div>
              </div>
            </div>

            {/* Courier Dispatch Banner */}
            {order.trackingNumber && (
              <div className="bg-neutral-100 p-4 border border-neutral-200 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block uppercase text-[10px] font-bold">Courier Partner</span>
                  <span className="font-extrabold text-neutral-900 text-sm">
                    {order.courierName || 'BlueDart Air Express'}
                  </span>
                  <div className="text-neutral-600 font-mono text-[11px] mt-0.5">
                    AWB: {order.trackingNumber}
                  </div>
                </div>

                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-colors rounded-xs self-start sm:self-center"
                  >
                    <span>Direct Courier Tracking</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Visual Stepper */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-900 mb-6">
                Shipment Milestones
              </h3>

              <div className="grid grid-cols-5 gap-2 relative">
                {statusSteps.map((step, idx) => {
                  const state = getStepStatus(step, order.orderStatus);
                  return (
                    <div key={step} className="flex flex-col items-center text-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                        state === 'completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : state === 'active'
                          ? 'bg-neutral-900 text-white ring-4 ring-neutral-200'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                      }`}>
                        {state === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        state === 'active' ? 'text-red-600 font-black' : state === 'completed' ? 'text-neutral-900' : 'text-neutral-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Log */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-900 mb-4">
                  Activity Log
                </h3>
                <div className="space-y-4">
                  {order.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-bold text-neutral-900">{event.status}: {event.message}</div>
                        <div className="text-[11px] text-neutral-400">{new Date(event.timestamp).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destination Address & Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200 text-xs">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                  <span>Destination Address</span>
                </h4>
                <p className="text-neutral-600 leading-relaxed pl-5">
                  {order.customer.fullName}<br />
                  {order.customer.addressLine1}<br />
                  {order.customer.addressLine2 && <>{order.customer.addressLine2}<br /></>}
                  {order.customer.city}, {order.customer.state} - {order.customer.pinCode}
                </p>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Package Contents ({order.items.length})
                </h4>
                <div className="space-y-2 divide-y divide-neutral-100">
                  {order.items.map((item, i) => (
                    <div key={i} className="pt-2 first:pt-0 flex items-center justify-between">
                      <span className="font-medium text-neutral-900">{item.quantity}x {item.productName}</span>
                      <span className="font-bold text-neutral-800">₹{item.total.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
