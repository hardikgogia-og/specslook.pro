import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Eye,
  Sun,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  MapPin
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
  title: string;
  titleHighlight: string;
  subtitle: string;
  priceNote?: string;
  image: string;
  primaryCtaText: string;
  primaryAction: { view: 'shop' | 'product'; params: Record<string, any> };
  secondaryCtaText: string;
  secondaryAction: { view: 'shop' | 'stores'; params?: Record<string, any> };
  highlights: string[];
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
      badge: 'INNOVATION SPOTLIGHT • 1 SECOND TRANSFORMATION',
      badgeColor: 'bg-amber-500 text-black',
      title: 'ENDLESS SHIFTS',
      titleHighlight: '6-IN-1 CONVERTIBLE',
      subtitle:
        '1 Base Optical Frame + 5 Magnetic Snap Lenses. Instantly convert from crystal-clear everyday prescription glasses to Dark Polarized Sunglasses, Night Driving Amber & Mirror Sun Shield with zero wobble.',
      priceNote: 'Complete 6-in-1 Set with Signature Case • Only ₹2,499 (50% OFF)',
      image: heroAttachmentsImg,
      primaryCtaText: 'Shop 6-in-1 Attachments',
      primaryAction: {
        view: 'product',
        params: { slug: 'specslook-6in1-magnetic-clip-on-eyeglasses' }
      },
      secondaryCtaText: 'Explore All Attachments',
      secondaryAction: {
        view: 'shop',
        params: { category: 'Attachments' }
      },
      highlights: [
        '5 Magnetic Snap Lenses Included',
        'Polarized + Night Vision Amber',
        'Swiss TR90 Ultra-Light Polymer',
        'Neodymium Precision Magnetic Lock'
      ]
    },
    {
      id: 'opticals-clarity',
      tabLabel: 'Optical Eyeglasses',
      tabIcon: <Eye className="w-3.5 h-3.5 text-blue-400" />,
      badge: 'FLAGSHIP OPTICALS • BLUE-LIGHT DEFENSE',
      badgeColor: 'bg-blue-600 text-white',
      title: 'CLARITY REDEFINED',
      titleHighlight: 'PREMIUM OPTICALS',
      subtitle:
        'Handcrafted aerospace Japanese titanium and Italian Mazzucchelli acetate with digital zero eye-strain Blue-Cut filters. Engineered for coders, designers, executives, and long screen hours.',
      priceNote: 'Zero Power & Prescription from ₹299 • Free 14-Day Doorstep Trial',
      image: heroOpticalsImg,
      primaryCtaText: 'Shop Eyeglasses',
      primaryAction: {
        view: 'shop',
        params: { category: 'Eyeglasses' }
      },
      secondaryCtaText: 'Explore Blue-Cut Lenses',
      secondaryAction: {
        view: 'shop',
        params: { category: 'Blue Light Blockers' }
      },
      highlights: [
        'Anti-Glare Digital Blue-Cut Filter',
        'Aerospace Titanium & Italian Acetate',
        'Certified Zeiss Optical Calibration',
        '14-Day Hassle-Free Doorstep Trial'
      ]
    },
    {
      id: 'sunglasses-polarized',
      tabLabel: 'Polarized Sunglasses',
      tabIcon: <Sun className="w-3.5 h-3.5 text-yellow-400" />,
      badge: 'ICONIC HERITAGE • 100% UV400 MINERAL GLASS',
      badgeColor: 'bg-red-600 text-white',
      title: 'THE ICONS COLLECTION',
      titleHighlight: 'POLARIZED SUNGLASSES',
      subtitle:
        'Legendary Aviator, Wayfarer, and Clubmaster silhouettes re-engineered with aerospace metal and precision polarized mineral glass that cancels 99.9% of blinding road, water, and outdoor glare.',
      priceNote: 'Iconic Sunwear Starting at ₹999 • 100% Cash on Delivery Across India',
      image: heroSunglassesImg,
      primaryCtaText: 'Shop Sunglasses',
      primaryAction: {
        view: 'shop',
        params: { category: 'Sunglasses' }
      },
      secondaryCtaText: 'Explore Polarized Optics',
      secondaryAction: {
        view: 'shop',
        params: { category: 'Polarized' }
      },
      highlights: [
        '100% UV400 Ultraviolet Shield',
        'Glare-Canceling HD Polarized Optics',
        'Scratch-Resistant Mineral Lenses',
        'Handcrafted Aviator & Wayfarer Cuts'
      ]
    },
    {
      id: 'signature-lifestyle',
      tabLabel: 'Signature Collection',
      tabIcon: <Sparkles className="w-3.5 h-3.5 text-red-400" />,
      badge: 'AUTUMN / WINTER 2026 • NEW ARRIVALS',
      badgeColor: 'bg-emerald-600 text-white',
      title: 'WEAR YOUR CONFIDENCE',
      titleHighlight: 'SPECSLOOK ARCHETYPE',
      subtitle:
        'From high-stakes boardroom meetings to weekend coastal escapes. Discover designer eyewear engineered to fit Indian facial profiles with custom bridge comfort and featherlight durability.',
      priceNote: 'Use Code WELCOME500 for Flat ₹500 OFF on Your First Order',
      image: heroLifestyleImg,
      primaryCtaText: 'Explore Full Collection',
      primaryAction: {
        view: 'shop',
        params: {}
      },
      secondaryCtaText: 'Visit Gurugram Stores',
      secondaryAction: {
        view: 'stores',
        params: {}
      },
      highlights: [
        '5 Gurugram Flagship Optical Boutiques',
        'Complimentary 12-Step Zeiss Eye Exam',
        'Free Express Delivery Across India',
        '4.9★ Rated Customer Satisfaction'
      ]
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay with 5 second timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

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
      className="relative w-full min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] bg-neutral-950 text-white overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with smooth transitions */}
      {slides.map((slide, index) => {
        const isCurrent = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center sm:object-right-top transition-transform duration-7000 ease-out ${
                isCurrent ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Cinematic Multi-Layer Gradient Overlays for optimal text contrast and realistic warmth */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-neutral-950/20 lg:from-neutral-950 lg:via-neutral-950/75 lg:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30" />
          </div>
        );
      })}

      {/* Main Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-between py-12 sm:py-16 lg:py-20">
        <div className="my-auto max-w-2xl pt-2 sm:pt-4">
          {/* Badge with pulse dot */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xs shadow-md ${active.badgeColor}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              {active.badge}
            </span>
          </div>

          {/* Large Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
            {active.title}
            <span className="block text-red-500 mt-1">{active.titleHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-xs sm:text-sm lg:text-base text-neutral-200 font-normal leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
            {active.subtitle}
          </p>

          {/* Price / Promo Note Tag */}
          {active.priceNote && (
            <div className="mt-3.5 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xs border border-white/20 text-[11px] sm:text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{active.priceNote}</span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              id={`hero-cta-primary-${active.id}`}
              type="button"
              onClick={() => navigateTo(active.primaryAction.view, active.primaryAction.params)}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 sm:px-8 uppercase tracking-widest transition-all shadow-xl hover:shadow-red-600/30 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{active.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              id={`hero-cta-secondary-${active.id}`}
              type="button"
              onClick={() => navigateTo(active.secondaryAction.view, active.secondaryAction.params)}
              className="bg-white/10 hover:bg-white text-white hover:text-neutral-950 font-extrabold text-xs sm:text-sm py-3.5 px-5 sm:px-7 uppercase tracking-widest transition-all backdrop-blur-md border border-white/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{active.secondaryCtaText}</span>
            </button>
          </div>

          {/* Highlights checklist bar */}
          <div className="mt-7 pt-5 border-t border-white/15 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-neutral-300">
            {active.highlights.map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Collection Tabs & Indicator Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/10">
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
                  className={`text-left px-3 py-2 sm:py-2.5 rounded-xs transition-all relative overflow-hidden flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-white/20 border border-white/40 shadow-sm'
                      : 'bg-black/30 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{slide.tabIcon}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-bold block truncate text-white">
                      {slide.tabLabel}
                    </span>
                    <span className="text-[9px] text-neutral-400 hidden sm:block">
                      0{idx + 1} / 0{slides.length}
                    </span>
                  </div>

                  {/* Animated Progress Bar on Active Tab */}
                  {isSelected && (
                    <span
                      key={`progress-${currentSlide}-${isPaused}`}
                      className="absolute bottom-0 left-0 h-0.5 bg-red-500"
                      style={{
                        animation: isPaused ? 'none' : 'heroProgressBar 5.5s linear forwards',
                        width: isPaused ? '100%' : undefined
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Slide Numbers & Left/Right Arrows */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <div className="text-xs font-mono tracking-widest text-neutral-400">
              <span className="text-white font-bold text-sm">0{currentSlide + 1}</span>
              <span className="mx-1 text-neutral-600">/</span>
              <span>0{slides.length}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="hero-prev-btn"
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-9 h-9 rounded-xs bg-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center border border-white/20 backdrop-blur-xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                id="hero-next-btn"
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-9 h-9 rounded-xs bg-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center justify-center border border-white/20 backdrop-blur-xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS animation for progress bar */}
      <style>{`
        @keyframes heroProgressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};
