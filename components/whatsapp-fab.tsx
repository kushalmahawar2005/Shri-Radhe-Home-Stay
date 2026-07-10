import { MessageCircle } from "lucide-react";

/** Floating WhatsApp button — always reachable booking CTA. */
export function WhatsAppFab({ whatsappPrimary }: { whatsappPrimary: string }) {
  return (
    <a
      href={whatsappPrimary}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
