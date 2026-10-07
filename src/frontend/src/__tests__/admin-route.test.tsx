import { AdminRoute } from "@/components/AdminRoute";
import { coreMockState, resetCoreMockState } from "@/test/core-mock";
import { createMockActor, renderWithProviders } from "@/test/harness";
import { resetRouterMockState, routerMockState } from "@/test/router-mock";
import { screen, waitFor } from "@testing-library/react";
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

describe("AdminRoute", () => {
  it("redirects unauthenticated visitors to the login route", async () => {
    coreMockState.actor = createMockActor();
    coreMockState.isAuthenticated = false;
    renderWithProviders(
      <AdminRoute>
        <div>Secret dashboard</div>
      </AdminRoute>,
    );

    expect(
      await screen.findByText(/redirecting to sign in/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Secret dashboard")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(routerMockState.navigate).toHaveBeenCalledWith({
        to: "/admin/login",
      });
    });
  });

  it("denies authenticated non-admins", async () => {
    coreMockState.actor = createMockActor({ isAdmin: false });
    coreMockState.isAuthenticated = true;
    renderWithProviders(
      <AdminRoute>
        <div>Secret dashboard</div>
      </AdminRoute>,
    );

    expect(await screen.findByText(/access restricted/i)).toBeInTheDocument();
    expect(screen.queryByText("Secret dashboard")).not.toBeInTheDocument();
    expect(routerMockState.navigate).not.toHaveBeenCalled();
  });

  it("renders children for an authenticated admin", async () => {
    coreMockState.actor = createMockActor({ isAdmin: true });
    coreMockState.isAuthenticated = true;
    renderWithProviders(
      <AdminRoute>
        <div>Secret dashboard</div>
      </AdminRoute>,
    );

    expect(await screen.findByText("Secret dashboard")).toBeInTheDocument();
    expect(coreMockState.actor.isCallerAdmin).toHaveBeenCalled();
  });
});
