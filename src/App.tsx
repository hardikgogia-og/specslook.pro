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
import { WhatsAppWidget } from './components/WhatsAppWidget.tsx';

const AppContent: React.FC = () => {
  const { currentView, toastMessage } = useStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

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

      {/* Floating WhatsApp Orders Widget (+91 83688 53448) */}
      {!isAdmin && <WhatsAppWidget phoneNumber="918368853448" />}
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
