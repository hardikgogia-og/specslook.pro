import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  Building2,
  Store,
  DollarSign,
  Clock,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  Users,
  ChevronRight,
  ArrowRight,
  Check,
  Layers,
  MapPin,
  Glasses,
  Briefcase,
  HelpCircle,
  FileCheck,
  BadgeCheck,
  Calculator
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { SpecslookLogo } from '../components/SpecslookLogo.tsx';
import { FranchiseRoiChart } from '../components/FranchiseRoiChart.tsx';
import { FranchiseRoiCalculator } from '../components/FranchiseRoiCalculator.tsx';
import { InvestorTestimonials } from '../components/InvestorTestimonials.tsx';

export const FranchiseView: React.FC = () => {
  const { showToast, navigateTo } = useStore();

  // Selected Model for Form or Comparison highlight
  const [selectedModel, setSelectedModel] = useState<'mini' | 'flagship'>('flagship');

  // Lead Form State
  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    preferredModel: 'Specslook FLAGSHIP (FOCO Model - ₹20 Lakhs - ROI 8-11 Months)',
    spaceStatus: 'Already have commercial space',
    carpetArea: '500 - 800 sq.ft',
    investmentReadiness: 'Ready within 30 days',
    priorExperience: 'No prior optical experience (Need turnkey training)',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastGeneratedWaLink, setLastGeneratedWaLink] = useState('');

  const WHATSAPP_NUMBER = '918368853448';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.fullName.trim() || !formState.phone.trim() || !formState.city.trim()) {
      showToast('Please fill in your name, WhatsApp number, and city.', 'error');
      return;
    }

    // Compose professional, structured WhatsApp inquiry message
    const message = [
      `🏛️ *NEW SPECSLOOK FRANCHISE APPLICATION*`,
      `------------------------------------------`,
      `👤 *Investor Name:* ${formState.fullName.trim()}`,
      `📱 *WhatsApp:* +91 ${formState.phone.trim()}`,
      `✉️ *Email:* ${formState.email.trim() || 'Not specified'}`,
      `📍 *Location:* ${formState.city.trim()}, ${formState.state.trim()}`,
      `💼 *Selected Model:* ${formState.preferredModel}`,
      `🏢 *Space Status:* ${formState.spaceStatus}`,
      `📐 *Carpet Area:* ${formState.carpetArea}`,
      `💰 *Investment Horizon:* ${formState.investmentReadiness}`,
      `👔 *Retail Experience:* ${formState.priorExperience}`,
      formState.notes.trim() ? `📝 *Notes/Queries:* ${formState.notes.trim()}` : null,
      `------------------------------------------`,
      `_Sent via Specslook Official Franchise Portal (24-Month Buyback Program)_`
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setLastGeneratedWaLink(whatsappUrl);
    setIsSubmitted(true);
    showToast('Franchise application prepared! Opening WhatsApp...', 'success');

    // Open WhatsApp in new tab
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('WhatsApp redirect:', err);
    }
  };

  const handleCopyLink = () => {
    if (lastGeneratedWaLink) {
      navigator.clipboard.writeText(lastGeneratedWaLink);
      showToast('WhatsApp application link copied to clipboard!');
    }
  };

  const handleDirectWhatsAppInquiry = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const text = encodeURIComponent(
      `Hello Specslook Franchise Team,\n\nI am interested in learning more about Specslook Franchise Partnership opportunities (Mini Store FOFO & Specslook Flagship models with 24-Month Buyback Guarantee). Please share the investment deck and schedule an introductory briefing.\n\nThank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white min-h-screen text-neutral-900 pb-24 selection:bg-red-600 selection:text-white">
      {/* Top Brand Notification Banner */}
      <div className="bg-neutral-950 text-neutral-300 py-3 px-4 border-b border-neutral-800 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-6 font-medium">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            OFFICIAL FRANCHISE PROGRAM 2026
          </span>
          <span className="hidden sm:inline text-neutral-600">&bull;</span>
          <span>Survey by <strong>Sarvya Bharat Optical Association</strong>: 65+ Standalone Company Stores &bull; 250+ Clinical Stores</span>
          <span className="hidden md:inline text-neutral-600">&bull;</span>
          <span className="text-amber-300 font-semibold">Contractual 24-Month Buyback Guarantee</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-neutral-950 text-white overflow-hidden py-16 sm:py-24 border-b border-neutral-900">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/15 border border-red-500/30 rounded-xs text-red-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              SPECSLOOK LUXURY EYEWEAR EXPANSION
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
              Partner With India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-red-500">Highest-ROI</span> Optical Chain
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal">
              Join an optical empire generating <strong>85% of brand revenue</strong> through high-street retail stores. With <strong>65+ standalone company-owned stores worldwide</strong> and <strong>250+ clinical stores</strong>, Specslook now opens turnkey franchise partnerships with contractual <strong>24-Month Buyback Guarantees</strong>.
            </p>

            {/* Quick Action Badges */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={() => {
                  document.getElementById('franchise-models')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 transition-colors shadow-lg shadow-red-900/30 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>View 2 Franchise Models</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsAppInquiry}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 border border-white/20 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Direct WhatsApp Inquiry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold uppercase tracking-wider px-5 py-3.5 border border-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>ROI Calculator</span>
              </button>
            </div>
          </div>

          {/* Key Authority Statistics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-neutral-900 pt-10">
            <div className="bg-neutral-900/70 border border-neutral-800 p-4 sm:p-5 rounded-xs">
              <div className="text-2xl sm:text-3xl font-black text-white">65+</div>
              <div className="text-xs font-bold text-red-500 uppercase tracking-wider mt-1">Standalone Stores</div>
              <div className="text-[11px] text-neutral-400 mt-1">Company-owned boutiques worldwide</div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 p-4 sm:p-5 rounded-xs">
              <div className="text-2xl sm:text-3xl font-black text-white">250+</div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mt-1">Partnered Clinical Stores</div>
              <div className="text-[11px] text-neutral-400 mt-1">In 2026 Sarvya Bharat Optical Survey</div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 p-4 sm:p-5 rounded-xs">
              <div className="text-2xl sm:text-3xl font-black text-white">85%</div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mt-1">Retail Store Revenue</div>
              <div className="text-[11px] text-neutral-400 mt-1">In-store customer testing & eyewear sales</div>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800 p-4 sm:p-5 rounded-xs">
              <div className="text-2xl sm:text-3xl font-black text-white">55+</div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mt-1">Active Franchise Investors</div>
              <div className="text-[11px] text-neutral-400 mt-1">Profitable store operators across India</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Survey Verification Bar */}
      <section className="bg-neutral-100 py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-extrabold text-neutral-900 uppercase block tracking-wider">
                Audited & Certified by Sarvya Bharat Optical Association (2026)
              </span>
              <span className="text-neutral-600 block text-[11px]">
                Official Retail Performance Audit: Specslook ranks in the Top Tier for retail store velocity and inventory turn ratio.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-bold text-neutral-700">
            <span className="inline-flex items-center gap-1.5 text-neutral-900 bg-white px-3 py-1.5 border border-neutral-300 rounded-xs shadow-xs">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              Trusted by 55+ Investors
            </span>
            <span className="inline-flex items-center gap-1.5 text-neutral-900 bg-white px-3 py-1.5 border border-neutral-300 rounded-xs shadow-xs">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              24-Month Buyback
            </span>
          </div>
        </div>
      </section>

      {/* 2 FRANCHISE MODELS SHOWCASE */}
      <section id="franchise-models" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-black text-red-600 uppercase tracking-widest">
            PROVEN HIGH-VELOCITY BUSINESS ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950">
            Choose Your Investment Model
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Both models feature 100% turnkey store delivery, certified optometrist deployment, Specslook Cloud POS, and our contractual <strong>24-Month Buyback Guarantee</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* MODEL 1: MINI STORE (FOFO) */}
          <div
            className={`border rounded-xs p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${
              selectedModel === 'mini'
                ? 'border-neutral-900 shadow-xl bg-white ring-1 ring-neutral-900'
                : 'border-neutral-200 bg-white hover:border-neutral-400'
            }`}
          >
            <div className="space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-xs">
                    MODEL 01 &bull; FOFO ARCHITECTURE
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mt-2">
                    Mini Store (FOFO Model)
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Franchise Owned, Franchise Operated &bull; Compact Boutique
                  </p>
                </div>
                <div className="w-12 h-12 bg-neutral-100 rounded-xs flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-neutral-800" />
                </div>
              </div>

              {/* Investment & Key Financial Highlights */}
              <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 border border-neutral-100 rounded-xs">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Investment</div>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">₹7 - 10 Lakhs</div>
                  <div className="text-[10px] text-neutral-500">All inclusive initial capital</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Expected ROI Timeline</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">~ 15 Months</div>
                  <div className="text-[10px] text-neutral-500">Consistent monthly cashflow</div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-extrabold text-emerald-900 uppercase block">24 Months Contractual Buyback Guarantee</span>
                  <span className="text-emerald-800 text-[11px] leading-relaxed">
                    Zero inventory write-off risk. If performance benchmarks are not met within 24 months, Specslook buys back intact inventory at contracted terms.
                  </span>
                </div>
              </div>

              {/* Specifications List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Store Specifications & Inclusions:
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Carpet Area:</strong> 150 – 300 Sq. Ft. (High Street, Mall Kiosk, or Premium Market)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Curated Inventory:</strong> 250+ fast-moving luxury frames, sunglasses & polarized lenses</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Equipment Included:</strong> Digital automatic lensometer, precision frame adjusters, pupilometer</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>High Margins & High Volume:</strong> High product margins paired with fast-moving retail volume on bestselling frames & sunglasses</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Turnkey Setup:</strong> Complete modular display vitrines, lighting & brand signage</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Staffing:</strong> 1 to 2 certified optical sales specialists trained by Specslook Academy</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100 mt-6">
              <button
                onClick={() => {
                  setSelectedModel('mini');
                  setFormState(prev => ({
                    ...prev,
                    preferredModel: 'Mini Store (FOFO Model - ₹7-10 Lakhs INR)',
                    carpetArea: '150 - 300 sq.ft'
                  }));
                  document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors"
              >
                Apply for Mini Store (₹7 - 10L)
              </button>
            </div>
          </div>

          {/* MODEL 2: SPECSLOOK FLAGSHIP */}
          <div
            className={`border rounded-xs p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 relative ${
              selectedModel === 'flagship'
                ? 'border-red-600 shadow-2xl bg-neutral-950 text-white ring-2 ring-red-600'
                : 'border-neutral-900 bg-neutral-950 text-white hover:border-red-500'
            }`}
          >
            {/* Top Recommended Tag */}
            <div className="absolute -top-3.5 right-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xs shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              HIGHEST ROI &bull; MOST POPULAR
            </div>

            <div className="space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xs">
                    MODEL 02 &bull; FOCO ARCHITECTURE (COMPANY OPERATED)
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-2">
                    Specslook FLAGSHIP (FOCO Model)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    100% Company-Operated Boutique &bull; Integrated Eye Testing Clinic + Luxury Archive
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-600/20 border border-red-500/30 rounded-xs flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-red-400" />
                </div>
              </div>

              {/* Investment & Key Financial Highlights */}
              <div className="grid grid-cols-2 gap-3 bg-neutral-900/90 p-4 border border-neutral-800 rounded-xs">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Investment</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">₹20 Lakhs</div>
                  <div className="text-[10px] text-neutral-400">Complete turnkey setup & clinic</div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Rapid ROI Timeline</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">8 - 11 Months</div>
                  <div className="text-[10px] text-neutral-400">High margins & high volume footfalls</div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-red-950/40 border border-red-800/60 p-3.5 rounded-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-extrabold text-red-300 uppercase block">24 Months Contractual Buyback Guarantee</span>
                  <span className="text-neutral-300 text-[11px] leading-relaxed">
                    Legally binding buyback assurance on fixtures & inventory. Unsold stock is automatically replaced with new trending arrivals.
                  </span>
                </div>
              </div>

              {/* Specifications List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Flagship FOCO Advantages:
                </div>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>100% Company Operated (FOCO):</strong> Specslook corporate retail veterans hire, train, and manage all optometrists, stylists, and store operations for hands-free passive returns</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Carpet Area:</strong> 500 – 1,000+ Sq. Ft. (Prime High Street Corner / Luxury Mall)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Full Archive:</strong> 600+ Titanium, Italian Mazzucchelli acetate, 6-in-1 clip-on sunglasses</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Clinical Suite:</strong> Built-in 14-Point Zeiss computerized eye examination chamber</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Omnichannel Order Routing:</strong> Specslook.com orders from your city/pin code routed to your store</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>High Margins & High Volume:</strong> Exceptional high margins combined with high-volume customer footfall, computerized Zeiss lens upgrades & eyewear turnover</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Celebrity & Influencer Marketing:</strong> Central launch budget and regional PR coverage included</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-800 mt-6">
              <button
                onClick={() => {
                  setSelectedModel('flagship');
                  setFormState(prev => ({
                    ...prev,
                    preferredModel: 'Specslook FLAGSHIP (FOCO Model - ₹20 Lakhs - ROI 8-11 Months)',
                    carpetArea: '500 - 1,000+ sq.ft'
                  }));
                  document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest py-3.5 transition-colors shadow-lg shadow-red-900/40"
              >
                Apply for Specslook FLAGSHIP FOCO (₹20L)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI CALCULATOR WIDGET */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FranchiseRoiCalculator />
      </section>

      {/* RECHARTS COMPARISON BAR CHART: ROI TIMELINE VISUALIZATION */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FranchiseRoiChart />
      </section>

      {/* DETAILED HEAD-TO-HEAD COMPARISON TABLE */}
      <section className="bg-neutral-50 py-16 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
              Franchise Model Comparison Matrix
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Direct comparison of capital deployment, returns, and operational deliverables.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white uppercase text-[11px] tracking-wider">
                    <th className="p-4 font-bold border-r border-neutral-800">Operational Metric</th>
                    <th className="p-4 font-bold border-r border-neutral-800 w-1/3">
                      Mini Store (FOFO Model)
                    </th>
                    <th className="p-4 font-bold bg-neutral-950 text-red-400 w-1/3">
                      Specslook FLAGSHIP (FOCO Model)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-700 font-medium">
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Business Architecture</td>
                    <td className="p-4 font-bold text-neutral-800">FOFO (Franchise Owned, Franchise Operated)</td>
                    <td className="p-4 font-black text-red-600 bg-red-50/30">FOCO (Franchise Owned, Company Operated)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Store Operations & Staffing</td>
                    <td className="p-4">Owner managed with brand training</td>
                    <td className="p-4 font-bold text-neutral-950 bg-red-50/30">100% Run by Specslook Corporate Team</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Margin & Sales Dynamics</td>
                    <td className="p-4 font-bold text-emerald-700">High Margins & High Volume</td>
                    <td className="p-4 font-bold text-emerald-700 bg-red-50/30">High Margins & High Volume + Clinic Testing</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Total Investment</td>
                    <td className="p-4">₹7 Lakhs to ₹10 Lakhs INR</td>
                    <td className="p-4 font-bold text-neutral-950 bg-red-50/30">₹20 Lakhs INR</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Buyback Guarantee</td>
                    <td className="p-4 text-emerald-700 font-bold">24 Months Contractual</td>
                    <td className="p-4 text-emerald-700 font-bold bg-red-50/30">24 Months Contractual</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Expected ROI Payback</td>
                    <td className="p-4 text-neutral-900 font-bold">Within 15 Months</td>
                    <td className="p-4 text-red-600 font-black bg-red-50/30">Within 8 - 11 Months</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Required Carpet Area</td>
                    <td className="p-4">150 to 300 Sq. Ft.</td>
                    <td className="p-4 bg-red-50/30">500 to 1,000+ Sq. Ft.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Eye Testing Suite</td>
                    <td className="p-4">Auto-Lensometer & Portable Refraction</td>
                    <td className="p-4 font-bold text-neutral-900 bg-red-50/30">Full 14-Point Zeiss Computerized Clinic</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Frames Displayed</td>
                    <td className="p-4">250+ SKUs (Top Bestsellers)</td>
                    <td className="p-4 font-bold text-neutral-900 bg-red-50/30">600+ Complete Luxury Archive</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Omnichannel Web Lead Routing</td>
                    <td className="p-4">Standard local pickup</td>
                    <td className="p-4 text-emerald-700 font-bold bg-red-50/30">Priority City-Wide Lead Dispatch</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Staff Training</td>
                    <td className="p-4">Sales & dispensing training (1-2 staff)</td>
                    <td className="p-4 bg-red-50/30">Certified Optometrist & Boutique Stylists (3-4 staff)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-neutral-900 bg-neutral-50">Grand Opening Campaign</td>
                    <td className="p-4">Digital Geo-targeted Social Ads</td>
                    <td className="p-4 font-bold bg-red-50/30">Celebrity/Influencer VIP Launch + PR Kit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNER WITH SPECSLOOK: 4 PILLARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="text-xs font-black text-red-600 uppercase tracking-widest">
            UNPARALLELED FRANCHISE SECURITY
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
            Why 55+ Investors Chose Specslook
          </h2>
          <p className="text-xs text-neutral-500">
            Engineered from day one to protect franchisee capital and accelerate operating profitability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-neutral-200 rounded-xs space-y-3 hover:border-neutral-900 transition-colors">
            <div className="w-12 h-12 bg-neutral-100 rounded-xs flex items-center justify-center text-red-600">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">24-Month Buyback</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We stand behind our retail velocity with a contractual buyback clause protecting your capital against market unforeseen events.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-xs space-y-3 hover:border-neutral-900 transition-colors">
            <div className="w-12 h-12 bg-neutral-100 rounded-xs flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">85% In-Store Revenue</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Eyewear is tactile. 85% of Specslook revenue happens through physical store customer examinations and custom lens fittings.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-xs space-y-3 hover:border-neutral-900 transition-colors">
            <div className="w-12 h-12 bg-neutral-100 rounded-xs flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">Online Lead Dispatch</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All digital customers on Specslook.com residing in your territory are routed to your store for eye tests and frame collection.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 rounded-xs space-y-3 hover:border-neutral-900 transition-colors">
            <div className="w-12 h-12 bg-neutral-100 rounded-xs flex items-center justify-center text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">100% Zero Dead Stock</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Slow-moving frames are seamlessly rotated out every quarter and swapped for top-trending acetate and titanium bestsellers.
            </p>
          </div>
        </div>
      </section>

      {/* ROTATING INVESTOR TESTIMONIALS & CASE STUDIES */}
      <section className="bg-neutral-900 text-white py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InvestorTestimonials />
        </div>
      </section>

      {/* ROADMAP TO LAUNCH IN 21 DAYS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="text-xs font-black text-red-600 uppercase tracking-widest">
            RAPID TURNKEY EXECUTION
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
            Open Your Store in 21 Days
          </h2>
          <p className="text-xs text-neutral-500">
            From application approval to ribbon cutting, our retail expansion engineers handle the heavy lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-neutral-200 p-6 rounded-xs relative bg-white">
            <span className="text-2xl font-black text-neutral-200 block mb-2">01</span>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">Site Evaluation & Agreement</h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Location audit, footfall mapping, and signing of franchise agreement with the 24-month buyback clause.
            </p>
          </div>

          <div className="border border-neutral-200 p-6 rounded-xs relative bg-white">
            <span className="text-2xl font-black text-neutral-200 block mb-2">02</span>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">Fit-out & Vitrines</h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Modular Italian-inspired display cases, LED illumination, and clinical testing booth construction in 10 days.
            </p>
          </div>

          <div className="border border-neutral-200 p-6 rounded-xs relative bg-white">
            <span className="text-2xl font-black text-neutral-200 block mb-2">03</span>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">Stock & Staff Training</h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Inwarding of top 250-600 bestsellers, POS hardware integration, and optometrist dispensing certification.
            </p>
          </div>

          <div className="border border-neutral-200 p-6 rounded-xs relative bg-white">
            <span className="text-2xl font-black text-red-600 block mb-2">04</span>
            <h4 className="font-extrabold text-sm uppercase text-neutral-900">Grand Launch</h4>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Regional influencer push, localized SMS blasts, and doorstep eye-exam booking activation in your city.
            </p>
          </div>
        </div>
      </section>

      {/* APPLICATION CONTACT FORM & WHATSAPP INTEGRATION */}
      <section id="apply-form" className="bg-neutral-950 text-white py-20 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xs text-xs font-bold uppercase tracking-wider">
              <MessageCircle className="w-3.5 h-3.5" />
              DIRECT EXECUTIVE CONNECT
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Apply For A Specslook Franchise
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
              Submit your preliminary details below. The system will immediately prepare and share your verified application directly to our expansion team on WhatsApp.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-neutral-900 border border-emerald-500/40 p-8 sm:p-12 rounded-xs text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  Franchise Application Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
                  Thank you, <strong>{formState.fullName}</strong>. Your franchise inquiry for <strong>{formState.preferredModel}</strong> in <strong>{formState.city}</strong> has been structured for WhatsApp delivery.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={lastGeneratedWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xs transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp & Send Message</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-6 py-4 border border-white/20 rounded-xs transition-colors"
                >
                  Copy Message Details
                </button>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-neutral-400 hover:text-white underline"
                >
                  Submit another inquiry or edit details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="bg-neutral-900/90 border border-neutral-800 p-6 sm:p-10 rounded-xs space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    placeholder="e.g. Honey Gogia"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    WhatsApp Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 bg-neutral-800 border border-r-0 border-neutral-700 text-neutral-400 text-xs font-bold rounded-l-xs">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="8368853448"
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-r-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="investor@domain.com"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none"
                  />
                </div>

                {/* Target City */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Proposed City & State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.city}
                    onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                    placeholder="e.g. Gurugram, Haryana"
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none"
                  />
                </div>

                {/* Preferred Model */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Selected Franchise Model *
                  </label>
                  <select
                    value={formState.preferredModel}
                    onChange={(e) => setFormState({ ...formState, preferredModel: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none font-medium"
                  >
                    <option value="Specslook FLAGSHIP (FOCO Model - ₹20 Lakhs - ROI 8-11 Months)">
                      Specslook FLAGSHIP FOCO (₹20 Lakhs &bull; 100% Company Operated &bull; ROI 8-11 Months)
                    </option>
                    <option value="Mini Store (FOFO Model - ₹7-10 Lakhs INR)">
                      Mini Store FOFO Model (₹7 - 10 Lakhs &bull; Compact Boutique &bull; ROI ~15 Months)
                    </option>
                    <option value="Exploring Both Models (Need Consultation Call)">
                      Exploring Both Models (Need Optical Consultant Guidance)
                    </option>
                  </select>
                </div>

                {/* Commercial Space Availability */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Commercial Space Status
                  </label>
                  <select
                    value={formState.spaceStatus}
                    onChange={(e) => setFormState({ ...formState, spaceStatus: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none font-medium"
                  >
                    <option value="Already have commercial space (Owned)">Already have commercial space (Owned)</option>
                    <option value="Already have commercial space (Rented)">Already have commercial space (Rented)</option>
                    <option value="Currently scouting locations">Currently scouting locations</option>
                    <option value="Need Specslook location assistance">Need Specslook site assistance</option>
                  </select>
                </div>

                {/* Carpet Area */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Approximate Carpet Area
                  </label>
                  <select
                    value={formState.carpetArea}
                    onChange={(e) => setFormState({ ...formState, carpetArea: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none font-medium"
                  >
                    <option value="150 - 300 sq.ft (Ideal for Mini Store)">150 - 300 sq.ft (Ideal for Mini Store)</option>
                    <option value="500 - 800 sq.ft (Ideal for Flagship)">500 - 800 sq.ft (Ideal for Flagship)</option>
                    <option value="800 - 1,500+ sq.ft (Flagship + Eye Lab)">800 - 1,500+ sq.ft (Flagship + Eye Lab)</option>
                    <option value="Yet to finalize space">Yet to finalize space</option>
                  </select>
                </div>

                {/* Investment Readiness */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Planned Investment Horizon
                  </label>
                  <select
                    value={formState.investmentReadiness}
                    onChange={(e) => setFormState({ ...formState, investmentReadiness: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none font-medium"
                  >
                    <option value="Ready within 15-30 days">Ready within 15-30 days</option>
                    <option value="Planning in 30-60 days">Planning in 30-60 days</option>
                    <option value="Exploring for next quarter">Exploring for next quarter</option>
                  </select>
                </div>

                {/* Prior Experience */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Retail or Optical Experience
                  </label>
                  <select
                    value={formState.priorExperience}
                    onChange={(e) => setFormState({ ...formState, priorExperience: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none font-medium"
                  >
                    <option value="No prior optical experience (Need turnkey training)">No prior optical experience (Need turnkey training)</option>
                    <option value="Existing optical or medical store owner">Existing optical or clinic store owner</option>
                    <option value="General retail / apparel franchise operator">General retail / apparel franchise operator</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    Specific Queries / Target Neighborhood
                  </label>
                  <textarea
                    rows={3}
                    value={formState.notes}
                    onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                    placeholder="Enter any specific target market (e.g. DLF Phase 5, Mall of India, high street) or questions on the 24-month buyback..."
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 text-white text-xs p-3.5 rounded-xs focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] text-neutral-400">
                  <span className="text-emerald-400 font-bold">&bull; Direct to WhatsApp:</span> Your message will be formatted for <strong>+91 83688 53448</strong>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-8 py-4 transition-colors shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Submit & Send to WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Direct WhatsApp Callout Bottom Banner */}
      <section className="bg-neutral-900 text-white py-12 border-t border-neutral-800 text-center px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-bold uppercase tracking-tight">
            Prefer a direct confidential conversation?
          </h3>
          <p className="text-xs text-neutral-400">
            Our Head of Franchise Development is available for one-on-one discovery meetings and P&L walk-throughs.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/918368853448?text=Hello%20Specslook!%20I'd%20like%20to%20schedule%20a%20confidential%20franchise%20discussion%20regarding%20the%2024-Month%20Buyback%20Store%20Models."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp +91 83688 53448</span>
            </a>
            <a
              href="tel:8368853448"
              className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-neutral-300" />
              <span>Call 8368853448</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
