export type VegType = 'veg' | 'non-veg' | 'egg';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  vegType: VegType;
  bestseller?: boolean;
  chefSpecial?: boolean;
  isNew?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  allergens?: string[];
  prepTimeMinutes: number;
  available: boolean;
  modifierGroups?: ModifierGroup[];
  rating: number;
  reviewsCount: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export type TableLocation = 'Indoor' | 'Window' | 'Couple / Intimate' | 'Group' | 'Outdoor';
export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  location: TableLocation;
  status: TableStatus;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "18:00"
  guests: number;
  seatingPreference: TableLocation;
  specialRequest?: string;
  tableId?: string;
  tableNumber?: string;
  status: ReservationStatus;
  createdAt: string;
  supabaseSynced?: boolean;
}

export type OrderType = 'Dine-in' | 'Takeaway' | 'Pickup';
export type OrderStatus = 'Received' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Cash on Pickup / Dine-in';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface CartCustomization {
  groupName: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string; // Unique cart item instance ID
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  vegType: VegType;
  quantity: number;
  selectedOptions: CartCustomization[];
  itemInstructions?: string;
  totalUnitPrice: number;
}

export interface Order {
  id: string; // e.g., CC-ORD-1042
  customerName: string;
  phone: string;
  email: string;
  orderType: OrderType;
  tableNumber?: string;
  pickupTime?: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  appliedCoupon?: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  estimatedTimeMinutes: number;
  supabaseSynced?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 15 for 15% or 100 for ₹100
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: 'admin';
  createdAt: string;
  isRegistered: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  dishName?: string;
  date: string;
  featured: boolean;
  approved: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  address: string;
  fullAddress: string;
  landmark: string;
  phone: string;
  email: string;
  openingHours: string;
  openTime: string;
  closeTime: string;
  whatsappNumber: string;
  taxPercentage: number; // GST 5%
  serviceChargePercentage: number; // 0% default
  reservationDurationMinutes: number;
  bufferBetweenReservationsMinutes: number;
  razorpayKeyId?: string;
  isTestPaymentMode: boolean;
  mapsUrl: string;
  instagramUrl: string;
}
