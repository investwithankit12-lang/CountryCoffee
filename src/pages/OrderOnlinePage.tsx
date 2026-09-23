import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderType, PaymentMethod } from '../types';
import {
  ShoppingBag,
  CreditCard,
  QrCode,
  Banknote,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Utensils,
  Tag,
  Database,
} from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

export const OrderOnlinePage: React.FC = () => {
  const {
    cart,
    clearCart,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings,
    createOrder,
    currentUser,
    setActivePage,
    setActiveTrackingOrder,
  } = useStore();

  const [orderType, setOrderType] = useState<OrderType>('Pickup');
  const [tableNumber, setTableNumber] = useState('T-01');
  const [pickupTime, setPickupTime] = useState('Within 25 minutes');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Financial Calculations
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
    setCouponMsg(null);
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode.trim());
    setCouponMsg({ success: res.success, text: res.message });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (cart.length === 0) {
      setErrorText('Please add at least one item from the menu to place an order.');
      return;
    }

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorText('Please provide your name, mobile number, and email.');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        orderType,
        tableNumber: orderType === 'Dine-in' ? tableNumber : undefined,
        pickupTime: orderType === 'Pickup' ? pickupTime : undefined,
        specialInstructions: specialInstructions.trim() || undefined,
        paymentMethod,
      });

      setIsProcessing(false);

      if (result.success && result.order) {
        setActiveTrackingOrder(result.order);
        setActivePage('order-tracking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorText(result.error || 'Failed to submit order.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorText(err?.message || 'Error occurred while submitting order.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F2]">
        <div className="w-18 h-18 rounded-full bg-[#F3ECE2] flex items-center justify-center mb-5 text-[#C59A6F]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1A1412] mb-2">
          Your Order Bag is Currently Empty
        </h2>
        <p className="text-xs text-[#705E53] max-w-sm mb-6 leading-relaxed">
          Browse our freshly roasted single-origin coffees, handcrafted beverages, and kitchen dishes to start an order.
        </p>
        <button
          onClick={() => {
            setActivePage('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl hover:bg-[#2A221E] shadow-md transition-all cursor-pointer"
        >
          Browse Restaurant Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      {/* Header */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Seamless Ordering
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Checkout & Order Confirmation
          </h1>
          <p className="text-xs sm:text-sm text-[#B8A89A]">
            Dine-in at your table, quick takeaway, or curbside pickup at Sector 2 Salt Lake.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Details & Order Type & Payment (8 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Order Type Selection */}
              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1A1412] flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#C59A6F]" />
                  <span>1. Select Order Type</span>
                </h3>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  {(['Pickup', 'Takeaway', 'Dine-in'] as OrderType[]).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        orderType === type
                          ? 'border-[#C59A6F] bg-[#C59A6F]/15 text-[#1A1412] font-bold shadow-xs'
                          : 'border-[#E6DCD1] bg-[#FAF7F2] text-[#5C4C43] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {orderType === 'Dine-in' && (
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] space-y-2">
                    <label htmlFor="dinein-table" className="text-xs font-semibold text-[#1A1412] block">
                      Select Table Number
                    </label>
                    <select
                      id="dinein-table"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-white focus:outline-none focus:border-[#C59A6F]"
                    >
                      {['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07', 'T-08', 'T-09', 'T-10'].map((tab) => (
                        <option key={tab} value={tab}>
                          Table {tab}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-[#705E53]">
                      Our team will deliver your order directly to your table at Country Coffees.
                    </p>
                  </div>
                )}

                {orderType === 'Pickup' && (
                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] space-y-2">
                    <label htmlFor="pickup-slot" className="text-xs font-semibold text-[#1A1412] block">
                      Preferred Pickup Time
                    </label>
                    <select
                      id="pickup-slot"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-white focus:outline-none focus:border-[#C59A6F]"
                    >
                      <option value="Within 20 minutes">ASAP (Approx. 15–20 minutes)</option>
                      <option value="In 30 minutes">In 30 minutes</option>
                      <option value="In 45 minutes">In 45 minutes</option>
                      <option value="In 1 hour">In 1 hour</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Customer Contact */}
              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1A1412] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C59A6F]" />
                  <span>2. Customer Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="ord-name" className="text-xs font-semibold text-[#1A1412] block mb-1">
                      Full Name
                    </label>
                    <input
                      id="ord-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priyam Roy"
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>

                  <div>
                    <label htmlFor="ord-phone" className="text-xs font-semibold text-[#1A1412] block mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="ord-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 00000"
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>

                  <div>
                    <label htmlFor="ord-email" className="text-xs font-semibold text-[#1A1412] block mb-1">
                      Email Address
                    </label>
                    <input
                      id="ord-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ord-notes" className="text-xs font-semibold text-[#1A1412] block mb-1">
                    Special Instructions for Kitchen
                  </label>
                  <input
                    id="ord-notes"
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Cut sandwich into halves, warm milk separately..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-[#1A1412] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C59A6F]" />
                  <span>3. Payment Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: QrCode },
                    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking (All Indian Banks)', icon: CreditCard },
                    { id: 'Cash on Pickup / Dine-in', label: 'Cash / Card on Counter', icon: Banknote },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        type="button"
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#C59A6F] bg-[#C59A6F]/10 text-[#1A1412] font-semibold'
                            : 'border-[#E6DCD1] bg-[#FAF7F2] text-[#5C4C43] hover:bg-[#F3ECE2]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C59A6F]' : 'text-[#8A796E]'}`} />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] text-[11px] text-[#705E53] leading-relaxed">
                  <span className="font-semibold text-[#1A1412]">Production Gateway Architecture: </span>
                  Designed for seamless integration with Razorpay / Indian banking UPI rails. Card data is never stored locally.
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs sticky top-24 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E6DCD1]">
                  <h3 className="font-serif text-base font-bold text-[#1A1412]">
                    Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                  </h3>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-700 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>

                {/* Items in cart */}
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 text-xs pb-2.5 border-b border-[#E6DCD1]/60"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1A1412] truncate">{item.name}</h4>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-[10px] text-[#705E53] truncate">
                            {item.selectedOptions.map((o) => o.optionName).join(', ')}
                          </p>
                        )}
                        <div className="text-[11px] text-[#8A796E] mt-0.5">
                          ₹{item.totalUnitPrice} × {item.quantity}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#E6DCD1] rounded-md px-1 py-0.5 bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 text-[#705E53] hover:text-[#1A1412]"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-1.5 font-bold tabular-nums text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-0.5 text-[#705E53] hover:text-[#1A1412]"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <span className="font-bold tabular-nums text-[#1A1412] min-w-[50px] text-right">
                          ₹{item.totalUnitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="pt-2 border-t border-[#E6DCD1]">
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
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs text-red-700 hover:underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Coupon code (WELCOME15)"
                          className="flex-1 text-xs px-3 py-2 border border-[#E6DCD1] rounded-lg bg-[#FAF7F2] uppercase focus:outline-none focus:border-[#C59A6F]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-3.5 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#2A221E] transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponMsg && (
                        <p
                          className={`text-[11px] ${
                            couponMsg.success ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {couponMsg.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="space-y-2 text-xs text-[#5C4C43] pt-3 border-t border-[#E6DCD1]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-semibold text-[#1A1412]">₹{subtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount</span>
                      <span className="tabular-nums">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST ({settings.taxPercentage}%)</span>
                    <span className="tabular-nums font-semibold text-[#1A1412]">₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#1A1412] pt-2 border-t border-[#E6DCD1]">
                    <span>Total Payable</span>
                    <span className="tabular-nums font-serif text-lg text-[#1A1412]">₹{total}</span>
                  </div>
                </div>

                {errorText && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {errorText}
                  </div>
                )}

                {/* Supabase Backend Integration Indicator */}
                <div className="flex items-center justify-between p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#1A1412]">
                    <Database className="w-3.5 h-3.5 text-[#C59A6F] shrink-0" />
                    <span>Supabase: <code className="font-mono font-semibold">{SUPABASE_PROJECT_ID}</code></span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Database Sync</span>
                  </span>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#1A1412] hover:bg-[#2A221E] disabled:bg-gray-400 text-[#FAF7F2] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>{isProcessing ? 'Syncing & Processing Order...' : 'Confirm & Place Order'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C59A6F]" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
