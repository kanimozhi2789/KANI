export type JourneyType = 'One Way' | 'Round Trip' | 'Airport Transfer';

export type FleetCategory = 'All' | '4-Seater' | '6-7 Seater' | 'Group Van';

export interface VehicleOption {
  id: string;
  name: string;
  models: string;
  category: Exclude<FleetCategory, 'All'>;
  seats: number;
  luggage: string;
  oneWayRate: number;
  roundTripRate: number;
  driverAllowance: number;
  acType: string;
  image: string;
  highlight: string;
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  duration: string;
  sedanFare: number;
  suvFare: number;
  corridor: 'Chennai Hub' | 'Bengaluru Hub' | 'Tamil Nadu & Hills';
}

export interface ServiceItem {
  number: string;
  title: string;
  summary: string;
  details: string[];
  featured?: boolean;
}

export interface WhyChooseItem {
  title: string;
  description: string;
  metric: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  route: string;
  vehicle: string;
  rating: number;
  quote: string;
  travelMonth: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const BUSINESS_CONTACT = {
  name: 'HAPPYTRAVELS',
  phoneDisplay: '8248028734',
  phoneFormatted: '+91 82480 28734',
  telHref: 'tel:+918248028734',
  whatsappNumber: '918248028734',
  email: 'bookings@happytravels.in',
  headquarters: 'Chennai · Bengaluru · Coimbatore · Madurai',
};

export const HERO_IMAGE = '/src/assets/images/hero_highway_cab_1794988452475.jpg';

export const FLEET_VEHICLES: VehicleOption[] = [
  {
    id: 'sedan',
    name: 'Sedan',
    models: 'Swift Dzire · Toyota Etios · Aura',
    category: '4-Seater',
    seats: 4,
    luggage: '2 Large Bags',
    oneWayRate: 14,
    roundTripRate: 13,
    driverAllowance: 300,
    acType: 'Climate Control AC',
    image: '/src/assets/images/fleet_sedan_1794988452412.jpg',
    highlight: 'Most booked for solo and couple intercity drops',
  },
  {
    id: 'suv',
    name: 'SUV',
    models: 'Maruti Ertiga · Mahindra Marazzo',
    category: '6-7 Seater',
    seats: 7,
    luggage: '4 Large Bags',
    oneWayRate: 18,
    roundTripRate: 17,
    driverAllowance: 400,
    acType: 'Dual-Zone Rear AC',
    image: '/src/assets/images/fleet_suv_1794988453237.jpg',
    highlight: 'Spacious legroom for family trips and pilgrimage routes',
  },
  {
    id: 'innova',
    name: 'Innova',
    models: 'Toyota Innova · Innova Crysta',
    category: '6-7 Seater',
    seats: 7,
    luggage: '5 Large Bags',
    oneWayRate: 20,
    roundTripRate: 19,
    driverAllowance: 450,
    acType: 'Captain Seats · Dual AC',
    image: '/src/assets/images/fleet_innova_1794988454276.jpg',
    highlight: 'Executive comfort for highway business travel and hills',
  },
  {
    id: 'tempo-traveller',
    name: 'Tempo Traveller',
    models: 'Force Traveller 12-Seater',
    category: 'Group Van',
    seats: 12,
    luggage: '10+ Suitcases',
    oneWayRate: 26,
    roundTripRate: 24,
    driverAllowance: 600,
    acType: 'Full Cabin Pushback AC',
    image: '/src/assets/images/fleet_tempo_1794988453876.jpg',
    highlight: 'Built for wedding guests, team offsites, and hill stations',
  },
];

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'chn-blr',
    from: 'Chennai',
    to: 'Bengaluru',
    distanceKm: 346,
    duration: '6h 15m',
    sedanFare: 4844,
    suvFare: 6228,
    corridor: 'Chennai Hub',
  },
  {
    id: 'chn-pondy',
    from: 'Chennai',
    to: 'Pondicherry',
    distanceKm: 155,
    duration: '3h 10m',
    sedanFare: 2170,
    suvFare: 2790,
    corridor: 'Chennai Hub',
  },
  {
    id: 'chn-tpty',
    from: 'Chennai',
    to: 'Tirupati',
    distanceKm: 138,
    duration: '3h 20m',
    sedanFare: 1932,
    suvFare: 2484,
    corridor: 'Chennai Hub',
  },
  {
    id: 'chn-mdu',
    from: 'Chennai',
    to: 'Madurai',
    distanceKm: 462,
    duration: '7h 45m',
    sedanFare: 6468,
    suvFare: 8316,
    corridor: 'Tamil Nadu & Hills',
  },
  {
    id: 'blr-mys',
    from: 'Bengaluru',
    to: 'Mysuru',
    distanceKm: 145,
    duration: '2h 50m',
    sedanFare: 2030,
    suvFare: 2610,
    corridor: 'Bengaluru Hub',
  },
  {
    id: 'blr-chn',
    from: 'Bengaluru',
    to: 'Chennai',
    distanceKm: 346,
    duration: '6h 15m',
    sedanFare: 4844,
    suvFare: 6228,
    corridor: 'Bengaluru Hub',
  },
  {
    id: 'cbe-ooty',
    from: 'Coimbatore',
    to: 'Ooty',
    distanceKm: 88,
    duration: '2h 45m',
    sedanFare: 1550,
    suvFare: 2100,
    corridor: 'Tamil Nadu & Hills',
  },
  {
    id: 'try-chn',
    from: 'Trichy',
    to: 'Chennai',
    distanceKm: 332,
    duration: '5h 40m',
    sedanFare: 4648,
    suvFare: 5976,
    corridor: 'Tamil Nadu & Hills',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'One-Way Drop Taxi',
    summary:
      'Pay strictly for the distance travelled from pickup to drop. Never pay return-empty kilometer charges when travelling between cities.',
    details: ['Zero return fare penalty', 'Minimum 130 km billing', 'Doorstep pickup & drop'],
    featured: true,
  },
  {
    number: '02',
    title: 'Round-Trip Outstation Cabs',
    summary:
      'Multi-day itineraries for family vacations, weekend temple circuits, and business visits with one dedicated chauffeur throughout.',
    details: ['Lower ₹13/km Sedan rate', 'Flexible sightseeing stops', 'Multi-city custom routing'],
  },
  {
    number: '03',
    title: '24/7 Airport Transfers',
    summary:
      'Flight-monitored pickups and on-time terminal drops across Chennai (MAA), Bengaluru (BLR), Coimbatore (CJB), and Madurai (IXM).',
    details: ['Live flight delay tracking', '45-min complimentary wait', 'Direct terminal arrival gate pickup'],
  },
  {
    number: '04',
    title: 'Corporate & Group Tours',
    summary:
      'Clean Innovas and 12-seater Tempo Travellers with GST-compliant invoicing for executive travel, weddings, and team retreats.',
    details: ['GST invoice on completion', 'Verified highway chauffeurs', 'Dedicated dispatch line'],
  },
];

