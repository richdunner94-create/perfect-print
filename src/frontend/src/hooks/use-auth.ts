import { createActor } from "@/backend";
import { queryKeys } from "@/lib/api";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

/**
 * Authentication + admin gating.
 *
 * `isAuthenticated` reflects a valid Internet Identity session (interactive
 * login or restored). `isAdmin` is the backend's authoritative check via
 * `isCallerAdmin()` — never trust a client-side role.
 *
 * `login` is the raw Internet Identity sign-in. It MUST be invoked directly
 * from a click handler (never from a form `onSubmit` or after an `await`),
 * because the signer window can only open while a real click event is
 * dispatching.
 */
export function useAuth() {
  const {
    login,
    clear,
    identity,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
  } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);

  const adminQuery = useQuery({
    queryKey: queryKeys.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    retry: false,
  });

  return {
    identity,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
    login,
    logout: clear,
    isAdmin: adminQuery.data ?? false,
    isCheckingAdmin: adminQuery.isLoading,
  };
}
