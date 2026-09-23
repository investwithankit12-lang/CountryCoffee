import React from 'react';
import { useStore } from '../context/StoreContext';
import { Coffee, Heart, Utensils, Users, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Hero */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Our Brand Philosophy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            The Story Behind Country Coffees
          </h1>
          <p className="text-sm sm:text-base text-[#B8A89A] max-w-xl mx-auto leading-relaxed">
            A quiet space shaped for coffee purists, slow conversations, and honest cafe culinary moments in Sector 2, Bidhannagar, Kolkata.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Story Section 1: The Origin in Salt Lake */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F]">
              Neighborhood Roots
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
              A Quiet Corner in BK Block
            </h2>
            <p className="text-sm text-[#5C4C43] leading-relaxed">
              Country Coffees was born from a simple observation: modern life in Kolkata moves fast, but the city's truest spirit has always thrived in relaxed "adda", thoughtful reading, and unhurried meetings over warm cups.
            </p>
            <p className="text-sm text-[#5C4C43] leading-relaxed">
              Situated at Plot No. 39 in Sector 2, we set out to build a contemporary coffee sanctuary. Here, the aroma of freshly ground beans, comfortable walnut seating, and mindful acoustics invite you to stay as long as you like.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E6DCD1]">
            <img
              src="/src/assets/images/cafe_interior_ambience_1790166266354.jpg"
              alt="Country Coffees Interior"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover"
            />
          </div>
        </div>

        {/* Story Section 2: Coffee & Food Pillars */}
        <div className="bg-[#F3ECE2] rounded-3xl p-8 sm:p-12 border border-[#E6DCD1]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
              Our Core Craft
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
              What We Hold Dear
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1]">
              <div className="w-10 h-10 rounded-xl bg-[#F3ECE2] flex items-center justify-center mb-4 text-[#C59A6F]">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1412] mb-2">
                Coffee Culture
              </h3>
              <p className="text-xs text-[#5C4C43] leading-relaxed">
                We calibrate our grind size and brew ratios daily. From manual pour-overs to rich cortados, we serve coffee that respects bean clarity.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1]">
              <div className="w-10 h-10 rounded-xl bg-[#F3ECE2] flex items-center justify-center mb-4 text-[#C59A6F]">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1412] mb-2">
                Food Philosophy
              </h3>
              <p className="text-xs text-[#5C4C43] leading-relaxed">
                Every dish is cooked to order using quality produce. Real butter brioche, sourdough bakes, fresh Italian herbs, and no shortcuts.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1]">
              <div className="w-10 h-10 rounded-xl bg-[#F3ECE2] flex items-center justify-center mb-4 text-[#C59A6F]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1A1412] mb-2">
                Warm Hospitality
              </h3>
              <p className="text-xs text-[#5C4C43] leading-relaxed">
                Whether you drop in for a 15-minute morning takeaway or an evening table for two, our team treats every guest with genuine warmth.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Visual Craftsmanship Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 rounded-3xl overflow-hidden shadow-lg border border-[#E6DCD1]">
            <img
              src="/src/assets/images/signature_artisan_coffee_1790166241444.jpg"
              alt="Pour-over and latte art"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F]">
              Craft In Every Cup
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
              Brewing with Patience
            </h2>
            <p className="text-sm text-[#5C4C43] leading-relaxed">
              We steer away from generic claims and let the cup speak for itself. We train our baristas to understand extraction timing, milk steaming micro-foam textures, and flavor balance.
            </p>
            <p className="text-sm text-[#5C4C43] leading-relaxed">
              Pair your cup with our signature tiramisu dusted with Valrhona cocoa or our classic avocado sourdough platter for a memorable culinary pairing.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActivePage('reserve');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#2A221E] shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Reserve a Table</span>
                <ArrowRight className="w-4 h-4 text-[#C59A6F]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
