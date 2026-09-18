import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CheckCircle, X, Glasses } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

interface PurchaseNotification {
  name: string;
  city: string;
  product: string;
  categoryHint?: string;
}

const NOTIFICATIONS: PurchaseNotification[] = [
  { name: 'Rahul Sharma', city: 'Delhi', product: '6-in-1 Clip-On Glasses', categoryHint: 'Attachments' },
  { name: 'Arjun Verma', city: 'Gurugram', product: 'Classic Black Frame', categoryHint: 'Eyeglasses' },
  { name: 'Rohan Mehta', city: 'Mumbai', product: 'Premium Aviator Sunglasses', categoryHint: 'Sunglasses' },
  { name: 'Aditya Kapoor', city: 'Bengaluru', product: '6-in-1 Attachment Glasses', categoryHint: 'Attachments' },
  { name: 'Karan Singh', city: 'Chandigarh', product: 'Blue Light Glasses', categoryHint: 'Eyeglasses' },
  { name: 'Ankit Gupta', city: 'Jaipur', product: 'Premium Round Frame', categoryHint: 'Eyeglasses' },
  { name: 'Yash Malhotra', city: 'Noida', product: 'Classic Rectangle Frame', categoryHint: 'Eyeglasses' },
  { name: 'Vivek Kumar', city: 'Lucknow', product: 'Polarized Sunglasses', categoryHint: 'Sunglasses' },
  { name: 'Harsh Bansal', city: 'Pune', product: '6-in-1 Clip-On Glasses', categoryHint: 'Attachments' },
  { name: 'Aman Arora', city: 'Hyderabad', product: 'Premium Metal Frame', categoryHint: 'Eyeglasses' },
  { name: 'Nikhil Jain', city: 'Ahmedabad', product: 'UV Protection Sunglasses', categoryHint: 'Sunglasses' },
  { name: 'Mohit Saini', city: 'Faridabad', product: 'Classic Black Frame', categoryHint: 'Eyeglasses' },
];

export const RecentPurchasePopup: React.FC = () => {
  const { navigateTo, currentView } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);

  // Hidden on admin panel and checkout to avoid distraction
  const isHiddenView = currentView === 'admin' || currentView === 'checkout';

  useEffect(() => {
    if (isHiddenView || isDismissedByUser) {
      setIsVisible(false);
      return;
    }

    let hideTimer: ReturnType<typeof setTimeout>;
    let intervalTimer: ReturnType<typeof setTimeout>;

    // Initial trigger after page load (3.5 seconds)
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearTimeout(intervalTimer);
    };
  }, [isHiddenView, isDismissedByUser]);

  useEffect(() => {
    if (!isVisible || isHiddenView || isDismissedByUser) return;

    // Display for exactly 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      // Wait 30-second interval before showing next notification
      const intervalTimer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % NOTIFICATIONS.length);
        setIsVisible(true);
      }, 30000);

      return () => clearTimeout(intervalTimer);
    }, 4000);

    return () => clearTimeout(hideTimer);
  }, [isVisible, isHiddenView, isDismissedByUser]);

  if (isHiddenView || isDismissedByUser) {
    return null;
  }

  const currentItem = NOTIFICATIONS[currentIndex];

  const handleClick = () => {
    if (currentItem.categoryHint) {
      navigateTo('shop', { category: currentItem.categoryHint });
    } else {
      navigateTo('shop');
    }
  };

  return (
    <div
      aria-live="polite"
      aria-label="Recent purchase alert"
      className="fixed bottom-5 left-5 z-40 pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={`notification-${currentIndex}`}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-auto max-w-[calc(100vw-32px)] sm:max-w-xs bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-2xl rounded-xs p-3.5 flex items-start gap-3 select-none group hover:border-neutral-400 transition-colors"
          >
            {/* Visual Icon Box */}
            <div
              onClick={handleClick}
              className="w-10 h-10 rounded-xs bg-neutral-950 text-white flex items-center justify-center shrink-0 cursor-pointer relative overflow-hidden group-hover:bg-red-600 transition-colors"
            >
              <Glasses className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Notification Content matching layout */}
            <div onClick={handleClick} className="flex-1 min-w-0 cursor-pointer">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified Buyer</span>
              </div>
              <div className="font-bold text-neutral-900 text-xs sm:text-[13px] leading-tight truncate">
                {currentItem.name} from {currentItem.city}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium my-0.5 tracking-wide">
                Purchased
              </div>
              <div className="font-bold text-neutral-950 text-xs sm:text-[13px] leading-tight text-red-600 truncate">
                {currentItem.product}
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              title="Dismiss notification"
              className="text-neutral-400 hover:text-neutral-700 p-0.5 -mr-1 -mt-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
