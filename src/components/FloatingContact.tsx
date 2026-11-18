import { MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_CONTACT } from '../data/travelData';

export function FloatingContact() {
  const defaultWhatsAppHref = `https://wa.me/${BUSINESS_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    'Hello HAPPYTRAVELS, I need a taxi quote. Please share availability.'
  )}`;

  return (
    <div
      aria-label="Quick contact actions"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5"
    >
      <a
        href={BUSINESS_CONTACT.telHref}
        aria-label={`Call HAPPYTRAVELS at ${BUSINESS_CONTACT.phoneDisplay}`}
        className="h-12 px-4 inline-flex items-center gap-2 rounded-full bg-[#0B1E3D] hover:bg-blue-900 text-white text-sm font-semibold shadow-lg border border-blue-800/70 transition-transform hover:-translate-y-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Phone className="w-4 h-4 text-orange-400 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline tabular-nums">Call {BUSINESS_CONTACT.phoneDisplay}</span>
        <span className="sm:hidden">Call Now</span>
      </a>

      <a
        href={defaultWhatsAppHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with HAPPYTRAVELS on WhatsApp"
        className="h-12 px-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      >
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
