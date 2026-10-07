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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";

/**
 * A typed local stand-in for the generated backend actor. Every method the
 * frontend hooks call is present, so a page under test exercises its real
 * data-fetching and mutation wiring against deterministic in-memory data.
 *
 * This is a mock seam: it proves the frontend contract, never the canister.
 */
export interface MockActor {
  listServices: () => Promise<Service[]>;
  getService: (id: bigint) => Promise<Service | null>;
  createService: (
    title: string,
    description: string,
    imageUrl: string | null,
    active: boolean,
  ) => Promise<bigint>;
  updateService: (
    id: bigint,
    title: string,
    description: string,
    imageUrl: string | null,
    active: boolean,
  ) => Promise<boolean>;
  deleteService: (id: bigint) => Promise<boolean>;
  listPosts: () => Promise<Post[]>;
  getPost: (id: bigint) => Promise<Post | null>;
  createPost: (
    title: string,
    body: string,
    imageUrl: string | null,
    category: PostCategory,
    published: boolean,
  ) => Promise<bigint>;
  updatePost: (
    id: bigint,
    title: string,
    body: string,
    imageUrl: string | null,
    category: PostCategory,
    published: boolean,
  ) => Promise<boolean>;
  deletePost: (id: bigint) => Promise<boolean>;
  listVisas: () => Promise<VisaDetails[]>;
  getVisa: (country: VisaCountry) => Promise<VisaDetails | null>;
  updateVisa: (
    country: VisaCountry,
    title: string,
    description: string,
    requirements: string,
    processingInfo: string,
    fees: string,
  ) => Promise<boolean>;
  listBookings: () => Promise<Booking[]>;
  createBooking: (
    name: string,
    phone: string,
    email: string,
    serviceType: string,
    preferredDate: string,
    preferredTime: string,
    notes: string,
  ) => Promise<bigint>;
  updateBookingStatus: (id: bigint, status: BookingStatus) => Promise<boolean>;
  deleteBooking: (id: bigint) => Promise<boolean>;
  listContactMessages: () => Promise<ContactMessage[]>;
  submitContactMessage: (
    name: string,
    email: string,
    phone: string,
    message: string,
  ) => Promise<bigint>;
  deleteContactMessage: (id: bigint) => Promise<boolean>;
  getDashboardCounts: () => Promise<DashboardCounts>;
  isCallerAdmin: () => Promise<boolean>;
}

export interface MockActorOptions {
  services?: Service[];
  posts?: Post[];
  visas?: VisaDetails[];
  bookings?: Booking[];
  contactMessages?: ContactMessage[];
  dashboardCounts?: DashboardCounts;
  isAdmin?: boolean;
}

/** Build a fresh mock actor with deterministic defaults. */
export function createMockActor(options: MockActorOptions = {}): MockActor {
  const services = [...(options.services ?? [])];
  const posts = [...(options.posts ?? [])];
  const visas = [...(options.visas ?? [])];
  const bookings = [...(options.bookings ?? [])];
  const contactMessages = [...(options.contactMessages ?? [])];
  let nextId = 100n;

  return {
    listServices: vi.fn(async () => services),
    getService: vi.fn(
      async (id: bigint) => services.find((s) => s.id === id) ?? null,
    ),
    createService: vi.fn(async (title, description, imageUrl, active) => {
      const id = nextId++;
      services.push({
        id,
        title,
        description,
        imageUrl: imageUrl ?? undefined,
        active,
        createdAt: 0n,
      });
      return id;
    }),
    updateService: vi.fn(async (id, title, description, imageUrl, active) => {
      const index = services.findIndex((s) => s.id === id);
      if (index === -1) return false;
      services[index] = {
        ...services[index],
        title,
        description,
        imageUrl: imageUrl ?? undefined,
        active,
      };
      return true;
    }),
    deleteService: vi.fn(async (id: bigint) => {
      const index = services.findIndex((s) => s.id === id);
      if (index === -1) return false;
      services.splice(index, 1);
      return true;
    }),
    listPosts: vi.fn(async () => posts),
    getPost: vi.fn(
      async (id: bigint) => posts.find((p) => p.id === id) ?? null,
    ),
    createPost: vi.fn(async (title, body, imageUrl, category, published) => {
      const id = nextId++;
      posts.push({
        id,
        title,
        body,
        imageUrl: imageUrl ?? undefined,
        category,
        published,
        createdAt: 0n,
      });
      return id;
    }),
    updatePost: vi.fn(
      async (id, title, body, imageUrl, category, published) => {
        const index = posts.findIndex((p) => p.id === id);
        if (index === -1) return false;
        posts[index] = {
          ...posts[index],
          title,
          body,
          imageUrl: imageUrl ?? undefined,
          category,
          published,
        };
        return true;
      },
    ),
    deletePost: vi.fn(async (id: bigint) => {
      const index = posts.findIndex((p) => p.id === id);
      if (index === -1) return false;
      posts.splice(index, 1);
      return true;
    }),
    listVisas: vi.fn(async () => visas),
    getVisa: vi.fn(
      async (country: VisaCountry) =>
        visas.find((v) => v.country === country) ?? null,
    ),
    updateVisa: vi.fn(
      async (
        country,
        title,
        description,
        requirements,
        processingInfo,
        fees,
      ) => {
        const index = visas.findIndex((v) => v.country === country);
        if (index === -1) return false;
        visas[index] = {
          country,
          title,
          description,
          requirements,
          processingInfo,
          fees,
        };
        return true;
      },
    ),
    listBookings: vi.fn(async () => bookings),
    createBooking: vi.fn(
      async (
        name,
        phone,
        email,
        serviceType,
        preferredDate,
        preferredTime,
        notes,
      ) => {
        const id = nextId++;
        bookings.push({
          id,
          name,
          phone,
          email,
          serviceType,
          preferredDate,
          preferredTime,
          notes,
          status: "pending" as BookingStatus,
          createdAt: 0n,
        });
        return id;
      },
    ),
    updateBookingStatus: vi.fn(async (id: bigint, status: BookingStatus) => {
      const index = bookings.findIndex((b) => b.id === id);
      if (index === -1) return false;
      bookings[index] = { ...bookings[index], status };
      return true;
    }),
    deleteBooking: vi.fn(async (id: bigint) => {
      const index = bookings.findIndex((b) => b.id === id);
      if (index === -1) return false;
      bookings.splice(index, 1);
      return true;
    }),
    listContactMessages: vi.fn(async () => contactMessages),
    submitContactMessage: vi.fn(async (name, email, phone, message) => {
      const id = nextId++;
      contactMessages.push({ id, name, email, phone, message, createdAt: 0n });
      return id;
    }),
    deleteContactMessage: vi.fn(async (id: bigint) => {
      const index = contactMessages.findIndex((m) => m.id === id);
      if (index === -1) return false;
      contactMessages.splice(index, 1);
      return true;
    }),
    getDashboardCounts: vi.fn(
      async () =>
        options.dashboardCounts ?? {
          services: BigInt(services.length),
          posts: BigInt(posts.length),
          pendingAppointments: BigInt(
            bookings.filter((b) => b.status === "pending").length,
          ),
          totalAppointments: BigInt(bookings.length),
          contactMessages: BigInt(contactMessages.length),
        },
    ),
    isCallerAdmin: vi.fn(async () => options.isAdmin ?? false),
  };
}

/** A fresh QueryClient per render so caches never leak between tests. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactNode,
  queryClient: QueryClient = createTestQueryClient(),
) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}
