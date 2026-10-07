import { AdminServicesPage } from "@/pages/admin/Services";
import { coreMockState, resetCoreMockState } from "@/test/core-mock";
import { createMockActor, renderWithProviders } from "@/test/harness";
import { resetRouterMockState } from "@/test/router-mock";
import { screen, waitFor } from "@testing-library/react";
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

const seededService = {
  id: 1n,
  title: "Business cards",
  description: "Premium card stock printing.",
  active: true,
  createdAt: 0n,
};

beforeEach(() => {
  resetCoreMockState();
  resetRouterMockState();
});

describe("AdminServicesPage", () => {
  it("creates a service through the dialog", async () => {
    const user = userEvent.setup();
    const actor = createMockActor();
    coreMockState.actor = actor;
    renderWithProviders(<AdminServicesPage />);

    await user.click(
      await screen.findByRole("button", { name: /add service/i }),
    );

    await user.type(screen.getByLabelText("Title"), "Banner printing");
    await user.type(
      screen.getByLabelText("Description"),
      "Large-format vinyl banners.",
    );
    await user.click(screen.getByRole("button", { name: /save service/i }));

    await waitFor(() => {
      expect(actor.createService).toHaveBeenCalledTimes(1);
    });
    expect(actor.createService).toHaveBeenCalledWith(
      "Banner printing",
      "Large-format vinyl banners.",
      null,
      true,
    );
  });

  it("edits an existing service", async () => {
    const user = userEvent.setup();
    const actor = createMockActor({ services: [seededService] });
    coreMockState.actor = actor;
    renderWithProviders(<AdminServicesPage />);

    await user.click(await screen.findByRole("button", { name: /^edit$/i }));

    const title = screen.getByLabelText("Title");
    await user.clear(title);
    await user.type(title, "Business cards (updated)");
    await user.click(screen.getByRole("button", { name: /save service/i }));

    await waitFor(() => {
      expect(actor.updateService).toHaveBeenCalledTimes(1);
    });
    expect(actor.updateService).toHaveBeenCalledWith(
      1n,
      "Business cards (updated)",
      "Premium card stock printing.",
      null,
      true,
    );
  });

  it("deletes a service after confirmation", async () => {
    const user = userEvent.setup();
    const actor = createMockActor({ services: [seededService] });
    coreMockState.actor = actor;
    renderWithProviders(<AdminServicesPage />);

    await user.click(await screen.findByRole("button", { name: /^delete$/i }));
    await user.click(
      await screen.findByRole("button", { name: /delete service/i }),
    );

    await waitFor(() => {
      expect(actor.deleteService).toHaveBeenCalledWith(1n);
    });
  });
});
