import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';
import { SpecslookLogo } from './SpecslookLogo.tsx';
import { useStore } from '../context/StoreContext.tsx';

export const Footer: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      {/* Brand Trust Feature Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-neutral-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Free Air Shipping</h4>
              <p className="text-xs text-neutral-400 mt-1">Complimentary insured delivery on orders across India.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">14-Day Free Returns</h4>
              <p className="text-xs text-neutral-400 mt-1">Hassle-free doorstep pickup & complete exchanges.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">100% UV400 Protection</h4>
              <p className="text-xs text-neutral-400 mt-1">Optical lab certified mineral crystal & polarized optics.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">1-Year Warranty</h4>
              <p className="text-xs text-neutral-400 mt-1">Guaranteed against manufacturing defects & barrel hinge wear.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div onClick={() => navigateTo('home')} className="cursor-pointer inline-block">
              <SpecslookLogo variant="white" size="lg" />
            </div>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              Specslook is India's premier destination for luxury eyewear. Designed with iconic Italian craftsmanship, aerospace-grade Beta-Titanium and precision optical lenses that define individual distinction.
            </p>
            <div className="pt-2 flex items-center gap-4 text-neutral-400">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Join The Society:</span>
              <a
                href="https://instagram.com/specslookeyewear"
                target="_blank"
                rel="noreferrer"
                aria-label="Specslook on Instagram"
                className="hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-[11px] font-medium">@specslookeyewear</span>
              </a>
              <a
                href="https://www.linkedin.com/company/specslook"
                target="_blank"
                rel="noreferrer"
                aria-label="Specslook on LinkedIn"
                className="hover:text-red-500 transition-colors flex items-center gap-1 text-xs"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-[11px] font-medium">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Col 2: The Icons */}
          <div>
            <h5 className="text-white font-bold text-xs tracking-widest uppercase mb-4">The Icons</h5>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li>
                <button onClick={() => navigateTo('shop', { shape: 'Aviator' })} className="hover:text-white transition-colors">
                  Aviator Classic
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { shape: 'Wayfarer' })} className="hover:text-white transition-colors">
                  Original Wayfarer
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { shape: 'Clubmaster' })} className="hover:text-white transition-colors">
                  Clubmaster Browline
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { shape: 'Round' })} className="hover:text-white transition-colors">
                  Round Metal Legend
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { shape: 'Hexagonal' })} className="hover:text-white transition-colors">
                  Hexagonal Flat Lenses
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { polarized: true })} className="hover:text-white transition-colors">
                  Chromance Polarized
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Experience & Client Care */}
          <div>
            <h5 className="text-white font-bold text-xs tracking-widest uppercase mb-4">Client Care</h5>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li>
                <button onClick={() => navigateTo('home-eyetest')} className="hover:text-white transition-colors flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Home Eye Test (Doorstep)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop', { category: 'Eyeglasses', gender: 'Women' })} className="hover:text-white transition-colors">
                  Women's Eyewear Collection
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('tracking')} className="hover:text-white transition-colors flex items-center gap-1">
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('stores')} className="hover:text-white transition-colors">
                  Book Store Eye Exam
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Our Optical Lab & Story
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Customer Concierge (Contact Us)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('blog')} className="hover:text-white transition-colors">
                  Style Journal & Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h5 className="text-white font-bold text-xs tracking-widest uppercase mb-4">VIP Newsletter</h5>
            <p className="text-xs text-neutral-400 mb-3">
              Subscribe to receive exclusive access to private vault drops and ₹500 off your first pair.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Specslook VIP Society! Use code WELCOME500 for ₹500 off.'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-neutral-900 border border-neutral-800 text-xs px-3 py-2 text-white focus:outline-none focus:border-red-600 font-medium"
              />
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 tracking-wider uppercase transition-colors"
              >
                Join Privé
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Payment Gateways */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          &copy; {new Date().getFullYear()} Specslook Eyewear India Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-neutral-400">
          <span className="bg-emerald-950/80 text-emerald-400 px-2.5 py-1 rounded-xs border border-emerald-800 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Cash on Delivery (COD) Available
          </span>
          <span className="bg-neutral-900 px-2 py-1 rounded-xs border border-neutral-800 font-semibold text-neutral-300">
            Doorstep UPI QR (GPay / PhonePe / Paytm)
          </span>
          <span className="bg-neutral-900 px-2 py-1 rounded-xs border border-neutral-800 font-semibold text-neutral-300">
            Cash Accepted at Doorstep
          </span>
        </div>
      </div>
    </footer>
  );
};
