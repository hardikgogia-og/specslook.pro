import React, { useState } from 'react';
import { User, Heart, Package, MapPin, Search, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { Order } from '../types.ts';

export const CustomerAccountView: React.FC = () => {
  const { wishlist, viewParams, navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState<'wishlist' | 'orders'>(viewParams.tab || 'wishlist');
  const [lookupEmail, setLookupEmail] = useState('');
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersSearched, setOrdersSearched] = useState(false);

  const handleLookupOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail.trim()) return;
    setLoadingOrders(true);
    setOrdersSearched(true);

    try {
      const res = await fetch(`/api/orders/customer/${encodeURIComponent(lookupEmail.trim())}`);
      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
      if (res.ok && Array.isArray(data)) {
        setCustomerOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-xs shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xl">
              <User className="w-7 h-7 text-neutral-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest">
                SPECSLOOK CLIENT PRIVÉ
              </div>
              <h1 className="text-2xl font-black uppercase text-neutral-900 tracking-tight">
                Client Profile & Saved Frames
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xs border border-neutral-200">
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'wishlist' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist ({wishlist.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Purchase History</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-white p-12 border border-neutral-200 rounded-xs text-center">
                <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-neutral-900">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-6">
                  Save your favorite Aviator, Wayfarer or Clubmaster frames to view them anytime.
                </p>
                <button
                  onClick={() => navigateTo('shop')}
                  className="bg-neutral-900 text-white text-xs font-bold py-3 px-6 uppercase tracking-wider hover:bg-red-600 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders Lookup */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-xs shadow-xs">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-900 mb-2">
                Find Your Past Orders
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Enter your order email address to retrieve all historic transactions, invoices, and shipment tracking links.
              </p>

              <form onSubmit={handleLookupOrders} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="Enter your order email address"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingOrders}
                  className="bg-neutral-900 hover:bg-red-600 text-white text-xs font-bold px-5 uppercase tracking-wider transition-colors"
                >
                  {loadingOrders ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>

            {/* Orders list */}
            {ordersSearched && (
              <div className="space-y-4">
                {customerOrders.length === 0 ? (
                  <div className="bg-white p-8 border border-neutral-200 rounded-xs text-center text-xs text-neutral-500">
                    No orders registered under <strong className="text-neutral-900">{lookupEmail}</strong>.
                  </div>
                ) : (
                  customerOrders.map((ord) => (
                    <div key={ord.id} className="bg-white p-6 border border-neutral-200 rounded-xs shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2">
                        <div>
                          <div className="font-mono font-bold text-sm text-neutral-900">{ord.orderNumber}</div>
                          <div className="text-[11px] text-neutral-500">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {ord.orderStatus}
                          </span>
                          <button
                            onClick={() => navigateTo('tracking', { query: ord.orderNumber })}
                            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                          >
                            <span>Live Tracking</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-neutral-100">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="py-2 first:pt-0 flex items-center justify-between text-xs">
                            <span className="font-medium text-neutral-800">
                              {item.quantity}x {item.productName} ({item.sku})
                            </span>
                            <span className="font-bold text-neutral-900">₹{item.total.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-neutral-200 flex justify-between text-xs font-bold text-neutral-900">
                        <span>Total Paid ({ord.paymentMethod.toUpperCase()})</span>
                        <span className="text-sm font-black text-red-600">₹{ord.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
