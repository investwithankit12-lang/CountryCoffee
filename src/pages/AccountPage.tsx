import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  ShoppingBag,
  Calendar,
  Heart,
  Clock,
  CheckCircle2,
  Trash2,
  CalendarPlus,
  Plus,
  LogOut,
  MapPin,
  LogIn,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    orders,
    reservations,
    cancelReservation,
    favorites,
    menuItems,
    toggleFavorite,
    addToCart,
    setIsCartOpen,
    setActivePage,
    setActiveTrackingOrder,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'favorites' | 'profile'>('orders');

  // Sign in / Sign up form state if no user
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName || !authPhone || !authEmail) return;
    loginUser(authEmail.trim(), authName.trim(), authPhone.trim());
  };

  const savedDishes = menuItems.filter((item) => favorites.includes(item.id));

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Header */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Guest Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-2">
            My Account & Activity
          </h1>
          <p className="text-xs sm:text-sm text-[#B8A89A]">
            {currentUser
              ? `Welcome back, ${currentUser.name}`
              : 'Sign in to access your order history and table reservations.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {!currentUser ? (
          /* Sign In Card */
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E6DCD1] p-8 shadow-xs">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#F3ECE2] flex items-center justify-center mx-auto mb-3 text-[#C59A6F]">
                <User className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1A1412]">
                Sign In to Country Coffees
              </h2>
              <p className="text-xs text-[#705E53] mt-1">
                Enter your details to track orders, save favorite coffees, and manage reservations.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Suman Roy"
                  className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="+91 98300 00000"
                  className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="suman.roy@example.com"
                  className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#C59A6F]" />
                <span>Continue to Guest Account</span>
              </button>
            </form>
          </div>
        ) : (
          /* User Dashboard */
          <div className="space-y-8">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-[#E6DCD1] pb-3 overflow-x-auto gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'orders'
                      ? 'bg-[#1A1412] text-[#FAF7F2]'
                      : 'text-[#5C4C43] hover:bg-[#F3ECE2]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C59A6F]" />
                  <span>My Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'reservations'
                      ? 'bg-[#1A1412] text-[#FAF7F2]'
                      : 'text-[#5C4C43] hover:bg-[#F3ECE2]'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#C59A6F]" />
                  <span>Table Bookings ({reservations.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'favorites'
                      ? 'bg-[#1A1412] text-[#FAF7F2]'
                      : 'text-[#5C4C43] hover:bg-[#F3ECE2]'
                  }`}
                >
                  <Heart className="w-4 h-4 text-[#C59A6F]" />
                  <span>Saved Dishes ({favorites.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'profile'
                      ? 'bg-[#1A1412] text-[#FAF7F2]'
                      : 'text-[#5C4C43] hover:bg-[#F3ECE2]'
                  }`}
                >
                  <User className="w-4 h-4 text-[#C59A6F]" />
                  <span>Profile Info</span>
                </button>
              </div>

              <button
                onClick={logoutUser}
                className="text-xs text-red-700 hover:underline flex items-center gap-1 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* TAB: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#E6DCD1] p-6">
                    <ShoppingBag className="w-12 h-12 text-[#8A796E] mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-1">
                      No orders placed yet
                    </h3>
                    <p className="text-xs text-[#705E53] mb-4">
                      When you order online or dine-in, your order tracking will appear here.
                    </p>
                    <button
                      onClick={() => setActivePage('menu')}
                      className="px-5 py-2.5 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-2xl border border-[#E6DCD1] p-5 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#E6DCD1] text-xs">
                          <div>
                            <span className="font-bold text-[#1A1412]">#{ord.id}</span>
                            <span className="text-[#8A796E] ml-2">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              ord.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'Ready'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-[#5C4C43]">
                          {ord.items.map((it, i) => (
                            <div key={i} className="flex justify-between">
                              <span>
                                {it.name} × {it.quantity}
                              </span>
                              <span className="tabular-nums">₹{it.totalUnitPrice * it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-[#E6DCD1] flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[#8A796E]">Total: </span>
                            <span className="font-bold text-[#1A1412]">₹{ord.total}</span>
                            <span className="text-[10px] text-[#8A796E] ml-1">({ord.orderType})</span>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTrackingOrder(ord);
                              setActivePage('order-tracking');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-3 py-1.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-[11px] font-semibold rounded-lg"
                          >
                            Track Order Live
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Reservations */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#E6DCD1] p-6">
                    <Calendar className="w-12 h-12 text-[#8A796E] mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-1">
                      No active table bookings
                    </h3>
                    <p className="text-xs text-[#705E53] mb-4">
                      Reserve a table anytime for coffee, dinner, or meetings.
                    </p>
                    <button
                      onClick={() => setActivePage('reserve')}
                      className="px-5 py-2.5 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl"
                    >
                      Reserve a Table Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reservations.map((res) => (
                      <div
                        key={res.id}
                        className="bg-white rounded-2xl border border-[#E6DCD1] p-5 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#E6DCD1] text-xs">
                          <span className="font-bold text-[#1A1412]">{res.id}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              res.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.status === 'Completed'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[#8A796E] block text-[10px]">Date & Time</span>
                            <span className="font-semibold text-[#1A1412]">
                              {res.date} at {res.time}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#8A796E] block text-[10px]">Guests & Table</span>
                            <span className="font-semibold text-[#1A1412]">
                              {res.guests} Guests · {res.tableNumber || res.seatingPreference}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#E6DCD1] flex items-center justify-between text-xs">
                          <span className="text-[11px] text-[#705E53]">
                            Held for 15 mins
                          </span>

                          {res.status === 'Confirmed' && (
                            <button
                              onClick={() => cancelReservation(res.id)}
                              className="text-xs text-red-700 hover:underline font-semibold"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Saved Dishes */}
            {activeTab === 'favorites' && (
              <div>
                {savedDishes.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#E6DCD1] p-6">
                    <Heart className="w-12 h-12 text-[#8A796E] mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-[#1A1412] mb-1">
                      No saved dishes yet
                    </h3>
                    <p className="text-xs text-[#705E53] mb-4">
                      Click the heart icon on any coffee or dish in the menu to save it here.
                    </p>
                    <button
                      onClick={() => setActivePage('menu')}
                      className="px-5 py-2.5 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedDishes.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-[#E6DCD1] overflow-hidden shadow-xs flex flex-col justify-between"
                      >
                        <div className="relative h-44 bg-[#1A1412]">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white text-red-600 shadow-sm"
                          >
                            <Heart className="w-4 h-4 fill-red-600" />
                          </button>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-base font-bold text-[#1A1412] mb-1">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#5C4C43] line-clamp-2 mb-3">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#E6DCD1] flex items-center justify-between">
                            <span className="font-serif font-bold text-[#1A1412]">
                              ₹{item.discountPrice || item.price}
                            </span>
                            <button
                              onClick={() => {
                                addToCart({
                                  id: `cart-${Date.now()}`,
                                  menuItemId: item.id,
                                  name: item.name,
                                  price: item.discountPrice || item.price,
                                  image: item.image,
                                  vegType: item.vegType,
                                  quantity: 1,
                                  selectedOptions: [],
                                  totalUnitPrice: item.discountPrice || item.price,
                                });
                                setIsCartOpen(true);
                              }}
                              className="px-3 py-1.5 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#C59A6F]" />
                              <span>Order</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Profile Info */}
            {activeTab === 'profile' && (
              <div className="max-w-xl bg-white rounded-3xl border border-[#E6DCD1] p-8 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#E6DCD1] pb-3">
                  Account Details
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#8A796E] block mb-1">Full Name</span>
                    <input
                      type="text"
                      value={currentUser.name}
                      onChange={(e) =>
                        updateUserProfile({
                          name: e.target.value,
                          phone: currentUser.phone,
                          email: currentUser.email,
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <span className="text-[#8A796E] block mb-1">Mobile Number</span>
                    <input
                      type="tel"
                      value={currentUser.phone}
                      onChange={(e) =>
                        updateUserProfile({
                          name: currentUser.name,
                          phone: e.target.value,
                          email: currentUser.email,
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <span className="text-[#8A796E] block mb-1">Email Address</span>
                    <input
                      type="email"
                      value={currentUser.email}
                      onChange={(e) =>
                        updateUserProfile({
                          name: currentUser.name,
                          phone: currentUser.phone,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-[11px] text-[#705E53]">
                    Your profile data is stored securely in your active session.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
