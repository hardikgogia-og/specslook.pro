import React, { useEffect, Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';

// Eager view for instant homepage first paint
import { HomeView } from './views/HomeView.tsx';

// Code-split dynamic views for superfast page loads
const ShopView = lazy(() => import('./views/ShopView.tsx').then(m => ({ default: m.ShopView })));
const ProductDetailView = lazy(() => import('./views/ProductDetailView.tsx').then(m => ({ default: m.ProductDetailView })));
const CheckoutView = lazy(() => import('./views/CheckoutView.tsx').then(m => ({ default: m.CheckoutView })));
const OrderConfirmationView = lazy(() => import('./views/OrderConfirmationView.tsx').then(m => ({ default: m.OrderConfirmationView })));
const OrderTrackingView = lazy(() => import('./views/OrderTrackingView.tsx').then(m => ({ default: m.OrderTrackingView })));
const CustomerAccountView = lazy(() => import('./views/CustomerAccountView.tsx').then(m => ({ default: m.CustomerAccountView })));
const StoresView = lazy(() => import('./views/StoresView.tsx').then(m => ({ default: m.StoresView })));
const FranchiseView = lazy(() => import('./views/FranchiseView.tsx').then(m => ({ default: m.FranchiseView })));
const AboutView = lazy(() => import('./views/AboutView.tsx').then(m => ({ default: m.AboutView })));
const ContactView = lazy(() => import('./views/ContactView.tsx').then(m => ({ default: m.ContactView })));
const BlogView = lazy(() => import('./views/BlogView.tsx').then(m => ({ default: m.BlogView })));
const AdminView = lazy(() => import('./views/AdminView.tsx').then(m => ({ default: m.AdminView })));
const HomeEyeTestView = lazy(() => import('./views/HomeEyeTestView.tsx').then(m => ({ default: m.HomeEyeTestView })));
const TermsView = lazy(() => import('./views/TermsView.tsx').then(m => ({ default: m.TermsView })));
const PrivacyPolicyView = lazy(() => import('./views/PrivacyPolicyView.tsx').then(m => ({ default: m.PrivacyPolicyView })));

import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';
import { RecentPurchasePopup } from './components/RecentPurchasePopup.tsx';
import { updateSEO } from './utils/seo.ts';

const ViewLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-12">
    <div className="fixed top-0 inset-x-0 h-0.5 bg-neutral-100 z-50 overflow-hidden">
      <div className="h-full bg-red-600 animate-pulse w-full" />
    </div>
    <div className="w-8 h-8 border-2 border-neutral-200 border-t-red-600 rounded-full animate-spin mb-3" />
    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Loading...</span>
  </div>
);

