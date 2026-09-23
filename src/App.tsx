import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { Toast } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ReservationPage } from './pages/ReservationPage';
import { OrderOnlinePage } from './pages/OrderOnlinePage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { OffersPage } from './pages/OffersPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activePage } = useStore();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'menu':
        return <MenuPage />;
      case 'reserve':
        return <ReservationPage />;
      case 'order':
        return <OrderOnlinePage />;
      case 'order-tracking':
        return <OrderTrackingPage />;
      case 'about':
        return <AboutPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'offers':
        return <OffersPage />;
      case 'contact':
        return <ContactPage />;
      case 'account':
        return <AccountPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241E1A] font-sans flex flex-col selection:bg-[#C59A6F] selection:text-[#1A1412]">
      {/* 1. Header with Top Bar Contract */}
      <Header />

      {/* 2. Main Page Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Global Overlays & Modals */}
      <CartDrawer />
      <WhatsAppFloat />
      <Toast />
      <MobileNav />
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
