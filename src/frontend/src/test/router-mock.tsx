import type { AnchorHTMLAttributes, ReactNode } from "react";
import { vi } from "vitest";

/**
 * Mutable state read by the `@tanstack/react-router` mock. Tests set the
 * current pathname, search params, and route params before rendering.
 */
export interface RouterMockState {
  pathname: string;
  search: Record<string, unknown>;
  params: Record<string, string>;
  navigate: ReturnType<typeof vi.fn>;
}

export const routerMockState: RouterMockState = {
  pathname: "/",
  search: {},
  params: {},
  navigate: vi.fn(),
};

export function resetRouterMockState(): void {
  routerMockState.pathname = "/";
  routerMockState.search = {};
  routerMockState.params = {};
  routerMockState.navigate.mockReset();
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  children?: ReactNode;
}

/** Minimal `Link` stand-in that renders a real anchor with a resolved href. */
export function MockLink({ to, params, search, children, ...rest }: LinkProps) {
  let href = to;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      href = href.replace(`$${key}`, value);
    }
  }
  if (search && Object.keys(search).length > 0) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
      if (value !== undefined && value !== null) query.set(key, String(value));
    }
    const qs = query.toString();
    if (qs) href = `${href}?${qs}`;
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

export function MockOutlet({ children }: { children?: ReactNode }) {
  return <>{children ?? null}</>;
}
