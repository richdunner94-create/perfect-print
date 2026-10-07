import { vi } from "vitest";
import type { MockActor } from "./harness";

/**
 * Mutable state read by the `@caffeineai/core-infrastructure` mock. Tests set
 * `actor` and the auth flags before rendering, then assert on the actor's
 * recorded calls.
 */
export interface CoreMockState {
  actor: MockActor | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  isLoginError: boolean;
  loginError: Error | undefined;
  login: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
}

export const coreMockState: CoreMockState = {
  actor: null,
  isAuthenticated: false,
  isInitializing: false,
  isLoggingIn: false,
  isLoginError: false,
  loginError: undefined,
  login: vi.fn(),
  clear: vi.fn(),
};

/** Reset the shared mock state between tests. */
export function resetCoreMockState(): void {
  coreMockState.actor = null;
  coreMockState.isAuthenticated = false;
  coreMockState.isInitializing = false;
  coreMockState.isLoggingIn = false;
  coreMockState.isLoginError = false;
  coreMockState.loginError = undefined;
  coreMockState.login.mockReset();
  coreMockState.clear.mockReset();
}
