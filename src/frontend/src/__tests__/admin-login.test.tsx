import { AdminLoginPage } from "@/pages/admin/Login";
import { coreMockState, resetCoreMockState } from "@/test/core-mock";
import { createMockActor, renderWithProviders } from "@/test/harness";
import { resetRouterMockState, routerMockState } from "@/test/router-mock";
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

beforeEach(() => {
  resetCoreMockState();
  resetRouterMockState();
});

describe("AdminLoginPage", () => {
  it("calls login synchronously from the sign-in button click", async () => {
    const user = userEvent.setup();
    coreMockState.actor = createMockActor();
    renderWithProviders(<AdminLoginPage />);

    await user.type(
      screen.getByLabelText("Admin password"),
      "correct horse battery",
    );

    // The signer window can only open while a real click event is dispatching,
    // so login() must be invoked during the click, not after an await.
    let calledDuringClick = false;
    coreMockState.login.mockImplementation(() => {
      calledDuringClick = true;
    });

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(coreMockState.login).toHaveBeenCalledTimes(1);
    expect(calledDuringClick).toBe(true);
  });

  it("blocks sign-in when the password is empty", async () => {
    const user = userEvent.setup();
    coreMockState.actor = createMockActor();
    renderWithProviders(<AdminLoginPage />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // The empty-password guard must short-circuit before login() runs, so the
    // signer window is never requested without a password.
    expect(coreMockState.login).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Admin password")).toHaveValue("");
  });

  it("redirects an authenticated admin away from the login page", async () => {
    coreMockState.actor = createMockActor({ isAdmin: true });
    coreMockState.isAuthenticated = true;
    renderWithProviders(<AdminLoginPage />);

    await waitFor(() => {
      expect(routerMockState.navigate).toHaveBeenCalledWith({ to: "/admin" });
    });
  });

  it("shows the denied state for an authenticated non-admin", async () => {
    coreMockState.actor = createMockActor({ isAdmin: false });
    coreMockState.isAuthenticated = true;
    renderWithProviders(<AdminLoginPage />);

    expect(
      await screen.findByText(/doesn't have admin access/i),
    ).toBeInTheDocument();
    expect(routerMockState.navigate).not.toHaveBeenCalled();
  });
});
