import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, Copy, Check, Sparkles, ArrowRight, Percent } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { coupons, applyCoupon, setIsCartOpen, setActivePage } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const comboDeals = [
    {
      id: 'combo-1',
      title: 'Artisan Pour-Over & House Tiramisu',
      desc: 'Pair any hand-dripped single origin coffee with our signature espresso-soaked Valrhona tiramisu.',
      price: '₹419',
      originalPrice: '₹470',
      tag: 'Save ₹51',
    },
    {
      id: 'combo-2',
      title: 'Sourdough Brunch & Latte Pairing',
      desc: 'Toasted sourdough with creamy smashed avocado and poached farm egg, served alongside a silky Cafe Latte.',
      price: '₹479',
      originalPrice: '₹530',
      tag: 'Save ₹51',
    },
    {
      id: 'combo-3',
      title: 'Afternoon Adda Combo (For 2)',
      desc: 'Two classic cappuccinos or cold coffees served with a sharing portion of wood-fired Margherita pizza.',
      price: '₹649',
      originalPrice: '₹750',
      tag: 'Save ₹101',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Header */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Privileges & Value
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Offers & Pairings
          </h1>
          <p className="text-sm sm:text-base text-[#B8A89A] max-w-lg mx-auto leading-relaxed">
            Exclusive coupons for your online orders and chef-curated combos at Country Coffees Kolkata.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Section 1: Active Coupons */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Percent className="w-5 h-5 text-[#C59A6F]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1412]">
              Active Discount Coupons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#C59A6F] font-bold">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% Flat Discount`
                        : `₹${coupon.discountValue} Flat Off`}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#1A1412]">
                    {coupon.description}
                  </h3>

                  <p className="text-xs text-[#705E53] leading-relaxed">
                    Min order value: ₹{coupon.minOrderAmount}
                    {coupon.maxDiscount && ` · Max discount up to ₹${coupon.maxDiscount}`}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6DCD1] flex items-center justify-between gap-3">
                  <div className="font-mono text-xs font-bold tracking-wider px-3 py-1.5 bg-[#FAF7F2] border border-[#E6DCD1] rounded-lg text-[#1A1412]">
                    {coupon.code}
                  </div>

                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="px-3.5 py-1.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C59A6F]" />
                        <span>Copy & Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Curated Combos */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#C59A6F]" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1412]">
              Chef's Special Combos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comboDeals.map((combo) => (
              <div
                key={combo.id}
                className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#C59A6F]/20 text-[#1A1412] rounded-md inline-block">
                    {combo.tag}
                  </span>

                  <h3 className="font-serif text-base font-bold text-[#1A1412]">
                    {combo.title}
                  </h3>

                  <p className="text-xs text-[#5C4C43] leading-relaxed">
                    {combo.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6DCD1] flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-lg font-bold text-[#1A1412]">
                      {combo.price}
                    </span>
                    <span className="text-xs text-[#8A796E] line-through">
                      {combo.originalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActivePage('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#1A1412] hover:text-[#C59A6F] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Order in Menu</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59A6F]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
