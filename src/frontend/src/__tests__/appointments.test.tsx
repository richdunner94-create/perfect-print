import { AppointmentsPage } from "@/pages/Appointments";
import { coreMockState, resetCoreMockState } from "@/test/core-mock";
import { createMockActor, renderWithProviders } from "@/test/harness";
import { resetRouterMockState, routerMockState } from "@/test/router-mock";
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

beforeEach(() => {
  resetCoreMockState();
  resetRouterMockState();
});

async function chooseSelectOption(
  user: ReturnType<typeof userEvent.setup>,
  trigger: HTMLElement,
  optionName: string,
) {
  await user.click(trigger);
  const listbox = await screen.findByRole("listbox");
  await user.click(within(listbox).getByRole("option", { name: optionName }));
}

describe("AppointmentsPage", () => {
  it("shows validation errors when the form is submitted empty", async () => {
    const user = userEvent.setup();
    coreMockState.actor = createMockActor();
    renderWithProviders(<AppointmentsPage />);

    await user.click(
      screen.getByRole("button", { name: /request appointment/i }),
    );

    expect(
      await screen.findByText(/please enter your full name/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(coreMockState.actor.createBooking).not.toHaveBeenCalled();
  });

  it("submits a complete booking and shows a confirmation", async () => {
    const user = userEvent.setup();
    const actor = createMockActor();
    coreMockState.actor = actor;
    renderWithProviders(<AppointmentsPage />);

    await user.type(screen.getByLabelText(/full name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^phone$/i), "+1 206 555 0142");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");

    await chooseSelectOption(
      user,
      screen.getByLabelText(/^service$/i),
      "General inquiry",
    );
    await user.type(screen.getByLabelText(/preferred date/i), "2026-03-04");
    await chooseSelectOption(
      user,
      screen.getByLabelText(/preferred time/i),
      "10:00",
    );
    await user.type(screen.getByLabelText(/notes/i), "Please use matte stock.");

    await user.click(
      screen.getByRole("button", { name: /request appointment/i }),
    );

    await waitFor(() => {
      expect(actor.createBooking).toHaveBeenCalledTimes(1);
    });
    expect(actor.createBooking).toHaveBeenCalledWith(
      "Ada Lovelace",
      "+1 206 555 0142",
      "ada@example.com",
      "General inquiry",
      "2026-03-04",
      "10:00",
      "Please use matte stock.",
    );

    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
  });

  it("pre-fills the service from a query parameter", async () => {
    coreMockState.actor = createMockActor();
    routerMockState.search = { service: "Visa assistance — China" };
    renderWithProviders(<AppointmentsPage />);

    expect(
      await screen.findByText("Visa assistance — China"),
    ).toBeInTheDocument();
  });
});
