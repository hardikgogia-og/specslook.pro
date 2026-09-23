import React, { useState, useEffect, useRef } from 'react';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Store,
  MapPin,
  Sparkles,
  Award,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

interface InvestorQuote {
  id: string;
  name: string;
  city: string;
  stateCountry: string;
  model: 'Specslook FLAGSHIP (FOCO)' | 'Mini Store (FOFO)';
  modelType: 'flagship' | 'mini';
  investment: string;
  roiTimeline: string;
  keyMetric: string;
  year: string;
  quote: string;
  verifiedInvestor: boolean;
}

const testimonials: InvestorQuote[] = [
  {
    id: '1',
    name: 'Rajeev Mehra',
    city: 'Gurugram',
    stateCountry: 'Delhi NCR',
    model: 'Specslook FLAGSHIP (FOCO)',
    modelType: 'flagship',
    investment: '₹20 Lakhs Outlay',
    roiTimeline: 'Break-even in 9 Months',
    keyMetric: '₹2.90L Monthly Avg. Profit',
    year: 'Partnered since 2024',
    quote:
      'We partnered under the FOCO model with a ₹20 Lakh capital outlay. Specslook’s company retail team manages 100% of the boutique, staffing, and computerized Zeiss eye testing clinic while we enjoy hands-free returns. Driven by high margins and high volume retail footfalls, we achieved 100% break-even in just 9 months. The 24-month contractual buyback guarantee gave my family total peace of mind.',
    verifiedInvestor: true
  },
  {
    id: '2',
    name: 'Ananya Ramachandran',
    city: 'Bengaluru',
    stateCountry: 'Indiranagar 100ft Rd, Karnataka',
    model: 'Mini Store (FOFO)',
    modelType: 'mini',
    investment: '₹8.5 Lakhs Outlay',
    roiTimeline: 'Break-even in 13 Months',
    keyMetric: '190+ Frames Dispensed / Mo',
    year: 'Partnered since 2024',
    quote:
      'As a first-time retail investor without optical experience, the FOFO Mini Store model was seamless. Specslook delivered complete vitrines, illuminated signage, digital auto-lensometer, and trained our floor dispensers. With high margins and high volume sales on frames and fast-moving sunglasses, we were net cash-flow positive by month two.',
    verifiedInvestor: true
  },
  {
    id: '3',
    name: 'Vikramaditya Singhania',
    city: 'Chandigarh',
    stateCountry: 'Sector 17 Plaza, Punjab',
    model: 'Specslook FLAGSHIP (FOCO)',
    modelType: 'flagship',
    investment: '₹20 Lakhs Outlay',
    roiTimeline: 'Break-even in 10 Months',
    keyMetric: 'Expanding to 2nd Unit',
    year: 'Partnered since 2023',
    quote:
      'The FOCO model was the best decision for us. Having Specslook corporate retail veterans manage daily operations backed by 65+ company-owned stores gives walk-in customers immediate credibility. High margins combined with high volume customer turnover meant we reached full ROI in 10 months and are already locking in our second boutique location in Panchkula.',
    verifiedInvestor: true
  },
  {
    id: '4',
    name: 'Adil Merchant',
    city: 'Mumbai',
    stateCountry: 'Bandra West (Linking Road), MH',
    model: 'Specslook FLAGSHIP (FOCO)',
    modelType: 'flagship',
    investment: '₹20 Lakhs Outlay',
    roiTimeline: 'Record Break-even in 8 Months',
    keyMetric: 'Top Performing Flagship',
    year: 'Partnered since 2025',
    quote:
      'Under the company-operated FOCO structure, celebrity launch marketing and geo-targeted social campaigns generated long queues from our opening weekend. We hit 100% capital recovery in just 8 months. High margins and high volume sales across bespoke titanium frames and Zeiss lenses made this an extraordinary investment.',
    verifiedInvestor: true
  },
  {
    id: '5',
    name: 'Preeti & Mohit Chhabra',
    city: 'Jaipur',
    stateCountry: 'Malviya Nagar, Rajasthan',
    model: 'Mini Store (FOFO)',
    modelType: 'mini',
    investment: '₹7.8 Lakhs Outlay',
    roiTimeline: 'Break-even in 14 Months',
    keyMetric: '220 Sq.Ft High-Volume Kiosk',
    year: 'Partnered since 2024',
    quote:
      'We run a 220 sq.ft compact FOFO boutique in a bustling commercial complex. Specslook’s express replenishment keeps bestselling acetate designs always in stock. High margins and high volume footfalls combined with the 24-month buyback contract eliminated our downside risk completely. Perfect business model for couples seeking predictable returns.',
    verifiedInvestor: true
  },
  {
    id: '6',
    name: 'Dr. Harshvardhan Kulkarni',
    city: 'Pune',
    stateCountry: 'Koregaon Park, Maharashtra',
    model: 'Specslook FLAGSHIP (FOCO)',
    modelType: 'flagship',
    investment: '₹20 Lakhs Outlay',
    roiTimeline: 'Break-even in 8.5 Months',
    keyMetric: '42% Prescription Repeat Rate',
    year: 'Partnered since 2025',
    quote:
      'Being a medical professional, clinical precision was mandatory. Under the FOCO model, Specslook’s 14-point Zeiss computerized examination suite gave our clinic medical-grade authority. Patients appreciate getting tested and choosing European-grade eyewear in one seamless luxury lounge. Truly exceptional high margins and high volume flow.',
    verifiedInvestor: true
  }
];

