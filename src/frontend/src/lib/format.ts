import { BookingStatus, PostCategory, VisaCountry } from "@/backend";

/** Convert a Motoko nanosecond timestamp into a JS Date, or null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Human-readable date, e.g. "Mar 4, 2026". */
export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Human-readable date and time, e.g. "Mar 4, 2026, 2:30 PM". */
export function formatDateTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Format a preferred appointment date string (YYYY-MM-DD) for display. */
export function formatPreferredDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const bookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.pending]: "Pending",
  [BookingStatus.confirmed]: "Confirmed",
  [BookingStatus.completed]: "Completed",
  [BookingStatus.cancelled]: "Cancelled",
};

export const postCategoryLabels: Record<PostCategory, string> = {
  [PostCategory.promotion]: "Promotion",
  [PostCategory.announcement]: "Announcement",
  [PostCategory.advertising]: "Advertising",
};

export const visaCountryLabels: Record<VisaCountry, string> = {
  [VisaCountry.china]: "China",
  [VisaCountry.france]: "France",
  [VisaCountry.usa]: "United States",
};

export const visaCountryFlags: Record<VisaCountry, string> = {
  [VisaCountry.china]: "🇨🇳",
  [VisaCountry.france]: "🇫🇷",
  [VisaCountry.usa]: "🇺🇸",
};

/** WhatsApp deep link for the business number. */
export const WHATSAPP_NUMBER = "241777913361";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function whatsappLink(message?: string): string {
  if (!message) return WHATSAPP_URL;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
