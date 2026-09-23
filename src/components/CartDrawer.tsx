import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
    setActivePage,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.totalUnitPrice * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const rawDisc = (subtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount ? Math.min(rawDisc, appliedCoupon.maxDiscount) : rawDisc;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((afterDiscount * settings.taxPercentage) / 100);
  const total = Math.round(afterDiscount + taxAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActivePage('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#241E1A] shadow-2xl flex flex-col border-l border-[#E6DCD1]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E6DCD1] flex items-center justify-between bg-[#F3ECE2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C59A6F]" />
              <h2 className="font-serif text-lg font-bold text-[#1A1412]">Your Order Bag</h2>
              <span className="text-xs text-[#705E53] ml-1">
                ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#705E53] hover:text-[#1A1412] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#705E53]">
                <div className="w-16 h-16 rounded-full bg-[#F3ECE2] flex items-center justify-center mb-4 text-[#C59A6F]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1A1412] mb-1">Your bag is empty</h3>
                <p className="text-xs text-[#705E53] max-w-xs mb-5">
                  Explore our handcrafted coffee, fresh sourdough bakes, and bistro dishes.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActivePage('menu');
                  }}
                  className="px-5 py-2.5 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#2A221E] transition-colors"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-2 border-b border-[#E6DCD1] text-xs text-[#705E53]">
                  <span>Order Items</span>
                  <button
                    onClick={clearCart}
                    className="text-red-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear bag
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-white rounded-xl border border-[#E6DCD1] shadow-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg bg-[#F3ECE2] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#1A1412] truncate">{item.name}</h4>
                          <span className="text-xs font-semibold tabular-nums text-[#1A1412]">
                            ₹{item.totalUnitPrice * item.quantity}
                          </span>
                        </div>

                        {/* Customizations */}
                        {item.selectedOptions.length > 0 && (
                          <p className="text-[10px] text-[#705E53] truncate mt-0.5">
                            {item.selectedOptions.map((o) => o.optionName).join(', ')}
                          </p>
                        )}

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-[#E6DCD1] rounded-md px-1.5 py-0.5 bg-[#FAF7F2]">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="text-[#705E53] hover:text-[#1A1412] p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold tabular-nums w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="text-[#705E53] hover:text-[#1A1412] p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#8A796E] hover:text-red-700 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-3 border-t border-[#E6DCD1]">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-[#C59A6F]/15 border border-[#C59A6F]/30 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#B38657]" />
                        <div>
                          <span className="font-bold text-[#1A1412]">{appliedCoupon.code}</span>
                          <p className="text-[10px] text-[#705E53]">Saving ₹{discountAmount}</p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-700 hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Coupon code (e.g. WELCOME15)"
                          className="flex-1 text-xs px-3 py-2 border border-[#E6DCD1] rounded-lg bg-white uppercase tracking-wider focus:outline-none focus:border-[#C59A6F]"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#2A221E] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-red-600 pl-1">{couponError}</p>}
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E6DCD1] space-y-3">
              <div className="space-y-1.5 text-xs text-[#5C4C43]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#1A1412]">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({settings.taxPercentage}%)</span>
                  <span className="tabular-nums font-medium text-[#1A1412]">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1A1412] pt-2 border-t border-[#E6DCD1]">
                  <span>Total Amount</span>
                  <span className="tabular-nums font-serif text-base text-[#1A1412]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C59A6F]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
