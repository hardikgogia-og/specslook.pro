import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, Check, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { StoreLocatorForm } from '../components/StoreLocatorForm.tsx';

export const StoresView: React.FC = () => {
  const { stores, showToast } = useStore();
  const [selectedStore, setSelectedStore] = useState(stores[0]?.name || 'SPECSLOOK SL1');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !bookingDate) return;
    setIsBooked(true);
    showToast(`Appointment scheduled at ${selectedStore}`);
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto text-center max-w-2xl">
          <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1">
            FLAGSHIP BOUTIQUES & LABS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Our Flagship Stores
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Experience our full eyewear archive in person, tailored bespoke fitting, and complimentary 14-point Zeiss eye examinations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* LOCATE A STORE IN YOUR CITY Form */}
        <StoreLocatorForm variant="dark" />

        {/* Flagship Stores Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1">
              GURUGRAM FLAGSHIP ATELIERS
            </div>
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
              Visit Our 5 Flagship Stores
            </h2>
          </div>
          <span className="text-xs font-semibold text-neutral-500">
            Certified Zeiss Optometrists Available Daily
          </span>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs hover:border-neutral-900 transition-all flex flex-col"
            >
              <div className="aspect-16/10 bg-neutral-100 overflow-hidden relative">
                <img
                  src={(store as any).image || (store as any).imageUrl}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-neutral-950/90 text-white text-[10px] font-extrabold px-2.5 py-0.5 uppercase tracking-wider backdrop-blur-xs">
                  {store.city}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-lg text-neutral-900">{store.name}</h3>
                  <div className="mt-3 space-y-2 text-xs text-neutral-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>{store.timings}</span>
                    </div>
                  </div>

                  {store.features && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {store.features.map((feat, i) => (
                        <span
                          key={i}
                          className="bg-neutral-100 text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded-xs"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      setSelectedStore(store.name);
                      document.getElementById('appointment-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-neutral-900 hover:bg-red-600 text-white text-xs font-bold py-2.5 uppercase tracking-wider transition-colors"
                  >
                    Book Store Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointment Booking Section */}
        <div id="appointment-section" className="mt-20 bg-neutral-50 border border-neutral-200 rounded-xs p-8 sm:p-12">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1">
                COMPLIMENTARY CONSULTATION
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
                Book Eye Exam & Custom Frame Fitting
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Enjoy 1-on-1 styling advice and comprehensive digital eye exams performed by our licensed optometrists.
              </p>
            </div>

            {isBooked ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xs text-center space-y-3">
                <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-extrabold text-sm uppercase text-emerald-900">Appointment Confirmed!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you, <strong>{clientName}</strong>. Your consultation at <strong>{selectedStore}</strong> has been scheduled for <strong>{bookingDate} at {bookingTime}</strong>. We have sent an SMS confirmation to +91 {clientPhone}.
                </p>
                <button
                  onClick={() => setIsBooked(false)}
                  className="text-xs font-bold uppercase tracking-wider text-emerald-900 underline pt-2"
                >
                  Book another slot
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Select Boutique</label>
                  <select
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.name}>{s.name} ({s.city})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Honey Gogia"
                      className="w-full text-xs p-3 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full text-xs p-3 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full text-xs p-3 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Time Slot *</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-xs p-3 bg-white border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
                    >
                      <option>10:30 AM</option>
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>04:00 PM</option>
                      <option>06:30 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold py-3.5 px-4 uppercase tracking-widest transition-colors shadow-md"
                >
                  Confirm Free Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
