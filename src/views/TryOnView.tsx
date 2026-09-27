import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Check,
  ShoppingBag,
  ArrowRight,
  User,
  Heart,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { VirtualTryOnModal } from '../components/VirtualTryOnModal.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { updateSEO } from '../utils/seo.ts';
import { Product } from '../types.ts';

export const TryOnView: React.FC = () => {
  const { products, viewParams, navigateTo, openTryOn } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Sunglasses' | 'Eyeglasses' | 'Attachments'>('All');

  // Handle product param passed from navigation
  useEffect(() => {
    updateSEO({
      title: '3D Virtual Try-On Studio | Specslook Eyewear',
      description: 'Experience real-time camera face tracking to try on designer glasses, sunglasses, and titanium optical frames before you buy with cash on delivery across India.',
      canonicalPath: '/try-on/',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Virtual Try-On', url: '/try-on/' }
      ]
    });

    if (viewParams.slug || viewParams.id) {
      const target = (viewParams.slug || viewParams.id).toString().toLowerCase();
      const found = products.find(p => p.slug.toLowerCase() === target || p.id === target);
      if (found) {
        setSelectedProduct(found);
      }
    } else if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [viewParams, products]);

  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Top Breadcrumb & Hero Banner */}
      <div className="bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-3">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-white">Virtual Try-On Atelier</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen AR Optical Fitting</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-3">
                3D Virtual Try-On Studio
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                See exactly how handcrafted Japanese titanium frames and luxury sunglasses look on your face in real-time. Powered by privacy-first on-device computer vision.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-xs flex items-center justify-center gap-2.5 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Launch Live Camera Try-On</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('Sunglasses');
                  setIsModalOpen(true);
                }}
                className="px-5 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xs border border-neutral-700 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Try Sunglasses</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Value Props Strip */}
      <div className="border-b border-neutral-200 bg-neutral-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Real-Time Tracking</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Smooth live webcam tracking adapts to your natural head movements.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">100% Private</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Processed entirely on your device. No video or photos are saved to any server.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Custom Fit Calibration</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Fine-tune pupillary scale, bridge height, tilt, and sun tint darkness.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Model Face Mode</h4>
              <p className="text-xs text-neutral-500 mt-0.5">No webcam? Try any glasses on high-resolution oval, square, and round face models.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Grid for Selecting Frames */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
              Browse Frames Ready for Virtual Try-On
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Select any pair to immediately try on with your camera or model faces.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['All', 'Sunglasses', 'Eyeglasses', 'Attachments'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="relative group/tryon">
              <ProductCard product={product} />

              {/* Floating Quick Try-On Button over card */}
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
                className="absolute top-2.5 right-12 z-10 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-transform active:scale-95 cursor-pointer"
                title="Virtual Try-On"
              >
                <Camera className="w-3 h-3" />
                <span>Try On</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Try-On Interactive Modal */}
      <VirtualTryOnModal
        initialProduct={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
