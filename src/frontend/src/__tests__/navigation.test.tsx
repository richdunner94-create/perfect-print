import { Layout } from "@/components/Layout";
import { WHATSAPP_URL } from "@/lib/format";
import { renderWithProviders } from "@/test/harness";
import { resetRouterMockState, routerMockState } from "@/test/router-mock";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
  resetRouterMockState();
});

describe("Header navigation", () => {
  it("renders a link for every public page", () => {
    renderWithProviders(
      <Layout>
        <p>page body</p>
      </Layout>,
    );

    const primary = screen.getByRole("navigation", { name: "Primary" });
    const expected: Array<[string, string]> = [
      ["Home", "/"],
      ["Services", "/services"],
      ["Visa Services", "/visa-services"],
      ["Appointments", "/appointments"],
      ["Advertising", "/advertising"],
      ["Contact", "/contact"],
    ];
    for (const [label, href] of expected) {
      const link = within(primary).getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
    }
  });

  it("shows the floating WhatsApp button on the page", () => {
    renderWithProviders(
      <Layout>
        <p>page body</p>
      </Layout>,
    );
    const whatsapp = screen.getByRole("link", {
      name: /chat with us on whatsapp/i,
    });
    expect(whatsapp).toHaveAttribute("href", WHATSAPP_URL);
  });

  it("opens the mobile menu with the same destinations", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Layout>
        <p>page body</p>
      </Layout>,
    );

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i }),
    );

    const mobile = await screen.findByRole("navigation", { name: "Mobile" });
    expect(
      within(mobile).getByRole("link", { name: "Visa Services" }),
    ).toHaveAttribute("href", "/visa-services");
    expect(
      within(mobile).getByRole("link", { name: "Appointments" }),
    ).toHaveAttribute("href", "/appointments");
  });
});
