import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, User as UserIcon, Menu as MenuIcon, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cart,
    favorites,
    currentUser,
    setIsCartOpen,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'reserve', label: 'Reserve' },
    { id: 'order', label: 'Order Online' },
    { id: 'offers', label: 'Offers' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-[#1A1412] text-[#E8DCCF] text-xs py-2 px-4 border-b border-[#3B2F2A]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C59A6F] animate-pulse"></span>
            <span>Open Daily 10:00 AM – 10:00 PM</span>
            <span className="hidden md:inline text-[#A89887]">·</span>
            <span className="hidden md:inline text-[#A89887]">BK Block, Sector 2, Salt Lake, Kolkata</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a
              href="tel:+917003239518"
              className="text-[#E8DCCF] hover:text-[#C59A6F] transition-colors"
            >
              +91 70032 39518
            </a>
          </div>
        </div>
      </div>

      {/* 2. Top Bar Contract: [Brand title] — [Nav links] — [Actions] */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DCD1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group focus:outline-none"
            aria-label="Country Coffees Home"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#1A1412] group-hover:text-[#C59A6F] transition-colors block">
              COUNTRY COFFEES
            </span>
          </button>

          {/* Zone 2: Clean 4–6 text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium tracking-wide text-[#3B2F2A]">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors hover:text-[#1A1412] cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-[#1A1412] font-semibold' : 'text-[#5C4C43]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C59A6F] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1–2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Favorites Icon */}
            <button
              onClick={() => handleNavClick('account')}
              aria-label="View favorites"
              className="p-2 text-[#3B2F2A] hover:text-[#C59A6F] transition-colors relative cursor-pointer"
              title="Saved Dishes"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C59A6F] text-[#FAF7F2] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#1A1412] hover:bg-[#2A221E] transition-colors rounded-lg cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#C59A6F]" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemsCount > 0 && (
                <span className="w-4 h-4 bg-[#C59A6F] text-[#1A1412] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Sign in */}
            <button
              onClick={() => handleNavClick('account')}
              aria-label="Account"
              className="p-2 text-[#3B2F2A] hover:text-[#1A1412] transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="My Account"
            >
              <UserIcon className="w-4 h-4" />
              <span className="max-w-[90px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#3B2F2A] hover:text-[#1A1412] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E6DCD1] px-6 py-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2 text-sm font-medium transition-colors ${
                    activePage === link.id ? 'text-[#C59A6F] font-bold' : 'text-[#3B2F2A]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-[#E6DCD1] flex items-center justify-between">
                <button
                  onClick={() => handleNavClick('account')}
                  className="text-sm font-medium text-[#3B2F2A] flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{currentUser ? currentUser.name : 'Account & Reservations'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
