import React from 'react';
import {
  ShieldCheck,
  Award,
  Eye,
  Sparkles,
  Gem,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { StoreLocatorForm } from '../components/StoreLocatorForm.tsx';

export const AboutView: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="bg-white min-h-screen pb-24 text-neutral-900">
      {/* Editorial Header */}
      <header className="bg-neutral-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-600/10 border border-red-500/30 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-xs">
            <span>HERITAGE ESTABLISHED IN GURUGRAM &bull; SINCE 1998</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
            Crafting Visionary Icons Since 1998
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            For more than 28 years, Specslook has defined the vanguard of luxury eyeglasses, polarized designer sunglasses, and precision ophthalmic optics in India.
          </p>
        </div>
      </header>

      {/* Main Content Article */}
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-24">
        {/* Section 1: The Genesis (1998) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-neutral-700 leading-relaxed">
            <div className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>THE SPECSLOOK CHRONICLE &bull; FOUNDED 1998</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-950 uppercase tracking-tight">
              28+ Years of Optical Legacy, Uncompromising Standards
            </h2>
            <p className="text-base text-neutral-800 font-medium leading-relaxed">
              In 1998, Specslook began not as an impersonal mass-retail chain, but as a passionate precision lens-grinding atelier in Gurugram, Haryana. Guided by Master Opticians who regarded vision correction as both a high-precision medical science and a transformative form of personal style, we set out to craft eyewear that commands distinction.
            </p>
            <p className="text-sm text-neutral-600">
              While mass-market manufacturers switched to flimsy injection-molded plastics and disposable polycarbonates, Specslook remained true to the classical bespoke ethos. Since our founding in 1998, we have pioneered the introduction of custom hand-beveled Italian Mazzucchelli acetate, aerospace-grade Beta-Titanium memory metals, and diamond-clarity mineral lenses across North India.
            </p>
            <p className="text-sm text-neutral-600">
              Today, Specslook stands as India's foremost independent optical house. From executive boardrooms to sun-drenched coastal highways, our signature Aviators, iconic Wayfarers, and tailored optical frames provide wearers with unrivaled visual acuity, featherweight comfort, and perennial design elegance.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xs overflow-hidden border border-neutral-200 shadow-xl bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80"
                alt="Artisanal Handcrafting Eyewear Atelier Since 1998"
                className="w-full h-full object-cover aspect-4/3 filter contrast-105"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/60 to-transparent p-5 text-white">
                <div className="text-red-500 text-[10px] font-black uppercase tracking-widest">
                  Original Atelier &bull; Est. 1998
                </div>
                <div className="text-xs font-semibold text-neutral-300 mt-1">
                  Over 28 years of master-optician benchwork and continuous lens innovation.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Materials & Craftsmanship Deep Dive (SEO Heavy) */}
        <section className="bg-neutral-50 border border-neutral-200 p-8 sm:p-14 rounded-xs space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-black text-red-600 uppercase tracking-widest">
              SUPERIOR MATERIAL ENGINEERING
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              Anatomy of an Iconic Eyewear Masterpiece
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every Specslook frame passes through 84 distinct bench manufacturing steps and over 72 hours of precision calibration before earning our emblem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-neutral-200 rounded-xs space-y-3.5 shadow-xs">
              <div className="w-11 h-11 rounded-xs bg-neutral-950 text-white flex items-center justify-center">
                <Gem className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-950 uppercase tracking-wide">
                Mazzucchelli Cellulose Acetate
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Extracted from organic cotton flock and sustainable European wood pulp, our high-density cellulose acetate frames offer deep optical chatoyancy, rich tonal gradients, and hypoallergenic skin biocompatibility that never causes irritation.
              </p>
              <ul className="text-[11px] text-neutral-500 space-y-1.5 pt-2 border-t border-neutral-100">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> 72-Hour Birchwood Barrel Tumbling</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Warm Hand-Formable Temple Cores</li>
              </ul>
            </div>

            <div className="bg-white p-6 border border-neutral-200 rounded-xs space-y-3.5 shadow-xs">
              <div className="w-11 h-11 rounded-xs bg-neutral-950 text-white flex items-center justify-center">
                <Award className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-950 uppercase tracking-wide">
                Japanese Beta-Titanium
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Engineered from aerospace-grade Ti-15V-3Cr-3Sn-3Al alloys, our metal frames weigh under 14 grams yet provide extraordinary tensile strength, flexural shape memory, and absolute corrosion resistance against perspiration and tropical humidity.
              </p>
              <ul className="text-[11px] text-neutral-500 space-y-1.5 pt-2 border-t border-neutral-100">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Screw-Locked 5-Barrel German Hinges</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Soft Silicone Hypoallergenic Nosepads</li>
              </ul>
            </div>

            <div className="bg-white p-6 border border-neutral-200 rounded-xs space-y-3.5 shadow-xs">
              <div className="w-11 h-11 rounded-xs bg-neutral-950 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-extrabold text-base text-neutral-950 uppercase tracking-wide">
                Chromance™ UV400 Polarized Optics
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our solar lenses feature micro-crystalline polarization films that eliminate 99.9% of blinding road and water glare. Combined with 9-layer vacuum anti-reflective coatings, they deliver vivid high-contrast color calibration and 100% UV400 solar shielding.
              </p>
              <ul className="text-[11px] text-neutral-500 space-y-1.5 pt-2 border-t border-neutral-100">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Zero-Distortion Optical Ground Glass</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-red-600 shrink-0" /> Oleophobic Scratch-Proof Protection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: The 5 Gurugram Flagship Experience Stores */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">
                OUR FLAGSHIP NETWORK &bull; GURUGRAM
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                Experience Specslook In Person
              </h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-md">
              Visit our 5 dedicated optical flagship locations across Gurugram for computerized eye tests, bespoke face profiling, and personalized frame fittings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-neutral-200 rounded-xs space-y-2 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-950">SPECSLOOK SL1</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-xs uppercase">Flagship</span>
              </div>
              <div className="text-xs font-bold text-red-600">DREAMZ MALL, GURUGRAM</div>
              <p className="text-xs text-neutral-500">Dreamz Mall, Sector 4 / 7, Gurugram, Haryana - 122001</p>
              <div className="text-[11px] text-neutral-700 pt-2 border-t border-neutral-100 font-semibold">
                Tel: +91 98110 54101 &bull; Open 10:30 AM - 9:30 PM
              </div>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xs space-y-2 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-950">SPECSLOOK SL2</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-xs uppercase">Boutique</span>
              </div>
              <div className="text-xs font-bold text-red-600">SEC 5 CIRCLE, GURUGRAM</div>
              <p className="text-xs text-neutral-500">Sec 5 Circle, Railway Road, Gurugram, Haryana - 122006</p>
              <div className="text-[11px] text-neutral-700 pt-2 border-t border-neutral-100 font-semibold">
                Tel: +91 98110 54102 &bull; Open 10:30 AM - 9:30 PM
              </div>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xs space-y-2 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-950">SPECSLOOK SL3</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-xs uppercase">Boutique</span>
              </div>
              <div className="text-xs font-bold text-red-600">SECTOR 85, GURUGRAM</div>
              <p className="text-xs text-neutral-500">Sector 85, Multi-Brand Boulevard, Gurugram, Haryana - 122004</p>
              <div className="text-[11px] text-neutral-700 pt-2 border-t border-neutral-100 font-semibold">
                Tel: +91 98110 54103 &bull; Open 10:30 AM - 9:30 PM
              </div>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xs space-y-2 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-950">SPECSLOOK SL4</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-xs uppercase">Boutique</span>
              </div>
              <div className="text-xs font-bold text-red-600">SECTOR 103, GURUGRAM</div>
              <p className="text-xs text-neutral-500">Sector 103, Dwarka Expressway Corridor, Gurugram, Haryana - 122006</p>
              <div className="text-[11px] text-neutral-700 pt-2 border-t border-neutral-100 font-semibold">
                Tel: +91 98110 54104 &bull; Open 10:30 AM - 9:30 PM
              </div>
            </div>

            <div className="p-5 bg-white border border-neutral-200 rounded-xs space-y-2 hover:border-neutral-900 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-950">SPECSLOOK SL5</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-xs uppercase">Boutique</span>
              </div>
              <div className="text-xs font-bold text-red-600">SECTOR 89, GURUGRAM</div>
              <p className="text-xs text-neutral-500">Sector 89, New Gurugram Commercial Hub, Gurugram, Haryana - 122505</p>
              <div className="text-[11px] text-neutral-700 pt-2 border-t border-neutral-100 font-semibold">
                Tel: +91 98110 54105 &bull; Open 10:30 AM - 9:30 PM
              </div>
            </div>

            <div className="p-5 bg-neutral-900 text-white border border-neutral-800 rounded-xs flex flex-col justify-between">
              <div>
                <div className="text-red-500 text-[10px] font-black uppercase tracking-widest">NATIONWIDE ACCESS</div>
                <h3 className="text-sm font-extrabold uppercase mt-1">Live Outside Gurugram?</h3>
                <p className="text-xs text-neutral-400 mt-2">
                  Enjoy Free Express Shipping, Home Try-On Kits, and 14-day zero-risk returns everywhere across India.
                </p>
              </div>
              <button
                onClick={() => navigateTo('stores')}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer"
              >
                Book An Appointment
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: LOCATE A STORE IN YOUR CITY Form */}
        <section className="pt-6">
          <StoreLocatorForm variant="dark" />
        </section>

        {/* Section 5: The Specslook Promise */}
        <section className="bg-neutral-950 text-white p-8 sm:p-14 rounded-xs space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-black text-red-600 uppercase tracking-widest">
              THE SPECSLOOK STANDARD
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Why Discerning Wearers Choose Specslook
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Every order placed with Specslook is backed by comprehensive customer guarantees:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-neutral-800 p-5 rounded-xs space-y-2 bg-neutral-900/60">
              <div className="text-red-500 font-black text-xs uppercase tracking-wider">01. 14-Day Zero-Risk Trial</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Test your frames at home or work. If the fit, optical alignment, or style is not completely perfect, return with zero hassle.
              </p>
            </div>

            <div className="border border-neutral-800 p-5 rounded-xs space-y-2 bg-neutral-900/60">
              <div className="text-red-500 font-black text-xs uppercase tracking-wider">02. Free Express Delivery</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Complimentary insured express air shipping across India, complete with Cash On Delivery and secure digital payment options.
              </p>
            </div>

            <div className="border border-neutral-800 p-5 rounded-xs space-y-2 bg-neutral-900/60">
              <div className="text-red-500 font-black text-xs uppercase tracking-wider">03. Lifetime Maintenance</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Bring your Specslook frame into any of our flagship boutiques anytime for complimentary ultrasonic lens bath, realignment, and screw tightening.
              </p>
            </div>

            <div className="border border-neutral-800 p-5 rounded-xs space-y-2 bg-neutral-900/60">
              <div className="text-red-500 font-black text-xs uppercase tracking-wider">04. Lab Certified Accuracy</div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Computer-controlled lens edging calibrated to 0.01mm tolerance. Every prescription is verified by certified optometrists.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400">
              Over 250,000+ satisfied clients styled since 1998. Follow us on Instagram{' '}
              <a
                href="https://instagram.com/specslookeyewear"
                target="_blank"
                rel="noreferrer"
                className="text-red-500 underline font-bold"
              >
                @specslookeyewear
              </a>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore The Icons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </article>
    </div>
  );
};
