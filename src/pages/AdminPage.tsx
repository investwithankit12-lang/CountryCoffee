import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem, OrderStatus, TableLocation, VegType, ReservationStatus } from '../types';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SETUP_SQL,
} from '../lib/supabase';
import {
  ShieldCheck,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  Tag,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Database,
  RefreshCw,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Download,
  Printer,
  UserCheck,
  Key,
  Shield,
  UserPlus,
  User,
  X,
  Phone,
  Mail,
  Sparkles,
  Award,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    adminAccount,
    isAdminRegistered,
    isAdminLoggedIn,
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    updateAdminCredentials,
    orders,
    updateOrderStatus,
    reservations,
    updateReservationStatus,
    syncReservationToSupabase,
    syncOrderToSupabase,
    supabaseStatus,
    supabaseMessage,
    supabaseReservationsReady,
    supabaseOrdersReady,
    checkSupabaseHealth,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    categories,
    addCategory,
    deleteCategory,
    coupons,
    addCoupon,
    deleteCoupon,
    tables,
    settings,
    updateSettings,
    showToast,
  } = useStore();

  // Registration Form State (Strict 1-slot policy)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login Form State
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Credentials / Profile Update Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(adminAccount?.name || '');
  const [profileEmail, setProfileEmail] = useState(adminAccount?.email || '');
  const [profilePhone, setProfilePhone] = useState(adminAccount?.phone || '');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileModalMsg, setProfileModalMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Active Tab - Defaulting to 'reservations' to directly view all bookings done on website
  const [currentTab, setCurrentTab] = useState<'reservations' | 'orders' | 'menu' | 'coupons' | 'settings' | 'supabase'>('reservations');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Table Bookings Search & Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingDateFilter, setBookingDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingSeatingFilter, setBookingSeatingFilter] = useState<string>('all');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filtered reservations calculation
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      // Search match
      const q = bookingSearch.trim().toLowerCase();
      if (q) {
        const matchesName = res.customerName.toLowerCase().includes(q);
        const matchesPhone = res.phone.toLowerCase().includes(q);
        const matchesEmail = res.email.toLowerCase().includes(q);
        const matchesId = res.id.toLowerCase().includes(q);
        const matchesTable = (res.tableNumber || '').toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesId && !matchesTable) {
          return false;
        }
      }

      // Date match
      if (bookingDateFilter === 'today' && res.date !== todayStr) return false;
      if (bookingDateFilter === 'upcoming' && res.date < todayStr) return false;
      if (bookingDateFilter === 'past' && res.date >= todayStr) return false;

      // Status match
      if (bookingStatusFilter !== 'all' && res.status !== bookingStatusFilter) return false;

      // Seating preference match
      if (bookingSeatingFilter !== 'all' && res.seatingPreference !== bookingSeatingFilter) return false;

      return true;
    });
  }, [reservations, bookingSearch, bookingDateFilter, bookingStatusFilter, bookingSeatingFilter, todayStr]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  const handleRefreshSupabase = async () => {
    setIsTestingSupabase(true);
    await checkSupabaseHealth();
    setIsTestingSupabase(false);
    showToast('Supabase status checked');
  };

  const handleSyncAllReservations = async () => {
    const unsynced = reservations.filter((r) => !r.supabaseSynced);
    if (unsynced.length === 0) {
      showToast('All bookings are already synced to Supabase!');
      return;
    }
    setIsSyncingAll(true);
    let successCount = 0;
    for (const res of unsynced) {
      const outcome = await syncReservationToSupabase(res);
      if (outcome.success) successCount++;
    }
    setIsSyncingAll(false);
    showToast(`Synced ${successCount} of ${unsynced.length} bookings to Supabase`);
  };

  const handleSyncAllOrders = async () => {
    const unsynced = orders.filter((o) => !o.supabaseSynced);
    if (unsynced.length === 0) {
      showToast('All orders are already synced to Supabase!');
      return;
    }
    setIsSyncingOrders(true);
    let successCount = 0;
    for (const ord of unsynced) {
      const outcome = await syncOrderToSupabase(ord);
      if (outcome.success) successCount++;
    }
    setIsSyncingOrders(false);
    showToast(`Synced ${successCount} of ${unsynced.length} orders to Supabase`);
  };

  // Export Bookings to CSV
  const handleExportBookingsCsv = () => {
    if (reservations.length === 0) {
      showToast('No bookings available to export.');
      return;
    }
    const headers = [
      'Booking ID',
      'Guest Name',
      'Phone',
      'Email',
      'Date',
      'Time',
      'Guests',
      'Seating Preference',
      'Assigned Table',
      'Status',
      'Special Request',
      'Supabase Synced',
      'Created At',
    ];
    const rows = reservations.map((r) => [
      r.id,
      `"${r.customerName.replace(/"/g, '""')}"`,
      r.phone,
      r.email,
      r.date,
      r.time,
      r.guests,
      r.seatingPreference,
      r.tableNumber || 'Not assigned',
      r.status,
      `"${(r.specialRequest || '').replace(/"/g, '""')}"`,
      r.supabaseSynced ? 'YES' : 'NO',
      r.createdAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `country_coffees_bookings_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Bookings manifest downloaded as CSV');
  };

  const handlePrintBookings = () => {
    window.print();
  };

  // Submit Handler: Register Admin (Single slot)
  const handleRegisterAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type your password.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmittingReg(true);
    const result = await registerAdmin(regName, regEmail, regPassword, regPhone);
    setIsSubmittingReg(false);

    if (!result.success) {
      setRegError(result.error || 'Failed to claim admin slot.');
    }
  };

  // Submit Handler: Login Admin
  const handleLoginAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrorMsg(null);
    setIsSubmittingLogin(true);

    const result = loginAdmin(loginInput, loginPassword);
    setIsSubmittingLogin(false);

    if (!result.success) {
      setLoginErrorMsg(result.error || 'Invalid administrator email or password.');
    } else {
      setLoginInput('');
      setLoginPassword('');
    }
  };

  // Submit Handler: Update Profile / Change Password
  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileModalMsg(null);

    const res = updateAdminCredentials({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      currentPassword: profileCurrentPassword,
      newPassword: profileNewPassword || undefined,
    });

    if (!res.success) {
      setProfileModalMsg({ type: 'error', text: res.error || 'Update failed' });
    } else {
      setProfileModalMsg({ type: 'success', text: 'Admin profile & credentials successfully updated!' });
      setProfileCurrentPassword('');
      setProfileNewPassword('');
      setTimeout(() => {
        setIsProfileModalOpen(false);
        setProfileModalMsg(null);
      }, 1500);
    }
  };

  // New Menu Item Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(200);
  const [newItemDiscPrice, setNewItemDiscPrice] = useState<number | undefined>(undefined);
  const [newItemCategory, setNewItemCategory] = useState('coffee');
  const [newItemVegType, setNewItemVegType] = useState<VegType>('veg');
  const [newItemPrepTime, setNewItemPrepTime] = useState(15);
  const [newItemImage, setNewItemImage] = useState('/src/assets/images/signature_artisan_coffee_1790166241444.jpg');
  const [newItemBestseller, setNewItemBestseller] = useState(false);

  // New Coupon Form State
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponVal, setCouponVal] = useState(15);
  const [couponMinOrder, setCouponMinOrder] = useState(300);

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemDesc.trim()) return;

    addMenuItem({
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      description: newItemDesc.trim(),
      price: Number(newItemPrice),
      discountPrice: newItemDiscPrice ? Number(newItemDiscPrice) : undefined,
      category: newItemCategory,
      vegType: newItemVegType,
      image: newItemImage.trim(),
      bestseller: newItemBestseller,
      rating: 5.0,
      reviewsCount: 1,
      available: true,
      prepTimeMinutes: Number(newItemPrepTime),
    });

    setIsAddingItem(false);
    setNewItemName('');
    setNewItemDesc('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !couponDesc.trim()) return;

    addCoupon({
      id: `coup-${Date.now()}`,
      code: couponCode.trim().toUpperCase(),
      title: `${couponCode.trim().toUpperCase()} Promo`,
      description: couponDesc.trim(),
      discountType: couponType,
      discountValue: Number(couponVal),
      minOrderAmount: Number(couponMinOrder),
      validUntil: '2026-12-31',
      active: true,
    });

    setIsAddingCoupon(false);
    setCouponCode('');
    setCouponDesc('');
  };

  // ==========================================
  // SCREEN 1: UNAUTHENTICATED AUTH GATE
  // ==========================================
  if (!isAdminLoggedIn) {
    // If no admin has been created yet: SINGLE-SLOT REGISTRATION
    if (!isAdminRegistered) {
      return (
        <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E6DCD1] p-6 sm:p-9 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#1A1412] text-[#C59A6F] flex items-center justify-center mx-auto mb-3 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>One-Time Admin Slot (1 Available)</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412]">
                Create Administrator Account
              </h2>
              <p className="text-xs text-[#705E53] mt-2 max-w-sm mx-auto leading-relaxed">
                Provide your details below to claim the <strong>sole administrator slot</strong>. Once registered, sign-up is permanently locked and nobody else can create an admin account.
              </p>
            </div>

            <form onSubmit={handleRegisterAdminSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                  Full Name / Admin Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ankit Ghosh"
                  className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                    Admin Email (Login ID) *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="admin@countrycoffees.com"
                    className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 70032 39518"
                    className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                    Admin Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412] pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A796E] hover:text-[#1A1412]"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412]"
                  />
                </div>
              </div>

              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] text-[11px] text-[#705E53] leading-relaxed">
                <span className="font-semibold text-[#1A1412]">Single-Slot Lock:</span> Upon clicking below, this slot will be registered as the sole administrator for Country Coffees. All website bookings will be viewable in your dashboard.
              </div>

              <button
                type="submit"
                disabled={isSubmittingReg}
                className="w-full py-3.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[#C59A6F]" />
                <span>{isSubmittingReg ? 'Creating Admin Account...' : 'Claim Single Slot & Create Admin Account'}</span>
              </button>
            </form>
          </div>
        </div>
      );
    }

    // Once registered: STRICT LOGIN ONLY (Nobody else is permitted to sign up)
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6DCD1] p-6 sm:p-9 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1412] text-[#C59A6F] flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3 text-[#C59A6F]" />
              <span>Admin Slot: Claimed (1/1) · Sign-up Locked</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1412]">
              Administrator Login
            </h2>
            <p className="text-xs text-[#705E53] mt-1.5 leading-relaxed">
              Sign in to view all live table bookings and restaurant operations.
            </p>
          </div>

          <form onSubmit={handleLoginAdminSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                Admin Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="admin@countrycoffees.com or admin name"
                  className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412] pl-9"
                />
                <User className="w-4 h-4 text-[#8A796E] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1A1412] block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412] pl-9 pr-9"
                />
                <Key className="w-4 h-4 text-[#8A796E] absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A796E] hover:text-[#1A1412]"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginErrorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginErrorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span>{isSubmittingLogin ? 'Signing In...' : 'Log In to Management Console'}</span>
            </button>
          </form>

          {/* Locked Registration Safeguard Banner */}
          <div className="mt-6 pt-4 border-t border-[#E6DCD1] text-center">
            <p className="text-[11px] text-[#8A796E]">
              Registered Slot: <span className="font-semibold text-[#1A1412]">{adminAccount?.name}</span> ({adminAccount?.email})
            </p>
            <p className="text-[10px] text-[#A89887] mt-0.5">
              Registration is permanently closed to prevent unauthorized admin accounts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // SCREEN 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Admin Top Banner */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8 border-b border-[#3B2F2A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-[#C59A6F] font-semibold">
                Live Restaurant Terminal · Supabase Connected
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Country Coffees Admin Console
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#C59A6F]" />
              <div className="text-left">
                <span className="text-xs font-semibold text-[#FAF7F2] block leading-none">
                  {adminAccount?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#B8A89A] block leading-tight mt-0.5">
                  Super Admin (Slot 1/1)
                </span>
              </div>
            </div>

            <a
              href="/dist.zip"
              download="country-coffees-dist.zip"
              className="px-3 py-1.5 bg-[#C59A6F]/20 hover:bg-[#C59A6F]/30 text-[#FAF7F2] text-xs font-medium rounded-lg border border-[#C59A6F]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download compiled website files for Netlify, Vercel, or web hosting"
            >
              <Download className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span className="hidden sm:inline">Export dist.zip</span>
            </a>

            <button
              onClick={() => {
                setProfileName(adminAccount?.name || '');
                setProfileEmail(adminAccount?.email || '');
                setProfilePhone(adminAccount?.phone || '');
                setProfileCurrentPassword('');
                setProfileNewPassword('');
                setProfileModalMsg(null);
                setIsProfileModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] text-xs font-medium rounded-lg border border-[#FAF7F2]/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#C59A6F]" />
              <span className="hidden sm:inline">Credentials</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-200 text-xs font-semibold rounded-lg border border-red-700/50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6DCD1]">
          {[
            { id: 'reservations', label: 'Table Bookings (Website)', icon: Calendar, count: reservations.length },
            { id: 'orders', label: 'Live Food Orders', icon: ShoppingBag, count: orders.length },
            { id: 'menu', label: 'Menu & Inventory', icon: UtensilsCrossed, count: menuItems.length },
            { id: 'coupons', label: 'Coupons & Offers', icon: Tag, count: coupons.length },
            { id: 'settings', label: 'Store Settings', icon: Settings },
            { id: 'supabase', label: 'Supabase DB', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1412] text-[#FAF7F2] shadow-xs'
                    : 'bg-white border border-[#E6DCD1] text-[#5C4C43] hover:bg-[#F3ECE2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C59A6F]' : ''}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#C59A6F] text-[#1A1412]' : 'bg-[#FAF7F2] text-[#5C4C43]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Live Orders */}
        {currentTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1A1412]">
                  Incoming & Active Kitchen Orders
                </h2>
                <p className="text-xs text-[#705E53]">
                  Real-time food & coffee orders syncing to Supabase project <code className="font-mono font-bold">{SUPABASE_PROJECT_ID}</code>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncAllOrders}
                  disabled={isSyncingOrders}
                  className="px-3.5 py-1.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 text-[#C59A6F] ${isSyncingOrders ? 'animate-spin' : ''}`} />
                  <span>{isSyncingOrders ? 'Syncing...' : 'Sync All to Supabase'}</span>
                </button>
                <button
                  onClick={() => setCurrentTab('supabase')}
                  className="px-3 py-1.5 bg-[#FAF7F2] border border-[#C59A6F] text-[#1A1412] rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#F3ECE2] transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>Supabase DB</span>
                </button>
              </div>
            </div>

            {/* Supabase Orders Quick Status Banner */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Database className="w-4 h-4 text-[#C59A6F] shrink-0" />
                <span className="text-[#1A1412] font-semibold">
                  Supabase Table: <code className="font-mono">public.orders</code>
                </span>
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {orders.filter((o) => o.supabaseSynced).length} / {orders.length} Synced
                </span>
              </div>
              <span className="text-[11px] text-[#705E53]">
                Orders placed via online checkout stream directly to your Supabase tables.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-[#E6DCD1] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#1A1412] text-sm">#{ord.id}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E6DCD1]">
                        {ord.orderType}
                        {ord.tableNumber ? ` · Table ${ord.tableNumber}` : ''}
                      </span>
                      {ord.supabaseSynced ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Supabase Synced</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => syncOrderToSupabase(ord)}
                          className="text-[10px] font-bold text-[#1A1412] bg-[#FAF7F2] border border-[#C59A6F] px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-[#F3ECE2] cursor-pointer"
                        >
                          <RefreshCw className="w-2.5 h-2.5 text-[#C59A6F]" />
                          <span>Push to Supabase</span>
                        </button>
                      )}
                      <span className="text-xs text-[#8A796E]">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs text-[#5C4C43]">
                      <span className="font-semibold text-[#1A1412]">{ord.customerName}</span> ({ord.phone}) · {ord.email}
                    </div>

                    <div className="text-xs text-[#705E53] flex flex-wrap gap-2">
                      {ord.items.map((it, i) => (
                        <span key={i} className="bg-[#FAF7F2] px-2 py-1 rounded-md border border-[#E6DCD1]">
                          {it.name} × {it.quantity}
                        </span>
                      ))}
                    </div>

                    {ord.specialInstructions && (
                      <p className="text-[11px] text-amber-800 italic">
                        Note: "{ord.specialInstructions}"
                      </p>
                    )}
                  </div>

                  {/* Status update buttons */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="text-right">
                      <span className="font-serif text-base font-bold text-[#1A1412] block">
                        ₹{ord.total}
                      </span>
                      <span className="text-[10px] text-[#8A796E]">{ord.paymentMethod}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(['Received', 'Confirmed', 'Preparing', 'Ready', 'Completed'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(ord.id, st)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                            ord.status === st
                              ? 'bg-[#1A1412] text-[#C59A6F]'
                              : 'bg-[#FAF7F2] border border-[#E6DCD1] text-[#705E53] hover:bg-[#F3ECE2]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Table Reservations (Primary Management Center) */}
        {currentTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#C59A6F]/20 text-[#1A1412] text-[10px] font-bold uppercase tracking-wider">
                    Website Bookings Hub
                  </span>
                  <span className="text-xs text-[#705E53]">
                    Supabase: <code className="font-mono font-bold">public.reservations</code>
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1A1412]">
                  Table Reservations & Guest Manifest
                </h2>
                <p className="text-xs text-[#705E53] mt-0.5">
                  All dining bookings submitted on the website appear here instantly with live cloud synchronization.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportBookingsCsv}
                  className="px-3 py-2 bg-white hover:bg-[#FAF7F2] text-[#1A1412] border border-[#E6DCD1] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Export all reservations to CSV spreadsheet"
                >
                  <Download className="w-3.5 h-3.5 text-[#C59A6F]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handlePrintBookings}
                  className="px-3 py-2 bg-white hover:bg-[#FAF7F2] text-[#1A1412] border border-[#E6DCD1] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Print guest arrival list for front desk"
                >
                  <Printer className="w-3.5 h-3.5 text-[#705E53]" />
                  <span>Print Manifest</span>
                </button>

                <button
                  onClick={handleSyncAllReservations}
                  disabled={isSyncingAll}
                  className="px-3.5 py-2 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#C59A6F] ${isSyncingAll ? 'animate-spin' : ''}`} />
                  <span>{isSyncingAll ? 'Syncing...' : 'Sync All to Supabase'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-4 shadow-xs">
                <span className="text-[11px] font-bold text-[#8A796E] uppercase tracking-wider block">
                  Total Bookings
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-bold text-[#1A1412]">{reservations.length}</span>
                  <span className="text-xs text-[#705E53]">registered</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-4 shadow-xs">
                <span className="text-[11px] font-bold text-[#C59A6F] uppercase tracking-wider block">
                  Today's Bookings
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-bold text-[#1A1412]">
                    {reservations.filter((r) => r.date === todayStr).length}
                  </span>
                  <span className="text-xs text-[#705E53]">for {todayStr}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-4 shadow-xs">
                <span className="text-[11px] font-bold text-[#8A796E] uppercase tracking-wider block">
                  Expected Guests
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-bold text-[#1A1412]">
                    {reservations.reduce((sum, r) => sum + (r.guests || 0), 0)}
                  </span>
                  <span className="text-xs text-[#705E53]">patrons total</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E6DCD1] p-4 shadow-xs">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Supabase Synced
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-serif font-bold text-emerald-900">
                    {reservations.filter((r) => r.supabaseSynced).length} / {reservations.length}
                  </span>
                  <span className="text-xs text-emerald-700">persisted</span>
                </div>
              </div>
            </div>

            {/* Supabase Status Banner */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Database className="w-4 h-4 text-[#C59A6F] shrink-0" />
                <span className="text-[#1A1412] font-semibold">
                  Supabase Backend: <code className="font-mono">{SUPABASE_PROJECT_ID}</code>
                </span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                    supabaseStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : supabaseStatus === 'table_needed'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {supabaseStatus === 'connected'
                    ? '✓ Connected & Live Syncing'
                    : supabaseStatus === 'table_needed'
                    ? 'Run SQL Setup Script'
                    : 'Connecting to Cloud...'}
                </span>
              </div>
              <button
                onClick={() => setCurrentTab('supabase')}
                className="text-[11px] text-[#C59A6F] hover:text-[#1A1412] font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>View Supabase SQL & Architecture</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Dining Floor Plan Overview */}
            <div className="bg-white rounded-2xl border border-[#E6DCD1] p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#C59A6F] flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Cafe Dining Floorplan ({tables.length} Tables)</span>
                </h3>
                <span className="text-[11px] text-[#8A796E]">
                  Assign any table to incoming bookings using the dropdown on each booking card below.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {tables.map((t) => {
                  const assignedBookings = reservations.filter(
                    (r) => (r.tableNumber === t.tableNumber || r.tableId === t.id) && r.status !== 'Cancelled'
                  );
                  return (
                    <div
                      key={t.id}
                      className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] text-center relative"
                    >
                      <span className="font-bold text-xs text-[#1A1412] block">
                        Table {t.tableNumber}
                      </span>
                      <span className="text-[11px] text-[#705E53] block">
                        {t.capacity} seats · {t.location}
                      </span>
                      {assignedBookings.length > 0 && (
                        <span className="inline-block mt-1 text-[9px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded-md">
                          {assignedBookings.length} booking(s)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search and Filters Toolbar */}
            <div className="bg-white rounded-2xl border border-[#E6DCD1] p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8A796E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by customer name, phone, email, booking ID (e.g. CC-RES), or table..."
                    className="w-full text-xs p-2.5 pl-9 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] focus:outline-none focus:border-[#C59A6F] text-[#1A1412]"
                  />
                  {bookingSearch && (
                    <button
                      onClick={() => setBookingSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A796E] hover:text-[#1A1412] text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  <select
                    value={bookingSeatingFilter}
                    onChange={(e) => setBookingSeatingFilter(e.target.value)}
                    className="text-xs p-2.5 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                  >
                    <option value="all">All Seating Areas</option>
                    <option value="Window Table">Window Table</option>
                    <option value="Indoor Dining">Indoor Dining</option>
                    <option value="Couple / Intimate">Couple / Intimate</option>
                    <option value="Outdoor Garden">Outdoor Garden</option>
                    <option value="Group Booth">Group Booth</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E6DCD1]/60 text-xs">
                {/* Date Filter Tabs */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#8A796E] font-semibold mr-1">Date:</span>
                  {[
                    { id: 'all', label: 'All Dates' },
                    { id: 'today', label: `Today (${todayStr})` },
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'past', label: 'Past' },
                  ].map((df) => (
                    <button
                      key={df.id}
                      onClick={() => setBookingDateFilter(df.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        bookingDateFilter === df.id
                          ? 'bg-[#1A1412] text-[#FAF7F2]'
                          : 'bg-[#FAF7F2] border border-[#E6DCD1] text-[#705E53] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      {df.label}
                    </button>
                  ))}
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#8A796E] font-semibold mr-1">Status:</span>
                  {['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        bookingStatusFilter === st
                          ? 'bg-[#C59A6F] text-[#1A1412]'
                          : 'bg-[#FAF7F2] border border-[#E6DCD1] text-[#705E53] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      {st === 'all' ? 'All Status' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtered Reservations List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#705E53] px-1">
                <span>
                  Showing <strong className="text-[#1A1412]">{filteredReservations.length}</strong> of{' '}
                  <strong className="text-[#1A1412]">{reservations.length}</strong> total bookings
                </span>
                {(bookingSearch || bookingDateFilter !== 'all' || bookingStatusFilter !== 'all' || bookingSeatingFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setBookingSearch('');
                      setBookingDateFilter('all');
                      setBookingStatusFilter('all');
                      setBookingSeatingFilter('all');
                    }}
                    className="text-[#C59A6F] font-semibold hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}
              </div>

              {filteredReservations.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#E6DCD1] p-12 text-center shadow-xs">
                  <Calendar className="w-10 h-10 text-[#C59A6F] mx-auto mb-3 opacity-60" />
                  <h3 className="font-serif text-lg font-bold text-[#1A1412]">
                    No Bookings Found
                  </h3>
                  <p className="text-xs text-[#705E53] mt-1 max-w-sm mx-auto">
                    {reservations.length === 0
                      ? 'No table bookings have been placed yet. When customers book a table on the website, their reservation will show up here.'
                      : 'No bookings match your current search or filters. Try adjusting your query or date filter.'}
                  </p>
                  {(bookingSearch || bookingDateFilter !== 'all' || bookingStatusFilter !== 'all' || bookingSeatingFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setBookingSearch('');
                        setBookingDateFilter('all');
                        setBookingStatusFilter('all');
                        setBookingSeatingFilter('all');
                      }}
                      className="mt-4 px-4 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredReservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white rounded-2xl border border-[#E6DCD1] p-5 shadow-xs hover:border-[#C59A6F]/70 transition-all space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#FAF7F2] pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-[#1A1412] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E6DCD1]">
                            {res.id}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DCD1] font-semibold text-[#1A1412] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C59A6F]" />
                            <span>{res.date}</span>
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DCD1] font-semibold text-[#1A1412] flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#C59A6F]" />
                            <span>{res.time}</span>
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 font-bold text-amber-900">
                            {res.guests} Guests
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DCD1] text-[#705E53]">
                            {res.seatingPreference}
                          </span>
                        </div>

                        {/* Supabase Status Pill & Manual Sync */}
                        <div className="flex items-center gap-2">
                          {res.supabaseSynced ? (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Supabase Synced</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => syncReservationToSupabase(res)}
                              className="text-[11px] font-bold text-[#1A1412] bg-[#FAF7F2] border border-[#C59A6F] px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-[#F3ECE2] cursor-pointer"
                              title="Push this booking to Supabase public.reservations"
                            >
                              <RefreshCw className="w-3 h-3 text-[#C59A6F]" />
                              <span>Push to Supabase</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Guest Details & Table Reassignment */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-[#8A796E] uppercase tracking-wider block mb-0.5">
                            Customer / Guest
                          </span>
                          <span className="font-bold text-sm text-[#1A1412] block">
                            {res.customerName}
                          </span>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <a
                              href={`tel:${res.phone}`}
                              className="text-[#5C4C43] hover:text-[#1A1412] font-semibold flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-[#C59A6F]" />
                              <span>{res.phone}</span>
                            </a>
                            <a
                              href={`mailto:${res.email}`}
                              className="text-[#5C4C43] hover:text-[#1A1412] flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3 text-[#C59A6F]" />
                              <span>{res.email}</span>
                            </a>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#8A796E] uppercase tracking-wider block mb-0.5">
                            Assigned Table
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <select
                              value={res.tableId || ''}
                              onChange={(e) => {
                                const selectedTableId = e.target.value;
                                updateReservationStatus(res.id, res.status, selectedTableId);
                                showToast(`Table assigned for ${res.customerName}`);
                              }}
                              className="p-2 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2] text-xs font-semibold text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                            >
                              <option value="">-- Assign Table --</option>
                              {tables.map((t) => (
                                <option key={t.id} value={t.id}>
                                  Table {t.tableNumber} ({t.capacity} Seats · {t.location})
                                </option>
                              ))}
                            </select>
                            {res.tableNumber && (
                              <span className="px-2 py-1 bg-[#1A1412] text-[#FAF7F2] font-bold rounded-lg text-[11px]">
                                Table {res.tableNumber}
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#8A796E] uppercase tracking-wider block mb-0.5">
                            Special Requests & Occasion
                          </span>
                          {res.specialRequest ? (
                            <p className="mt-1 p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-[11px] italic">
                              "{res.specialRequest}"
                            </p>
                          ) : (
                            <span className="text-[#8A796E] italic mt-1 block">
                              No special instructions provided
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Buttons and Timestamp */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E6DCD1]/60">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-semibold text-[#8A796E] mr-1">
                            Update Status:
                          </span>
                          {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as ReservationStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                updateReservationStatus(res.id, st, res.tableId);
                                showToast(`Booking ${res.id} marked as ${st}`);
                              }}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                res.status === st
                                  ? 'bg-[#1A1412] text-[#FAF7F2] shadow-xs'
                                  : 'bg-[#FAF7F2] border border-[#E6DCD1] text-[#705E53] hover:bg-[#F3ECE2]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {res.createdAt && (
                          <span className="text-[10px] text-[#8A796E]">
                            Booked on: {new Date(res.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Menu & Pricing Manager */}
        {currentTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1A1412]">
                  Menu Database & Daily Inventory
                </h2>
                <p className="text-xs text-[#705E53]">
                  Toggle item availability when sold out, or add new dishes.
                </p>
              </div>

              <button
                onClick={() => setIsAddingItem(!isAddingItem)}
                className="px-4 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C59A6F]" />
                <span>Add New Menu Item</span>
              </button>
            </div>

            {/* Add Item Form */}
            {isAddingItem && (
              <form
                onSubmit={handleCreateMenuItem}
                className="bg-white rounded-2xl border border-[#C59A6F] p-6 shadow-sm space-y-4"
              >
                <h3 className="font-serif text-base font-bold text-[#1A1412]">
                  New Menu Dish / Coffee
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Item Name</label>
                    <input
                      type="text"
                      required
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g. Spanish Cortado"
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Diet Type</label>
                    <select
                      value={newItemVegType}
                      onChange={(e) => setNewItemVegType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="egg">Contains Egg</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Prep Time (mins)</label>
                    <input
                      type="number"
                      value={newItemPrepTime}
                      onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1412] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Short description of ingredients and tasting notes..."
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="px-4 py-2 text-xs text-[#705E53]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg"
                  >
                    Save Item to Menu
                  </button>
                </div>
              </form>
            )}

            {/* Menu Items Table */}
            <div className="bg-white rounded-2xl border border-[#E6DCD1] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E6DCD1] text-[#705E53] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Dish / Coffee</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Availability</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DCD1]">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-[#F3ECE2] shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#1A1412] block">{item.name}</span>
                            <span className="text-[10px] text-[#8A796E] capitalize">{item.vegType}</span>
                          </div>
                        </td>
                        <td className="p-3 capitalize text-[#5C4C43]">{item.category}</td>
                        <td className="p-3 font-semibold tabular-nums text-[#1A1412]">
                          ₹{item.price}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => updateMenuItem(item.id, { available: !item.available })}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                              item.available
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.available ? 'In Stock' : 'Sold Out'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Coupons */}
        {currentTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-lg font-bold text-[#1A1412]">
                Active Coupons & Promotions
              </h2>
              <button
                onClick={() => setIsAddingCoupon(!isAddingCoupon)}
                className="px-4 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C59A6F]" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {isAddingCoupon && (
              <form
                onSubmit={handleCreateCoupon}
                className="bg-white rounded-2xl border border-[#C59A6F] p-6 shadow-sm space-y-4"
              >
                <h3 className="font-serif text-base font-bold text-[#1A1412]">
                  New Coupon Code
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. MONSOON20"
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1] uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Type</label>
                    <select
                      value={couponType}
                      onChange={(e) => setCouponType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Value</label>
                    <input
                      type="number"
                      value={couponVal}
                      onChange={(e) => setCouponVal(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1A1412] block mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      value={couponMinOrder}
                      onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1A1412] block mb-1">Description</label>
                  <input
                    type="text"
                    required
                    value={couponDesc}
                    onChange={(e) => setCouponDesc(e.target.value)}
                    placeholder="e.g. 20% off on all espresso orders"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E6DCD1]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCoupon(false)}
                    className="px-4 py-2 text-xs text-[#705E53]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1A1412] text-[#FAF7F2] text-xs font-semibold rounded-lg"
                  >
                    Save Coupon
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-[#E6DCD1] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-[#1A1412]">{c.code}</span>
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="text-red-700 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#5C4C43]">{c.description}</p>
                    <p className="text-[11px] text-[#8A796E]">Min order: ₹{c.minOrderAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Restaurant Settings */}
        {currentTab === 'settings' && (
          <div className="max-w-xl bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#1A1412]">
              Restaurant Master Configuration
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1A1412] block mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => updateSettings({ name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1412] block mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => updateSettings({ tagline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1412] block mb-1">Hospitality Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => updateSettings({ phone: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1412] block mb-1">WhatsApp Concierge Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1412] block mb-1">GST Tax Percentage (%)</label>
                <input
                  type="number"
                  value={settings.taxPercentage}
                  onChange={(e) => updateSettings({ taxPercentage: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-[#E6DCD1] bg-[#FAF7F2]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1A1412] block">Operating Hours</span>
                  <span className="text-[11px] text-[#705E53]">{settings.openingHours}</span>
                </div>
                <div className="px-3 py-1 bg-[#F3ECE2] text-[#1A1412] rounded-lg text-xs font-semibold">
                  10 AM – 10 PM
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Supabase Cloud Database */}
        {currentTab === 'supabase' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1A1412] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#C59A6F]" />
                  <span>Supabase Backend Integration</span>
                </h2>
                <p className="text-xs text-[#705E53]">
                  Direct PostgreSQL connection to Supabase project <code className="font-mono font-bold text-[#1A1412]">{SUPABASE_PROJECT_ID}</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshSupabase}
                  disabled={isTestingSupabase}
                  className="px-4 py-2 bg-white border border-[#E6DCD1] hover:bg-[#F3ECE2] text-[#1A1412] text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#C59A6F] ${isTestingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isTestingSupabase ? 'Checking...' : 'Test Connection'}</span>
                </button>

                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Open Supabase</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C59A6F]" />
                </a>
              </div>
            </div>

            {/* Connection Status Card */}
            <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6DCD1] gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    supabaseStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
                    supabaseStatus === 'table_needed' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <span className="font-bold text-sm text-[#1A1412] block">
                      {supabaseStatus === 'connected' ? 'Connected & All Tables Active' :
                       supabaseStatus === 'table_needed' ? 'Connected to Project (Run SQL in Supabase)' :
                       'Supabase Endpoint Accessible'}
                    </span>
                    <span className="text-xs text-[#705E53]">{supabaseMessage}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSyncAllReservations}
                    disabled={isSyncingAll}
                    className="px-3.5 py-1.5 bg-[#FAF7F2] border border-[#C59A6F] text-[#1A1412] text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-[#F3ECE2] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#C59A6F] ${isSyncingAll ? 'animate-spin' : ''}`} />
                    <span>{isSyncingAll ? 'Syncing...' : 'Sync Bookings'}</span>
                  </button>

                  <button
                    onClick={handleSyncAllOrders}
                    disabled={isSyncingOrders}
                    className="px-3.5 py-1.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#C59A6F] ${isSyncingOrders ? 'animate-spin' : ''}`} />
                    <span>{isSyncingOrders ? 'Syncing...' : 'Sync Food Orders'}</span>
                  </button>
                </div>
              </div>

              {/* Endpoint Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1]">
                  <span className="text-[#8A796E] block mb-1">Project Ref</span>
                  <code className="font-mono font-bold text-[#1A1412]">{SUPABASE_PROJECT_ID}</code>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1]">
                  <span className="text-[#8A796E] block mb-1">Target Tables</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      supabaseReservationsReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      reservations {supabaseReservationsReady ? '✓' : '•'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      supabaseOrdersReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      orders {supabaseOrdersReady ? '✓' : '•'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1]">
                  <span className="text-[#8A796E] block mb-1">Reservations Synced</span>
                  <span className="font-bold text-emerald-700">
                    {reservations.filter((r) => r.supabaseSynced).length} / {reservations.length} bookings
                  </span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1]">
                  <span className="text-[#8A796E] block mb-1">Food Orders Synced</span>
                  <span className="font-bold text-emerald-700">
                    {orders.filter((o) => o.supabaseSynced).length} / {orders.length} orders
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Click SQL Setup Guide */}
            <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1A1412]">
                    Complete Supabase SQL Schema (Reservations & Orders)
                  </h3>
                  <p className="text-xs text-[#705E53]">
                    Run this SQL script in your Supabase SQL Editor to establish the <code className="font-mono font-semibold">reservations</code> and <code className="font-mono font-semibold">orders</code> tables with RLS and instant public write policies.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3.5 py-1.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C59A6F]" />}
                  <span>{sqlCopied ? 'SQL Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-[#1A1412] rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-[#FAF7F2] border border-[#3B2F2A] relative">
                <pre>{SUPABASE_SETUP_SQL}</pre>
              </div>

              {/* Instructions */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] text-xs space-y-2">
                <span className="font-bold text-[#1A1412] block">How to run in Supabase (takes 30 seconds):</span>
                <ol className="list-decimal list-inside space-y-1 text-[#5C4C43] text-[11px]">
                  <li>Click <strong>Copy SQL Schema</strong> button above.</li>
                  <li>
                    Open your{' '}
                    <a
                      href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C59A6F] underline font-semibold"
                    >
                      Supabase SQL Editor (project {SUPABASE_PROJECT_ID})
                    </a>
                    .
                  </li>
                  <li>Paste the SQL script and click the green <strong>Run</strong> button.</li>
                  <li>Return here and click <strong>Test Connection</strong> or <strong>Sync Food Orders</strong>!</li>
                </ol>
              </div>
            </div>

            {/* Table Field Dictionary */}
            <div className="bg-white rounded-2xl border border-[#E6DCD1] p-6 shadow-xs space-y-5">
              <h3 className="font-serif text-base font-bold text-[#1A1412]">
                Database Schema Field Dictionary
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-xs font-bold text-[#1A1412] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C59A6F]" />
                    <span>Table: public.orders (Food & Coffee Orders)</span>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E6DCD1] text-[#8A796E]">
                          <th className="py-2 font-semibold">Column</th>
                          <th className="py-2 font-semibold">Type</th>
                          <th className="py-2 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6DCD1]/50 text-[#1A1412]">
                        <tr>
                          <td className="py-2 font-mono font-semibold">id</td>
                          <td className="py-2 text-[#705E53]">TEXT (PK)</td>
                          <td className="py-2">Order identifier (e.g. CC-ORD-8421)</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">customer_name</td>
                          <td className="py-2 text-[#705E53]">TEXT</td>
                          <td className="py-2">Customer full name</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">phone, email</td>
                          <td className="py-2 text-[#705E53]">TEXT</td>
                          <td className="py-2">Customer contact credentials</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">order_type</td>
                          <td className="py-2 text-[#705E53]">TEXT</td>
                          <td className="py-2">Dine-in, Takeaway, or Pickup</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">items</td>
                          <td className="py-2 text-[#705E53]">JSONB</td>
                          <td className="py-2">Ordered items array with quantities, variants & options</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">subtotal, tax_amount, total</td>
                          <td className="py-2 text-[#705E53]">NUMERIC</td>
                          <td className="py-2">Financial breakdown in INR</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">payment_method, payment_status</td>
                          <td className="py-2 text-[#705E53]">TEXT</td>
                          <td className="py-2">UPI QR, Card, or Cash on Pickup</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">status</td>
                          <td className="py-2 text-[#705E53]">TEXT</td>
                          <td className="py-2">Received, Confirmed, Preparing, Ready, Completed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E6DCD1]">
                  <h4 className="font-mono text-xs font-bold text-[#1A1412] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C59A6F]" />
                    <span>Table: public.reservations (Table Bookings)</span>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E6DCD1] text-[#8A796E]">
                          <th className="py-2 font-semibold">Column</th>
                          <th className="py-2 font-semibold">Type</th>
                          <th className="py-2 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6DCD1]/50 text-[#1A1412]">
                        <tr>
                          <td className="py-2 font-mono font-semibold">id</td>
                          <td className="py-2 text-[#705E53]">TEXT (PK)</td>
                          <td className="py-2">Unique booking reference (e.g. CC-RES-4821)</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">customer_name, phone, email</td>
                          <td className="py-2 text-[#705E53]">TEXT</td>
                          <td className="py-2">Guest identification details</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">date, time, guests</td>
                          <td className="py-2 text-[#705E53]">TEXT / INT</td>
                          <td className="py-2">Date (YYYY-MM-DD), time slot & party size</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">seating_preference, table_number</td>
                          <td className="py-2 text-[#705E53]">TEXT</td>
                          <td className="py-2">Window, Couple/Intimate, Indoor, Group, Outdoor</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono font-semibold">status, created_at</td>
                          <td className="py-2 text-[#705E53]">TEXT / TIMESTAMPTZ</td>
                          <td className="py-2">Booking confirmation status and creation timestamp</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Credentials & Security Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E6DCD1] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DCD1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1A1412] text-[#C59A6F] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1A1412]">
                    Admin Security & Profile
                  </h3>
                  <span className="text-[10px] text-[#8A796E]">
                    Sole Administrator (Slot 1/1 Claimed)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#8A796E] hover:text-[#1A1412] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <span className="font-semibold">Single Slot Security:</span> You are the only registered administrator for this website. You can update your contact name, login email, or change your master password here.
            </div>

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1A1412] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#1A1412] block mb-1">Login Email</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#1A1412] block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E6DCD1]/60">
                <label className="font-semibold text-[#1A1412] block mb-1">
                  Current Password * <span className="font-normal text-[#8A796E]">(required to authorize changes)</span>
                </label>
                <input
                  type="password"
                  required
                  value={profileCurrentPassword}
                  onChange={(e) => setProfileCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-2.5 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1412] block mb-1">
                  New Password <span className="font-normal text-[#8A796E]">(leave blank to keep existing password)</span>
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={profileNewPassword}
                  onChange={(e) => setProfileNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full p-2.5 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                />
              </div>

              {profileModalMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    profileModalMsg.type === 'error'
                      ? 'bg-red-50 border border-red-200 text-red-700'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}
                >
                  {profileModalMsg.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  )}
                  <span>{profileModalMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#E6DCD1] text-[#705E53] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
