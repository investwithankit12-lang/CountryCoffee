import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem } from '../types';
import { MenuItemModal } from '../components/MenuItemModal';
import {
  Search,
  Filter,
  Star,
  Plus,
  Heart,
  Info,
  Check,
  ShoppingBag,
} from 'lucide-react';

export const MenuPage: React.FC = () => {
  const {
    categories,
    menuItems,
    favorites,
    toggleFavorite,
    cart,
    setIsCartOpen,
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg' | 'egg'>('all');
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category filter
        if (activeCategory !== 'all' && item.category !== activeCategory) {
          return false;
        }
        // Search query
        if (
          searchQuery.trim() &&
          !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        // Diet
        if (dietFilter !== 'all' && item.vegType !== dietFilter) {
          return false;
        }
        // Bestseller
        if (onlyBestsellers && !item.bestseller) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        }
        if (sortBy === 'price-desc') {
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0; // recommended / natural order
      });
  }, [menuItems, activeCategory, searchQuery, dietFilter, onlyBestsellers, sortBy]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Page Header */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            The Culinary Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Country Coffees Menu
          </h1>
          <p className="text-sm sm:text-base text-[#B8A89A] max-w-xl mx-auto leading-relaxed">
            Meticulously brewed artisanal coffees, refreshing botanicals, European bistro favorites,
            and handcrafted bakes.
          </p>
        </div>
      </div>

      {/* Verified Listing Disclosure Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-[#F3ECE2] border border-[#E6DCD1] rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#5C4C43]">
          <Info className="w-4 h-4 text-[#C59A6F] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1A1412]">Real Restaurant Menu Database: </span>
            This interactive menu is fully configurable. Restaurant staff can update prices, add new seasonal items, or toggle daily availability anytime in the Admin Dashboard.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Controls: Search, Filters & Sorting */}
        <div className="bg-white rounded-2xl border border-[#E6DCD1] p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8A796E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coffee, pasta, bakes..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
              />
            </div>

            {/* Diet Filter Buttons */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
                  dietFilter === 'all'
                    ? 'bg-[#1A1412] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#5C4C43] hover:bg-[#F3ECE2]'
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#FAF7F2] text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Veg Only</span>
              </button>
              <button
                onClick={() => setDietFilter('egg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  dietFilter === 'egg'
                    ? 'bg-amber-700 text-white'
                    : 'bg-[#FAF7F2] text-amber-800 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Egg Allowed</span>
              </button>
              <button
                onClick={() => setDietFilter('non-veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  dietFilter === 'non-veg'
                    ? 'bg-red-700 text-white'
                    : 'bg-[#FAF7F2] text-red-800 border border-red-200 hover:bg-red-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Bestseller toggle & Sort dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <label className="flex items-center gap-1.5 text-xs text-[#5C4C43] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyBestsellers}
                  onChange={(e) => setOnlyBestsellers(e.target.checked)}
                  className="rounded text-[#C59A6F] focus:ring-0"
                />
                <span>Bestsellers Only</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs p-2 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
              >
                <option value="recommended">Featured Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (Segmented interactive buttons per skill rules) */}
          <div className="pt-3 border-t border-[#E6DCD1] flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#1A1412] text-[#FAF7F2] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#5C4C43] hover:text-[#1A1412] hover:bg-[#F3ECE2]'
              }`}
            >
              All Categories ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#1A1412] text-[#FAF7F2] shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5C4C43] hover:text-[#1A1412] hover:bg-[#F3ECE2]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E6DCD1] p-8">
            <Filter className="w-10 h-10 text-[#8A796E] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-1">
              No menu items match your criteria
            </h3>
            <p className="text-xs text-[#705E53] mb-4">
              Try resetting your filters or searching with a different keyword.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setDietFilter('all');
                setOnlyBestsellers(false);
              }}
              className="px-4 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#2A221E]"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border border-[#E6DCD1] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group ${
                    !item.available ? 'opacity-60' : ''
                  }`}
                >
                  {/* Image Container */}
                  <div
                    onClick={() => item.available && setSelectedItemForModal(item)}
                    className="relative h-52 sm:h-56 bg-[#1A1412] cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge / Indicators */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center p-0.5 bg-white/95 ${
                          item.vegType === 'veg'
                            ? 'border-emerald-600'
                            : item.vegType === 'egg'
                            ? 'border-amber-600'
                            : 'border-red-600'
                        }`}
                        title={item.vegType}
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
                      {item.chefSpecial && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#C59A6F] text-[#1A1412] rounded-md font-semibold">
                          Chef's Special
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      aria-label="Save dish"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-[#1A1412] shadow-sm transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-red-600 text-red-600' : 'text-[#5C4C43]'}`}
                      />
                    </button>

                    {!item.available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                        Currently Sold Out
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-[#8A796E] font-medium">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="tabular-nums">{item.rating}</span>
                          <span className="text-[10px] text-[#8A796E] font-normal">
                            ({item.reviewsCount})
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => item.available && setSelectedItemForModal(item)}
                        className="font-serif text-base font-bold text-[#1A1412] hover:text-[#C59A6F] transition-colors cursor-pointer mb-1.5"
                      >
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#5C4C43] line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action */}
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
                        disabled={!item.available}
                        onClick={() => setSelectedItemForModal(item)}
                        className="px-3.5 py-1.5 bg-[#1A1412] hover:bg-[#2A221E] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#FAF7F2] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#C59A6F]" />
                        <span>Customize & Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Mobile Cart Bar if cart has items */}
      {cartItemCount > 0 && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E6DCD1] z-30 shadow-lg">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 px-4 bg-[#1A1412] text-[#FAF7F2] font-semibold text-xs rounded-xl flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C59A6F]" />
              <span>{cartItemCount} item{cartItemCount > 1 ? 's' : ''} in Bag</span>
            </div>
            <span className="text-xs text-[#C59A6F] font-bold">View Bag →</span>
          </button>
        </div>
      )}

      {/* Item Modal */}
      {selectedItemForModal && (
        <MenuItemModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}
    </div>
  );
};
