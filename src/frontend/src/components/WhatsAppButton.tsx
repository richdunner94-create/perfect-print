import { WHATSAPP_URL } from "@/lib/format";
import { MessageCircle } from "lucide-react";

/** Floating WhatsApp inquiry button, visible on every page. */
export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      data-ocid="whatsapp.float_button"
      className="group fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elevated transition-smooth hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-6 sm:right-6"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring"
      />
      <MessageCircle className="relative size-7" aria-hidden="true" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
