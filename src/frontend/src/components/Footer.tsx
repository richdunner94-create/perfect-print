import { WHATSAPP_URL } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone, Printer } from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Visa Services", to: "/visa-services" },
  { label: "Appointments", to: "/appointments" },
  { label: "Advertising", to: "/advertising" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/10">
              <Printer className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Washington&apos;s Perfect Print
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/75">
            Premium printing, signage, and trusted visa assistance — crafted
            with care in Seattle.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  data-ocid={`footer.link.${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                  className="text-sm text-primary-foreground/80 transition-smooth hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href="tel:+12065550142"
                className="font-mono transition-smooth hover:text-primary-foreground"
              >
                +1 (206) 555-0142
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href="mailto:hello@washingtonsperfectprint.com"
                className="break-all transition-smooth hover:text-primary-foreground"
              >
                hello@washingtonsperfectprint.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>Seattle, Washington</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
            Chat With Us
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-primary-foreground/75">
            Questions about a print job or visa application? Message us on
            WhatsApp.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="footer.whatsapp_link"
            className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-4 py-2.5 text-sm font-semibold text-primary transition-smooth hover:bg-primary-foreground/90"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {year} Washington&apos;s Perfect Print. All rights reserved.</p>
          <p>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-smooth hover:text-primary-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
