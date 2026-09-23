import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'coffee' | 'food' | 'interior' | 'ambience';
  title: string;
  subtitle: string;
  image: string;
}

export const GalleryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'coffee' | 'food' | 'interior' | 'ambience'>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g-1',
      category: 'coffee',
      title: 'Artisanal Cafe Latte',
      subtitle: 'Silky micro-foam rosetta art in handcrafted ceramic',
      image: '/src/assets/images/signature_artisan_coffee_1790166241444.jpg',
    },
    {
      id: 'g-2',
      category: 'interior',
      title: 'The Main Coffee Lounge',
      subtitle: 'Walnut wood, amber pendant lighting, and quiet booths',
      image: '/src/assets/images/cafe_interior_ambience_1790166266354.jpg',
    },
    {
      id: 'g-3',
      category: 'food',
      title: 'Artisanal Brunch Platter',
      subtitle: 'Fresh sourdough, avocado and poached egg',
      image: '/src/assets/images/gourmet_cafe_dish_1790166254628.jpg',
    },
    {
      id: 'g-4',
      category: 'food',
      title: 'House Tiramisu & Pastries',
      subtitle: 'Dusted with dark cocoa and espresso reduction',
      image: '/src/assets/images/signature_dessert_pastry_1790166277241.jpg',
    },
    {
      id: 'g-5',
      category: 'ambience',
      title: 'Espresso Bar & Counter',
      subtitle: 'Polished brass and warm evening glow',
      image: '/src/assets/images/hero_country_coffees_1790166227975.jpg',
    },
    {
      id: 'g-6',
      category: 'coffee',
      title: 'Single Origin Pour-Over',
      subtitle: 'Meticulous slow drip extraction for floral clarity',
      image: '/src/assets/images/signature_artisan_coffee_1790166241444.jpg',
    },
  ];

  const filtered = activeTab === 'all' ? galleryItems : galleryItems.filter((i) => i.category === activeTab);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      {/* Header */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Visual Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Ambience & Culinary Moments
          </h1>
          <p className="text-sm sm:text-base text-[#B8A89A] max-w-lg mx-auto leading-relaxed">
            A glimpse into the coffee craft, warm seating, and fresh bistro creations at Country Coffees Kolkata.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {[
            { id: 'all', label: 'All Moments' },
            { id: 'coffee', label: 'Coffee & Brews' },
            { id: 'food', label: 'Food & Bakes' },
            { id: 'interior', label: 'Interior Spaces' },
            { id: 'ambience', label: 'Ambience' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1A1412] text-[#FAF7F2] shadow-xs'
                  : 'bg-white border border-[#E6DCD1] text-[#5C4C43] hover:bg-[#F3ECE2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="relative h-80 rounded-2xl overflow-hidden shadow-xs cursor-pointer group bg-[#1A1412] border border-[#E6DCD1]"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white opacity-95 transition-opacity">
                <span className="text-[10px] uppercase tracking-wider text-[#C59A6F] font-semibold mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                <p className="text-xs text-[#E8DCCF] mt-1 line-clamp-2">{item.subtitle}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#C59A6F] font-semibold">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge image</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#1A1412] rounded-2xl overflow-hidden shadow-2xl border border-[#3B2F2A]"
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-cover"
            />

            <div className="p-6 text-white bg-[#1A1412]">
              <span className="text-xs uppercase tracking-widest text-[#C59A6F] font-semibold">
                {lightboxItem.category}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
                {lightboxItem.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#B8A89A] mt-1">
                {lightboxItem.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