export const InvestorTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const active = testimonials[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentIndex]);

  return (
    <div className="space-y-12">
      {/* Header with Trust Counter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-500 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            INVESTOR TESTIMONIALS & CASE STUDIES
          </div>
          <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Trusted by 55+ Franchise Investors
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Real feedback from entrepreneurs operating Specslook Mini and Flagship retail centers across prime shopping high-streets and malls.
          </p>
        </div>

        {/* Status Indicators & Counter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">55+ Verified Franchisees</span>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800/80 px-3.5 py-2 rounded-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-300">100% 24M Buyback Protection</span>
          </div>
        </div>
      </div>

      {/* Main Rotating Showcase Card */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative bg-neutral-950 border border-neutral-800 rounded-xs p-6 sm:p-12 overflow-hidden shadow-2xl transition-all duration-300"
      >
        {/* Glow ambient decoration */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Big subtle quote icon in background */}
        <Quote className="absolute right-6 bottom-6 w-32 h-32 text-neutral-900/60 -scale-x-100 pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Top Info Bar: Store Model, City, Investment */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
            <div className="flex flex-wrap items-center gap-2.5">
              {active.modelType === 'flagship' ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-red-600 text-white px-3 py-1 rounded-xs shadow-xs">
                  <Building2 className="w-3.5 h-3.5" />
                  {active.model}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-neutral-800 text-neutral-200 border border-neutral-700 px-3 py-1 rounded-xs">
                  <Store className="w-3.5 h-3.5" />
                  {active.model}
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-300 bg-neutral-900 px-3 py-1 rounded-xs border border-neutral-800">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <strong>{active.city}</strong>, {active.stateCountry}
              </span>

              <span className="text-xs text-neutral-500 hidden sm:inline">&bull;</span>
              <span className="text-xs text-neutral-400 font-medium">{active.investment}</span>
            </div>

            {/* Payback badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              {active.roiTimeline}
            </div>
          </div>

          {/* Quote Text */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-bold text-neutral-400 ml-2">Verified Franchise Experience</span>
            </div>

            <p className="text-base sm:text-xl font-medium text-neutral-100 leading-relaxed italic pr-4">
              "{active.quote}"
            </p>
          </div>

          {/* Author Details & Quick Performance Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center font-black text-lg text-white">
                {active.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-white">{active.name}</h4>
                  {active.verifiedInvestor && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-xs border border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Partner
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                  <span>Specslook Store Franchisee</span>
                  <span>&bull;</span>
                  <span className="text-neutral-500">{active.year}</span>
                </div>
              </div>
            </div>

            {/* Performance Stat Callout */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xs sm:text-right">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Store Milestone</div>
              <div className="text-xs font-black text-amber-300">{active.keyMetric}</div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows & Progress */}
        <div className="relative z-10 flex items-center justify-between pt-8 mt-6 border-t border-neutral-900">
          {/* Direct Dot Indicators */}
          <div className="flex items-center gap-2">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View testimonial from ${t.name}`}
                className={`h-2 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-8 bg-red-600' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
            <span className="text-xs text-neutral-500 ml-2 font-medium">
              {currentIndex + 1} of {testimonials.length}
            </span>
          </div>

          {/* Left / Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-xs transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Select Thumbnails / Investor Grid for Fast Exploration */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {testimonials.map((item, idx) => {
          const isSelected = currentIndex === idx;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`p-3 text-left rounded-xs border transition-all duration-200 ${
                isSelected
                  ? 'bg-neutral-900 border-red-600 shadow-md ring-1 ring-red-600'
                  : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 text-neutral-400'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-500 truncate">
                {item.city}
              </div>
              <div className="text-xs font-black text-white truncate mt-0.5">{item.name}</div>
              <div className="text-[10px] text-neutral-400 truncate mt-1">
                {item.modelType === 'flagship' ? 'Flagship FOCO (₹20L)' : 'Mini FOFO (₹7-10L)'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
