import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, UtensilsCrossed, Calendar, ShoppingBag, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, cart } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'reserve', label: 'Book', icon: Calendar },
    { id: 'order', label: 'Order', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'account', label: 'Account', icon: User },
  ];

  const handleSelect = (id: string) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E6DCD1] h-16 px-2 flex items-center justify-around shadow-lg max-h-[12vh]"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
              isActive ? 'text-[#1A1412] font-semibold' : 'text-[#705E53] hover:text-[#1A1412]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#C59A6F]' : ''}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 bg-[#C59A6F] text-[#1A1412] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
