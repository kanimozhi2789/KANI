import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from 'react';
import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import {
  BUSINESS_CONTACT,
  FLEET_VEHICLES,
  POPULAR_CITIES,
  buildWhatsAppUrl,
  estimateTripFare,
  type JourneyType,
} from '../data/travelData';

export interface BookingPrefill {
  pickup?: string;
  drop?: string;
  vehicleType?: string;
  passengers?: number;
  journeyType?: JourneyType;
  signal: number;
}

interface BookingFormProps {
  prefill: BookingPrefill;
}

interface ConfirmedBooking {
  referenceId: string;
  pickup: string;
  drop: string;
  journeyType: JourneyType;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  vehicleType: string;
  estimatedFare?: number;
  distanceKm?: number | null;
  customerName: string;
  mobile: string;
}

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function BookingForm({ prefill }: BookingFormProps) {
  const today = useMemo(() => getTodayDateString(), []);

  const [journeyType, setJourneyType] = useState<JourneyType>('One Way');
  const [pickup, setPickup] = useState('Chennai');
  const [drop, setDrop] = useState('Bengaluru');
  const [pickupDate, setPickupDate] = useState(today);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [passengers, setPassengers] = useState<number>(3);
  const [vehicleType, setVehicleType] = useState<string>('Sedan');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    if (prefill.signal === 0) return;
    setConfirmed(null);
    if (prefill.pickup) setPickup(prefill.pickup);
    if (prefill.drop) setDrop(prefill.drop);
    if (prefill.vehicleType) setVehicleType(prefill.vehicleType);
    if (prefill.passengers) setPassengers(prefill.passengers);
    if (prefill.journeyType) setJourneyType(prefill.journeyType);
  }, [prefill]);

  const selectedVehicle = useMemo(
    () => FLEET_VEHICLES.find((v) => v.name === vehicleType) ?? FLEET_VEHICLES[0],
    [vehicleType]
  );

  const fareEstimate = useMemo(
    () =>
      estimateTripFare({
        pickup,
        drop,
        journeyType,
        vehicle: selectedVehicle,
      }),
    [pickup, drop, journeyType, selectedVehicle]
  );

  const activeRate = fareEstimate.perKmRate;

  const liveWhatsAppUrl = useMemo(
    () =>
      buildWhatsAppUrl({
        referenceId: confirmed?.referenceId,
        journeyType,
        pickup,
        drop,
        pickupDate,
        pickupTime,
        passengers,
        vehicleType,
        estimatedFare: confirmed?.estimatedFare ?? fareEstimate.estimatedTotal,
        customerName,
        mobile,
      }),
    [
      confirmed?.referenceId,
      confirmed?.estimatedFare,
      journeyType,
      pickup,
      drop,
      pickupDate,
      pickupTime,
      passengers,
      vehicleType,
      fareEstimate.estimatedTotal,
      customerName,
      mobile,
    ]
  );

  const handleSwapLocations = () => {
    setPickup(drop);
    setDrop(pickup);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pickup;
      delete next.drop;
      return next;
    });
  };

  const validateFields = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (pickup.trim().length < 2) {
      nextErrors.pickup = 'Enter pickup city or landmark';
    }
    if (drop.trim().length < 2) {
      nextErrors.drop = 'Enter drop city or landmark';
    }
    if (
      pickup.trim().length >= 2 &&
      drop.trim().length >= 2 &&
      pickup.trim().toLowerCase() === drop.trim().toLowerCase()
    ) {
      nextErrors.drop = 'Drop location must differ from pickup';
    }
    if (!pickupDate) {
      nextErrors.pickupDate = 'Select pickup date';
    } else if (pickupDate < today) {
      nextErrors.pickupDate = 'Pickup date cannot be in the past';
    }
    if (!pickupTime) {
      nextErrors.pickupTime = 'Select pickup time';
    }
    if (customerName.trim().length < 2) {
      nextErrors.customerName = 'Enter your full name';
    }

    const digitsOnly = mobile.replace(/\D/g, '');
    const normalizedMobile =
      digitsOnly.length > 10 && digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;
    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      nextErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup: pickup.trim(),
          drop: drop.trim(),
          journeyType,
          pickupDate,
          pickupTime,
          passengers,
          vehicleType,
          estimatedFare: fareEstimate.estimatedTotal,
          distanceKm: fareEstimate.oneWayDistanceKm,
          customerName: customerName.trim(),
          mobile: mobile.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setServerError(data.message || 'Unable to submit booking right now.');
        return;
      }

      setConfirmed(data.booking);
    } catch {
      setServerError(
        'Network issue submitting online. You can still send your enquiry directly via WhatsApp or call 8248028734.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsAppClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!validateFields()) {
      e.preventDefault();
    }
  };

  if (confirmed) {
    const confirmedWhatsAppUrl = buildWhatsAppUrl(confirmed);
    return (
      <div
        id="booking-form"
        className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-7 text-slate-900"
      >
        <div className="flex items-start gap-3 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Enquiry Registered
            </p>
            <h2 className="font-display text-xl font-bold text-[#0B1E3D] mt-0.5">
              Booking Ref: <span className="tabular-nums">{confirmed.referenceId}</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Our dispatch team will call <span className="font-medium tabular-nums">{confirmed.mobile}</span> within 15 minutes with chauffeur details.
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 py-5 text-sm border-b border-slate-100">
          <div>
            <dt className="text-slate-500 text-xs">Journey</dt>
            <dd className="font-semibold text-slate-900">{confirmed.journeyType}</dd>
          </div>
          <div>
            <dt className="text-slate-500 text-xs">Vehicle &amp; Guests</dt>
            <dd className="font-semibold text-slate-900">
              {confirmed.vehicleType} · {confirmed.passengers}{' '}
              {confirmed.passengers === 1 ? 'Guest' : 'Guests'}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-slate-500 text-xs">Route</dt>
            <dd className="font-semibold text-slate-900">
              {confirmed.pickup} → {confirmed.drop}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 text-xs">Pickup Schedule</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">
              {confirmed.pickupDate} · {confirmed.pickupTime}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 text-xs">Passenger Name</dt>
            <dd className="font-semibold text-slate-900 truncate">{confirmed.customerName}</dd>
          </div>
          {confirmed.estimatedFare && (
            <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <dt className="text-slate-600 text-xs font-medium">
                Estimated {confirmed.journeyType} Fare{' '}
                {confirmed.distanceKm ? `(~${confirmed.distanceKm} km)` : ''}
              </dt>
              <dd className="font-display text-lg font-extrabold text-[#0B1E3D] tabular-nums">
                ₹{confirmed.estimatedFare.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500">+ tolls</span>
              </dd>
            </div>
          )}
        </dl>

        <div className="pt-5 space-y-3">
          <a
            href={confirmedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Send Booking on WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={BUSINESS_CONTACT.telHref}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0B1E3D] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="tabular-nums">{BUSINESS_CONTACT.phoneDisplay}</span>
            </a>
            <button
              type="button"
              onClick={() => setConfirmed(null)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              New Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="booking-form"
      className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-7 text-slate-900"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#0B1E3D]">
            Book Your Outstation Cab
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant fare lock · ₹<span className="tabular-nums">{activeRate}</span>/km for{' '}
            {selectedVehicle.name}
          </p>
        </div>
        <span className="text-xs font-semibold text-blue-700 tabular-nums whitespace-nowrap">
          24/7 Dispatch
        </span>
      </div>

      {/* Journey Type Segmented Tabs */}
      <div
        role="tablist"
        aria-label="Journey type"
        className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-4"
      >
        {(['One Way', 'Round Trip', 'Airport Transfer'] as JourneyType[]).map((type) => {
          const isActive = journeyType === type;
          return (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setJourneyType(type)}
              className={`py-2 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap truncate ${
                isActive
                  ? 'bg-[#0B1E3D] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <datalist id="city-suggestions">
          {POPULAR_CITIES.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>

        {/* Pickup & Drop Locations */}
        <div className="relative space-y-3">
          <div>
            <label htmlFor="pickup-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Pickup Location
            </label>
            <div className="relative">
              <MapPin
                className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="pickup-input"
                type="text"
                list="city-suggestions"
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  if (errors.pickup) setErrors((p) => ({ ...p, pickup: '' }));
                }}
                placeholder="e.g., Chennai or MAA Airport"
                aria-invalid={Boolean(errors.pickup)}
                className={`w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.pickup ? 'border-red-500' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.pickup && <p className="text-xs text-red-600 mt-1">{errors.pickup}</p>}
          </div>

          <button
            type="button"
            onClick={handleSwapLocations}
            aria-label="Swap pickup and drop locations"
            title="Swap locations"
            className="absolute right-3 top-[52%] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <div>
            <label htmlFor="drop-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Drop Location
            </label>
            <div className="relative">
              <MapPin
                className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="drop-input"
                type="text"
                list="city-suggestions"
                value={drop}
                onChange={(e) => {
                  setDrop(e.target.value);
                  if (errors.drop) setErrors((p) => ({ ...p, drop: '' }));
                }}
                placeholder="e.g., Bengaluru or Pondicherry"
                aria-invalid={Boolean(errors.drop)}
                className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                  errors.drop ? 'border-red-500' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.drop && <p className="text-xs text-red-600 mt-1">{errors.drop}</p>}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Pickup Date
            </label>
            <div className="relative">
              <Calendar
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="date-input"
                type="date"
                min={today}
                value={pickupDate}
                onChange={(e) => {
                  setPickupDate(e.target.value);
                  if (errors.pickupDate) setErrors((p) => ({ ...p, pickupDate: '' }));
                }}
                aria-invalid={Boolean(errors.pickupDate)}
                className={`w-full pl-9 pr-2.5 py-2.5 text-sm rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 tabular-nums ${
                  errors.pickupDate ? 'border-red-500' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.pickupDate && <p className="text-xs text-red-600 mt-1">{errors.pickupDate}</p>}
          </div>

          <div>
            <label htmlFor="time-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Pickup Time
            </label>
            <div className="relative">
              <Clock
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="time-input"
                type="time"
                value={pickupTime}
                onChange={(e) => {
                  setPickupTime(e.target.value);
                  if (errors.pickupTime) setErrors((p) => ({ ...p, pickupTime: '' }));
                }}
                aria-invalid={Boolean(errors.pickupTime)}
                className={`w-full pl-9 pr-2.5 py-2.5 text-sm rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 tabular-nums ${
                  errors.pickupTime ? 'border-red-500' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.pickupTime && <p className="text-xs text-red-600 mt-1">{errors.pickupTime}</p>}
          </div>
        </div>

        {/* Passengers & Vehicle Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="passengers-select"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Passengers
            </label>
            <div className="relative">
              <Users
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="passengers-select"
                value={passengers}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setPassengers(count);
                  if (count > 7 && vehicleType !== 'Tempo Traveller') {
                    setVehicleType('Tempo Traveller');
                  } else if (count > 4 && vehicleType === 'Sedan') {
                    setVehicleType('SUV');
                  }
                }}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 tabular-nums"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="vehicle-select"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Cab Category
            </label>
            <select
              id="vehicle-select"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {FLEET_VEHICLES.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} (₹{journeyType === 'Round Trip' ? v.roundTripRate : v.oneWayRate}/km)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="name-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Your Name
            </label>
            <div className="relative">
              <User
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="name-input"
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors((p) => ({ ...p, customerName: '' }));
                }}
                placeholder="Full name"
                aria-invalid={Boolean(errors.customerName)}
                className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.customerName ? 'border-red-500' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.customerName && (
              <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label htmlFor="mobile-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="mobile-input"
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (errors.mobile) setErrors((p) => ({ ...p, mobile: '' }));
                }}
                placeholder="10-digit mobile"
                aria-invalid={Boolean(errors.mobile)}
                className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 tabular-nums ${
                  errors.mobile ? 'border-red-500' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
          </div>
        </div>

        {serverError && (
          <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </p>
        )}

        {/* Live Estimated Drop Fare Summary */}
        <div
          aria-live="polite"
          className="rounded-xl bg-blue-50/80 border border-blue-200 px-4 py-3 flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#0B1E3D]">
              {fareEstimate.isCustomRoute
                ? `Minimum ${journeyType} Drop Fare`
                : `Estimated ${journeyType} Fare`}
            </div>
            <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
              {fareEstimate.isCustomRoute ? (
                <span>
                  {fareEstimate.billableKm} km min × ₹{fareEstimate.perKmRate}/km
                  {fareEstimate.driverAllowance > 0
                    ? ` + ₹${fareEstimate.driverAllowance} batta`
                    : ''}
                </span>
              ) : (
                <span>
                  ~{fareEstimate.billableKm} km × ₹{fareEstimate.perKmRate}/km
                  {fareEstimate.driverAllowance > 0
                    ? ` + ₹${fareEstimate.driverAllowance} batta`
                    : ''}
                  {fareEstimate.minBillingApplied ? ' (min km)' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1E3D] tabular-nums leading-none">
              ₹{fareEstimate.estimatedTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tolls &amp; permits extra</div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-1 space-y-2.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 rounded-xl shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
          >
            {isSubmitting ? 'Confirming Booking...' : 'Confirm Cab Booking'}
          </button>

          <a
            href={liveWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDirectWhatsAppClick}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-[#0B1E3D] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Submit Enquiry on WhatsApp</span>
          </a>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
          <span>No advance payment required · Instant confirmation</span>
        </p>
      </form>
    </div>
  );
}