const AppContent: React.FC = () => {
  const { currentView, viewParams, toastMessage } = useStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // Prefetch frequent customer views on idle to make route transitions instant
  useEffect(() => {
    const prefetchRoutes = () => {
      import('./views/ShopView.tsx');
      import('./views/ProductDetailView.tsx');
      import('./views/StoresView.tsx');
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchRoutes, { timeout: 2500 });
    } else {
      setTimeout(prefetchRoutes, 1500);
    }
  }, []);

  // Dynamic SEO metadata updates across pages
  useEffect(() => {
    if (currentView === 'product') {
      // Handled with fine-grained product details inside ProductDetailView
      return;
    }

    if (currentView === 'home') {
      updateSEO({
        title: 'Specslook | Premium Luxury Eyewear & Sunglasses',
        description: 'Discover handcrafted luxury eyewear, Japanese titanium frames, designer sunglasses, and computerized home eye testing across India.',
        canonicalPath: '/',
        breadcrumbs: [{ name: 'Home', url: '/' }]
      });
    } else if (currentView === 'about') {
      updateSEO({
        title: 'About Specslook | Heritage Craftsmanship & Master Optics',
        description: 'Learn about Specslook heritage, precision Japanese titanium fabrication, bespoke optical lenses, and our flagship ateliers.',
        canonicalPath: '/about/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about/' }
        ]
      });
    } else if (currentView === 'stores') {
      updateSEO({
        title: 'Specslook Flagship Stores & Optical Ateliers | Delhi NCR',
        description: 'Locate Specslook flagship boutiques in Gurugram, Delhi NCR with master optometrists, Zeiss lens fittings, and personal styling.',
        canonicalPath: '/store/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Stores', url: '/store/' }
        ]
      });
    } else if (currentView === 'franchise') {
      updateSEO({
        title: 'Specslook Franchise Opportunities | Mini Store FOFO & Flagship Models',
        description: 'Partner with Specslook optical chain. Explore Mini Store FOFO (₹7-10L) and Flagship (₹20L) models with 24-month buyback guarantee and fast ROI.',
        canonicalPath: '/franchise/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Franchise', url: '/franchise/' }
        ]
      });
    } else if (currentView === 'home-eyetest') {
      updateSEO({
        title: 'Specslook Home Eye Test | Certified Optometrist at Doorstep',
        description: 'Book a professional 14-point computerized eye examination at your home or office with 100+ designer frames to try on.',
        canonicalPath: '/home/home-eyetest/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Home Eye Test', url: '/home/home-eyetest/' }
        ]
      });
    } else if (currentView === 'contact') {
      updateSEO({
        title: 'Contact Specslook | Concierge Care & Optical Support',
        description: 'Get in touch with Specslook eyewear concierge team for prescription guidance, orders, appointments, and warranty assistance.',
        canonicalPath: '/contact-us/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact-us/' }
        ]
      });
    } else if (currentView === 'shop') {
      const isWomenEyewear = viewParams.category === 'Eyeglasses' && viewParams.gender === 'Women';
      const isMenEyewear = viewParams.category === 'Eyeglasses' && viewParams.gender === 'Men';
      const isSunglasses = viewParams.category === 'Sunglasses';
      const isEyeglasses = viewParams.category === 'Eyeglasses' && !viewParams.gender;
      const isAttachments = viewParams.category === 'Attachments';

      if (isWomenEyewear) {
        updateSEO({
          title: "Women's Eyewear & Designer Frames | Specslook",
          description: "Shop exquisite women's eyeglasses, cat-eye frames, round spectacles, and titanium opticals with prescription lenses.",
          canonicalPath: '/product-category/eyewear/womeneyewear/',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Eyewear', url: '/product-category/eyeglasses/' },
            { name: 'Women Eyewear', url: '/product-category/eyewear/womeneyewear/' }
          ]
        });
      } else if (isMenEyewear) {
        updateSEO({
          title: "Men's Eyewear & Executive Optical Frames | Specslook",
          description: "Shop handcrafted men's spectacles, titanium browlines, and classic rectangular optical frames.",
          canonicalPath: '/product-category/eyewear/meneyewear/',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Eyewear', url: '/product-category/eyeglasses/' },
            { name: 'Men Eyewear', url: '/product-category/eyewear/meneyewear/' }
          ]
        });
      } else if (isSunglasses) {
        updateSEO({
          title: 'Designer Sunglasses & Polarized Shades | Specslook',
          description: 'Shop luxury aviator sunglasses, wayfarers, and hexagonal polarized shades with 100% UV400 protection.',
          canonicalPath: '/product-category/sunglasses/',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Sunglasses', url: '/product-category/sunglasses/' }
          ]
        });
      } else if (isEyeglasses) {
        updateSEO({
          title: 'Designer Eyeglasses & Optical Frames | Specslook',
          description: 'Browse handcrafted optical frames, blue-light blocking glasses, and prescription spectacles.',
          canonicalPath: '/product-category/eyeglasses/',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Eyeglasses', url: '/product-category/eyeglasses/' }
          ]
        });
      } else if (isAttachments) {
        updateSEO({
          title: 'Magnetic Clip-On Sunglasses & Eyewear Attachments | Specslook',
          description: 'Explore 6-in-1 magnetic clip-on frames and polarized clip-on attachments for eyeglasses.',
          canonicalPath: '/product-category/attachments/',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Attachments', url: '/product-category/attachments/' }
          ]
        });
      } else {
        updateSEO({
          title: 'Eyewear Collection & Designer Frames | Specslook',
          description: 'Explore Specslook complete collection of luxury spectacles, designer sunglasses, and clip-on attachments.',
          canonicalPath: '/shop',
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Shop', url: '/shop' }
          ]
        });
      }
    } else if (currentView === 'blog') {
      updateSEO({
        title: 'Eyewear Journal & Style Guides | Specslook',
        description: 'Read optical guides, eyewear styling advice, sunglasses history, and lens technology insights by Specslook specialists.',
        canonicalPath: '/blog/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Journal', url: '/blog/' }
        ]
      });
    } else if (currentView === 'checkout') {
      updateSEO({
        title: 'Secure Checkout | Specslook',
        description: 'Complete your luxury eyewear order with Cash on Delivery and free insured shipping across India.',
        canonicalPath: '/checkout/',
        noIndex: true
      });
    } else if (currentView === 'account') {
      updateSEO({
        title: 'My Account & Orders | Specslook',
        description: 'Access your Specslook account, track orders, view saved prescriptions, and manage personal preferences.',
        canonicalPath: '/account/',
        noIndex: true
      });
    } else if (currentView === 'tracking') {
      updateSEO({
        title: 'Track Your Shipment | Specslook',
        description: 'Live order tracking and dispatch status for your Specslook handcrafted glasses.',
        canonicalPath: '/tracking/'
      });
    } else if (currentView === 'terms') {
      updateSEO({
        title: 'Terms & Conditions | Specslook',
        description: 'Read the official Terms and Conditions governing eyewear purchases, custom prescription lenses, Home Eye Test appointments, and warranties at Specslook.',
        canonicalPath: '/terms-and-conditions/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Terms and Conditions', url: '/terms-and-conditions/' }
        ]
      });
    } else if (currentView === 'privacy') {
      updateSEO({
        title: 'Privacy Policy & Data Protection Charter | Specslook',
        description: 'Discover how Specslook protects your personal information, optical prescriptions, and transaction data under Indian data protection regulations.',
        canonicalPath: '/privacy-policy/',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy-policy/' }
        ]
      });
    } else if (currentView === 'admin') {
      updateSEO({
        title: 'Specslook Management Suite',
        description: 'Specslook administrator and catalog control suite.',
        canonicalPath: '/admin',
        noIndex: true
      });
    }
  }, [currentView, viewParams]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product':
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
      case 'checkout':
        return <CheckoutView />;
      case 'confirmation':
        return <OrderConfirmationView />;
      case 'tracking':
        return <OrderTrackingView />;
      case 'account':
        return <CustomerAccountView />;
      case 'stores':
        return <StoresView />;
      case 'franchise':
        return <FranchiseView />;
      case 'home-eyetest':
        return <HomeEyeTestView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'blog':
      case 'blog-post':
        return <BlogView />;
      case 'terms':
        return <TermsView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  const isAdmin = currentView === 'admin';
  const isProductPage = currentView === 'product';

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-red-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-xs shadow-2xl border border-neutral-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Customer Navigation Bar (Hidden in Admin for dedicated focus) */}
      {!isAdmin && <Navbar />}

      {/* Dynamic View Body wrapped in Suspense for instant chunk loading */}
      <main className="flex-1">
        <Suspense fallback={<ViewLoadingFallback />}>
          {renderCurrentView()}
        </Suspense>
      </main>

      {/* Customer Footer (Hidden in Admin) */}
      {!isAdmin && <Footer />}

      {/* Floating WhatsApp Orders Widget (+91 83688 53448) - Hidden on product pages to keep glass selection clean */}
      {!isAdmin && !isProductPage && <WhatsAppWidget phoneNumber="918368853448" />}

      {/* Premium Recent Purchase Notification Popup */}
      {!isAdmin && <RecentPurchasePopup />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
