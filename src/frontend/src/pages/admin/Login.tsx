import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AdminLoginPage() {
  const {
    login,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
    isAdmin,
    isCheckingAdmin,
  } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      void navigate({ to: "/admin" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  /**
   * Internet Identity's signer window can only open while a real click event
   * is dispatching. This handler runs synchronously inside the button's
   * `onClick`, so `login()` is called before the event finishes — never from
   * a form `onSubmit` (which fires after the click) and never after an
   * `await`.
   */
  function handleSignIn() {
    if (password.trim() === "") {
      toast.error("Enter the admin password to continue");
      return;
    }
    login();
  }

  const busy = isLoggingIn || isInitializing;

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-subtle px-4 py-16">
      <div
        aria-hidden="true"
        className="texture-paper pointer-events-none absolute inset-0 opacity-60"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-ink">
            <Lock className="size-6" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the admin password, then confirm with your administrator
            identity.
          </p>
        </div>

        {isAuthenticated && !isAdmin && !isCheckingAdmin ? (
          <div
            data-ocid="admin_login.denied_state"
            className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-muted-foreground"
          >
            This identity doesn&apos;t have admin access. Contact the site owner
            to be granted access.
          </div>
        ) : null}

        {/* Deliberately not a <form>: login() must run inside the button's
            click event, and form onSubmit fires after the click has ended. */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              data-ocid="admin_login.password_input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={busy}
            />
            <p className="text-xs text-muted-foreground">
              The password unlocks the sign-in step; access is verified by your
              administrator identity.
            </p>
          </div>

          {isLoginError ? (
            <p
              data-ocid="admin_login.error_state"
              className="text-sm text-destructive"
            >
              {loginError?.message ?? "Sign-in failed. Please try again."}
            </p>
          ) : null}

          <Button
            type="button"
            size="lg"
            className="w-full rounded-full shadow-ink"
            disabled={busy}
            onClick={handleSignIn}
            data-ocid="admin_login.submit_button"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ShieldCheck className="size-4" aria-hidden="true" />
            )}
            {isLoggingIn ? "Signing in…" : "Sign in"}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            to="/"
            data-ocid="admin_login.home_link"
            className="inline-flex items-center gap-1.5 font-medium text-primary transition-smooth hover:underline"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
