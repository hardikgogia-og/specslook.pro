import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { updateSEO } from '../utils/seo.ts';

export const NotFoundView: React.FC = () => {
  const { navigateTo } = useStore();

  useEffect(() => {
    updateSEO({
      title: 'Page Not Found (404) | Specslook Official Store',
      description: 'The requested page was not found on Specslook. Explore our handcrafted eyeglasses, polarized sunglasses, and doorstep home eye tests.',
      canonicalPath: '/404.html',
      noIndex: true
    });
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-neutral-50 selection:bg-red-600 selection:text-white">
      <div className="max-w-2xl w-full text-center">
        {/* Visual 404 Badge */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 border border-red-200 text-red-600 text-3xl font-black tracking-tight shadow-sm">
          404
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 mb-3 font-serif">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          The page you are looking for does not exist, has been removed, or the link may have expired.
        </p>

        {/* Primary Action Button */}
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-bold uppercase mb-12">
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              navigateTo('home');
            }}
            className="bg-neutral-950 text-white px-6 py-3 rounded-xs hover:bg-neutral-800 transition-colors shadow-md cursor-pointer"
          >
            Return to Homepage
          </button>

          <button
            onClick={() => {
              window.history.pushState({}, '', '/product-category/eyeglasses/');
              navigateTo('shop', { category: 'Eyeglasses' });
            }}
            className="bg-red-600 text-white px-5 py-3 rounded-xs hover:bg-red-700 transition-colors shadow-md cursor-pointer"
          >
            Eyeglasses
          </button>

          <button
            onClick={() => {
              window.history.pushState({}, '', '/product-category/sunglasses/');
              navigateTo('shop', { category: 'Sunglasses' });
            }}
            className="border border-neutral-300 bg-white text-neutral-800 px-5 py-3 rounded-xs hover:border-neutral-950 transition-colors shadow-xs cursor-pointer"
          >
            Shades &amp; Sunglasses
          </button>

          <button
            onClick={() => {
              window.history.pushState({}, '', '/home/home-eyetest/');
              navigateTo('home-eyetest');
            }}
            className="border border-neutral-300 bg-white text-neutral-800 px-5 py-3 rounded-xs hover:border-neutral-950 transition-colors shadow-xs cursor-pointer"
          >
            Book Home Eye Test
          </button>
        </div>

        {/* Customer Care Concierge Info */}
        <div className="border-t border-neutral-200 pt-8 text-xs text-neutral-500 max-w-lg mx-auto">
          <p className="mb-2">Need assistance with optical prescription lenses or frames?</p>
          <p className="font-semibold text-neutral-800">
            WhatsApp Concierge:{' '}
            <a
              href="https://wa.me/918368853448"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 underline font-bold hover:text-red-700"
            >
              +91 83688 53448
            </a>
            {' '}&bull;{' '}
            Email:{' '}
            <a
              href="mailto:info@specslook.com"
              className="text-red-600 underline font-bold hover:text-red-700"
            >
              info@specslook.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
