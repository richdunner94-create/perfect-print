import type {
  Booking,
  BookingStatus,
  ContactMessage,
  DashboardCounts,
  Post,
  PostCategory,
  Service,
  VisaCountry,
  VisaDetails,
} from "@/backend";

export type {
  Booking,
  BookingStatus,
  ContactMessage,
  DashboardCounts,
  Post,
  PostCategory,
  Service,
  VisaCountry,
  VisaDetails,
};

export interface ServiceInput {
  title: string;
  description: string;
  imageUrl: string | null;
  active: boolean;
}

export interface PostInput {
  title: string;
  body: string;
  imageUrl: string | null;
  category: PostCategory;
  published: boolean;
}

export interface BookingInput {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface VisaInput {
  country: VisaCountry;
  title: string;
  description: string;
  requirements: string;
  processingInfo: string;
  fees: string;
}

/** Query keys shared across hooks so mutations invalidate the right caches. */
export const queryKeys = {
  services: ["services"] as const,
  posts: ["posts"] as const,
  visas: ["visas"] as const,
  bookings: ["bookings"] as const,
  contactMessages: ["contactMessages"] as const,
  dashboardCounts: ["dashboardCounts"] as const,
  isAdmin: ["isAdmin"] as const,
};
