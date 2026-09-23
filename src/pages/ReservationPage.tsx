import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TableLocation, Reservation } from '../types';
import { SUPABASE_PROJECT_ID, SUPABASE_SETUP_SQL } from '../lib/supabase';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  MapPin,
  Phone,
  CalendarPlus,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Database,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export const ReservationPage: React.FC = () => {
  const {
    settings,
    createReservation,
    syncReservationToSupabase,
    supabaseStatus,
    supabaseMessage,
    currentUser,
    setActivePage,
  } = useStore();

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [seatingPreference, setSeatingPreference] = useState<TableLocation>('Window');
  const [specialRequest, setSpecialRequest] = useState('');

  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  const handleManualSync = async () => {
    if (!confirmedReservation) return;
    setIsSyncing(true);
    const res = await syncReservationToSupabase(confirmedReservation);
    setIsSyncing(false);
    if (res.success) {
      setConfirmedReservation({ ...confirmedReservation, supabaseSynced: true });
    }
  };

  // Time slots from 10:00 to 21:00 (every 30 mins)
  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00',
  ];

  const seatingOptions: TableLocation[] = [
    'Window',
    'Couple / Intimate',
    'Indoor',
    'Group',
    'Outdoor',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Call reservation availability & creation logic with Supabase backend sync
      const res = await createReservation({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        date,
        time,
        guests,
        seatingPreference,
        specialRequest: specialRequest.trim() || undefined,
      });

      setIsSubmitting(false);

      if (res.success && res.reservation) {
        setConfirmedReservation(res.reservation);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(res.error || 'Failed to book table. Please try a different slot.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Failed to book table. Please try again.');
    }
  };

  const handleAddToCalendar = () => {
    if (!confirmedReservation) return;
    const startDateTime = new Date(`${confirmedReservation.date}T${confirmedReservation.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 90 * 60000);

    const formatCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const title = encodeURIComponent('Table Reservation at Country Coffees Kolkata');
    const details = encodeURIComponent(
      `Reservation ID: ${confirmedReservation.id}\nParty: ${confirmedReservation.guests} guests\nTable: ${confirmedReservation.tableNumber || confirmedReservation.seatingPreference}\nAddress: 39, Plot No. 39, BK Block, Sector 2, Bidhannagar, Kolkata\nPhone: +91 70032 39518`
    );
    const location = encodeURIComponent('Country Coffees, 39, Plot No. 39, BK Block, Sector 2, Bidhannagar, Kolkata, West Bengal 700091');

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalDate(startDateTime)}/${formatCalDate(endDateTime)}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 lg:pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#1A1412] text-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-[#3B2F2A]">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-2">
            Hospitality & Reservations
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Reserve Your Table
          </h1>
          <p className="text-sm sm:text-base text-[#B8A89A] max-w-lg mx-auto leading-relaxed">
            Reserve an intimate table, window seat, or group dining lounge at Country Coffees in Sector 2, Kolkata.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Confirmation Screen */}
        {confirmedReservation ? (
          <div className="bg-white rounded-3xl border border-[#E6DCD1] p-6 sm:p-10 shadow-lg animate-in zoom-in-95 duration-200">
            <div className="text-center max-w-md mx-auto mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A6F] block mb-1">
                Booking ID: {confirmedReservation.id}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1412] mb-2">
                Reservation Confirmed!
              </h2>
              <p className="text-xs text-[#5C4C43]">
                A table has been allocated for you at Country Coffees. We hold tables for up to 15 minutes past reservation time.
              </p>
            </div>

            {/* Booking Summary Card */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#E6DCD1] p-6 space-y-4 mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#E6DCD1] text-xs">
                <div>
                  <span className="text-[#8A796E] block mb-1">Date</span>
                  <span className="font-bold text-[#1A1412] text-sm">
                    {new Date(confirmedReservation.date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A796E] block mb-1">Time</span>
                  <span className="font-bold text-[#1A1412] text-sm">
                    {confirmedReservation.time}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A796E] block mb-1">Party Size</span>
                  <span className="font-bold text-[#1A1412] text-sm">
                    {confirmedReservation.guests} Guests
                  </span>
                </div>
                <div>
                  <span className="text-[#8A796E] block mb-1">Assigned Table</span>
                  <span className="font-bold text-[#1A1412] text-sm">
                    {confirmedReservation.tableNumber || confirmedReservation.seatingPreference}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#5C4C43]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C59A6F] shrink-0 mt-0.5" />
                  <span>39, Plot No. 39, BK Block, Sector 2, Bidhannagar, Kolkata, West Bengal 700091</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C59A6F] shrink-0" />
                  <span>Helpline: +91 70032 39518</span>
                </div>
                {confirmedReservation.specialRequest && (
                  <div className="pt-2 text-[11px] text-[#705E53] italic">
                    Special request noted: "{confirmedReservation.specialRequest}"
                  </div>
                )}
              </div>
            </div>

            {/* Supabase Cloud Sync Status */}
            {confirmedReservation.supabaseSynced ? (
              <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Saved to Supabase Backend Tables</span>
                    <span className="text-[11px] text-emerald-700">
                      Project: <code className="font-mono">{SUPABASE_PROJECT_ID}</code> · Table: <code className="font-mono">reservations</code>
                    </span>
                  </div>
                </div>
                <span className="self-start sm:self-center text-[10px] font-bold px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-full">
                  ✓ Database Synced Live
                </span>
              </div>
            ) : (
              <div className="mb-8 p-4 rounded-2xl bg-[#FAF7F2] border border-[#C59A6F]/60 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[#1A1412]">
                    <Database className="w-4 h-4 text-[#C59A6F] shrink-0" />
                    <div>
                      <span className="font-bold block">Supabase Backend Integration</span>
                      <span className="text-[11px] text-[#705E53]">
                        Target project: <code className="font-mono text-[#1A1412] font-semibold">{SUPABASE_PROJECT_ID}</code>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="self-start sm:self-auto px-3.5 py-1.5 bg-[#1A1412] text-[#FAF7F2] text-[11px] font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:bg-[#2A221E] transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#C59A6F] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing to Supabase...' : 'Sync to Supabase'}</span>
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DCD1] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1A1412]">
                      Need to create the "reservations" table in your Supabase dashboard?
                    </span>
                    <button
                      onClick={handleCopySql}
                      className="text-[11px] text-[#C59A6F] hover:text-[#1A1412] font-bold flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                    >
                      {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{sqlCopied ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-[#705E53] leading-relaxed">
                    Paste this into your Supabase <strong>SQL Editor</strong> and click "Run", then click "Sync to Supabase" to push this booking.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleAddToCalendar}
                className="px-5 py-3 bg-[#1A1412] text-[#FAF7F2] hover:bg-[#2A221E] text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-[#C59A6F]" />
                <span>Add to Google Calendar</span>
              </button>

              <a
                href="https://maps.app.goo.gl/RmJhTSJmnQSguXkj7"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#FAF7F2] border border-[#1A1412] text-[#1A1412] hover:bg-[#1A1412] hover:text-[#FAF7F2] text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#C59A6F]" />
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setConfirmedReservation(null);
                }}
                className="px-5 py-3 text-xs text-[#705E53] hover:text-[#1A1412] font-medium"
              >
                Book Another Table
              </button>

              <button
                onClick={() => setActivePage('account')}
                className="px-5 py-3 text-xs text-[#C59A6F] hover:underline font-bold"
              >
                View in My Account →
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Form */
          <div className="bg-white rounded-3xl border border-[#E6DCD1] p-6 sm:p-10 shadow-xs">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-800">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-0.5">Table Slot Unavailable</h4>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Dining Date, Time & Party */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#E6DCD1] pb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#C59A6F]" />
                  <span>1. Schedule & Guests</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date Picker */}
                  <div>
                    <label htmlFor="res-date" className="block text-xs font-semibold text-[#1A1412] mb-1">
                      Date
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      required
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>

                  {/* Time Selector */}
                  <div>
                    <label htmlFor="res-time" className="block text-xs font-semibold text-[#1A1412] mb-1">
                      Time Slot
                    </label>
                    <select
                      id="res-time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot} ({parseInt(slot.split(':')[0]) >= 12 ? 'PM' : 'AM'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guests */}
                  <div>
                    <label htmlFor="res-guests" className="block text-xs font-semibold text-[#1A1412] mb-1">
                      Number of Guests
                    </label>
                    <select
                      id="res-guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Seating Preference */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#E6DCD1] pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C59A6F]" />
                  <span>2. Seating Preference</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {seatingOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setSeatingPreference(opt)}
                      className={`p-3 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                        seatingPreference === opt
                          ? 'border-[#C59A6F] bg-[#C59A6F]/15 text-[#1A1412] font-bold shadow-xs'
                          : 'border-[#E6DCD1] bg-[#FAF7F2] text-[#5C4C43] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Guest Information */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1412] border-b border-[#E6DCD1] pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C59A6F]" />
                  <span>3. Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="res-name" className="block text-xs font-semibold text-[#1A1412] mb-1">
                      Full Name
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Suman Roy"
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-phone" className="block text-xs font-semibold text-[#1A1412] mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98300 12345"
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-email" className="block text-xs font-semibold text-[#1A1412] mb-1">
                      Email Address
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. suman.roy@example.com"
                      className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="res-notes" className="block text-xs font-semibold text-[#1A1412] mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="res-notes"
                    rows={2}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Celebrating a birthday, quiet corner for business meeting, high chair needed..."
                    className="w-full text-xs p-3 rounded-xl border border-[#E6DCD1] bg-[#FAF7F2] text-[#1A1412] focus:outline-none focus:border-[#C59A6F] resize-none"
                  />
                </div>
              </div>

              {/* Supabase Backend Integration Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1] text-xs gap-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#C59A6F] shrink-0" />
                  <span className="text-[#1A1412] font-medium text-[11px]">
                    Connected to Supabase Project: <code className="font-mono font-bold text-[#1A1412]">{SUPABASE_PROJECT_ID}</code>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Supabase Active
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#E6DCD1] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#705E53]">
                  <span>Tables held for 15 mins</span>
                  <span className="mx-2">·</span>
                  <span>Free cancellation anytime</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1412] hover:bg-[#2A221E] text-[#FAF7F2] font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Checking Availability...' : 'Confirm Table Reservation'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
