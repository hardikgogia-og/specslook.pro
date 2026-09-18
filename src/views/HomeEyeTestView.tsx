import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
  User,
  Mail,
  Eye,
  Check,
  Glasses
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import eyeDoctorImg from '../assets/images/sunglass_woman_face_1789314512198.jpg';

export const HomeEyeTestView: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Delhi NCR',
    pincode: '',
    preferredDate: '',
    preferredTime: '11:00 AM - 01:00 PM',
    membersCount: '1 Person',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.preferredDate) {
      showToast('Please fill in required booking details', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Home Eye Test appointment requested! Our optometrist coordinator will call to confirm.');
  };

  const steps = [
    {
      num: '01',
      title: 'Schedule Your Slot',
      desc: 'Pick your preferred date and 2-hour window. Our team calls to confirm your address and vision profile.'
    },
    {
      num: '02',
      title: '14-Point Clinical Exam',
      desc: 'A certified master optometrist visits with computerized autorefractors and hospital-grade trial lenses.'
    },
    {
      num: '03',
      title: '100+ Frames at Home',
      desc: 'Try on our curated luxury collection of titanium, acetate, and aviator frames in your natural room lighting.'
    },
    {
      num: '04',
      title: 'Doorstep Delivery',
      desc: 'Your custom lenses are crafted in our ISO optical laboratory and hand-delivered within 48 to 72 hours.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-xs text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLINICAL OPTOMETRY AT YOUR DOORSTEP</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Specslook Home Eye Test
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Experience comprehensive 14-point computerized eye examinations by certified optometrists in the comfort of your living room. Try on 100+ premium frames with zero purchase obligation.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-neutral-200 rounded-xs shadow-xs">
            <div className="border-b border-neutral-200 pb-4 mb-6">
              <span className="text-xs font-extrabold text-red-600 uppercase tracking-widest block">
                RESERVE YOUR APPOINTMENT
              </span>
              <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mt-1">
                Book Certified Optometrist Visit
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Available across Delhi, Gurugram, Noida, Ghaziabad & Faridabad. 100% sanitized optical kit.
              </p>
            </div>

            {submitted ? (
              <div className="bg-neutral-900 text-white p-8 rounded-xs text-center space-y-4">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Appointment Request Confirmed!</h3>
                <p className="text-xs text-neutral-300 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our chief optometrist coordinator will contact you at <strong className="text-white">{formData.phone}</strong> within 30 minutes to confirm your scheduled slot on <strong>{formData.preferredDate}</strong>.
                </p>
                <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/918368853448?text=Hi%20Specslook,%20I%20just%20booked%20a%20Home%20Eye%20Test%20for%20${encodeURIComponent(formData.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                  >
                    <span>Instant WhatsApp Confirmation</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider underline"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                      />
                      <User className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      City / Region
                    </label>
                    <select
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                    >
                      <option value="Delhi">Delhi Central & South</option>
                      <option value="Gurugram">Gurugram / DLF Cyber City</option>
                      <option value="Noida">Noida & Greater Noida</option>
                      <option value="Faridabad">Faridabad</option>
                      <option value="Ghaziabad">Ghaziabad / Indirapuram</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Complete Address (Flat / House / Tower / Landmark) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address for the visiting optometrist"
                    className="w-full bg-neutral-50 border border-neutral-300 p-3 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Time Window *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                      <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                      Persons Testing
                    </label>
                    <select
                      value={formData.membersCount}
                      onChange={e => setFormData({ ...formData, membersCount: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 rounded-xs focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                    >
                      <option value="1 Person">1 Person</option>
                      <option value="2 People (Couples)">2 People</option>
                      <option value="3+ Family Members">3+ Family Members</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-neutral-950 text-white hover:bg-red-600 font-extrabold text-xs uppercase tracking-widest py-3.5 px-6 rounded-xs transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Home Eye Test Booking</span>
                  </button>
                  <p className="text-[11px] text-neutral-500 text-center mt-2">
                    Complimentary eye exam with any frame order. No forced purchase.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Benefits & Features (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-50 p-6 sm:p-8 border border-neutral-200 rounded-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shrink-0">
                  <Glasses className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-neutral-900 uppercase">100+ Frames to Try</h3>
                  <p className="text-xs text-neutral-500">Curated showcase brought right to your living room</p>
                </div>
              </div>

              <ul className="space-y-3 pt-2 text-xs text-neutral-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>14-point clinical refraction</strong> using hospital-grade portable autorefractor machines.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Certified optometrists</strong> trained in clinical refraction, astigmatism, and presbyopia.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Digital pupillometer pupil-distance (PD)</strong> measurement for zero optical distortion.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Instant digital prescription</strong> sent to your WhatsApp and email within 10 minutes.</span>
                </li>
              </ul>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-neutral-900 text-white p-6 border border-neutral-800 rounded-xs flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">NEED INSTANT HELP?</span>
                <h4 className="font-bold text-sm mt-0.5">Book via WhatsApp Concierge</h4>
                <p className="text-xs text-neutral-400 mt-0.5">+91 83688 53448</p>
              </div>
              <a
                href="https://wa.me/918368853448?text=Hi%20Specslook,%20I%20would%20like%20to%20book%20a%20Home%20Eye%20Test."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xs uppercase tracking-wider shrink-0 transition-colors"
              >
                Chat Now
              </a>
            </div>
          </div>
        </div>

        {/* 4 Steps Section */}
        <div className="mt-20 pt-12 border-t border-neutral-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest">HOW IT WORKS</span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight mt-1">
              Seamless 4-Step Optical Care
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(step => (
              <div key={step.num} className="bg-neutral-50 p-6 rounded-xs border border-neutral-200 relative">
                <span className="text-3xl font-black text-neutral-200 block mb-2">{step.num}</span>
                <h3 className="font-bold text-sm text-neutral-900 uppercase mb-1.5">{step.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
