import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';

// Views
import { HomeView } from './views/HomeView.tsx';
import { ShopView } from './views/ShopView.tsx';
import { ProductDetailView } from './views/ProductDetailView.tsx';
import { CheckoutView } from './views/CheckoutView.tsx';
import { OrderConfirmationView } from './views/OrderConfirmationView.tsx';
import { OrderTrackingView } from './views/OrderTrackingView.tsx';
import { CustomerAccountView } from './views/CustomerAccountView.tsx';
import { StoresView } from './views/StoresView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { BlogView } from './views/BlogView.tsx';
import { AdminView } from './views/AdminView.tsx';
import { HomeEyeTestView } from './views/HomeEyeTestView.tsx';
import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';
import { updateSEO } from './utils/seo.ts';

const AppContent: React.FC = () => {
  const { currentView, viewParams, toastMessage } = useStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

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
      case 'home-eyetest':
        return <HomeEyeTestView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'blog':
      case 'blog-post':
        return <BlogView />;
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

      {/* Dynamic View Body */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Customer Footer (Hidden in Admin) */}
      {!isAdmin && <Footer />}

      {/* Floating WhatsApp Orders Widget (+91 83688 53448) - Hidden on product pages to keep glass selection clean */}
      {!isAdmin && !isProductPage && <WhatsAppWidget phoneNumber="918368853448" />}
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
