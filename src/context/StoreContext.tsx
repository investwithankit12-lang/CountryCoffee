import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  MenuCategory,
  RestaurantTable,
  Reservation,
  Order,
  CartItem,
  Coupon,
  RestaurantSettings,
  Review,
  User,
  AdminAccount,
  ReservationStatus,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../types';
import {
  initialSettings,
  initialCategories,
  initialMenuItems,
  initialTables,
  initialCoupons,
  initialReviews,
  initialReservations,
  initialOrders,
} from '../data/initialData';
import {
  saveBookingToSupabase,
  saveOrderToSupabase,
  testSupabaseConnection,
  fetchReservationsFromSupabase,
  fetchOrdersFromSupabase,
  SUPABASE_PROJECT_ID,
  supabase,
} from '../lib/supabase';

interface ReservationAvailabilityResult {
  available: boolean;
  assignedTable?: RestaurantTable;
  reason?: string;
}

interface StoreContextType {
  // Settings
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;

  // Categories & Menu
  categories: MenuCategory[];
  menuItems: MenuItem[];
  addCategory: (cat: MenuCategory) => void;
  deleteCategory: (catId: string) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, updated: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  resetMenuToDefault: () => void;

  // Tables
  tables: RestaurantTable[];
  addTable: (table: RestaurantTable) => void;
  updateTable: (id: string, updated: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;

  // Reservations
  reservations: Reservation[];
  checkTableAvailability: (date: string, time: string, guests: number, preference?: string) => ReservationAvailabilityResult;
  createReservation: (
    resData: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'tableId' | 'tableNumber'>
  ) => Promise<{
    success: boolean;
    reservation?: Reservation;
    error?: string;
    supabaseSynced?: boolean;
    supabaseTable?: string;
    supabaseMessage?: string;
  }>;
  updateReservationStatus: (id: string, status: ReservationStatus, tableId?: string) => void;
  cancelReservation: (id: string) => void;
  syncReservationToSupabase: (reservation: Reservation) => Promise<{ success: boolean; error?: string; tableUsed?: string }>;

  // Supabase Integration
  supabaseStatus: 'connected' | 'table_needed' | 'error' | 'checking';
  supabaseMessage: string;
  supabaseReservationsReady: boolean;
  supabaseOrdersReady: boolean;
  checkSupabaseHealth: () => Promise<void>;
  syncOrderToSupabase: (order: Order) => Promise<{ success: boolean; error?: string; tableUsed?: string }>;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updated: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    phone: string;
    email: string;
    orderType: OrderType;
    tableNumber?: string;
    pickupTime?: string;
    specialInstructions?: string;
    paymentMethod: PaymentMethod;
  }) => Promise<{
    success: boolean;
    order?: Order;
    error?: string;
    supabaseSynced?: boolean;
    supabaseTable?: string;
    supabaseMessage?: string;
  }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Customer & Auth
  currentUser: User | null;
  adminAccount: AdminAccount | null;
  isAdminRegistered: boolean;
  isAdminLoggedIn: boolean;
  registerAdmin: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (emailOrUsername: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  updateAdminCredentials: (updates: { name?: string; email?: string; phone?: string; newPassword?: string; currentPassword: string }) => { success: boolean; error?: string };
  loginUser: (email: string, name: string, phone: string) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: { name: string; phone: string; email: string }) => void;

  // Favorites
  favorites: string[]; // menuItemId[]
  toggleFavorite: (menuItemId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'approved'>) => void;
  toggleReviewFeatured: (id: string) => void;
  toggleReviewApproval: (id: string) => void;

  // Navigation helper
  activePage: string;
  setActivePage: (page: string) => void;

  // Toast / notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with seed fallback
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('cc_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem('cc_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('cc_menu');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem('cc_tables');
    return saved ? JSON.parse(saved) : initialTables;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('cc_reservations');
    return saved ? JSON.parse(saved) : initialReservations;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cc_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('cc_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('cc_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_favorites');
    return saved ? JSON.parse(saved) : ['cc-item-01', 'cc-item-11'];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cc_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Single-slot Admin Account State
  const [adminAccount, setAdminAccount] = useState<AdminAccount | null>(() => {
    try {
      const saved = localStorage.getItem('cc_admin_account');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdminRegistered = Boolean(adminAccount && adminAccount.isRegistered);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cc_admin_session') === 'true';
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Supabase Backend Integration State
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'table_needed' | 'error' | 'checking'>('checking');
  const [supabaseMessage, setSupabaseMessage] = useState<string>('Connecting to Supabase...');
  const [supabaseReservationsReady, setSupabaseReservationsReady] = useState<boolean>(false);
  const [supabaseOrdersReady, setSupabaseOrdersReady] = useState<boolean>(false);

  const checkSupabaseHealth = async () => {
    setSupabaseStatus('checking');
    try {
      const res = await testSupabaseConnection();
      setSupabaseReservationsReady(res.reservationsTableExists);
      setSupabaseOrdersReady(res.ordersTableExists);

      if (res.connected && res.reservationsTableExists && res.ordersTableExists) {
        setSupabaseStatus('connected');
        setSupabaseMessage('Active & connected to Supabase (reservations & orders tables ready)');
      } else if (res.connected && (res.reservationsTableExists || res.ordersTableExists)) {
        setSupabaseStatus('table_needed');
        setSupabaseMessage(res.message);
      } else if (res.connected) {
        setSupabaseStatus('table_needed');
        setSupabaseMessage('Connected to Supabase project bkawojufwrgqcrkfpglu (SQL table creation needed)');
      } else {
        setSupabaseStatus('error');
        setSupabaseMessage(res.message);
      }

      // Fetch existing reservations from Supabase if table is ready
      if (res.reservationsTableExists) {
        try {
          const remoteReservations = await fetchReservationsFromSupabase();
          if (remoteReservations && remoteReservations.length > 0) {
            setReservations((prev) => {
              const remoteMapped: Reservation[] = remoteReservations.map((row: any) => ({
                id: row.id,
                customerName: row.customer_name || row.customerName || 'Guest',
                phone: row.phone || '',
                email: row.email || '',
                date: row.date || new Date().toISOString().split('T')[0],
                time: row.time || '18:00',
                guests: Number(row.guests) || 2,
                seatingPreference: row.seating_preference || row.seatingPreference || 'Indoor',
                specialRequest: row.special_request || row.specialRequest || undefined,
                tableNumber: row.table_number || row.tableNumber || undefined,
                status: (row.status as ReservationStatus) || 'Confirmed',
                createdAt: row.created_at || new Date().toISOString(),
                supabaseSynced: true,
              }));

              const map = new Map<string, Reservation>();
              prev.forEach((r) => map.set(r.id, r));
              remoteMapped.forEach((r) => map.set(r.id, r));
              return Array.from(map.values());
            });
          }
        } catch (fetchErr) {
          console.warn('[StoreContext] Error fetching Supabase reservations:', fetchErr);
        }
      }

      // Fetch existing orders from Supabase if table is ready
      if (res.ordersTableExists) {
        try {
          const remoteOrders = await fetchOrdersFromSupabase();
          if (remoteOrders && remoteOrders.length > 0) {
            setOrders((prev) => {
              const remoteMapped: Order[] = remoteOrders.map((row: any) => {
                let parsedItems = [];
                try {
                  parsedItems = typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [];
                } catch {
                  parsedItems = [];
                }
                return {
                  id: row.id,
                  customerName: row.customer_name || row.customerName || 'Customer',
                  phone: row.phone || '',
                  email: row.email || '',
                  orderType: (row.order_type || row.orderType || 'Pickup') as OrderType,
                  tableNumber: row.table_number || row.tableNumber || undefined,
                  pickupTime: row.pickup_time || row.pickupTime || undefined,
                  items: parsedItems,
                  subtotal: Number(row.subtotal) || 0,
                  taxAmount: Number(row.tax_amount || row.taxAmount) || 0,
                  discountAmount: Number(row.discount_amount || row.discountAmount) || 0,
                  total: Number(row.total) || 0,
                  appliedCoupon: row.applied_coupon || row.appliedCoupon || undefined,
                  specialInstructions: row.special_instructions || row.specialInstructions || undefined,
                  paymentMethod: (row.payment_method || row.paymentMethod || 'UPI') as PaymentMethod,
                  paymentStatus: (row.payment_status || row.paymentStatus || 'Paid') as 'Pending' | 'Paid' | 'Failed',
                  status: (row.status || 'Received') as OrderStatus,
                  createdAt: row.created_at || new Date().toISOString(),
                  estimatedTimeMinutes: 25,
                  supabaseSynced: true,
                };
              });

              const map = new Map<string, Order>();
              prev.forEach((o) => map.set(o.id, o));
              remoteMapped.forEach((o) => map.set(o.id, o));
              return Array.from(map.values());
            });
          }
        } catch (fetchErr) {
          console.warn('[StoreContext] Error fetching Supabase orders:', fetchErr);
        }
      }
    } catch (err: any) {
      setSupabaseStatus('error');
      setSupabaseMessage(err?.message || 'Failed to reach Supabase project.');
    }
  };

  useEffect(() => {
    checkSupabaseHealth();
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('cc_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cc_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cc_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('cc_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('cc_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('cc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cc_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('cc_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cc_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cc_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cc_user');
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Settings
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Restaurant settings updated');
  };

  // Categories & Menu
  const addCategory = (cat: MenuCategory) => {
    setCategories((prev) => [...prev, cat]);
    showToast(`Added category: ${cat.name}`);
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('Category deleted');
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
    showToast(`Added: ${item.name}`);
  };

  const updateMenuItem = (id: string, updated: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    showToast('Menu item updated');
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item deleted from menu');
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  const resetMenuToDefault = () => {
    setMenuItems(initialMenuItems);
    setCategories(initialCategories);
    showToast('Menu reset to initial default items');
  };

  // Tables
  const addTable = (table: RestaurantTable) => {
    setTables((prev) => [...prev, table]);
    showToast(`Table ${table.tableNumber} added`);
  };

  const updateTable = (id: string, updated: Partial<RestaurantTable>) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    showToast('Table configuration updated');
  };

  const deleteTable = (id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
    showToast('Table removed');
  };

  // Double-booking & Availability logic
  const checkTableAvailability = (
    date: string,
    time: string,
    guests: number,
    preference?: string
  ): ReservationAvailabilityResult => {
    // 1. Operating hours check
    const [reqHours, reqMins] = time.split(':').map(Number);
    const reqTotalMins = reqHours * 60 + reqMins;
    const [openH, openM] = settings.openTime.split(':').map(Number);
    const [closeH, closeM] = settings.closeTime.split(':').map(Number);
    const openTotalMins = openH * 60 + openM;
    const closeTotalMins = closeH * 60 + closeM;

    if (reqTotalMins < openTotalMins || reqTotalMins + 60 > closeTotalMins) {
      return {
        available: false,
        reason: `Country Coffees operates between ${settings.openingHours}. Last seating is 60 minutes before closing.`,
      };
    }

    // 2. Find eligible tables by capacity
    const eligibleTables = tables.filter((t) => t.status !== 'Maintenance' && t.capacity >= guests);

    if (eligibleTables.length === 0) {
      return {
        available: false,
        reason: `No tables currently configured can accommodate ${guests} guests in one seating. Please contact us directly for large private parties.`,
      };
    }

    // 3. Check conflicting active reservations for this date
    // Duration: 90 mins, buffer: 15 mins
    const durationMins = settings.reservationDurationMinutes || 90;
    const bufferMins = settings.bufferBetweenReservationsMinutes || 15;
    const slotSpan = durationMins + bufferMins;

    const dayReservations = reservations.filter(
      (r) => r.date === date && (r.status === 'Confirmed' || r.status === 'Pending')
    );

    // Filter tables that don't conflict at this time
    const availableTables = eligibleTables.filter((table) => {
      const tableBookings = dayReservations.filter((r) => r.tableId === table.id);
      for (const booking of tableBookings) {
        const [bHours, bMins] = booking.time.split(':').map(Number);
        const bTotalMins = bHours * 60 + bMins;
        // Check overlap
        const overlaps = Math.abs(reqTotalMins - bTotalMins) < slotSpan;
        if (overlaps) return false;
      }
      return true;
    });

    if (availableTables.length === 0) {
      return {
        available: false,
        reason: `All tables are fully booked for ${guests} guests around ${time} on ${date}. Please select an alternative time slot.`,
      };
    }

    // Prefer seating preference if specified
    if (preference) {
      const preferred = availableTables.find((t) => t.location === preference);
      if (preferred) {
        return { available: true, assignedTable: preferred };
      }
    }

    // Otherwise pick best-fit table (least excess capacity)
    const sorted = [...availableTables].sort((a, b) => a.capacity - b.capacity);
    return { available: true, assignedTable: sorted[0] };
  };

  const createReservation = async (
    resData: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'tableId' | 'tableNumber'>
  ): Promise<{
    success: boolean;
    reservation?: Reservation;
    error?: string;
    supabaseSynced?: boolean;
    supabaseTable?: string;
    supabaseMessage?: string;
  }> => {
    const avail = checkTableAvailability(
      resData.date,
      resData.time,
      resData.guests,
      resData.seatingPreference
    );

    if (!avail.available || !avail.assignedTable) {
      return { success: false, error: avail.reason || 'Requested slot is unavailable.' };
    }

    const bookingId = `CC-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    let newReservation: Reservation = {
      ...resData,
      id: bookingId,
      tableId: avail.assignedTable.id,
      tableNumber: avail.assignedTable.tableNumber,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      supabaseSynced: false,
    };

    // Save directly to Supabase backend table
    let supabaseSynced = false;
    let supabaseTable: string | undefined;
    let supabaseMessage = '';

    try {
      const supaResult = await saveBookingToSupabase(newReservation);
      if (supaResult.success) {
        supabaseSynced = true;
        supabaseTable = supaResult.tableUsed;
        newReservation = { ...newReservation, supabaseSynced: true };
        supabaseMessage = `Successfully stored in Supabase (${supaResult.tableUsed})`;
        setSupabaseStatus('connected');
      } else {
        if (supaResult.needsTableCreation) {
          setSupabaseStatus('table_needed');
          supabaseMessage = 'Stored locally. Table "reservations" not yet created in Supabase SQL editor.';
        } else {
          supabaseMessage = supaResult.error || 'Supabase sync pending';
        }
      }
    } catch (err: any) {
      console.warn('[StoreContext] Supabase sync exception:', err);
      supabaseMessage = err?.message || 'Sync error';
    }

    setReservations((prev) => [newReservation, ...prev]);

    if (supabaseSynced) {
      showToast(`Table confirmed & saved to Supabase! (${bookingId})`);
    } else {
      showToast(`Table confirmed! Reservation ID: ${bookingId}`);
    }

    return {
      success: true,
      reservation: newReservation,
      supabaseSynced,
      supabaseTable,
      supabaseMessage,
    };
  };

  const syncReservationToSupabase = async (
    reservation: Reservation
  ): Promise<{ success: boolean; error?: string; tableUsed?: string }> => {
    try {
      const supaResult = await saveBookingToSupabase(reservation);
      if (supaResult.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === reservation.id ? { ...r, supabaseSynced: true } : r))
        );
        showToast(`Reservation #${reservation.id} synced to Supabase (${supaResult.tableUsed})`);
        return { success: true, tableUsed: supaResult.tableUsed };
      } else {
        return { success: false, error: supaResult.error };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sync' };
    }
  };

  const updateReservationStatus = (id: string, status: ReservationStatus, tableId?: string) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            ...(tableId ? { tableId, tableNumber: tables.find((t) => t.id === tableId)?.tableNumber } : {}),
          };
        }
        return r;
      })
    );
    showToast(`Reservation #${id} updated to ${status}`);
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' } : r))
    );
    showToast(`Reservation #${id} has been cancelled`);
  };

  // Cart Management
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Find if exact same item & options already exists
      const existingIdx = prev.findIndex(
        (ci) =>
          ci.menuItemId === item.menuItemId &&
          JSON.stringify(ci.selectedOptions) === JSON.stringify(item.selectedOptions)
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
    showToast(`Added ${item.name} to cart`);
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.totalUnitPrice * item.quantity, 0);
    if (subtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: `Coupon requires minimum order value of ₹${coupon.minOrderAmount}`,
      };
    }

    setAppliedCoupon(coupon);
    showToast(`Promo code ${coupon.code} applied!`);
    return { success: true, message: `Coupon applied: ${coupon.title}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    showToast(`Coupon ${coupon.code} created`);
  };

  const updateCoupon = (id: string, updated: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('Coupon updated');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon deleted');
  };

  // Orders
  const createOrder = async (orderData: {
    customerName: string;
    phone: string;
    email: string;
    orderType: OrderType;
    tableNumber?: string;
    pickupTime?: string;
    specialInstructions?: string;
    paymentMethod: PaymentMethod;
  }): Promise<{
    success: boolean;
    order?: Order;
    error?: string;
    supabaseSynced?: boolean;
    supabaseTable?: string;
    supabaseMessage?: string;
  }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

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

    const orderId = `CC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    let newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      orderType: orderData.orderType,
      tableNumber: orderData.tableNumber,
      pickupTime: orderData.pickupTime,
      items: [...cart],
      subtotal,
      taxAmount,
      discountAmount,
      total,
      appliedCoupon: appliedCoupon?.code,
      specialInstructions: orderData.specialInstructions,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Cash on Pickup / Dine-in' ? 'Pending' : 'Paid',
      status: 'Received',
      createdAt: new Date().toISOString(),
      estimatedTimeMinutes: 25,
      supabaseSynced: false,
    };

    // Save directly to Supabase backend table
    let supabaseSynced = false;
    let supabaseTable: string | undefined;
    let supabaseMessage = '';

    try {
      const supaResult = await saveOrderToSupabase(newOrder);
      if (supaResult.success) {
        supabaseSynced = true;
        supabaseTable = supaResult.tableUsed;
        newOrder = { ...newOrder, supabaseSynced: true };
        supabaseMessage = `Successfully stored in Supabase (${supaResult.tableUsed})`;
      } else {
        if (supaResult.needsTableCreation) {
          supabaseMessage = 'Stored locally. Table "orders" not yet created in Supabase SQL editor.';
        } else {
          supabaseMessage = supaResult.error || 'Supabase order sync pending';
        }
      }
    } catch (err: any) {
      console.warn('[StoreContext] Supabase order sync exception:', err);
      supabaseMessage = err?.message || 'Sync error';
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    clearCart();

    if (supabaseSynced) {
      showToast(`Order confirmed & saved to Supabase! (#${orderId})`);
    } else {
      showToast(`Order confirmed! Order #${orderId}`);
    }

    return {
      success: true,
      order: newOrder,
      supabaseSynced,
      supabaseTable,
      supabaseMessage,
    };
  };

  const syncOrderToSupabase = async (
    order: Order
  ): Promise<{ success: boolean; error?: string; tableUsed?: string }> => {
    try {
      const supaResult = await saveOrderToSupabase(order);
      if (supaResult.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, supabaseSynced: true } : o))
        );
        if (activeTrackingOrder && activeTrackingOrder.id === order.id) {
          setActiveTrackingOrder({ ...activeTrackingOrder, supabaseSynced: true });
        }
        showToast(`Order #${order.id} synced to Supabase (${supaResult.tableUsed})`);
        return { success: true, tableUsed: supaResult.tableUsed };
      } else {
        return { success: false, error: supaResult.error };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sync order' };
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Order #${orderId} status set to ${status}`);
  };

  // Auth
  const loginUser = (email: string, name: string, phone: string) => {
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      name,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    showToast(`Welcome back, ${name}!`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out successfully');
  };

  const updateUserProfile = (updates: { name: string; phone: string; email: string }) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
      showToast('Profile updated successfully');
    }
  };

  // Strict Single-Slot Administrator Authentication
  const registerAdmin = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Strict 1-slot guard: If already registered, permanently block any further registrations
    if (adminAccount && adminAccount.isRegistered) {
      showToast('Admin registration slot is already claimed and permanently locked.');
      return {
        success: false,
        error: 'The single administrator registration slot for this website has already been claimed. Nobody else is allowed to create an admin account.',
      };
    }

    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: 'Please provide full name, email, and password.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const newAdmin: AdminAccount = {
      id: 'primary_admin_slot',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      passwordHash: password,
      role: 'admin',
      createdAt: new Date().toISOString(),
      isRegistered: true,
    };

    setAdminAccount(newAdmin);
    localStorage.setItem('cc_admin_account', JSON.stringify(newAdmin));
    setIsAdminLoggedIn(true);
    localStorage.setItem('cc_admin_session', 'true');
    showToast(`Administrator account created for ${newAdmin.name}!`);

    // Sync to Supabase if admin_config table is available
    try {
      await supabase.from('admin_config').upsert({
        id: 'primary_admin',
        admin_name: newAdmin.name,
        admin_email: newAdmin.email,
        phone: newAdmin.phone,
        created_at: newAdmin.createdAt,
        is_registered: true,
      }, { onConflict: 'id' });
    } catch {
      // Gracefully continue with localStorage fallback
    }

    return { success: true };
  };

  const loginAdmin = (
    emailOrUsername: string,
    password: string
  ): { success: boolean; error?: string } => {
    // If no admin registered yet
    if (!adminAccount || !adminAccount.isRegistered) {
      showToast('No administrator account set up yet. Please claim the single registration slot first.');
      return {
        success: false,
        error: 'No administrator account has been set up yet. Please claim the single registration slot first.',
      };
    }

    const cleanInput = emailOrUsername.trim().toLowerCase();
    const adminEmail = adminAccount.email.toLowerCase();
    const adminName = adminAccount.name.toLowerCase();

    // Verify identity and password
    const matchesIdentity = cleanInput === adminEmail || cleanInput === adminName || cleanInput === 'admin';
    const matchesPassword = password === adminAccount.passwordHash;

    if (matchesIdentity && matchesPassword) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('cc_admin_session', 'true');
      showToast(`Welcome back, ${adminAccount.name}!`);
      return { success: true };
    }

    showToast('Invalid administrator credentials');
    return { success: false, error: 'Invalid administrator email or password.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cc_admin_session');
    showToast('Admin session closed');
  };

  const updateAdminCredentials = (updates: {
    name?: string;
    email?: string;
    phone?: string;
    newPassword?: string;
    currentPassword: string;
  }): { success: boolean; error?: string } => {
    if (!adminAccount) {
      return { success: false, error: 'No administrator account found.' };
    }

    if (updates.currentPassword !== adminAccount.passwordHash) {
      return { success: false, error: 'Current password does not match.' };
    }

    const updatedAccount: AdminAccount = {
      ...adminAccount,
      name: updates.name?.trim() || adminAccount.name,
      email: updates.email?.trim().toLowerCase() || adminAccount.email,
      phone: updates.phone !== undefined ? updates.phone.trim() : adminAccount.phone,
      passwordHash:
        updates.newPassword && updates.newPassword.length >= 6
          ? updates.newPassword
          : adminAccount.passwordHash,
    };

    setAdminAccount(updatedAccount);
    localStorage.setItem('cc_admin_account', JSON.stringify(updatedAccount));
    showToast('Administrator profile updated successfully');
    return { success: true };
  };

  // Favorites
  const toggleFavorite = (menuItemId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(menuItemId);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter((id) => id !== menuItemId);
      } else {
        showToast('Saved to favorites');
        return [...prev, menuItemId];
      }
    });
  };

  // Reviews
  const addReview = (newReview: Omit<Review, 'id' | 'date' | 'approved'>) => {
    const review: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      approved: true, // Default visible or admin can manage
    };
    setReviews((prev) => [review, ...prev]);
    showToast('Thank you for your review!');
  };

  const toggleReviewFeatured = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, featured: !r.featured } : r))
    );
  };

  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        categories,
        menuItems,
        addCategory,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        resetMenuToDefault,
        tables,
        addTable,
        updateTable,
        deleteTable,
        reservations,
        checkTableAvailability,
        createReservation,
        updateReservationStatus,
        cancelReservation,
        syncReservationToSupabase,
        syncOrderToSupabase,
        supabaseStatus,
        supabaseMessage,
        supabaseReservationsReady,
        supabaseOrdersReady,
        checkSupabaseHealth,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        orders,
        createOrder,
        updateOrderStatus,
        activeTrackingOrder,
        setActiveTrackingOrder,
        currentUser,
        adminAccount,
        isAdminRegistered,
        isAdminLoggedIn,
        registerAdmin,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        loginUser,
        logoutUser,
        updateUserProfile,
        favorites,
        toggleFavorite,
        reviews,
        addReview,
        toggleReviewFeatured,
        toggleReviewApproval,
        activePage,
        setActivePage,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
