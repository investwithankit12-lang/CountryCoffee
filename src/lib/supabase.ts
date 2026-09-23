import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'bkawojufwrgqcrkfpglu';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://bkawojufwrgqcrkfpglu.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yAwjTvHgO_dby_gqTXJLew_WS8nFKrS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor to enable both table reservations & food orders:

-- 1. Table: public.reservations (Table Bookings)
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INT NOT NULL,
  seating_preference TEXT,
  special_request TEXT,
  table_number TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to reservations" ON public.reservations;
CREATE POLICY "Allow public insert to reservations" 
ON public.reservations FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on reservations" ON public.reservations;
CREATE POLICY "Allow public select on reservations" 
ON public.reservations FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public update on reservations" ON public.reservations;
CREATE POLICY "Allow public update on reservations" 
ON public.reservations FOR UPDATE 
TO anon, authenticated
USING (true);


-- 2. Table: public.orders (Online Food & Coffee Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  order_type TEXT NOT NULL,
  table_number TEXT,
  pickup_time TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  applied_coupon TEXT,
  special_instructions TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  status TEXT DEFAULT 'Received',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" 
ON public.orders FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
CREATE POLICY "Allow public select on orders" 
ON public.orders FOR SELECT 
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;
CREATE POLICY "Allow public update on orders" 
ON public.orders FOR UPDATE 
TO anon, authenticated
USING (true);
`;

export interface SupabaseSaveResult {
  success: boolean;
  tableUsed?: string;
  error?: string;
  needsTableCreation?: boolean;
  data?: any;
}

/**
 * Checks connection to the Supabase project and determines if tables are created.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  reservationsTableExists: boolean;
  ordersTableExists: boolean;
  message: string;
}> {
  try {
    let resOk = false;
    let ordOk = false;

    // Check reservations table
    const { error: resErr } = await supabase.from('reservations').select('id').limit(1);
    if (!resErr) {
      resOk = true;
    }

    // Check orders table
    const { error: ordErr } = await supabase.from('orders').select('id').limit(1);
    if (!ordErr) {
      ordOk = true;
    }

    if (resOk && ordOk) {
      return {
        connected: true,
        reservationsTableExists: true,
        ordersTableExists: true,
        message: 'Active & connected. Both "reservations" and "orders" tables are ready in Supabase.',
      };
    } else if (resOk && !ordOk) {
      return {
        connected: true,
        reservationsTableExists: true,
        ordersTableExists: false,
        message: 'Connected: "reservations" table is active. Run SQL for "orders" table in Supabase.',
      };
    } else if (!resOk && ordOk) {
      return {
        connected: true,
        reservationsTableExists: false,
        ordersTableExists: true,
        message: 'Connected: "orders" table is active. Run SQL for "reservations" table in Supabase.',
      };
    } else {
      return {
        connected: true,
        reservationsTableExists: false,
        ordersTableExists: false,
        message: 'Supabase connected, but "reservations" & "orders" tables need to be created in SQL editor.',
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      reservationsTableExists: false,
      ordersTableExists: false,
      message: err?.message || 'Unable to connect to Supabase endpoint.',
    };
  }
}

/**
 * Saves a table reservation / appointment booking into the Supabase database.
 */
export async function saveBookingToSupabase(booking: {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference?: string;
  specialRequest?: string;
  tableNumber?: string;
  status: string;
}): Promise<SupabaseSaveResult> {
  const candidateTables = ['reservations', 'bookings', 'appointments', 'table_reservations'];

  const snakePayload = {
    id: booking.id,
    customer_name: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    date: booking.date,
    time: booking.time,
    guests: booking.guests,
    seating_preference: booking.seatingPreference,
    special_request: booking.specialRequest || null,
    table_number: booking.tableNumber || null,
    status: booking.status,
    created_at: new Date().toISOString(),
  };

  const camelPayload = {
    id: booking.id,
    customerName: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    date: booking.date,
    time: booking.time,
    guests: booking.guests,
    seatingPreference: booking.seatingPreference,
    specialRequest: booking.specialRequest || null,
    tableNumber: booking.tableNumber || null,
    status: booking.status,
    createdAt: new Date().toISOString(),
  };

  let lastError: any = null;
  let allMissingTables = true;

  for (const tableName of candidateTables) {
    try {
      // 1. Try snake_case upsert
      const { data, error } = await supabase
        .from(tableName)
        .upsert(snakePayload, { onConflict: 'id' })
        .select();

      if (!error) {
        console.log(`[Supabase] Successfully saved booking to table "${tableName}":`, data);
        return { success: true, tableUsed: tableName, data };
      }

      // If column mismatch, try camelCase
      if (error && error.message && error.message.includes('column')) {
        allMissingTables = false;
        const { data: camelData, error: camelErr } = await supabase
          .from(tableName)
          .upsert(camelPayload, { onConflict: 'id' })
          .select();
        if (!camelErr) {
          console.log(`[Supabase] Successfully saved booking to table "${tableName}" (camelCase):`, camelData);
          return { success: true, tableUsed: tableName, data: camelData };
        }
        lastError = camelErr;
      } else if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        lastError = error;
      } else {
        allMissingTables = false;
        lastError = error;
      }
    } catch (err: any) {
      lastError = err;
      console.error(`[Supabase] Exception targeting table "${tableName}":`, err);
    }
  }

  const needsTableCreation =
    allMissingTables && (lastError?.code === 'PGRST205' || lastError?.message?.includes('does not exist'));

  return {
    success: false,
    error: lastError?.message || 'Could not save booking to Supabase.',
    needsTableCreation,
  };
}

/**
 * Saves an online food / beverage order into the Supabase database.
 */
export async function saveOrderToSupabase(order: {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  orderType: string;
  tableNumber?: string;
  pickupTime?: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  appliedCoupon?: string;
  specialInstructions?: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}): Promise<SupabaseSaveResult> {
  const candidateTables = ['orders', 'food_orders', 'online_orders', 'customer_orders'];

  const snakePayload = {
    id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    email: order.email,
    order_type: order.orderType,
    table_number: order.tableNumber || null,
    pickup_time: order.pickupTime || null,
    items: order.items,
    subtotal: order.subtotal,
    tax_amount: order.taxAmount,
    discount_amount: order.discountAmount,
    total: order.total,
    applied_coupon: order.appliedCoupon || null,
    special_instructions: order.specialInstructions || null,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    status: order.status,
    created_at: order.createdAt || new Date().toISOString(),
  };

  const camelPayload = {
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    orderType: order.orderType,
    tableNumber: order.tableNumber || null,
    pickupTime: order.pickupTime || null,
    items: order.items,
    subtotal: order.subtotal,
    taxAmount: order.taxAmount,
    discountAmount: order.discountAmount,
    total: order.total,
    appliedCoupon: order.appliedCoupon || null,
    specialInstructions: order.specialInstructions || null,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    createdAt: order.createdAt || new Date().toISOString(),
  };

  let lastError: any = null;
  let allMissingTables = true;

  for (const tableName of candidateTables) {
    try {
      // 1. Try snake_case upsert
      const { data, error } = await supabase
        .from(tableName)
        .upsert(snakePayload, { onConflict: 'id' })
        .select();

      if (!error) {
        console.log(`[Supabase] Successfully saved order to table "${tableName}":`, data);
        return { success: true, tableUsed: tableName, data };
      }

      // If items column requires stringified text instead of json
      if (error && error.message && (error.message.includes('json') || error.message.includes('text'))) {
        const textItemsPayload = { ...snakePayload, items: JSON.stringify(order.items) };
        const { data: strData, error: strErr } = await supabase
          .from(tableName)
          .upsert(textItemsPayload, { onConflict: 'id' })
          .select();
        if (!strErr) {
          console.log(`[Supabase] Successfully saved order to table "${tableName}" with text items:`, strData);
          return { success: true, tableUsed: tableName, data: strData };
        }
      }

      // If column mismatch, try camelCase
      if (error && error.message && error.message.includes('column')) {
        allMissingTables = false;
        const { data: camelData, error: camelErr } = await supabase
          .from(tableName)
          .upsert(camelPayload, { onConflict: 'id' })
          .select();
        if (!camelErr) {
          console.log(`[Supabase] Successfully saved order to table "${tableName}" (camelCase):`, camelData);
          return { success: true, tableUsed: tableName, data: camelData };
        }
        lastError = camelErr;
      } else if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
        lastError = error;
      } else {
        allMissingTables = false;
        lastError = error;
      }
    } catch (err: any) {
      lastError = err;
      console.error(`[Supabase] Exception targeting table "${tableName}":`, err);
    }
  }

  const needsTableCreation =
    allMissingTables && (lastError?.code === 'PGRST205' || lastError?.message?.includes('does not exist'));

  return {
    success: false,
    error: lastError?.message || 'Could not save order to Supabase.',
    needsTableCreation,
  };
}

/**
 * Fetches all reservations stored in Supabase.
 */
export async function fetchReservationsFromSupabase(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch reservations:', error.message);
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.warn('[Supabase] fetchReservations exception:', err?.message);
    return [];
  }
}

/**
 * Fetches all orders stored in Supabase.
 */
export async function fetchOrdersFromSupabase(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Failed to fetch orders:', error.message);
      return [];
    }
    return data || [];
  } catch (err: any) {
    console.warn('[Supabase] fetchOrders exception:', err?.message);
    return [];
  }
}
