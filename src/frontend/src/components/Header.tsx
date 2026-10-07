import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Printer } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Visa Services", to: "/visa-services" },
  { label: "Appointments", to: "/appointments" },
  { label: "Advertising", to: "/advertising" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-subtle backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          data-ocid="nav.logo_link"
          className="group flex min-w-0 items-center gap-2.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-ink">
            <Printer className="size-5" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-base font-bold tracking-tight text-foreground">
              Washington&apos;s Perfect Print
            </span>
            <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Print &amp; Visa Studio
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.link.${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-smooth",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-full shadow-ink sm:inline-flex"
          >
            <Link to="/appointments" data-ocid="nav.book_button">
              Book Appointment
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full lg:hidden"
                aria-label="Open navigation menu"
                data-ocid="nav.menu_button"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="font-display text-lg">Menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      data-ocid={`nav.mobile_link.${link.label.toLowerCase().replace(/\s+/g, "_")}`}
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-smooth hover:bg-secondary"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto border-t border-border p-4">
                <SheetClose asChild>
                  <Button asChild className="w-full rounded-full shadow-ink">
                    <Link to="/appointments" data-ocid="nav.mobile_book_button">
                      Book Appointment
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
