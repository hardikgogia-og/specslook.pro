import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types.ts';
import { ProductCard } from './ProductCard.tsx';
import { useStore } from '../context/StoreContext.tsx';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  autoRunIntervalMs?: number;
  category: 'Eyeglasses' | 'Sunglasses';
  id?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  subtitle,
  badge,
  products,
  autoRunIntervalMs = 2000,
  category,
  id
}) => {
  const { navigateTo } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Determine responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate maximum index
  const maxIndex = Math.max(0, products.length - itemsPerSlide);

  // Auto-run every 2 seconds (autoRunIntervalMs)
  useEffect(() => {
    if (products.length <= itemsPerSlide || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoRunIntervalMs);

    return () => clearInterval(timer);
  }, [products.length, itemsPerSlide, isPaused, maxIndex, autoRunIntervalMs]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (!products || products.length === 0) {
    return null;
  }

  // Calculate total pages for dot indicators
  const totalPages = maxIndex + 1;

  return (
    <section id={id} className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Header with Title, Badge, Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-neutral-200">
        <div>
          {badge && (
            <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-1 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('shop', { category })}
            className="text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-red-600 flex items-center gap-1 group mr-2"
          >
            <span>View All {category}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-xs bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 flex items-center justify-center transition-colors border border-neutral-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="w-9 h-9 rounded-xs bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 flex items-center justify-center transition-colors border border-neutral-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={sliderRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="shrink-0 px-2.5"
                style={{ width: `${100 / itemsPerSlide}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Auto-run status indicator & Dot Navigation */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: Math.min(8, totalPages) }).map((_, idx) => {
              const isActive = Math.round(currentIndex * (Math.min(8, totalPages) - 1) / maxIndex) === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const targetIdx = Math.round(idx * maxIndex / (Math.min(8, totalPages) - 1));
                    setCurrentIndex(targetIdx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 transition-all rounded-full cursor-pointer ${
                    isActive ? 'w-8 bg-red-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
