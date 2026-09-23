import React, { useState } from 'react';
import { MenuItem, CartCustomization } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Clock, AlertCircle, Plus, Minus, Check, Star } from 'lucide-react';

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const { addToCart, setIsCartOpen } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartCustomization[]>(() => {
    // Select first option for required modifier groups by default
    const defaults: CartCustomization[] = [];
    if (item.modifierGroups) {
      item.modifierGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          defaults.push({
            groupName: group.name,
            optionName: group.options[0].name,
            price: group.options[0].price,
          });
        }
      });
    }
    return defaults;
  });

  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate unit price including selected modifiers
  const basePrice = item.discountPrice || item.price;
  const modifiersTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = basePrice + modifiersTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleOption = (groupName: string, optionName: string, price: number, required: boolean) => {
    setSelectedOptions((prev) => {
      if (required) {
        // Replace single choice for required group
        const filtered = prev.filter((o) => o.groupName !== groupName);
        return [...filtered, { groupName, optionName, price }];
      } else {
        // Multi-select or toggle optional
        const exists = prev.some((o) => o.groupName === groupName && o.optionName === optionName);
        if (exists) {
          return prev.filter((o) => !(o.groupName === groupName && o.optionName === optionName));
        } else {
          return [...prev, { groupName, optionName, price }];
        }
      }
    });
  };

  const handleAddToCart = () => {
    addToCart({
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      price: basePrice,
      image: item.image,
      vegType: item.vegType,
      quantity,
      selectedOptions,
      itemInstructions: specialInstructions.trim() || undefined,
      totalUnitPrice: unitPrice,
    });
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FAF7F2] text-[#241E1A] max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden relative border border-[#E6DCD1] max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Item Image */}
          <div className="relative h-60 sm:h-72 w-full bg-[#1A1412]">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-xs text-[#E8DCCF] mb-1">
                <span className="capitalize">{item.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span className="font-semibold tabular-nums">{item.rating}</span>
                </span>
                <span>·</span>
                <span>{item.prepTimeMinutes} mins prep</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                {item.name}
              </h2>
            </div>
          </div>

          {/* Details & Modifiers */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DCD1]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 ${
                    item.vegType === 'veg'
                      ? 'border-emerald-600'
                      : item.vegType === 'egg'
                      ? 'border-amber-600'
                      : 'border-red-600'
                  }`}
                  title={item.vegType}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.vegType === 'veg'
                        ? 'bg-emerald-600'
                        : item.vegType === 'egg'
                        ? 'bg-amber-600'
                        : 'bg-red-600'
                    }`}
                  />
                </span>
                <span className="text-xs font-semibold capitalize text-[#5C4C43]">
                  {item.vegType === 'veg' ? 'Pure Vegetarian' : item.vegType === 'egg' ? 'Contains Egg' : 'Non-Vegetarian'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                {item.discountPrice && (
                  <span className="text-xs text-[#8A796E] line-through tabular-nums">
                    ₹{item.price}
                  </span>
                )}
                <span className="text-lg font-bold text-[#1A1412] tabular-nums font-serif">
                  ₹{unitPrice}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs sm:text-sm text-[#5C4C43] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Allergens & Prep metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#705E53] pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C59A6F]" />
                <span>Estimated time: {item.prepTimeMinutes} mins</span>
              </div>
              {item.allergens && item.allergens.length > 0 && (
                <div className="flex items-center gap-1.5 text-[#705E53]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>Allergens: {item.allergens.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Modifier Groups */}
            {item.modifierGroups && item.modifierGroups.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-[#E6DCD1]">
                {item.modifierGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1A1412] uppercase tracking-wider">
                        {group.name}
                      </h4>
                      <span className="text-[11px] text-[#705E53]">
                        {group.required ? 'Required' : 'Optional'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {group.options.map((option) => {
                        const isSelected = selectedOptions.some(
                          (o) => o.groupName === group.name && o.optionName === option.name
                        );

                        return (
                          <button
                            type="button"
                            key={option.id}
                            onClick={() =>
                              handleToggleOption(group.name, option.name, option.price, group.required)
                            }
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'border-[#C59A6F] bg-[#C59A6F]/10 text-[#1A1412]'
                                : 'border-[#E6DCD1] bg-white text-[#5C4C43] hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-${group.required ? 'full' : 'sm'} border flex items-center justify-center ${
                                  isSelected ? 'border-[#C59A6F] bg-[#C59A6F]' : 'border-[#A89887]'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="font-medium">{option.name}</span>
                            </div>
                            <span className="tabular-nums font-semibold text-[#1A1412]">
                              {option.price > 0 ? `+₹${option.price}` : 'Free'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Special Instructions */}
            <div className="pt-2 border-t border-[#E6DCD1] space-y-1">
              <label htmlFor="modal-notes" className="text-xs font-semibold text-[#1A1412]">
                Kitchen Notes (Optional)
              </label>
              <input
                id="modal-notes"
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less ice, extra hot, no cinnamon..."
                className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-white focus:outline-none focus:border-[#C59A6F]"
              />
            </div>
          </div>
        </div>

        {/* Footer with Quantity & Add to Cart */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E6DCD1] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 border border-[#E6DCD1] rounded-xl px-2.5 py-1.5 bg-[#FAF7F2]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-[#705E53] hover:text-[#1A1412] p-1 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold tabular-nums w-5 text-center text-[#1A1412]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="text-[#705E53] hover:text-[#1A1412] p-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] font-semibold text-xs rounded-xl flex items-center justify-between shadow-md transition-all cursor-pointer"
          >
            <span>Add to Order Bag</span>
            <span className="tabular-nums font-serif text-sm">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
