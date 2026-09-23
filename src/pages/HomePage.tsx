import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { MenuItemModal } from '../components/MenuItemModal';
import {
  Calendar,
  UtensilsCrossed,
  ShoppingBag,
  MapPin,
  Phone,
  ArrowRight,
  Coffee,
  Heart,
  Sparkles,
  Star,
  Plus,
  ExternalLink,
  MessageSquareQuote,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    setActivePage,
    menuItems,
    reviews,
    addReview,
    favorites,
    toggleFavorite,
    setIsCartOpen,
  } = useStore();

  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewDish, setReviewDish] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const featuredItems = menuItems.filter((i) => i.bestseller || i.chefSpecial).slice(0, 6);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview({
      customerName: reviewName.trim(),
      dishName: reviewDish.trim() || undefined,
      comment: reviewComment.trim(),
      rating: reviewRating,
      featured: false,
    });
    setReviewName('');
    setReviewDish('');
    setReviewComment('');
    setIsReviewModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      
      {/* 3. Cinematic Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-[#1A1412] text-[#FAF7F2] overflow-hidden">
        {/* Background Image with Dark Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_country_coffees_1790166227975.jpg"
            alt="Country Coffees ambience and espresso bar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412] via-[#1A1412]/60 to-[#1A1412]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1412]/80 border border-[#C59A6F]/40 text-[#C59A6F] text-xs uppercase tracking-widest font-semibold mb-6 backdrop-blur-md">
            <span>Sector 2, Salt Lake · Kolkata</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF7F2] mb-6 drop-shadow-sm text-balance">
            COUNTRY COFFEES
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-[#E8DCCF] font-light max-w-2xl mx-auto mb-10 leading-relaxed font-serif italic">
            "Coffee, Conversations & Culinary Moments."
          </p>

          {/* Primary, Secondary, and Optional CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setActivePage('reserve');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-7 py-3.5 bg-[#C59A6F] hover:bg-[#B38657] text-[#1A1412] font-bold text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Reserve a Table
            </button>

            <button
              onClick={() => {
                setActivePage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-7 py-3.5 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] border border-[#FAF7F2]/30 font-semibold text-sm rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
              Explore Menu
            </button>

            <button
              onClick={() => {
                setActivePage('order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#E8DCCF] hover:text-[#C59A6F] transition-colors cursor-pointer"
            >
              Order Online →
            </button>
          </div>
        </div>
      </section>

      {/* 4. Quick Action Buttons */}
      <section className="bg-[#F3ECE2] py-6 border-b border-[#E6DCD1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <button
              onClick={() => {
                setActivePage('reserve');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 p-3.5 bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl hover:border-[#C59A6F] hover:shadow-xs transition-all cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-[#C59A6F]" />
              <span className="text-xs font-bold text-[#1A1412] group-hover:text-[#C59A6F]">
                Reserve a Table
              </span>
            </button>

            <button
              onClick={() => {
                setActivePage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 p-3.5 bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl hover:border-[#C59A6F] hover:shadow-xs transition-all cursor-pointer group"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#C59A6F]" />
              <span className="text-xs font-bold text-[#1A1412] group-hover:text-[#C59A6F]">
                View Menu
              </span>
            </button>

            <button
              onClick={() => {
                setActivePage('order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 p-3.5 bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl hover:border-[#C59A6F] hover:shadow-xs transition-all cursor-pointer group"
            >
              <ShoppingBag className="w-4 h-4 text-[#C59A6F]" />
              <span className="text-xs font-bold text-[#1A1412] group-hover:text-[#C59A6F]">
                Order Online
              </span>
            </button>

            <a
              href="https://maps.app.goo.gl/RmJhTSJmnQSguXkj7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl hover:border-[#C59A6F] hover:shadow-xs transition-all cursor-pointer group"
            >
              <MapPin className="w-4 h-4 text-[#C59A6F]" />
              <span className="text-xs font-bold text-[#1A1412] group-hover:text-[#C59A6F]">
                Get Directions
              </span>
            </a>

            <a
              href="tel:+917003239518"
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-3.5 bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl hover:border-[#C59A6F] hover:shadow-xs transition-all cursor-pointer group"
            >
              <Phone className="w-4 h-4 text-[#C59A6F]" />
              <span className="text-xs font-bold text-[#1A1412] group-hover:text-[#C59A6F]">
                Call Us
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. Signature Experience Section */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
              The Country Coffees Essence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1412] tracking-tight mb-4">
              A Place Made for Good Coffee & Good Conversations
            </h2>
            <p className="text-sm sm:text-base text-[#5C4C43] leading-relaxed">
              Located in the heart of Sector 2, Bidhannagar, Country Coffees was imagined as a calm,
              warm sanctuary. Whether catching up over hand-dripped pour-overs, working with quiet focus,
              or dining with family, every detail is designed for comfort and connection.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 bg-[#FDFBF7] rounded-2xl border border-[#E6DCD1] hover:border-[#C59A6F] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#F3ECE2] flex items-center justify-center mb-5 text-[#C59A6F]">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-2">
                Crafted Coffee
              </h3>
              <p className="text-xs text-[#5C4C43] leading-relaxed">
                Single-origin pour-overs, precision espresso extractions, and slow-steeped cold brews
                prepared with passion.
              </p>
            </div>

            <div className="p-7 bg-[#FDFBF7] rounded-2xl border border-[#E6DCD1] hover:border-[#C59A6F] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#F3ECE2] flex items-center justify-center mb-5 text-[#C59A6F]">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-2">
                Freshly Prepared Food
              </h3>
              <p className="text-xs text-[#5C4C43] leading-relaxed">
                Wholesome sourdough platters, stone-baked thin crust pizzas, handcrafted pastas, and
                bistro comfort classics.
              </p>
            </div>

            <div className="p-7 bg-[#FDFBF7] rounded-2xl border border-[#E6DCD1] hover:border-[#C59A6F] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#F3ECE2] flex items-center justify-center mb-5 text-[#C59A6F]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-2">
                Comfortable Atmosphere
              </h3>
              <p className="text-xs text-[#5C4C43] leading-relaxed">
                Warm walnut tones, soft acoustic background melodies, plush intimate booths, and
                unhurried Kolkata hospitality.
              </p>
            </div>

            <div className="p-7 bg-[#FDFBF7] rounded-2xl border border-[#E6DCD1] hover:border-[#C59A6F] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#F3ECE2] flex items-center justify-center mb-5 text-[#C59A6F]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-2">
                Memorable Moments
              </h3>
              <p className="text-xs text-[#5C4C43] leading-relaxed">
                From cozy first dates and family celebrations to midday business catchups and evening
                dessert cravings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Menu Section */}
      <section className="py-20 bg-[#F3ECE2] border-y border-[#E6DCD1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
                Curated Highlights
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1412]">
                Featured Selections
              </h2>
            </div>
            <button
              onClick={() => {
                setActivePage('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#1A1412] hover:text-[#C59A6F] transition-colors"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Food Image */}
                  <div
                    onClick={() => setSelectedItemForModal(item)}
                    className="relative h-52 sm:h-56 bg-[#1A1412] cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center p-0.5 bg-white/90 ${
                          item.vegType === 'veg'
                            ? 'border-emerald-600'
                            : item.vegType === 'egg'
                            ? 'border-amber-600'
                            : 'border-red-600'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.vegType === 'veg'
                              ? 'bg-emerald-600'
                              : item.vegType === 'egg'
                              ? 'bg-amber-600'
                              : 'bg-red-600'
                          }`}
                        />
                      </span>
                      {item.bestseller && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#1A1412]/85 text-[#C59A6F] rounded-md backdrop-blur-xs">
                          Bestseller
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      aria-label="Save to favorites"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-[#1A1412] shadow-sm transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-red-600 text-red-600' : 'text-[#5C4C43]'}`}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] uppercase tracking-wider text-[#8A796E] font-medium">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="tabular-nums">{item.rating}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setSelectedItemForModal(item)}
                        className="font-serif text-base font-bold text-[#1A1412] hover:text-[#C59A6F] transition-colors cursor-pointer mb-1.5"
                      >
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#705E53] line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-3 border-t border-[#E6DCD1] flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-[#1A1412] tabular-nums font-serif">
                          ₹{item.discountPrice || item.price}
                        </span>
                        {item.discountPrice && (
                          <span className="text-xs text-[#8A796E] line-through tabular-nums">
                            ₹{item.price}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedItemForModal(item)}
                        className="px-3 py-1.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-[#C59A6F]" />
                        <span>Customize & Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Reserve a Table CTA Banner */}
      <section className="py-20 bg-[#1A1412] text-[#FAF7F2] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Seamless Dining Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Plan Your Visit to Country Coffees
          </h2>
          <p className="text-sm sm:text-base text-[#B8A89A] max-w-xl mx-auto mb-8 leading-relaxed">
            Reserve your preferred table in advance. Intimate corner seating, window tables overlooking Sector 2, or group spaces for celebrations.
          </p>
          <button
            onClick={() => {
              setActivePage('reserve');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-[#C59A6F] hover:bg-[#B38657] text-[#1A1412] font-bold text-sm rounded-xl shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            Check Table Availability & Reserve
          </button>
        </div>
      </section>

      {/* 8. Ambience Spotlight / Gallery Teaser */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
              Atmosphere & Moments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1412]">
              Crafted Spaces in Salt Lake
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-80 rounded-2xl overflow-hidden shadow-xs relative group bg-[#1A1412]">
              <img
                src="/src/assets/images/cafe_interior_ambience_1790166266354.jpg"
                alt="Country Coffees Cafe Lounge"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <h4 className="font-serif text-lg font-bold">Warm Contemporary Interiors</h4>
                <p className="text-xs text-[#E8DCCF]">Walnut wood, gentle amber glow, and acoustic comfort</p>
              </div>
            </div>

            <div className="h-80 rounded-2xl overflow-hidden shadow-xs relative group bg-[#1A1412]">
              <img
                src="/src/assets/images/signature_artisan_coffee_1790166241444.jpg"
                alt="Country Coffees Pour Over & Espresso"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <h4 className="font-serif text-lg font-bold">Artisanal Barista Bar</h4>
                <p className="text-xs text-[#E8DCCF]">Slow pour-overs, single origins and latte art</p>
              </div>
            </div>

            <div className="h-80 rounded-2xl overflow-hidden shadow-xs relative group bg-[#1A1412]">
              <img
                src="/src/assets/images/signature_dessert_pastry_1790166277241.jpg"
                alt="Country Coffees Signature Tiramisu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <h4 className="font-serif text-lg font-bold">House Bakes & Desserts</h4>
                <p className="text-xs text-[#E8DCCF]">Espresso-soaked tiramisu and warm brioche tarts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Today's Specials / Offers Teaser */}
      <section className="py-14 bg-[#F3ECE2] border-y border-[#E6DCD1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#E6DCD1] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block">
                Today's Privilege
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
                First Online Order? Enjoy 15% Off
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4C43] leading-relaxed">
                Use code <span className="font-mono font-bold text-[#1A1412]">WELCOME15</span> at checkout
                on orders above ₹300. Prepared fresh for takeaway or quick table-side service.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActivePage('offers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#FAF7F2] border border-[#1A1412] text-[#1A1412] hover:bg-[#1A1412] hover:text-[#FAF7F2] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                View All Offers
              </button>
              <button
                onClick={() => {
                  setActivePage('order');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#1A1412] text-[#FAF7F2] hover:bg-[#2A221E] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. About Preview */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
                Honest Storytelling
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1412] mb-6">
                The Story Behind Country Coffees
              </h2>
              <p className="text-sm text-[#5C4C43] leading-relaxed mb-4">
                Set in Salt Lake's Sector 2, Country Coffees was created to bring genuine coffee culture
                together with honest, handcrafted cafe cuisine. We believe a coffee shop is more than
                beverages in a cup; it is a neighborhood landmark where ideas are drafted, friendships
                are rekindled, and solitary afternoons are cherished.
              </p>
              <p className="text-sm text-[#5C4C43] leading-relaxed mb-8">
                Our kitchen avoids short-cuts. We bake, brew, and serve every item fresh to order,
                honoring the slow pace that great coffee and wholesome dining deserve.
              </p>
              <button
                onClick={() => {
                  setActivePage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#1A1412] hover:text-[#C59A6F] transition-colors"
              >
                <span>Read Full Philosophy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E6DCD1]">
              <img
                src="/src/assets/images/gourmet_cafe_dish_1790166254628.jpg"
                alt="Country Coffees Culinary Offerings"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 11. Customer Reviews */}
      <section className="py-20 bg-[#F3ECE2] border-t border-[#E6DCD1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
                Real Guest Experiences
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1412]">
                Words from Our Community
              </h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-[#1A1412] text-[#1A1412] hover:bg-[#1A1412] hover:text-[#FAF7F2] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <MessageSquareQuote className="w-4 h-4 text-[#C59A6F]" />
              <span>Leave a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.filter((r) => r.approved).map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-600">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C4C43] italic leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E6DCD1]">
                  <h4 className="text-xs font-bold text-[#1A1412]">{rev.customerName}</h4>
                  {rev.dishName && (
                    <span className="text-[11px] text-[#8A796E]">Ordered {rev.dishName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Location + Opening Hours + Interactive Map */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
                  Find Country Coffees
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1412] mb-4">
                  Sector 2, Bidhannagar, Kolkata
                </h2>
                <p className="text-sm text-[#5C4C43] leading-relaxed">
                  Easily accessible in Salt Lake's serene BK Block, adjacent to local parks and Karunamoyee.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-4 bg-[#FDFBF7] rounded-xl border border-[#E6DCD1]">
                  <MapPin className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1412]">Physical Address</h4>
                    <p className="text-xs text-[#5C4C43] mt-0.5">
                      39, Plot No. 39, BK Block, Sector 2, Bidhannagar, Kolkata, West Bengal 700091, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#FDFBF7] rounded-xl border border-[#E6DCD1]">
                  <Phone className="w-5 h-5 text-[#C59A6F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1412]">Reservations & Telephone</h4>
                    <p className="text-xs text-[#5C4C43] mt-0.5">+91 70032 39518</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://maps.app.goo.gl/RmJhTSJmnQSguXkj7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#2A221E] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-[#C59A6F]" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C59A6F]" />
                </a>

                <button
                  onClick={() => {
                    setActivePage('reserve');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 border border-[#1A1412] text-[#1A1412] hover:bg-[#1A1412] hover:text-[#FAF7F2] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Book a Table for Today
                </button>
              </div>
            </div>

            {/* Embedded Google Maps Frame */}
            <div className="rounded-3xl overflow-hidden border border-[#E6DCD1] shadow-lg h-[380px] bg-[#E6DCD1]">
              <iframe
                title="Country Coffees Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.834468641499!2d88.415174!3d22.585252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275ccb9ec1433%3A0xea802da98d361ee2!2sCountry%20Coffees!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 13. Final Reservation CTA */}
      <section className="py-20 bg-[#F3ECE2] text-center border-t border-[#E6DCD1]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1412] mb-4">
            We Look Forward to Welcoming You
          </h2>
          <p className="text-sm text-[#5C4C43] mb-8 leading-relaxed">
            Open daily from 10:00 AM to 10:00 PM. Reserve your table or drop in for an artisanal roast
            and hearty meal.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setActivePage('reserve');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-[#1A1412] text-[#FAF7F2] font-semibold text-xs rounded-xl hover:bg-[#2A221E] shadow-md transition-all cursor-pointer"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => {
                setActivePage('order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-[#FAF7F2] border border-[#1A1412] text-[#1A1412] font-semibold text-xs rounded-xl hover:bg-[#1A1412] hover:text-[#FAF7F2] transition-all cursor-pointer"
            >
              Order Online
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedItemForModal && (
        <MenuItemModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] text-[#241E1A] max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#E6DCD1]">
            <h3 className="font-serif text-xl font-bold text-[#1A1412] mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-[#705E53] mb-4">
              Your honest review helps fellow coffee and food enthusiasts in Kolkata.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Sayan Mukherjee"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-white focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                  Dish or Coffee Ordered (Optional)
                </label>
                <input
                  type="text"
                  value={reviewDish}
                  onChange={(e) => setReviewDish(e.target.value)}
                  placeholder="e.g. Artisanal Cafe Latte & Tiramisu"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-white focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-[#A89887]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us about the coffee, taste, hospitality, or atmosphere..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-white focus:outline-none focus:border-[#C59A6F] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#705E53] hover:text-[#1A1412]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#2A221E]"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
