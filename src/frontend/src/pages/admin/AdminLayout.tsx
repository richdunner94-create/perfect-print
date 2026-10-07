import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Printer,
  Stamp,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";

const adminNav: {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Services", to: "/admin/services", icon: Printer },
  { label: "Posts", to: "/admin/posts", icon: Newspaper },
  { label: "Bookings", to: "/admin/bookings", icon: CalendarDays },
  { label: "Messages", to: "/admin/messages", icon: Mail },
  { label: "Visas", to: "/admin/visas", icon: Stamp },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {adminNav.map((item) => {
        const active = item.exact
          ? pathname === item.to
          : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            data-ocid={`admin.nav.${item.label.toLowerCase()}`}
            aria-current={active ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footerActions = (
    <div className="mt-4 space-y-1 border-t border-sidebar-border pt-4">
      <Link
        to="/"
        data-ocid="admin.view_site_link"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-sidebar-accent/60 hover:text-foreground"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        View site
      </Link>
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start rounded-lg text-muted-foreground"
        onClick={() => logout()}
        data-ocid="admin.logout_button"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Sign out
      </Button>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-12">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-sidebar p-3 shadow-subtle lg:hidden">
        <span className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Admin
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
          data-ocid="admin.menu_toggle"
        >
          {menuOpen ? (
            <X className="size-4" aria-hidden="true" />
          ) : (
            <Menu className="size-4" aria-hidden="true" />
          )}
          Menu
        </Button>
      </div>

      {menuOpen ? (
        <div
          id="admin-mobile-nav"
          className="rounded-2xl border border-border bg-sidebar p-4 shadow-subtle lg:hidden"
        >
          {navItems}
          {footerActions}
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-60 lg:shrink-0">
        <div className="rounded-2xl border border-border bg-sidebar p-4 shadow-subtle lg:sticky lg:top-24">
          <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Admin
          </p>
          {navItems}
          {footerActions}
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
