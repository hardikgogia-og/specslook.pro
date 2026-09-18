import React from 'react';
import {
  FileText,
  ShieldCheck,
  RotateCcw,
  Truck,
  Eye,
  CreditCard,
  Award,
  AlertCircle,
  HelpCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const TermsView: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="bg-white min-h-screen pb-24 text-neutral-900">
      {/* Editorial Header */}
      <header className="bg-neutral-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-600/10 border border-red-500/30 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>LEGAL & CUSTOMER CHARTER &bull; SPECSLOOK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Last Updated: September 2026 &bull; Governing all eyewear purchases, custom prescription lens manufacturing, and doorstep optometrist services across India by Specslook.
          </p>
        </div>
      </header>

      {/* Navigation Breadcrumb */}
      <div className="border-b border-neutral-100 bg-neutral-50/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-red-600 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Terms & Conditions</span>
        </div>
      </div>

      {/* Main Content Article */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-12">
        {/* Quick Highlights Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <ShieldCheck className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">1-Year Warranty</h4>
            <p className="text-[11px] text-neutral-600 mt-1">Full coverage on manufacturing defects, frame plating, and hinges.</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <RotateCcw className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">14-Day Returns</h4>
            <p className="text-[11px] text-neutral-600 mt-1">Hassle-free exchange on unused frames and lens power accuracy guarantee.</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <Truck className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Insured Shipping</h4>
            <p className="text-[11px] text-neutral-600 mt-1">Free express delivery across India with 100% transit insurance coverage.</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <CreditCard className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">COD Available</h4>
            <p className="text-[11px] text-neutral-600 mt-1">Cash on Delivery & doorstep UPI accepted with zero advance surcharge.</p>
          </div>
        </section>

        {/* Section 1: Entity & Acceptance */}
        <section className="space-y-4 text-neutral-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">01.</span>
            <span>Operating Entity & Acceptance of Terms</span>
          </h2>
          <p className="text-sm">
            These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Customer&quot;, or &quot;You&quot;) and <strong>Specslook</strong> (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;), having its principal headquarters and registered optical operations at <strong>Specslook, Dreamz Mall, Sec 4-7 Circle, Gurugram, Haryana - 122001, India</strong>.
          </p>
          <p className="text-sm">
            By accessing or using our website (<strong>https://specslook.com</strong>), ordering spectacle frames, polarized sunglasses, magnetic clip-on attachments, or scheduling our certified Doorstep Home Eye Test services, you acknowledge that you have read, understood, and agreed to be governed by these Terms, as well as our <button onClick={() => navigateTo('privacy')} className="text-red-600 underline font-semibold hover:text-red-700">Privacy Policy</button>. If you do not agree to these Terms, please refrain from using our services.
          </p>
        </section>

        {/* Section 2: Products, Catalog & Accuracy */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">02.</span>
            <span>Eyewear Catalog, Specifications & Pricing</span>
          </h2>
          <p className="text-sm">
            Specslook curates handcrafted Japanese Beta-Titanium frames, Italian Mazzucchelli acetate spectacles, UV400 polarized shades, and multi-piece magnetic clip-on systems. While we make every effort to display optical measurements (lens width, bridge distance, temple length), frame weights, and color finishes with exact fidelity:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li>Subtle hue variations may arise depending on individual monitor calibrations, high-definition digital screen resolutions, or natural tortoiseshell acetate sheet patterning.</li>
            <li>All product prices displayed on the website are denominated in <strong>Indian Rupees (INR ₹)</strong> and are inclusive of all statutory Goods and Services Tax (GST) applicable under Indian law.</li>
            <li>Specslook reserves the right to modify pricing, discontinue promotional voucher codes, or alter product specifications without prior notice; however, any confirmed order placed prior to a price modification will be fulfilled at the original checkout price.</li>
          </ul>
        </section>

        {/* Section 3: Prescription Lenses */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">03.</span>
            <span>Custom Prescription Lenses & Verification</span>
          </h2>
          <p className="text-sm">
            When ordering corrective optical lenses (Single Vision, Anti-Glare Blue Light Cut, Photochromic Transition, or Digital Freeform Progressive lenses):
          </p>
          <div className="space-y-2 text-sm text-neutral-600">
            <p>
              <strong>1. Validity of Prescription:</strong> The customer warrants that the optical prescription submitted (Sphere, Cylinder, Axis, and Pupillary Distance) was issued by a qualified optometrist or ophthalmologist and is not older than 12 months.
            </p>
            <p>
              <strong>2. Post-Checkout Prescription Submission:</strong> If you select &quot;Provide Prescription Later&quot; during checkout, you may upload your doctor&apos;s slip via our secure portal or send it via WhatsApp to our Optometrist Concierge at <strong>+91 83688 53448</strong> within 7 days.
            </p>
            <p>
              <strong>3. Power Verification & Free Power Re-Craft:</strong> If you experience optical adaptation difficulty or if our lab surfacing deviates from your verified slip, Specslook will re-craft and replace your lenses free of charge within 14 days of delivery.
            </p>
          </div>
        </section>

        {/* Section 4: Doorstep Home Eye Test */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">04.</span>
            <span>Doorstep Home Eye Test Protocols</span>
          </h2>
          <p className="text-sm">
            Specslook offers on-demand 14-point computerized eye examinations conducted by certified optometrists at homes and offices across Gurugram, Delhi NCR, and select metropolitan clusters.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li><strong>Sanitization & Equipment:</strong> Every diagnostic kit includes hospital-grade sanitized auto-refractors, digital retinoscope arrays, trial frame kits, and a curated selection of 100+ designer frames for physical try-on.</li>
            <li><strong>Rescheduling & Cancellations:</strong> Customers may reschedule or cancel their appointment up to 2 hours before the scheduled time slot without penalty via WhatsApp or phone.</li>
            <li><strong>Consultation Fee:</strong> The nominal home consultation fee (₹99–₹199, if applicable) is fully redeemable as an instant discount voucher against any spectacles or sunglasses purchased during the visit.</li>
            <li><strong>Diagnostic Scope:</strong> The Home Eye Test is an optical refractive assessment to determine visual acuity and prescription lenses. It does not replace surgical or pathological examinations by an eye hospital surgeon.</li>
          </ul>
        </section>

        {/* Section 5: Payment, COD & Shipping */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">05.</span>
            <span>Payments, Cash on Delivery & Express Shipping</span>
          </h2>
          <div className="space-y-3 text-sm text-neutral-600">
            <p>
              <strong>Payment Modes:</strong> We accept all major Indian credit cards, debit cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Cash on Delivery (COD).
            </p>
            <p>
              <strong>Cash on Delivery (COD) Policy:</strong> For COD orders, our automated verification system or concierge team will verify your contact number and delivery pincode prior to dispatch. Doorstep delivery agents accept both physical cash and contactless UPI QR scan upon package arrival.
            </p>
            <p>
              <strong>Dispatch & Transit Timelines:</strong> Standard optical frames and non-prescription sunglasses are dispatched within 24 to 48 business hours. Bespoke surfaced prescription lenses require 3 to 5 business days for master bench mounting and laser alignment. Express courier delivery across metro cities typically takes 2 to 4 business days post-dispatch.
            </p>
            <p>
              <strong>Transit Insurance:</strong> Every parcel shipped by Specslook is fully insured against theft, loss, or transit damage until signed for at your doorstep.
            </p>
          </div>
        </section>

        {/* Section 6: Returns, Refunds & Warranty */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">06.</span>
            <span>14-Day Return Policy & 1-Year Limited Warranty</span>
          </h2>
          <div className="space-y-3 text-sm text-neutral-600">
            <p>
              <strong>14-Day Frame Return & Exchange:</strong> If you are not completely satisfied with the aesthetic fit, style, or comfort of your frame, you may initiate a return or exchange within 14 days of delivery. The item must be returned in unworn condition, in its original hardshell case, accompanied by the microfibre cleaning cloth and invoice.
            </p>
            <p>
              <strong>1-Year Manufacturer Warranty:</strong> All Specslook frames carry a comprehensive 12-month manufacturer warranty covering hinge breakage, soldering fractures, and plating peeling under normal usage. The warranty excludes accidental drops, vehicular crushing, deep lens scratching caused by abrasive fabrics, or chemical exposure.
            </p>
            <p>
              <strong>Refund Processing:</strong> Refunds for approved returns are credited to the original payment method within 5 to 7 banking days. For COD orders, refunds are issued via direct bank IMPS/NEFT transfer or UPI upon receipt and inspection of the returned parcel.
            </p>
          </div>
        </section>

        {/* Section 7: Intellectual Property & Jurisdiction */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">07.</span>
            <span>Intellectual Property, Governing Law & Jurisdiction</span>
          </h2>
          <p className="text-sm">
            All brand trademarks, logos, optical frame designs, product photography, editorial journal text, and software code on specslook.com are the exclusive intellectual property of Specslook. Unauthorized reproduction, scraping, or commercial exploitation is strictly prohibited under the Copyright Act, 1957 and Trademarks Act, 1999.
          </p>
          <p className="text-sm">
            These Terms shall be governed by, construed, and enforced in accordance with the substantive laws of the Republic of India. Any legal dispute, controversy, or claim arising out of or relating to these Terms or orders placed on this platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gurugram, Haryana, India</strong>.
          </p>
        </section>

        {/* Section 8: Grievance Officer & Concierge Contacts */}
        <section className="bg-neutral-950 text-white p-6 sm:p-8 rounded-xs border border-neutral-900 space-y-4">
          <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>CUSTOMER GRIEVANCE REDRESSAL & ASSISTANCE</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold uppercase text-white">
            Need Guidance Regarding Your Order or Warranty?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            In compliance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, our designated Grievance Officer and Customer Concierge team are available Monday through Saturday from 10:00 AM to 7:00 PM IST:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-neutral-300">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Contact Number</div>
                <a href="tel:8368853448" className="hover:text-red-400 transition-colors">8368853448 (+91 83688 53448)</a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Email Address</div>
                <a href="mailto:info@specslook.com" className="hover:text-red-400 transition-colors">info@specslook.com</a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Headquarter Address</div>
                <div>Specslook, Dreamz Mall, Sec 4-7 Circle, Gurugram</div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};
