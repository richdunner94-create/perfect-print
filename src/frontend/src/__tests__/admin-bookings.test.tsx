import { BookingStatus } from "@/backend";
import { AdminBookingsPage } from "@/pages/admin/Bookings";
import { coreMockState, resetCoreMockState } from "@/test/core-mock";
import { createMockActor, renderWithProviders } from "@/test/harness";
import { resetRouterMockState } from "@/test/router-mock";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", async () => {
  const { coreMockState: state } = await import("@/test/core-mock");
  return {
    useActor: () => ({ actor: state.actor, isFetching: false }),
    useInternetIdentity: () => ({
      identity: undefined,
      isAuthenticated: state.isAuthenticated,
      isInitializing: state.isInitializing,
      isLoggingIn: state.isLoggingIn,
      isLoginError: state.isLoginError,
      loginError: state.loginError,
      login: state.login,
      clear: state.clear,
    }),
  };
});

vi.mock("@tanstack/react-router", async () => {
  const {
    MockLink,
    MockOutlet,
    routerMockState: state,
  } = await import("@/test/router-mock");
  return {
    Link: MockLink,
    Outlet: MockOutlet,
    useNavigate: () => state.navigate,
    useRouterState: (options?: {
      select?: (snapshot: { location: { pathname: string } }) => unknown;
    }) => {
      const snapshot = { location: { pathname: state.pathname } };
      return options?.select ? options.select(snapshot) : snapshot;
    },
    useSearch: () => state.search,
    useParams: () => state.params,
  };
});

const seededBooking = {
  id: 7n,
  name: "Ada Lovelace",
  phone: "+1 206 555 0142",
  email: "ada@example.com",
  serviceType: "Business cards",
  preferredDate: "2026-03-04",
  preferredTime: "10:00",
  notes: "Matte stock please.",
  status: BookingStatus.pending,
  createdAt: 0n,
};

beforeEach(() => {
  resetCoreMockState();
  resetRouterMockState();
});

describe("AdminBookingsPage", () => {
  it("lists submitted bookings with their details", async () => {
    coreMockState.actor = createMockActor({ bookings: [seededBooking] });
    renderWithProviders(<AdminBookingsPage />);

    // The page renders a desktop table and a mobile card list; scope to the
    // table so the assertion targets one representation.
    const table = await screen.findByTestId("admin_bookings.table");
    expect(within(table).getByText("Ada Lovelace")).toBeInTheDocument();
    expect(within(table).getByText("+1 206 555 0142")).toBeInTheDocument();
    expect(within(table).getByText("ada@example.com")).toBeInTheDocument();
    expect(within(table).getByText("Business cards")).toBeInTheDocument();
    expect(within(table).getByText("Matte stock please.")).toBeInTheDocument();
  });

  it("updates a booking's status", async () => {
    const user = userEvent.setup();
    const actor = createMockActor({ bookings: [seededBooking] });
    coreMockState.actor = actor;
    renderWithProviders(<AdminBookingsPage />);

    const table = await screen.findByTestId("admin_bookings.table");
    const trigger = within(table).getByRole("combobox", {
      name: /status for ada lovelace/i,
    });
    await user.click(trigger);
    const listbox = await screen.findByRole("listbox");
    await user.click(
      within(listbox).getByRole("option", { name: "Confirmed" }),
    );

    await waitFor(() => {
      expect(actor.updateBookingStatus).toHaveBeenCalledWith(
        7n,
        BookingStatus.confirmed,
      );
    });
  });

  it("shows an empty state when there are no bookings", async () => {
    coreMockState.actor = createMockActor({ bookings: [] });
    renderWithProviders(<AdminBookingsPage />);

    expect(await screen.findByText(/no bookings yet/i)).toBeInTheDocument();
  });
});
