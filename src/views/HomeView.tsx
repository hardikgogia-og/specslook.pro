import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Eye,
  ChevronRight,
  Star,
  Compass,
  CheckCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { HeroBannerSlider } from '../components/HeroBannerSlider.tsx';
import { ProductSlider } from '../components/ProductSlider.tsx';
import { StoreLocatorForm } from '../components/StoreLocatorForm.tsx';

// AI-Generated Category Backgrounds (Matching Characters Looking Left)
import eyeglassManImg from '../assets/images/eyeglass_man_left_1789315377577.jpg';
import eyeglassWomanImg from '../assets/images/eyeglass_woman_left_1789315396068.jpg';
import eyeglassKidImg from '../assets/images/eyeglass_kid_left_1789315413137.jpg';
import sunglassManImg from '../assets/images/sunglass_man_face_1789314497936.jpg';
import sunglassWomanImg from '../assets/images/sunglass_woman_face_1789314512198.jpg';
import sunglassKidImg from '../assets/images/sunglass_kid_smile_1789314525399.jpg';

export const HomeView: React.FC = () => {
  const { products, categories, stores, blogs, navigateTo } = useStore();

  // Eyeglasses sorted with bestsellers first
  const bestSellingEyeglasses = [...products]
    .filter(p => p.category === 'Eyeglasses')
    .sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));

  // Sunglasses sorted with bestsellers first
  const bestSellingSunglasses = [...products]
    .filter(p => p.category === 'Sunglasses')
    .sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO BANNER SLIDER (Interactive High-Fashion Specslook Showcase) */}
      <HeroBannerSlider />

      {/* 1.5. DEDICATED GENDER & OPTICAL CATEGORIES */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PRECISION COLLECTIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                Shop By Category & Gender
              </h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-md">
              Tailored frame ergonomics designed specifically for Men, Women, and Kids with certified optical glass add-on options.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Eyeglasses for Men */}
            <div
              onClick={() => navigateTo('shop', { category: 'Eyeglasses', gender: 'Men' })}
              className="group relative overflow-hidden rounded-xs min-h-[320px] sm:min-h-[350px] p-6 flex flex-col justify-between cursor-pointer border border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={eyeglassManImg}
                alt="Eyeglasses for Men"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 group-hover:from-neutral-950 group-hover:via-neutral-950/70 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-2.5 py-1 rounded-xs shadow-xs">
                  OPTICAL FOR MEN
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                  Eyeglasses for Men
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed font-normal">
                  Structured titanium and bold acetate frames crafted for masculine facial geometry.
                </p>
                <div className="pt-2 text-xs font-bold text-red-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>Browse Men's Optical</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

            {/* Eyeglasses for Women */}
            <div
              onClick={() => navigateTo('shop', { category: 'Eyeglasses', gender: 'Women' })}
              className="group relative overflow-hidden rounded-xs min-h-[320px] sm:min-h-[350px] p-6 flex flex-col justify-between cursor-pointer border border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={eyeglassWomanImg}
                alt="Eyeglasses for Women"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 group-hover:from-neutral-950 group-hover:via-neutral-950/70 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-2.5 py-1 rounded-xs shadow-xs">
                  OPTICAL FOR WOMEN
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                  Eyeglasses for Women
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed font-normal">
                  Elegant cat-eye, soft round, and refined lightweight metals with luxury detailing.
                </p>
                <div className="pt-2 text-xs font-bold text-red-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>Browse Women's Optical</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

            {/* Eyeglasses for Kids */}
            <div
              onClick={() => navigateTo('shop', { category: 'Eyeglasses', gender: 'Kids' })}
              className="group relative overflow-hidden rounded-xs min-h-[320px] sm:min-h-[350px] p-6 flex flex-col justify-between cursor-pointer border border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={eyeglassKidImg}
                alt="Eyeglasses for Kids"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 group-hover:from-neutral-950 group-hover:via-neutral-950/70 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-2.5 py-1 rounded-xs shadow-xs">
                  JUNIOR OPTICAL
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                  Eyeglasses for Kids
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed font-normal">
                  Impact-resistant, flexible lightweight frames with blue-light filter for school screens.
                </p>
                <div className="pt-2 text-xs font-bold text-red-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>Browse Kids' Optical</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

            {/* Sunglasses for Men */}
            <div
              onClick={() => navigateTo('shop', { category: 'Sunglasses', gender: 'Men' })}
              className="group relative overflow-hidden rounded-xs min-h-[320px] sm:min-h-[350px] p-6 flex flex-col justify-between cursor-pointer border border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={sunglassManImg}
                alt="Sunglasses for Men"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 group-hover:from-neutral-950 group-hover:via-neutral-950/70 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-2.5 py-1 rounded-xs shadow-xs">
                  SOLAR FOR MEN
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                  Sunglasses for Men
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed font-normal">
                  Military Aviators, bold square Wayfarers, and driving polarized sunglasses.
                </p>
                <div className="pt-2 text-xs font-bold text-red-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>Browse Men's Sun</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

            {/* Sunglasses for Women */}
            <div
              onClick={() => navigateTo('shop', { category: 'Sunglasses', gender: 'Women' })}
              className="group relative overflow-hidden rounded-xs min-h-[320px] sm:min-h-[350px] p-6 flex flex-col justify-between cursor-pointer border border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={sunglassWomanImg}
                alt="Sunglasses for Women"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 group-hover:from-neutral-950 group-hover:via-neutral-950/70 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-2.5 py-1 rounded-xs shadow-xs">
                  SOLAR FOR WOMEN
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                  Sunglasses for Women
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed font-normal">
                  Oversized butterfly, hexagonal metallic silhouettes, and UV400 gradient lenses.
                </p>
                <div className="pt-2 text-xs font-bold text-red-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>Browse Women's Sun</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

            {/* Sunglasses for Kids */}
            <div
              onClick={() => navigateTo('shop', { category: 'Sunglasses', gender: 'Kids' })}
              className="group relative overflow-hidden rounded-xs min-h-[320px] sm:min-h-[350px] p-6 flex flex-col justify-between cursor-pointer border border-neutral-800 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={sunglassKidImg}
                alt="Sunglasses for Kids"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20 group-hover:from-neutral-950 group-hover:via-neutral-950/70 transition-colors" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-600 px-2.5 py-1 rounded-xs shadow-xs">
                  JUNIOR SOLAR
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="relative z-10 space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                  Sunglasses for Kids
                </h3>
                <p className="text-xs text-neutral-200 leading-relaxed font-normal">
                  UV400 shatterproof polarized protection in fun, durable rubberized frames.
                </p>
                <div className="pt-2 text-xs font-bold text-red-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>Browse Kids' Sun</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Glass Add-on callout ribbon */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-neutral-950 uppercase">Precision Optical Glass Add-ons Available</h4>
                <p className="text-[11px] text-neutral-600">
                  Upgrade any frame with SL Anti Glare (+₹299), SL BluPro UV (+₹499), SL BluUltra UV (+₹899), or SL PhotoUV Gen 8 Photochromic (+₹1,299).
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('shop', { category: 'Eyeglasses' })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xs transition-colors shrink-0"
            >
              Explore Optical Frames
            </button>
          </div>
        </div>
      </section>

      {/* BEST SELLERS EYEGLASSES SLIDER (Auto-run 2 seconds) */}
      <div className="pt-2 pb-6">
        <ProductSlider
          id="eyeglasses-slider"
          title="Best Selling Eyeglasses"
          subtitle="Mastercrafted prescription optical frames engineered with Beta-Titanium and Italian Mazzucchelli acetate"
          badge="MOST POPULAR OPTICAL"
          products={bestSellingEyeglasses}
          autoRunIntervalMs={2000}
          category="Eyeglasses"
        />
      </div>

      {/* LUXURY DIVIDER & SUNGLASSES AUTOPLAY VIDEO BANNER WITH OFFICIAL TAGLINE */}
      <section className="relative my-10 bg-neutral-950 text-white overflow-hidden border-y border-neutral-800 shadow-2xl">
        {/* Subtle Textured Background with Dark Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1800&q=80"
            alt="Specslook Luxury Eyewear Ambient"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Tagline & Brand Callout */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 bg-red-600/90 text-white text-[11px] font-extrabold uppercase px-3 py-1 tracking-widest rounded-xs shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SIGNATURE SOLAR COLLECTION</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                  OUR MOTTO &amp; PROMISE
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  Change your look with <span className="text-red-500 underline decoration-red-600/60 underline-offset-8">Specslook</span>
                </h2>
              </div>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                Step outside ordinary vision. Our polarized sunglasses fuse military-grade UV400 solar shielding with iconic Italian contours designed to redefine your personal aesthetic.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => navigateTo('shop', { category: 'Sunglasses' })}
                  className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xs transition-all shadow-lg flex items-center gap-2 group"
                >
                  <span>Explore Sunglasses</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="text-xs text-neutral-400 font-medium">
                  • 100% UV400 Polarized Mineral Glass
                </div>
              </div>
            </div>

            {/* Autoplay Video Banner for Sunglasses */}
            <div className="lg:col-span-7">
              <div className="relative rounded-xs overflow-hidden border border-neutral-800 bg-black shadow-2xl group">
                <div className="relative w-full aspect-16/9 overflow-hidden">
                  <iframe
                    className="w-full h-full object-cover pointer-events-auto"
                    src="https://www.youtube-nocookie.com/embed/TPVp-ILVobw?autoplay=1&mute=1&loop=1&playlist=TPVp-ILVobw&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1"
                    title="Specslook Sunglasses Showcase"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="px-4 py-2.5 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-300">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    AUTOPLAYING SUNGLASSES CINEMATIC
                  </span>
                  <span className="text-neutral-400">
                    Press player volume icon to enable sound
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS SUNGLASSES SLIDER (Auto-run 2 seconds) */}
      <div className="pt-4 pb-4">
        <ProductSlider
          id="sunglasses-slider"
          title="Best Selling Sunglasses"
          subtitle="Iconic UV400 polarized shades delivering glare-free precision and timeless Italian silhouette aesthetics"
          badge="ICONIC SOLAR COLLECTION"
          products={bestSellingSunglasses}
          autoRunIntervalMs={2000}
          category="Sunglasses"
        />
      </div>

      {/* ATTACHMENTS (6-IN-1 & 2-IN-1) SLIDER */}
      {products.filter(p => p.category === 'Attachments').length > 0 && (
        <div className="pt-2 pb-6 bg-neutral-50/70 border-y border-neutral-200">
          <ProductSlider
            id="attachments-slider"
            title="Convertible Attachments (6-in-1 & 2-in-1)"
            subtitle="Modular magnetic clip-on frames that switch from clear optical prescription glasses to polarized shades & night driving lenses in 1 second"
            badge="NEW CONVERTIBLE CATEGORY"
            products={products.filter(p => p.category === 'Attachments')}
            autoRunIntervalMs={3000}
            category="Attachments"
          />
        </div>
      )}

      {/* SPECSLOOK THEME & CASH ON DELIVERY PROMISE BANNER */}
      <section className="relative bg-neutral-950 text-white py-14 border-y border-neutral-800 overflow-hidden">
        {/* Subtle Image Background with Black Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1600&q=80"
            alt="Specslook Eyewear Background"
            className="w-full h-full object-cover opacity-12 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-neutral-950/95 to-black/95" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* COD Feature */}
            <div className="p-6 bg-neutral-950/90 border-t-2 border-[#00DF1D] rounded-xs space-y-2 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-[#00DF1D] font-black text-sm uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#00DF1D] animate-ping" />
                Cash On Delivery
              </div>
              <h3 className="text-base font-black uppercase text-white">Pay At Your Doorstep</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Inspect your luxury frames upon courier arrival. Pay with cash or UPI QR code. No advance required.
              </p>
            </div>

            {/* Precision Optics */}
            <div className="p-6 bg-neutral-950/90 border-t-2 border-[#EA1D24] rounded-xs space-y-2 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-[#EA1D24] font-black text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#EA1D24]" />
                Precision Optics
              </div>
              <h3 className="text-base font-black uppercase text-white">100% UV400 Lenses</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Diamond-hard polarized and blue-light filter lenses with anti-reflective scratch coatings.
              </p>
            </div>

            {/* Doorstep Trial */}
            <div className="p-6 bg-neutral-950/90 border-t-2 border-[#00DF1D] rounded-xs space-y-2 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-[#00DF1D] font-black text-sm uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#00DF1D]" />
                14-Day Free Returns
              </div>
              <h3 className="text-base font-black uppercase text-white">Risk-Free Guarantee</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                If the size or fit isn't 100% comfortable, our courier will pick it up from your doorstep for free.
              </p>
            </div>

            {/* Authenticity */}
            <div className="p-6 bg-neutral-950/90 border-t-2 border-[#EA1D24] rounded-xs space-y-2 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-[#EA1D24] font-black text-sm uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#EA1D24]" />
                1-Year Warranty
              </div>
              <h3 className="text-base font-black uppercase text-white">Certified Genuine</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Each Specslook order includes an embossed case, microfiber cloth, and holographic warranty card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE CRAFTSMANSHIP & POLARIZED OPTICS EDITORIAL */}
      <section className="relative bg-neutral-950 text-white py-20 border-y border-neutral-900 overflow-hidden">
        {/* Subtle Image Background with Black Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1600&q=80"
            alt="Italian Eyewear Heritage Workshop"
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/90 to-neutral-950/95" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Showcase */}
            <div className="relative">
              <div className="aspect-4/3 bg-neutral-900 rounded-xs overflow-hidden border border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80"
                  alt="Specslook Precision Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-5 rounded-xs shadow-xl hidden sm:block max-w-xs">
                <div className="font-black text-xl uppercase tracking-tighter">CHROMANCE™</div>
                <div className="text-xs text-white/90 mt-1">
                  Calibrated light contrast filter eliminating 99.9% of blinding road and water reflections.
                </div>
              </div>
            </div>

            {/* Text Specifications */}
            <div className="space-y-6">
              <div className="text-xs font-extrabold text-red-500 uppercase tracking-widest">
                ENGINEERING DISTINCTION
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Crafted For Life Under The Sun
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Every Specslook frame undergoes 84 hand-finishing processes. From heat-tempered crystal glass that resists scratch marks to high-grade Japanese beta-titanium memory hinges that maintain fit forever.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Diamond-Hard Mineral Crystal</h4>
                    <p className="text-xs text-neutral-400">Pure optical glass that offers zero chromatic distortion and unmatched visual clarity.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">5-Barrel Interlocking Hinges</h4>
                    <p className="text-xs text-neutral-400">Aircraft rivets secure temples firmly to eliminate loose arms over years of daily wear.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ergonomic Hypoallergenic Nose Pads</h4>
                    <p className="text-xs text-neutral-400">Custom adjustable pads ensure zero slipping in humid climates and leave no pressure marks.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigateTo('about')}
                  className="bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold text-xs py-3.5 px-6 uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <span>Learn About Our Optical Heritage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PHYSICAL BOUTIQUES SPOTLIGHT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1">
              THE SPECSLOOK EXPERIENCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
              Visit Our Flagship Boutiques
            </h2>
          </div>
          <button
            onClick={() => navigateTo('stores')}
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-red-600 flex items-center gap-1 group"
          >
            <span>View All Stores & Book Eye Test</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => navigateTo('stores')}
              className="group bg-white border border-neutral-200 overflow-hidden hover:border-neutral-900 hover:shadow-lg transition-all cursor-pointer rounded-xs"
            >
              <div className="aspect-16/9 overflow-hidden bg-neutral-100">
                <img
                  src={(store as any).image || (store as any).imageUrl}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  {store.city} Flagship
                </div>
                <h3 className="font-extrabold text-base text-neutral-900 mt-1">{store.name}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{store.address}</p>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-800 font-semibold">
                  <span>{store.timings}</span>
                  <span className="text-red-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOCATE A STORE IN YOUR CITY FORM */}
        <StoreLocatorForm variant="dark" className="mt-14" />
      </section>

      {/* 6. JOURNAL / BLOG PREVIEW */}
      <section className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1">
                EYEWEAR JOURNAL
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                Style, Care & Optical Guides
              </h2>
            </div>
            <button
              onClick={() => navigateTo('blog')}
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-red-600 flex items-center gap-1"
            >
              <span>Explore Journal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((post) => (
              <div
                key={post.id}
                onClick={() => navigateTo('blog-post', { slug: post.slug })}
                className="group bg-white border border-neutral-200 rounded-xs overflow-hidden cursor-pointer hover:shadow-md transition-all"
              >
                <div className="aspect-16/9 bg-neutral-100 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-2">
                    <span className="font-bold text-red-600 uppercase">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
