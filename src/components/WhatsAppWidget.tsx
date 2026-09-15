import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, ShoppingBag } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '918368853448'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPlayedVisitSound, setHasPlayedVisitSound] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play crisp acoustic click sound via Web Audio API (zero external network latency)
  const playClickSound = (type: 'visit' | 'click' = 'click') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'visit') {
        // Welcoming two-tone luxury optical chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.exponentialRampToValueAtTime(660, now + 0.15);

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
      } else {
        // High-end tactile mechanical click
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

        gainNode.gain.setValueAtTime(0.18, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Trigger subtle welcoming click sound when visitor arrives and interacts with the page
  useEffect(() => {
    let triggered = false;

    const handleFirstUserInteraction = () => {
      if (!triggered && !hasPlayedVisitSound) {
        triggered = true;
        setHasPlayedVisitSound(true);
        playClickSound('visit');
      }
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    // Try direct audio on load (will succeed if audio already allowed)
    const timer = setTimeout(() => {
      if (!triggered) {
        playClickSound('visit');
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, [hasPlayedVisitSound]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Hello Specslook! I'd like to place an order or inquire about eyewear & optometrist services."
  )}`;

  const handleOpenWhatsApp = () => {
    playClickSound('click');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Instant Optical Support and Orders"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto"
    >
      {/* Floating Chat Bubble Popup */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Specslook WhatsApp concierge"
          className="mb-3 w-80 bg-white border border-neutral-200 rounded-sm shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          {/* Header */}
          <div className="bg-[#128C7E] px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">
                <MessageCircle className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="font-extrabold text-xs tracking-wide">Specslook Optical Concierge</div>
                <div className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Live Order Support (+91 83688 53448)
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound('click');
                setIsOpen(false);
              }}
              className="p-1 rounded hover:bg-white/10 text-white transition-colors"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-neutral-50/80 space-y-3">
            <div className="bg-white border border-neutral-200 p-3 rounded-xs shadow-xs text-xs text-neutral-800 leading-relaxed">
              <p className="font-bold text-neutral-900 mb-1">👋 Welcome to Specslook Luxury Eyewear!</p>
              <p className="text-[11px] text-neutral-600">
                Need help picking frames, booking a free Zeiss eye exam, ordering prescription lenses or clip-on attachments?
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-xs py-2.5 px-4 rounded-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Place Order on WhatsApp</span>
              </button>
              <span className="text-[10px] text-center text-neutral-500">
                Direct WhatsApp Hotline: <strong className="text-neutral-700">+91 83688 53448</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        {/* Subtle Label Pill on Desktop */}
        <button
          type="button"
          onClick={() => {
            playClickSound('click');
            setIsOpen(prev => !prev);
          }}
          className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-900 px-3.5 py-2 rounded-full shadow-lg hover:border-neutral-400 hover:shadow-xl transition-all cursor-pointer text-xs font-bold"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>Order on WhatsApp</span>
          <span className="text-[11px] font-normal text-neutral-500 font-mono">+91 83688 53448</span>
        </button>

        {/* WhatsApp Icon Button */}
        <button
          type="button"
          id="whatsapp-floating-button"
          onClick={() => {
            playClickSound('click');
            if (isOpen) {
              handleOpenWhatsApp();
            } else {
              setIsOpen(true);
            }
          }}
          aria-label="Chat on WhatsApp +91 83688 53448"
          className="relative group w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-xl shadow-emerald-700/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {/* Live Notification Indicator Badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white animate-bounce">
            1
          </span>

          <svg
            className="w-7 h-7 fill-white transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
      </div>
    </aside>
  );
};
