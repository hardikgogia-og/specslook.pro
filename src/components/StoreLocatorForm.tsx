import React, { useState } from 'react';
import { MapPin, Phone, User, Building, Send, CheckCircle2, ArrowRight, Clock, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface StoreLocatorFormProps {
  variant?: 'card' | 'embedded' | 'dark';
  className?: string;
}

export const StoreLocatorForm: React.FC<StoreLocatorFormProps> = ({ variant = 'card', className = '' }) => {
  const { stores, showToast } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [cityName, setCityName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [matchedStores, setMatchedStores] = useState<typeof stores>([]);
  const [isOtherCity, setIsOtherCity] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !cityName.trim() || !contactNumber.trim()) {
      showToast('Please fill out all fields to locate a store.');
      return;
    }

    // Check if city matches Gurugram/Gurgaon
    const normalizedCity = cityName.trim().toLowerCase();
    const isGurgaon = normalizedCity.includes('guru') || normalizedCity.includes('gurgaon') || normalizedCity.includes('ggn') || normalizedCity.includes('haryana');

    if (isGurgaon) {
      setMatchedStores(stores);
      setIsOtherCity(false);
    } else {
      setMatchedStores([]);
      setIsOtherCity(true);
    }

    setSubmitted(true);
    showToast(`Store search submitted for ${cityName.trim()}!`);
  };

  const handleReset = () => {
    setSubmitted(false);
    setCustomerName('');
    setCityName('');
    setContactNumber('');
    setMatchedStores([]);
    setIsOtherCity(false);
  };

  const isDark = variant === 'dark';

  return (
    <div
      id="locate-store-section"
      className={`rounded-xs transition-all ${
        isDark
          ? 'bg-neutral-900 text-white border border-neutral-800 p-6 sm:p-10 shadow-2xl'
          : 'bg-white text-neutral-900 border border-neutral-200 p-6 sm:p-10 shadow-sm'
      } ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xs mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>NATIONWIDE OPTICAL CONCIERGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            LOCATE A STORE IN YOUR CITY
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-lg mx-auto ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Enter your details below to instantly find the nearest Specslook Flagship Boutique or have our personal optical stylist bring the collection to your city.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4" id="locate-store-form">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Customer Name */}
              <div>
                <label
                  htmlFor="customer-name"
                  className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="customer-name"
                    name="customer-name"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full pl-9 pr-3 py-3 text-xs font-medium rounded-xs border transition-all focus:outline-none focus:ring-1 ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-red-500'
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>
              </div>

              {/* City Name */}
              <div>
                <label
                  htmlFor="city-name"
                  className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  City Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="city-name"
                    name="city-name"
                    required
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g. Gurugram, Delhi, Mumbai"
                    className={`w-full pl-9 pr-3 py-3 text-xs font-medium rounded-xs border transition-all focus:outline-none focus:ring-1 ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-red-500'
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contact-number"
                  className={`block text-[11px] font-extrabold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="contact-number"
                    name="contact-number"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. 98110XXXXX"
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    className={`w-full pl-9 pr-3 py-3 text-xs font-medium rounded-xs border transition-all focus:outline-none focus:ring-1 ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-red-500'
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:ring-neutral-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                id="submit-locate-store"
                className="w-full sm:w-auto px-10 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xs shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Find Stores In My City</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xs flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-emerald-600 uppercase">
                  Thank You, {customerName}!
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  We have received your store inquiry for <strong>{cityName}</strong>. An SMS confirmation with dedicated optical styling assistance has been dispatched to <strong>+91 {contactNumber}</strong>.
                </p>
              </div>
            </div>

            {/* Results based on city */}
            {!isOtherCity && matchedStores.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-red-500">
                    5 Flagship Stores Active in Gurugram
                  </h3>
                  <span className="text-[11px] text-neutral-400">Open 7 Days (10:30 AM - 9:30 PM)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {matchedStores.map((store) => (
                    <div
                      key={store.id}
                      className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xs hover:border-red-500/50 transition-colors space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{store.name}</span>
                        <span className="text-[9px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded-xs font-bold uppercase">
                          Boutique
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-neutral-800/80">
                        <a
                          href={`tel:${store.phone}`}
                          className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{store.phone}</span>
                        </a>
                        <span className="text-[10px] text-neutral-500">Free Eye Test</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-neutral-950/70 border border-neutral-800 rounded-xs space-y-3 text-left">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                  <Navigation className="w-4 h-4" />
                  <span>Doorstep Optical Concierge For {cityName}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  While our primary company-owned Flagship Boutiques (SL1 through SL5) are located in Gurugram, Specslook provides <strong>Complimentary Express Air Delivery</strong>, <strong>Doorstep Try-On Kits</strong>, and <strong>14-Day Zero-Risk Return Guarantees</strong> across {cityName} and nationwide.
                </p>
                <div className="p-3 bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 space-y-1">
                  <div className="font-semibold text-white">Direct Concierge Assistance:</div>
                  <div>Phone: <a href="tel:+919811054101" className="text-red-400 underline">+91 98110 54101</a> (10:00 AM - 8:00 PM)</div>
                  <div>WhatsApp: <span className="text-emerald-400 font-medium">+91 98110 54101</span> (Chat with an Optometrist)</div>
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-neutral-400 hover:text-white underline font-semibold uppercase tracking-wider cursor-pointer"
              >
                Search Another City
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
