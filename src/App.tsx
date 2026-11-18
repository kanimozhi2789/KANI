import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BookingForm, type BookingPrefill } from './components/BookingForm';
import { FloatingContact } from './components/FloatingContact';
import { ResilientImage } from './components/ResilientImage';
import {
  BUSINESS_CONTACT,
  CUSTOMER_REVIEWS,
  FAQS,
  FLEET_VEHICLES,
  HERO_IMAGE,
  POPULAR_ROUTES,
  SERVICES,
  WHY_CHOOSE_US,
  estimateTripFare,
  type FleetCategory,
  type PopularRoute,
  type VehicleOption,
} from './data/travelData';

type RouteFilter = 'All' | PopularRoute['corridor'];

export default function App() {
  const [fleetFilter, setFleetFilter] = useState<FleetCategory>('All');
  const [routeFilter, setRouteFilter] = useState<RouteFilter>('All');
  const [openFaqId, setOpenFaqId] = useState<string>(FAQS[0].id);
  const [prefill, setPrefill] = useState<BookingPrefill>({ signal: 0 });

  const filteredFleet = useMemo(() => {
    if (fleetFilter === 'All') return FLEET_VEHICLES;
    return FLEET_VEHICLES.filter((vehicle) => vehicle.category === fleetFilter);
  }, [fleetFilter]);

  const filteredRoutes = useMemo(() => {
    if (routeFilter === 'All') return POPULAR_ROUTES;
    return POPULAR_ROUTES.filter((route) => route.corridor === routeFilter);
  }, [routeFilter]);

  const scrollToBooking = () => {
    const el = document.getElementById('booking-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectVehicle = (vehicle: VehicleOption) => {
    setPrefill((prev) => ({
      vehicleType: vehicle.name,
      passengers: Math.min(vehicle.seats, 4),
      signal: prev.signal + 1,
    }));
    scrollToBooking();
  };

  const handleSelectRoute = (route: PopularRoute) => {
    setPrefill((prev) => ({
      pickup: route.from,
      drop: route.to,
      journeyType: 'One Way',
      vehicleType: 'Sedan',
      signal: prev.signal + 1,
    }));
    scrollToBooking();
  };

  const whatsAppQuickHref = `https://wa.me/${BUSINESS_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    'Hi HAPPYTRAVELS, I would like to book an outstation taxi.'
  )}`;

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-[#0B1E3D] text-white overflow-hidden">
          <div className="absolute inset-0">
            <ResilientImage
              src={HERO_IMAGE}
              alt="HAPPYTRAVELS sedan cruising along a coastal expressway at golden hour"
              className="w-full h-full object-cover opacity-35"
              fallbackLabel="HAPPYTRAVELS Outstation Highway Service"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0B1E3D]/95 via-[#0B1E3D]/85 to-[#0B1E3D]/70"
              aria-hidden="true"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Proposition */}
              <div className="lg:col-span-6 space-y-6">
                <p className="text-sm font-semibold text-orange-400 tracking-wide">
                  One-Way Drop Taxi · Round Trips · Airport Transfers
                </p>

                <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-balance">
                  Outstation Cabs Without Return-Fare Surprises.
                </h1>

                <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed">
                  Travel comfortably across Tamil Nadu, Karnataka, Andhra Pradesh, and Kerala with
                  HAPPYTRAVELS. Pay strictly for one-way kilometers on intercity drops, backed by
                  verified chauffeurs and 24/7 dispatch support.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <a
                    href="#fleet"
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1E3D] focus-visible:ring-orange-400"
                  >
                    <span>Explore Fleet &amp; Fares</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>

                  <a
                    href={BUSINESS_CONTACT.telHref}
                    className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
                    <span className="tabular-nums">24/7 Desk: {BUSINESS_CONTACT.phoneDisplay}</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                  <span>Starting at ₹14/km Sedan</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero Hidden Return Charges</span>
                  <span aria-hidden="true">·</span>
                  <span>Chennai · Bengaluru · Coimbatore · Madurai</span>
                </div>
              </div>

              {/* Right Column: Prominent Taxi Booking Form */}
              <div className="lg:col-span-6">
                <BookingForm prefill={prefill} />
              </div>
            </div>
          </div>
        </section>

        {/* OPERATIONAL PROOF STRIP */}
        <section className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {WHY_CHOOSE_US.map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1E3D] tabular-nums">
                    {item.metric}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FLEET SECTION */}
        <section id="fleet" className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-orange-600 mb-2">Our Vehicle Fleet</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1E3D] tracking-tight text-balance">
                  Clean, Air-Conditioned Cabs for Every Group Size
                </h2>
                <p className="text-slate-600 mt-3 text-base leading-relaxed">
                  Select a Sedan for solo highway trips, an SUV or Toyota Innova for family travel,
                  or a 12-seater Tempo Traveller for group tours.
                </p>
              </div>

              {/* Interactive Filter Tabs */}
              <div
                role="tablist"
                aria-label="Filter fleet by vehicle size"
                className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto"
              >
                {(['All', '4-Seater', '6-7 Seater', 'Group Van'] as FleetCategory[]).map((cat) => {
                  const active = fleetFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFleetFilter(cat)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-white text-[#0B1E3D] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFleet.map((vehicle) => (
                <article
                  key={vehicle.id}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <ResilientImage
                      src={vehicle.image}
                      alt={`${vehicle.name} (${vehicle.models})`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      fallbackLabel={vehicle.name}
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2.5">
                      <div>
                        <h3 className="font-display text-xl font-bold text-[#0B1E3D]">
                          {vehicle.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{vehicle.models}</p>
                      </div>

                      {/* Unboxed metadata with typographic separators */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-600">
                        <span className="tabular-nums">{vehicle.seats} Passengers</span>
                        <span aria-hidden="true">·</span>
                        <span>{vehicle.luggage}</span>
                        <span aria-hidden="true">·</span>
                        <span>{vehicle.acType}</span>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed">{vehicle.highlight}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="block text-xs text-slate-500">One-Way</span>
                          <span className="font-display text-lg font-bold text-[#0B1E3D] tabular-nums">
                            ₹{vehicle.oneWayRate}
                            <span className="text-xs font-normal text-slate-500">/km</span>
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-500">Round Trip</span>
                          <span className="font-display text-lg font-bold text-blue-700 tabular-nums">
                            ₹{vehicle.roundTripRate}
                            <span className="text-xs font-normal text-slate-500">/km</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 tabular-nums">
                        Driver Batta: ₹{vehicle.driverAllowance}/day
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectVehicle(vehicle)}
                        className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#0B1E3D] hover:bg-orange-500 rounded-xl transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      >
                        Select &amp; Book {vehicle.name}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* OUR SERVICES & WHY CHOOSE US */}
        <section id="services" className="py-16 lg:py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-semibold text-orange-600 mb-2">Our Services</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1E3D] tracking-tight text-balance">
                Built for Punctual Highway &amp; Airport Mobility
              </h2>
              <p className="text-slate-600 mt-3 text-base leading-relaxed">
                Whether you need a single-direction intercity drop or a multi-day family tour,
                HAPPYTRAVELS keeps pricing simple and pickups on schedule.
              </p>
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <div
                  key={service.number}
                  className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between ${
                    service.featured
                      ? 'md:col-span-2 bg-[#0B1E3D] text-white border-[#0B1E3D]'
                      : 'bg-white text-slate-900 border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <span
                      className={`font-display text-sm font-bold tabular-nums ${
                        service.featured ? 'text-orange-400' : 'text-blue-700'
                      }`}
                    >
                      {service.number}.
                    </span>
                    <h3
                      className={`font-display text-xl sm:text-2xl font-bold ${
                        service.featured ? 'text-white' : 'text-[#0B1E3D]'
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        service.featured ? 'text-slate-200 max-w-xl' : 'text-slate-600'
                      }`}
                    >
                      {service.summary}
                    </p>
                  </div>

                  <ul className="mt-6 pt-5 border-t border-current/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2">
                        <Check
                          className={`w-4 h-4 shrink-0 ${
                            service.featured ? 'text-orange-400' : 'text-blue-700'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Dedicated Why Choose Us Dispatch Card */}
              <div className="md:col-span-3 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-700 mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#0B1E3D]">
                        Sanitized, Well-Serviced Fleet
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Every cab undergoes brake, AC, and tire inspection before highway dispatch.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#0B1E3D]">
                        On-Time Pickup Guarantee
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Chauffeurs arrive 15 minutes before scheduled departure at your doorstep.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Headphones className="w-5 h-5 text-blue-700 mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#0B1E3D]">
                        Direct Human Coordinator
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Call {BUSINESS_CONTACT.phoneDisplay} anytime for live trip tracking or route changes.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href={BUSINESS_CONTACT.telHref}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">Call {BUSINESS_CONTACT.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR ROUTES */}
        <section id="routes" className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-orange-600 mb-2">Popular Corridors</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1E3D] tracking-tight text-balance">
                  Estimated One-Way Drop Fares
                </h2>
                <p className="text-slate-600 mt-3 text-base leading-relaxed">
                  Click any route below to pre-fill your booking form with instant one-way pricing.
                  Tolls and state permits apply at actuals.
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Filter popular routes by region"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto"
              >
                {(['All', 'Chennai Hub', 'Bengaluru Hub', 'Tamil Nadu & Hills'] as RouteFilter[]).map(
                  (tab) => {
                    const active = routeFilter === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setRouteFilter(tab)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-white text-[#0B1E3D] shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredRoutes.map((route) => {
                const sedanVehicle = FLEET_VEHICLES[0];
                const suvVehicle = FLEET_VEHICLES[1];
                const sedanEst = estimateTripFare({
                  pickup: route.from,
                  drop: route.to,
                  journeyType: 'One Way',
                  vehicle: sedanVehicle,
                }).estimatedTotal;
                const suvEst = estimateTripFare({
                  pickup: route.from,
                  drop: route.to,
                  journeyType: 'One Way',
                  vehicle: suvVehicle,
                }).estimatedTotal;

                return (
                  <div
                    key={route.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-300 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{route.corridor}</span>
                        <span className="tabular-nums">
                          {route.distanceKm} km · {route.duration}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-[#0B1E3D] flex items-center gap-2">
                        <span>{route.from}</span>
                        <ArrowRight className="w-4 h-4 text-orange-500 shrink-0" aria-hidden="true" />
                        <span>{route.to}</span>
                      </h3>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-sm">
                        <div>
                          <span className="block text-xs text-slate-500">Sedan Drop Fare</span>
                          <span className="font-display font-bold text-[#0B1E3D] tabular-nums">
                            ₹{sedanEst.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-500">SUV Drop Fare</span>
                          <span className="font-display font-bold text-blue-700 tabular-nums">
                            ₹{suvEst.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Includes driver batta · Tolls extra
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectRoute(route)}
                      className="mt-4 w-full py-2.5 px-4 text-xs font-bold text-[#0B1E3D] bg-slate-100 hover:bg-orange-500 hover:text-white rounded-xl transition-colors whitespace-nowrap"
                    >
                      Book {route.from} → {route.to}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section id="reviews" className="py-16 lg:py-24 bg-[#0B1E3D] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-orange-400 mb-2">Customer Reviews</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                  Trusted by Families, Flyers &amp; Corporate Travellers
                </h2>
              </div>
              <p className="text-sm text-slate-300 tabular-nums">
                4.9 / 5 Average Rating · Verified Intercity Trips
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CUSTOMER_REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="bg-white/5 border border-white/15 rounded-2xl p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-orange-400" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">“{review.quote}”</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-1">
                    <div className="font-display text-sm font-bold text-white">
                      {review.customerName}
                    </div>
                    <div className="text-xs text-slate-300">
                      {review.route} · {review.vehicle}
                    </div>
                    <div className="text-xs text-slate-400">{review.travelMonth}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm font-semibold text-orange-600 mb-2">Frequently Asked Questions</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1E3D] tracking-tight text-balance">
                Clear Answers Before You Ride
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
                    >
                      <span className="font-display text-base font-semibold text-[#0B1E3D]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-orange-500' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0B1E3D] text-slate-300 border-t border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
            <div className="space-y-3">
              <a
                href="#top"
                className="font-display text-xl font-extrabold tracking-tight text-white inline-block"
              >
                HAPPY<span className="text-orange-500">TRAVELS</span>
              </a>
              <p className="text-sm text-slate-300 leading-relaxed">
                Reliable one-way drop taxi, round-trip outstation cabs, and 24/7 airport transfer
                service across South India.
              </p>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-white mb-4">Quick Navigation</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#booking-form" className="hover:text-orange-400 transition-colors">
                    Book a Cab
                  </a>
                </li>
                <li>
                  <a href="#fleet" className="hover:text-orange-400 transition-colors">
                    Fleet &amp; Tariff
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-orange-400 transition-colors">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#routes" className="hover:text-orange-400 transition-colors">
                    Popular Routes
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-orange-400 transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-white mb-4">Service Hubs</h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
                  <span>Chennai &amp; Airport (MAA)</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
                  <span>Bengaluru &amp; Airport (BLR)</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
                  <span>Coimbatore, Trichy &amp; Madurai</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
                  <span>Pondicherry, Tirupati &amp; Ooty</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold text-white mb-4">24/7 Dispatch Desk</h3>
              <a
                href={BUSINESS_CONTACT.telHref}
                className="flex items-center gap-2.5 text-base font-bold text-white hover:text-orange-400 transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
                <span>{BUSINESS_CONTACT.phoneDisplay}</span>
              </a>
              <a
                href={whatsAppQuickHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>WhatsApp Booking Support</span>
              </a>
              <a
                href={`mailto:${BUSINESS_CONTACT.email}`}
                className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                <span>{BUSINESS_CONTACT.email}</span>
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} HAPPYTRAVELS. All rights reserved.</p>
            <p>24/7 Outstation &amp; One-Way Drop Taxi Service · Helpline {BUSINESS_CONTACT.phoneDisplay}</p>
          </div>
        </div>
      </footer>

      <FloatingContact />
    </div>
  );
}
