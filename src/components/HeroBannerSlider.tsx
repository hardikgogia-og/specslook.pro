import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Eye,
  Sun
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

// Photorealistic Hero Images of people wearing Specslook eyewear
import heroAttachmentsImg from '../assets/images/hero_attachments_shift_1789659615986.jpg';
import heroOpticalsImg from '../assets/images/hero_opticals_person_1789659629107.jpg';
import heroSunglassesImg from '../assets/images/hero_sunglasses_sun_1789659642131.jpg';
import heroLifestyleImg from '../assets/images/hero_lifestyle_duo_1789659659052.jpg';

interface SlideData {
  id: string;
  tabLabel: string;
  tabIcon: React.ReactNode;
  badge: string;
  badgeColor: string;
  image: string;
  primaryCtaText: string;
  primaryAction: { view: 'shop' | 'product'; params: Record<string, any> };
}

export const HeroBannerSlider: React.FC = () => {
  const { navigateTo } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const slides: SlideData[] = [
    {
      id: 'attachments-6in1',
      tabLabel: '6-in-1 Attachments',
      tabIcon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      badge: 'INNOVATION SPOTLIGHT • 6-IN-1 ATTACHMENTS',
      badgeColor: 'bg-amber-500 text-black',
      image: heroAttachmentsImg,
      primaryCtaText: 'Shop 6-in-1 Attachments',
      primaryAction: {
        view: 'shop',
        params: { category: 'Attachments' }
      }
    },
    {
      id: 'opticals-clarity',
      tabLabel: 'Optical Eyeglasses',
      tabIcon: <Eye className="w-3.5 h-3.5 text-blue-400" />,
      badge: 'FLAGSHIP SPOTLIGHT • PREMIUM OPTICALS',
      badgeColor: 'bg-blue-600 text-white',
      image: heroOpticalsImg,
      primaryCtaText: 'Shop Eyeglasses',
      primaryAction: {
        view: 'shop',
        params: { category: 'Eyeglasses' }
      }
    },
    {
      id: 'sunglasses-polarized',
      tabLabel: 'Polarized Sunglasses',
      tabIcon: <Sun className="w-3.5 h-3.5 text-yellow-400" />,
      badge: 'SOLAR SPOTLIGHT • POLARIZED SUNGLASSES',
      badgeColor: 'bg-red-600 text-white',
      image: heroSunglassesImg,
      primaryCtaText: 'Shop Sunglasses',
      primaryAction: {
        view: 'shop',
        params: { category: 'Sunglasses' }
      }
    },
    {
      id: 'signature-lifestyle',
      tabLabel: 'Signature Collection',
      tabIcon: <Sparkles className="w-3.5 h-3.5 text-red-400" />,
      badge: 'NEW ARRIVALS • SIGNATURE EYEWEAR',
      badgeColor: 'bg-emerald-600 text-white',
      image: heroLifestyleImg,
      primaryCtaText: 'Shop All Collections',
      primaryAction: {
        view: 'shop',
        params: {}
      }
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay with fast 2-second timer as requested
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Handle Touch Swipes for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const active = slides[currentSlide];

  return (
    <section
      id="hero-banner-slider"
      className="w-full bg-neutral-950 text-white select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Photo Stage: Fully visible picture with subtle, small title at top-left corner */}
      <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[520px] bg-neutral-950 overflow-hidden">
        {slides.map((slide, index) => {
          const isCurrent = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.badge}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center sm:object-right-top transition-transform duration-3000 ease-out ${
                  isCurrent ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Small, discreet title badge at top left - doesn't interrupt or block the photo */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-200 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{active.badge}</span>
          </div>
        </div>
      </div>

      {/* 2. Black background container below the photo */}
      <div className="w-full bg-neutral-950 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col items-center gap-3">
          {/* Shop button: smaller and placed below the photo */}
          <div className="flex justify-center w-full">
            <button
              id={`hero-cta-${active.id}`}
              type="button"
              onClick={() => navigateTo(active.primaryAction.view, active.primaryAction.params)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-5 uppercase tracking-wider transition-all shadow-md hover:shadow-red-600/40 flex items-center justify-center gap-2 group cursor-pointer rounded-xs border border-red-500/30"
            >
              <span>{active.primaryCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Movers (category tabs + previous/next controls): placed even bottom than the shop button */}
          <div className="w-full pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-neutral-800/80">
            {/* Quick Collection Navigation Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
              {slides.map((slide, idx) => {
                const isSelected = idx === currentSlide;
                return (
                  <button
                    key={slide.id}
                    id={`hero-tab-${slide.id}`}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`text-left px-3 py-1.5 sm:py-2 rounded-xs transition-all relative overflow-hidden flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-800 border border-neutral-600 shadow-xs'
                        : 'bg-neutral-900/90 hover:bg-neutral-800/60 border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="shrink-0 scale-90">{slide.tabIcon}</span>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-medium block truncate text-white">
                        {slide.tabLabel}
                      </span>
                    </div>

                    {/* Animated Progress Bar on Active Tab with 2s animation */}
                    {isSelected && (
                      <span
                        key={`progress-${currentSlide}-${isPaused}`}
                        className="absolute bottom-0 left-0 h-0.5 bg-red-500"
                        style={{
                          animation: isPaused ? 'none' : 'heroProgressBar 2s linear forwards',
                          width: isPaused ? '100%' : undefined
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Slide Numbers & Left/Right Arrows (Movers) */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              <div className="text-[11px] font-mono tracking-widest text-neutral-400">
                <span className="text-white font-bold text-xs">0{currentSlide + 1}</span>
                <span className="mx-1 text-neutral-600">/</span>
                <span>0{slides.length}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  id="hero-prev-btn"
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-neutral-900 hover:bg-neutral-700 text-white transition-all flex items-center justify-center border border-neutral-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="hero-next-btn"
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-neutral-900 hover:bg-neutral-700 text-white transition-all flex items-center justify-center border border-neutral-800 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS animation for progress bar - 2s */}
      <style>{`
        @keyframes heroProgressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};
