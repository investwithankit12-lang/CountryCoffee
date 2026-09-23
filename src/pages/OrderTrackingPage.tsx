import React from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  ShoppingBag,
  PackageCheck,
  MapPin,
  Phone,
  ArrowLeft,
  RefreshCw,
  Database,
} from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

export const OrderTrackingPage: React.FC = () => {
  const {
    activeTrackingOrder,
    orders,
    setActiveTrackingOrder,
    setActivePage,
    updateOrderStatus,
    syncOrderToSupabase,
  } = useStore();

  const currentOrder = activeTrackingOrder || orders[0];

  if (!currentOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F2]">
        <ShoppingBag className="w-12 h-12 text-[#8A796E] mb-3" />
        <h2 className="font-serif text-2xl font-bold text-[#1A1412] mb-2">
          No Active Order Found
        </h2>
        <p className="text-xs text-[#705E53] mb-6">
          You haven't placed an active order yet or your session was refreshed.
        </p>
        <button
          onClick={() => {
            setActivePage('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg hover:bg-[#2A221E]"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const steps: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    { status: 'Received', label: 'Order Received', icon: Clock, desc: 'We received your order ticket' },
    { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle2, desc: 'Sent to the kitchen' },
    { status: 'Preparing', label: 'Preparing', icon: ChefHat, desc: 'Barista & chefs are preparing your items' },
    { status: 'Ready', label: 'Ready', icon: ShoppingBag, desc: 'Fresh & ready for you' },
    { status: 'Completed', label: 'Completed', icon: PackageCheck, desc: 'Fulfilled & enjoyed' },
  ];

  const statusOrder: OrderStatus[] = ['Received', 'Confirmed', 'Preparing', 'Ready', 'Completed'];
  const currentIndex = statusOrder.indexOf(currentOrder.status);

  const handleSimulateNextStep = () => {
    if (currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1];
      updateOrderStatus(currentOrder.id, nextStatus);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Header */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-1">
            Real-Time Kitchen Feed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[#B8A89A]">
            Order #{currentOrder.id} · {currentOrder.orderType}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Status Card & Stepper */}
        <div className="bg-white rounded-3xl border border-[#E6DCD1] p-6 sm:p-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DCD1]">
            <div>
              <span className="text-xs text-[#8A796E]">Estimated Preparation Time</span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1412]">
                {currentOrder.status === 'Completed'
                  ? 'Order Completed'
                  : currentOrder.status === 'Ready'
                  ? 'Your Order is Ready!'
                  : 'Approx. 15 – 25 mins'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#F3ECE2] text-[#1A1412] border border-[#E6DCD1] rounded-lg text-xs font-semibold">
                Status: {currentOrder.status}
              </span>
              {currentIndex < statusOrder.length - 1 && (
                <button
                  onClick={handleSimulateNextStep}
                  title="Simulate next kitchen status"
                  className="px-3 py-1 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-[#C59A6F]" />
                  <span>Advance Status</span>
                </button>
              )}
            </div>
          </div>

          {/* Supabase Database Status */}
          <div className="mt-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#C59A6F] shrink-0" />
              <span className="text-[#1A1412] font-medium text-[11px]">
                Supabase Backend: Project <code className="font-mono font-bold">{SUPABASE_PROJECT_ID}</code> · Table: <code className="font-mono">orders</code>
              </span>
            </div>
            {currentOrder.supabaseSynced ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 self-start sm:self-auto">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Synced to Supabase Live</span>
              </span>
            ) : (
              <button
                onClick={() => syncOrderToSupabase(currentOrder)}
                className="text-[10px] font-bold text-[#1A1412] bg-white border border-[#C59A6F] px-2.5 py-1 rounded-md flex items-center gap-1 hover:bg-[#F3ECE2] cursor-pointer self-start sm:self-auto shadow-xs"
              >
                <RefreshCw className="w-2.5 h-2.5 text-[#C59A6F]" />
                <span>Push Order to Supabase</span>
              </button>
            )}
          </div>

          {/* Stepper Timeline */}
          <div className="py-8">
            <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
              {/* Connecting Line */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-[#E6DCD1] -z-0 hidden sm:block" />

              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#1A1412] text-[#C59A6F] ring-4 ring-[#C59A6F]/20 scale-110 shadow-md'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#FAF7F2] border border-[#E6DCD1] text-[#8A796E]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <h4
                      className={`text-xs font-bold mt-3 ${
                        isCurrent ? 'text-[#1A1412]' : isPassed ? 'text-emerald-800' : 'text-[#8A796E]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-[#705E53] hidden sm:block mt-0.5 leading-tight">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location & Contact Notice */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2 text-[#5C4C43]">
              <MapPin className="w-4 h-4 text-[#C59A6F] shrink-0 mt-0.5" />
              <span>39, Plot No. 39, BK Block, Sector 2, Bidhannagar, Kolkata 700091</span>
            </div>
            <div className="flex items-center gap-2 text-[#5C4C43]">
              <Phone className="w-4 h-4 text-[#C59A6F] shrink-0" />
              <span>Helpline: +91 70032 39518</span>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white rounded-3xl border border-[#E6DCD1] p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1A1412] border-b border-[#E6DCD1] pb-3">
            Item Breakdown
          </h3>

          <div className="space-y-3">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-[#E6DCD1]/60">
                <div>
                  <h4 className="font-bold text-[#1A1412]">
                    {item.name} <span className="font-normal text-[#705E53]">× {item.quantity}</span>
                  </h4>
                  {item.selectedOptions.length > 0 && (
                    <p className="text-[10px] text-[#705E53]">
                      {item.selectedOptions.map((o) => o.optionName).join(', ')}
                    </p>
                  )}
                </div>
                <span className="font-bold tabular-nums text-[#1A1412]">
                  ₹{item.totalUnitPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-1.5 text-xs text-[#5C4C43]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums font-semibold text-[#1A1412]">₹{currentOrder.subtotal}</span>
            </div>
            {currentOrder.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({currentOrder.appliedCoupon})</span>
                <span className="tabular-nums">-₹{currentOrder.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes (GST)</span>
              <span className="tabular-nums font-semibold text-[#1A1412]">₹{currentOrder.taxAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#1A1412] pt-2 border-t border-[#E6DCD1]">
              <span>Total Paid ({currentOrder.paymentMethod})</span>
              <span className="tabular-nums font-serif text-base">₹{currentOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => {
              setActivePage('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A1412] hover:text-[#C59A6F]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Menu</span>
          </button>

          <button
            onClick={() => {
              setActivePage('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#C59A6F] hover:underline"
          >
            View All My Orders in Account →
          </button>
        </div>
      </div>
    </div>
  );
};