export const WHY_CHOOSE_US: WhyChooseItem[] = [
  {
    title: 'Transparent One-Way Billing',
    description: 'You see the exact per-km fare, driver allowance, and toll rules before the cab arrives.',
    metric: '0 Return Fees',
  },
  {
    title: 'Highway-Verified Chauffeurs',
    description: 'Every driver holds commercial badge clearance, background verification, and regional route fluency.',
    metric: '100% Verified',
  },
  {
    title: 'Rapid Dispatch Confirmation',
    description: 'Receive chauffeur name, mobile number, and vehicle plate details within minutes of booking.',
    metric: '15 Min Avg',
  },
  {
    title: 'Live 24/7 Dispatch Desk',
    description: 'Reach a real coordinator directly at 8248028734 day or night—no automated ticket loops.',
    metric: '24/7 Support',
  },
];

export const CUSTOMER_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    customerName: 'Karthik Subramanian',
    route: 'Chennai Airport to Pondicherry',
    vehicle: 'Sedan',
    rating: 5,
    quote:
      'Booked a midnight airport pickup for my parents. Driver waited at Terminal 1 despite a 35-minute flight delay and charged the exact quoted one-way fare.',
    travelMonth: 'October 2026',
  },
  {
    id: 'rev-2',
    customerName: 'Priya Nandakumar',
    route: 'Bengaluru to Mysuru Round Trip',
    vehicle: 'Innova',
    rating: 5,
    quote:
      'Clean Innova Crysta with working rear AC for six family members. Driving was steady on the expressway and billing had zero surprises at drop-off.',
    travelMonth: 'September 2026',
  },
  {
    id: 'rev-3',
    customerName: 'Aravindh Rajagopal',
    route: 'Coimbatore to Ooty',
    vehicle: 'SUV',
    rating: 5,
    quote:
      'Navigating the 36 hairpin bends felt effortless because our chauffeur knew every curve. Confirmed over WhatsApp in ten minutes flat.',
    travelMonth: 'October 2026',
  },
  {
    id: 'rev-4',
    customerName: 'Meenakshi Sundaram',
    route: 'Madurai to Chennai Drop',
    vehicle: 'Sedan',
    rating: 5,
    quote:
      'Used HAPPYTRAVELS for an urgent one-way medical trip. Saved nearly 40% compared to round-trip cab quotes from local stands.',
    travelMonth: 'November 2026',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does HAPPYTRAVELS calculate one-way drop taxi fares?',
    answer:
      'One-way trips are billed strictly on actual pickup-to-drop distance multiplied by the vehicle per-km rate (starting at ₹14/km for Sedan), with a 130 km minimum distance rule. You never pay for the cab returning empty.',
  },
  {
    id: 'faq-2',
    question: 'Are toll gates, state border permits, and parking included in the base rate?',
    answer:
      'Highway tolls (FASTag), inter-state entry permits, and airport or hill-station parking charges are billed at actual receipt value. Driver allowance is fixed per day as displayed on each vehicle card.',
  },
  {
    id: 'faq-3',
    question: 'How early will I receive my driver and cab details?',
    answer:
      'For immediate pickups, driver and vehicle details are shared within 15 minutes via SMS and WhatsApp. For advance scheduled bookings, chauffeur details are sent at least 3 hours prior to departure.',
  },
  {
    id: 'faq-4',
    question: 'Can I book directly over WhatsApp or phone without an app download?',
    answer:
      'Yes. Submit your trip details using the booking form above to get an instant reference ID and WhatsApp handoff, or call our 24/7 dispatch desk directly on 8248028734.',
  },
  {
    id: 'faq-5',
    question: 'What is the policy for airport flight delays or cancellations?',
    answer:
      'Our airport transfer team tracks incoming flights and provides up to 45 minutes of complimentary waiting after landing. Bookings can be rescheduled or cancelled free of charge up to 4 hours before pickup.',
  },
  {
    id: 'faq-6',
    question: 'What payment modes are accepted after the trip?',
    answer:
      'You can pay via UPI (GPay, PhonePe, Paytm), cash directly to the chauffeur, or request a GST invoice bank transfer link for corporate bookings.',
  },
];

