import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Clock, Mail, ExternalLink, ShieldCheck, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, isAdminRegistered, isAdminLoggedIn, adminAccount } = useStore();
  const [modalPolicy, setModalPolicy] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  const handleNav = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1412] text-[#E8DCCF] border-t border-[#3B2F2A] pt-14 pb-20 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#3B2F2A]">
          
          {/* Col 1: Brand & Ethos */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold tracking-wider text-[#FAF7F2] block">
              COUNTRY COFFEES
            </span>
            <p className="text-sm text-[#B8A89A] leading-relaxed">
              A premium coffee house and bistro nestled in Sector 2, Bidhannagar, Kolkata.
              Crafted coffee, honest food, and spaces shaped for good conversations.
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-[#C59A6F] font-semibold block mb-1">
                Hours of Hospitality
              </span>
              <p className="text-sm text-[#FAF7F2]">10:00 AM – 10:00 PM, Every Day</p>
            </div>
          </div>

          {/* Col 2: Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F]">
              Visit & Contact
            </h4>
            <div className="flex items-start gap-2.5 text-sm text-[#B8A89A]">
              <MapPin className="w-4 h-4 text-[#C59A6F] shrink-0 mt-1" />
              <span>39, Plot No. 39, BK Block, Sector 2, Bidhannagar, Kolkata, West Bengal 700091</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#B8A89A]">
              <Phone className="w-4 h-4 text-[#C59A6F] shrink-0" />
              <a href="tel:+917003239518" className="hover:text-[#FAF7F2] transition-colors">
                +91 70032 39518
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#B8A89A]">
              <Clock className="w-4 h-4 text-[#C59A6F] shrink-0" />
              <span>Dine-in & Takeaway until 10:00 PM</span>
            </div>
            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/RmJhTSJmnQSguXkj7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C59A6F] hover:text-[#FAF7F2] underline transition-colors"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#B8A89A]">
              <li>
                <button onClick={() => handleNav('menu')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
                  Dynamic Menu
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('reserve')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
                  Reserve a Table
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('order')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
                  Order Online (Dine-in / Pickup)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('offers')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
                  Special Offers & Combos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
                  Ambience & Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
                  About Our Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
                  Contact & Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Guest Services & Staff */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F]">
              Customer Care & Admin
            </h4>
            <p className="text-xs text-[#B8A89A] leading-relaxed">
              Planning a group reservation or corporate gathering? Reach out directly via phone or WhatsApp.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs">
              <button
                onClick={() => handleNav('account')}
                className="text-left text-[#B8A89A] hover:text-[#FAF7F2] transition-colors"
              >
                Track Past Orders & Reservations
              </button>
              
              {/* Sole Admin Access Point (Footer only) */}
              <button
                onClick={() => handleNav('admin')}
                className="inline-flex items-center gap-1.5 text-[#C59A6F] hover:text-[#FAF7F2] transition-colors font-medium text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {!isAdminRegistered
                    ? 'Admin Sign-Up (1 Slot Open)'
                    : isAdminLoggedIn
                    ? `Admin Portal · ${adminAccount?.name || 'Active'}`
                    : 'Admin Login (All Bookings)'}
                </span>
                {!isAdminRegistered && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#C59A6F] text-[#1A1412] rounded">
                    Claim Slot
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8A796E]">
          <div>
            © {new Date().getFullYear()} Country Coffees. All rights reserved. Kolkata, India.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => setModalPolicy('privacy')}
              className="hover:text-[#FAF7F2] transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setModalPolicy('terms')}
              className="hover:text-[#FAF7F2] transition-colors"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <button
              onClick={() => setModalPolicy('refund')}
              className="hover:text-[#FAF7F2] transition-colors"
            >
              Refund & Cancellation
            </button>
            <span>·</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-[#A89887] hover:text-[#C59A6F] transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{!isAdminRegistered ? 'Admin Setup' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalPolicy && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] text-[#241E1A] max-w-lg w-full rounded-xl p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalPolicy(null)}
              className="absolute top-4 right-4 p-2 text-[#705E53] hover:text-[#1A1412]"
            >
              <X className="w-5 h-5" />
            </button>

            {modalPolicy === 'privacy' && (
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1A1412] mb-3">Privacy Policy</h3>
                <p className="text-xs text-[#5C4C43] leading-relaxed mb-3">
                  At Country Coffees, we respect your personal privacy. We collect customer contact information (name, phone number, email address) solely for the purpose of processing your table reservations, online orders, and communication regarding service updates.
                </p>
                <p className="text-xs text-[#5C4C43] leading-relaxed">
                  We do not sell or rent guest contact lists. All payments are processed through secure, PCI-compliant payment gateways.
                </p>
              </div>
            )}

            {modalPolicy === 'terms' && (
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1A1412] mb-3">Terms & Conditions</h3>
                <p className="text-xs text-[#5C4C43] leading-relaxed mb-3">
                  Table reservations at Country Coffees are held for up to 15 minutes past the reserved time slot before being released to walk-in patrons during peak hours. Seating preferences are accommodated based on daily dining room availability.
                </p>
                <p className="text-xs text-[#5C4C43] leading-relaxed">
                  Food items are prepared fresh to order; preparation times may vary slightly during peak rush hours.
                </p>
              </div>
            )}

            {modalPolicy === 'refund' && (
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1A1412] mb-3">Refund & Cancellation Policy</h3>
                <p className="text-xs text-[#5C4C43] leading-relaxed mb-3">
                  Online orders can be cancelled within 5 minutes of placement by calling our restaurant team at +91 70032 39518 before food preparation begins. Once preparing in the kitchen, online orders cannot be cancelled.
                </p>
                <p className="text-xs text-[#5C4C43] leading-relaxed">
                  Table reservations may be cancelled at any time through your customer account without any cancellation penalty.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#E6DCD1] text-right">
              <button
                onClick={() => setModalPolicy(null)}
                className="px-4 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#2A221E]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
