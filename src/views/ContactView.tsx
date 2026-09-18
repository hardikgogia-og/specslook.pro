import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Order & Shipment Status',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    showToast('Inquiry sent to Specslook Concierge team');
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest">
            CLIENT CONCIERGE & CARE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Contact Specslook
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Our luxury eyewear specialists and master opticians are available 7 days a week.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-50 p-6 sm:p-8 border border-neutral-200 rounded-xs space-y-6">
              <h2 className="font-black text-lg uppercase text-neutral-900">
                Direct Channels
              </h2>

              <div className="space-y-4 text-xs text-neutral-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Direct Concierge & Orders</span>
                    <a href="tel:8368853448" className="text-neutral-600 hover:text-red-600 transition-colors font-medium">
                      8368853448 (+91 83688 53448)
                    </a>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">Mon - Sun: 9:00 AM – 9:00 PM IST &bull; WhatsApp Active</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Client Relations & Support</span>
                    <a href="mailto:info@specslook.com" className="text-neutral-600 hover:text-red-600 transition-colors font-medium">
                      info@specslook.com
                    </a>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">Responses guaranteed within 2 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block">Headquarters & Optical Experience Center</span>
                    <span className="text-neutral-600 leading-relaxed">
                      Specslook, Dreamz Mall,<br />
                      Sec 4-7 Circle, Gurugram,<br />
                      Haryana - 122001, India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-xs shadow-xs">
              <h2 className="font-black text-lg uppercase text-neutral-900 mb-2">
                Send an Inquiry
              </h2>
              <p className="text-xs text-neutral-500 mb-6">
                Whether you need prescription guidance, custom frame measurements, or warranty assistance, our specialists are ready to assist.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-xs text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-sm uppercase text-emerald-900">Message Dispatched!</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Thank you, {formData.name}. Our eyewear concierge has received your note and will reach out to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold uppercase tracking-wider text-emerald-900 underline pt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Honey Gogia"
                        className="w-full text-xs p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full text-xs p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full text-xs p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Inquiry Topic</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full text-xs p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium bg-white"
                      >
                        <option>Order & Shipment Status</option>
                        <option>Prescription Lens Consultation</option>
                        <option>Store Visit / Private Fitting</option>
                        <option>Returns & Exchanges</option>
                        <option>Warranty Claim</option>
                        <option>Wholesale & Corporate Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share any order numbers or details regarding your inquiry..."
                      className="w-full text-xs p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-neutral-950 hover:bg-red-600 text-white text-xs font-extrabold py-3.5 px-6 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