export const POPULAR_CITIES = [
  'Chennai',
  'Chennai Airport (MAA)',
  'Bengaluru',
  'Bengaluru Airport (BLR)',
  'Pondicherry',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Salem',
  'Tirupati',
  'Mysuru',
  'Ooty',
  'Kodaikanal',
  'Vellore',
  'Hosur',
  'Rameshwaram',
  'Kanyakumari',
  'Thanjavur',
  'Erode',
  'Tirunelveli',
];

interface LatLng {
  lat: number;
  lng: number;
}

const CITY_COORDINATES: Record<string, LatLng> = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  'chennai airport': { lat: 12.9941, lng: 80.1709 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  'bengaluru airport': { lat: 13.1986, lng: 77.7066 },
  pondicherry: { lat: 11.9416, lng: 79.8083 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  trichy: { lat: 10.7905, lng: 78.7047 },
  salem: { lat: 11.6643, lng: 78.146 },
  tirupati: { lat: 13.6288, lng: 79.4192 },
  mysuru: { lat: 12.2958, lng: 76.6394 },
  ooty: { lat: 11.4102, lng: 76.695 },
  kodaikanal: { lat: 10.2381, lng: 77.4892 },
  vellore: { lat: 12.9165, lng: 79.1325 },
  hosur: { lat: 12.7409, lng: 77.8253 },
  rameshwaram: { lat: 9.2876, lng: 79.3129 },
  kanyakumari: { lat: 8.0883, lng: 77.5385 },
  thanjavur: { lat: 10.787, lng: 79.1378 },
  erode: { lat: 11.341, lng: 77.7172 },
  tirunelveli: { lat: 8.7139, lng: 77.7567 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  vijayawada: { lat: 16.5062, lng: 80.648 },
  kumbakonam: { lat: 10.9617, lng: 79.3881 },
  yercaud: { lat: 11.7748, lng: 78.2097 },
};

const CITY_ALIASES: Record<string, string> = {
  bangalore: 'bengaluru',
  'bangalore airport': 'bengaluru airport',
  blr: 'bengaluru airport',
  maa: 'chennai airport',
  pondy: 'pondicherry',
  puducherry: 'pondicherry',
  mysore: 'mysuru',
  tiruchirappalli: 'trichy',
  udhagamandalam: 'ooty',
  cochin: 'kochi',
  madras: 'chennai',
};

function normalizeCityKey(raw: string): string | null {
  const cleaned = raw
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;

  if (CITY_COORDINATES[cleaned]) return cleaned;
  if (CITY_ALIASES[cleaned]) return CITY_ALIASES[cleaned];

  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) {
    if (cleaned.includes(alias)) return canonical;
  }
  for (const key of Object.keys(CITY_COORDINATES)) {
    if (cleaned.includes(key)) return key;
  }
  return null;
}

function haversineRoadKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  const straightKm = 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.max(22, Math.round(straightKm * 1.24));
}

