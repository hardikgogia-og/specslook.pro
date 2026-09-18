import React from 'react';
import {
  Shield,
  Lock,
  Eye,
  Database,
  FileCheck,
  UserCheck,
  Bell,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  Server
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const PrivacyPolicyView: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="bg-white min-h-screen pb-24 text-neutral-900">
      {/* Editorial Header */}
      <header className="bg-neutral-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-600/10 border border-red-500/30 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>DATA PROTECTION & PRIVACY CHARTER &bull; DPDPA COMPLIANT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Last Updated: September 2026 &bull; How Specslook protects your personal information, optical prescriptions, and transaction data.
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
          <span className="text-neutral-900 font-semibold">Privacy Policy</span>
        </div>
      </div>

      {/* Main Content Article */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-12">
        {/* Core Commitments */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <Lock className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">256-Bit SSL</h4>
            <p className="text-[11px] text-neutral-600 mt-1">End-to-end encrypted sessions safeguarding orders and identity.</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <Eye className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Confidential Optics</h4>
            <p className="text-[11px] text-neutral-600 mt-1">Prescriptions accessed solely by licensed lab technicians.</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <UserCheck className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Zero Data Sale</h4>
            <p className="text-[11px] text-neutral-600 mt-1">We never rent, sell, or trade personal data with advertising brokers.</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-xs">
            <Server className="w-5 h-5 text-red-600 mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Indian Compliance</h4>
            <p className="text-[11px] text-neutral-600 mt-1">Aligned with IT Act 2000 & Digital Personal Data Protection Act.</p>
          </div>
        </section>

        {/* Section 1: Overview */}
        <section className="space-y-4 text-neutral-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">01.</span>
            <span>Commitment to Your Privacy</span>
          </h2>
          <p className="text-sm">
            At <strong>Specslook</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), having its principal optical headquarters at <strong>Specslook, Dreamz Mall, Sec 4-7 Circle, Gurugram, Haryana</strong>, protecting the confidentiality of your personal credentials, optical prescription records, and transaction security is our foremost priority. This Privacy Policy details our practices regarding the collection, storage, processing, and protection of information obtained through our website (<strong>https://specslook.com</strong>), mobile portals, WhatsApp optical support channels (<strong>8368853448</strong>), and in-person Home Eye Test appointments.
          </p>
          <p className="text-sm">
            We adhere strictly to the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act (DPDPA), India.
          </p>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">02.</span>
            <span>Information We Collect</span>
          </h2>
          <p className="text-sm">
            Depending on your interactions with Specslook, we may collect the following categories of information:
          </p>
          <div className="space-y-3 text-sm text-neutral-600">
            <div className="p-3.5 bg-neutral-50 border border-neutral-200/60 rounded-xs">
              <strong className="text-neutral-900 font-bold block mb-1">A. Contact & Identity Information</strong>
              <span>Full name, shipping address, billing address, telephone/WhatsApp mobile number, and email address provided during checkout, account creation, or concierge inquiries.</span>
            </div>
            <div className="p-3.5 bg-neutral-50 border border-neutral-200/60 rounded-xs">
              <strong className="text-neutral-900 font-bold block mb-1">B. Optical Prescription & Vision Data</strong>
              <span>Refractive power details (Sphere SPH, Cylinder CYL, Axis, Near Addition ADD), Pupillary Distance (PD), doctor consultation slips uploaded to our portal or shared via WhatsApp, and refraction measurements gathered during Home Eye Test visits.</span>
            </div>
            <div className="p-3.5 bg-neutral-50 border border-neutral-200/60 rounded-xs">
              <strong className="text-neutral-900 font-bold block mb-1">C. Transaction & Order Details</strong>
              <span>Items purchased, frame measurements, lens upgrades chosen, order history, coupon codes, and payment status. <em>Please note: Specslook does not store credit card CVV codes or net banking credentials; all electronic transactions are processed through RBI-authorized, PCI-DSS compliant payment gateways.</em></span>
            </div>
            <div className="p-3.5 bg-neutral-50 border border-neutral-200/60 rounded-xs">
              <strong className="text-neutral-900 font-bold block mb-1">D. Technical & Browsing Data</strong>
              <span>Internet Protocol (IP) address, operating system, browser type, device identifiers, time zones, and behavioral browsing data collected via secure cookies and web analytics.</span>
            </div>
          </div>
        </section>

        {/* Section 3: How We Use Information */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">03.</span>
            <span>How We Utilize Your Information</span>
          </h2>
          <p className="text-sm">We process your personal data solely for genuine business purposes, including:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li><strong>Optical Precision Manufacturing:</strong> Surfacing, edging, anti-reflective coating, and bench-mounting prescription lenses to match your verified optical parameters.</li>
            <li><strong>Order Fulfillment & Logistics:</strong> Dispatching packages via insured couriers (Blue Dart, Delhivery) and providing automated tracking updates.</li>
            <li><strong>Home Eye Test Coordination:</strong> Dispatching certified optometrists with sanitized diagnostic kits to your scheduled address.</li>
            <li><strong>Customer Concierge Support:</strong> Answering inquiries, providing styling guidance, and resolving warranty claims via phone, email, or WhatsApp (+91 83688 53448).</li>
            <li><strong>Order Verification & Fraud Prevention:</strong> Verifying Cash on Delivery (COD) bookings to prevent unauthorized dispatches and fraudulent activity.</li>
          </ul>
        </section>

        {/* Section 4: Sharing & Disclosure */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">04.</span>
            <span>Information Sharing & Third-Party Disclosure</span>
          </h2>
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xs text-xs text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-emerald-900 block mb-0.5">Strict Zero-Sale Guarantee</strong>
              Specslook never sells, rents, leases, or trades your personal information or vision records to third-party data brokers, marketing agencies, or unsolicited telemarketers.
            </div>
          </div>
          <p className="text-sm">We share information only with authorized service providers strictly necessary to execute our services:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li><strong>Logistics Couriers:</strong> Reputable couriers receive only your name, delivery address, phone number, and package dimensions to execute doorstep delivery.</li>
            <li><strong>Payment Processors:</strong> RBI-compliant payment gateways handle sensitive payment information under strict encryption standards.</li>
            <li><strong>Certified Optical Specialists:</strong> Prescription parameters are securely transmitted to our Gurugram optical lab technicians for lens surfacing.</li>
            <li><strong>Statutory Authorities:</strong> If mandated by applicable Indian law, court order, or governmental investigative agency.</li>
          </ul>
        </section>

        {/* Section 5: Cookies & Analytics */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">05.</span>
            <span>Cookies & Tracking Technologies</span>
          </h2>
          <p className="text-sm">
            We use essential cookies to maintain your shopping cart state, keep you signed into your account, and retain your selected lens choices. Additionally, we may use privacy-conscious analytics services (such as Google Analytics 4 and Meta Pixel) to analyze aggregate site traffic patterns, page response times, and checkout performance. You can disable non-essential cookies via your browser settings at any time without losing the ability to browse our catalog.
          </p>
        </section>

        {/* Section 6: Security & Storage */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">06.</span>
            <span>Data Security & Retention Safeguards</span>
          </h2>
          <p className="text-sm">
            We implement comprehensive technical and organizational measures, including TLS/SSL encryption across all endpoints, automated vulnerability scanning, strict role-based access control, and audited database backups. Optical prescription records are retained for a minimum of 3 years to facilitate seamless re-orders and longitudinal eye care tracking, after which records can be archived or permanently purged upon written request.
          </p>
        </section>

        {/* Section 7: User Rights */}
        <section className="space-y-4 text-neutral-700 leading-relaxed border-t border-neutral-100 pt-8">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2.5">
            <span className="text-red-600 text-sm font-mono">07.</span>
            <span>Your Privacy Rights</span>
          </h2>
          <p className="text-sm">Under applicable Indian data protection regulations, you possess the right to:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li>Request a copy of the personal information and prescription records we maintain about you.</li>
            <li>Request the correction, updating, or rectification of inaccurate or outdated contact information.</li>
            <li>Request the deletion or erasure of your account and personal data, subject to statutory tax and accounting retention requirements.</li>
            <li>Opt out of promotional newsletters or marketing WhatsApp communications at any time by replying &quot;STOP&quot; or emailing our support team.</li>
          </ul>
        </section>

        {/* Section 8: Grievance Redressal */}
        <section className="bg-neutral-950 text-white p-6 sm:p-8 rounded-xs border border-neutral-900 space-y-4">
          <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>STATUTORY GRIEVANCE REDRESSAL OFFICER</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold uppercase text-white">
            Data Protection & Grievance Contact
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            In accordance with the Information Technology Act, 2000 and rules made thereunder, any queries, concerns, or grievances concerning personal data processing may be directed to our designated Data Protection & Grievance Officer:
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
