import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BookingPayload {
  pickup: string;
  drop: string;
  journeyType: 'One Way' | 'Round Trip' | 'Airport Transfer';
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  vehicleType?: string;
  estimatedFare?: number;
  distanceKm?: number | null;
  customerName: string;
  mobile: string;
}

interface StoredBooking extends BookingPayload {
  referenceId: string;
  createdAt: string;
  status: 'Confirmed';
}

const DATA_FILE = path.resolve(__dirname, 'bookings-store.json');

function loadBookings(): StoredBooking[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // Fallback to empty array if file is unreadable
  }
  return [];
}

function saveBookings(bookings: StoredBooking[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings.slice(-200), null, 2), 'utf-8');
  } catch {
    // Ignore write failures in read-only environments
  }
}

const bookingsMemory: StoredBooking[] = loadBookings();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'HAPPYTRAVELS' });
  });

  app.post('/api/bookings', (req, res) => {
    const body = req.body as Partial<BookingPayload>;

    const pickup = typeof body.pickup === 'string' ? body.pickup.trim() : '';
    const drop = typeof body.drop === 'string' ? body.drop.trim() : '';
    const journeyType = body.journeyType;
    const pickupDate = typeof body.pickupDate === 'string' ? body.pickupDate.trim() : '';
    const pickupTime = typeof body.pickupTime === 'string' ? body.pickupTime.trim() : '';
    const passengers = Number(body.passengers);
    const vehicleType = typeof body.vehicleType === 'string' ? body.vehicleType.trim() : 'Sedan';
    const estimatedFare =
      typeof body.estimatedFare === 'number' && Number.isFinite(body.estimatedFare)
        ? Math.round(body.estimatedFare)
        : undefined;
    const distanceKm =
      typeof body.distanceKm === 'number' && Number.isFinite(body.distanceKm)
        ? Math.round(body.distanceKm)
        : null;
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
    const rawMobile = typeof body.mobile === 'string' ? body.mobile.replace(/\D/g, '') : '';
    const mobile = rawMobile.length > 10 && rawMobile.startsWith('91') ? rawMobile.slice(2) : rawMobile;

    const errors: Record<string, string> = {};

    if (pickup.length < 2) errors.pickup = 'Enter a valid pickup city or address.';
    if (drop.length < 2) errors.drop = 'Enter a valid drop city or address.';
    if (
      journeyType !== 'One Way' &&
      journeyType !== 'Round Trip' &&
      journeyType !== 'Airport Transfer'
    ) {
      errors.journeyType = 'Select a valid journey type.';
    }
    if (!pickupDate) errors.pickupDate = 'Select a pickup date.';
    if (!pickupTime) errors.pickupTime = 'Select a pickup time.';
    if (!Number.isFinite(passengers) || passengers < 1 || passengers > 20) {
      errors.passengers = 'Select between 1 and 20 passengers.';
    }
    if (customerName.length < 2) errors.customerName = 'Enter your full name.';
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please correct the highlighted booking fields.',
        errors,
      });
    }

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const referenceId = `HT-${randomDigits}`;

    const record: StoredBooking = {
      referenceId,
      pickup,
      drop,
      journeyType: journeyType as BookingPayload['journeyType'],
      pickupDate,
      pickupTime,
      passengers,
      vehicleType,
      estimatedFare,
      distanceKm,
      customerName,
      mobile,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
    };

    bookingsMemory.push(record);
    saveBookings(bookingsMemory);

    return res.status(201).json({
      success: true,
      booking: record,
    });
  });

  app.get('/api/bookings/:referenceId', (req, res) => {
    const found = bookingsMemory.find(
      (b) => b.referenceId.toUpperCase() === req.params.referenceId.toUpperCase()
    );
    if (!found) {
      return res.status(404).json({ success: false, message: 'Booking reference not found.' });
    }
    return res.json({ success: true, booking: found });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HAPPYTRAVELS server listening on http://localhost:${PORT}`);
  });
}

startServer();