export interface FareEstimate {
  oneWayDistanceKm: number | null;
  billableKm: number;
  perKmRate: number;
  baseFare: number;
  driverAllowance: number;
  estimatedTotal: number;
  isCustomRoute: boolean;
  minBillingApplied: boolean;
}

export function estimateTripFare(params: {
  pickup: string;
  drop: string;
  journeyType: JourneyType;
  vehicle: VehicleOption;
}): FareEstimate {
  const { pickup, drop, journeyType, vehicle } = params;
  const fromKey = normalizeCityKey(pickup);
  const toKey = normalizeCityKey(drop);

  let oneWayDistanceKm: number | null = null;

  if (fromKey && toKey && fromKey !== toKey) {
    const matchedRoute = POPULAR_ROUTES.find((r) => {
      const rFrom = normalizeCityKey(r.from);
      const rTo = normalizeCityKey(r.to);
      return (rFrom === fromKey && rTo === toKey) || (rFrom === toKey && rTo === fromKey);
    });

    if (matchedRoute) {
      oneWayDistanceKm = matchedRoute.distanceKm;
    } else {
      oneWayDistanceKm = haversineRoadKm(CITY_COORDINATES[fromKey], CITY_COORDINATES[toKey]);
    }
  } else if (fromKey && toKey && fromKey === toKey) {
    oneWayDistanceKm = 30;
  }

  const isCustomRoute = oneWayDistanceKm === null;
  const perKmRate =
    journeyType === 'Round Trip' ? vehicle.roundTripRate : vehicle.oneWayRate;

  let billableKm = 130;
  let minBillingApplied = false;
  let driverAllowance = vehicle.driverAllowance;

  if (journeyType === 'Round Trip') {
    const rawRoundKm = (oneWayDistanceKm ?? 125) * 2;
    billableKm = Math.max(rawRoundKm, 250);
    minBillingApplied = oneWayDistanceKm !== null && rawRoundKm < 250;
  } else if (journeyType === 'Airport Transfer') {
    if (oneWayDistanceKm !== null && oneWayDistanceKm <= 60) {
      billableKm = Math.max(oneWayDistanceKm, 40);
      minBillingApplied = oneWayDistanceKm < 40;
      driverAllowance = 0;
    } else {
      const rawKm = oneWayDistanceKm ?? 130;
      billableKm = Math.max(rawKm, 130);
      minBillingApplied = oneWayDistanceKm !== null && rawKm < 130;
    }
  } else {
    const rawKm = oneWayDistanceKm ?? 130;
    billableKm = Math.max(rawKm, 130);
    minBillingApplied = oneWayDistanceKm !== null && rawKm < 130;
  }

  const baseFare = billableKm * perKmRate;
  const estimatedTotal = baseFare + driverAllowance;

  return {
    oneWayDistanceKm,
    billableKm,
    perKmRate,
    baseFare,
    driverAllowance,
    estimatedTotal,
    isCustomRoute,
    minBillingApplied,
  };
}

export function buildWhatsAppUrl(details: {
  referenceId?: string;
  journeyType: JourneyType;
  pickup: string;
  drop: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  vehicleType: string;
  estimatedFare?: number;
  customerName: string;
  mobile: string;
}): string {
  const lines = [
    '*HAPPYTRAVELS – Cab Booking Enquiry*',
    details.referenceId ? `Booking Ref: ${details.referenceId}` : null,
    `Journey Type: ${details.journeyType}`,
    `Pickup: ${details.pickup || 'Not specified'}`,
    `Drop: ${details.drop || 'Not specified'}`,
    `Date & Time: ${details.pickupDate || 'Flexible'} at ${details.pickupTime || 'Flexible'}`,
    `Passengers: ${details.passengers}`,
    `Preferred Vehicle: ${details.vehicleType}`,
    details.estimatedFare
      ? `Estimated Fare: Rs.${details.estimatedFare.toLocaleString('en-IN')} (+ tolls)`
      : null,
    `Customer Name: ${details.customerName || 'Guest'}`,
    `Mobile: ${details.mobile || 'Provided on call'}`,
  ].filter(Boolean);

  return `https://wa.me/${BUSINESS_CONTACT.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}
