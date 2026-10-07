import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { type ReactNode, useEffect } from "react";

/**
 * Gates admin routes. Unauthenticated visitors are redirected to the login
 * page; authenticated non-admins see an access-denied panel. The backend's
 * `isCallerAdmin()` is the source of truth.
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing, isAdmin, isCheckingAdmin } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      void navigate({ to: "/admin/login" });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  if (isInitializing || (isAuthenticated && isCheckingAdmin)) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground"
      >
        <Loader2 className="size-6 animate-spin" aria-hidden="true" />
        <p className="text-sm">Checking your access…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="admin.redirect_state"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground"
      >
        <Lock className="size-6" aria-hidden="true" />
        <p className="text-sm">Redirecting to sign in…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.denied_state"
        className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl font-bold">Access restricted</h1>
        <p className="text-sm text-muted-foreground">
          This account doesn&apos;t have administrator access. Sign in with an
          admin account to manage the site.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/" data-ocid="admin.denied_home_link">
            Back to home
          </Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
