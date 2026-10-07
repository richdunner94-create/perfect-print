import { VisaCountry } from "@/backend";
import { VisaServicesPage } from "@/pages/VisaServices";
import { coreMockState, resetCoreMockState } from "@/test/core-mock";
import { createMockActor, renderWithProviders } from "@/test/harness";
import { resetRouterMockState } from "@/test/router-mock";
import { screen } from "@testing-library/react";
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

const seededVisas = [
  {
    country: VisaCountry.china,
    title: "China visa assistance",
    description: "Guidance for Chinese tourist and business visas.",
    requirements: "Passport\nPhoto\nItinerary",
    processingInfo: "5–7 business days",
    fees: "$140",
  },
  {
    country: VisaCountry.france,
    title: "France visa assistance",
    description: "Schengen application support for France.",
    requirements: "Passport\nInsurance",
    processingInfo: "10–15 business days",
    fees: "$90",
  },
  {
    country: VisaCountry.usa,
    title: "USA visa assistance",
    description: "Support for US visa applications.",
    requirements: "Passport\nDS-160",
    processingInfo: "Varies by consulate",
    fees: "$185",
  },
];

beforeEach(() => {
  resetCoreMockState();
  resetRouterMockState();
});

describe("VisaServicesPage", () => {
  it("renders separate China, France, and USA sections", async () => {
    coreMockState.actor = createMockActor({ visas: seededVisas });
    renderWithProviders(<VisaServicesPage />);

    expect(
      await screen.findByText("China visa assistance"),
    ).toBeInTheDocument();
    expect(screen.getByText("France visa assistance")).toBeInTheDocument();
    expect(screen.getByText("USA visa assistance")).toBeInTheDocument();

    // Each country card is anchored for the jump nav.
    expect(document.getElementById("visa-china")).not.toBeNull();
    expect(document.getElementById("visa-france")).not.toBeNull();
    expect(document.getElementById("visa-usa")).not.toBeNull();
  });

  it("offers a request-assistance action per country that links to appointments", async () => {
    coreMockState.actor = createMockActor({ visas: seededVisas });
    renderWithProviders(<VisaServicesPage />);

    const requestLinks = await screen.findAllByRole("link", {
      name: /request visa assistance/i,
    });
    expect(requestLinks).toHaveLength(3);
    for (const link of requestLinks) {
      expect(link).toHaveAttribute(
        "href",
        expect.stringContaining("/appointments"),
      );
    }
  });

  it("shows an empty state when no visa details are available", async () => {
    coreMockState.actor = createMockActor({ visas: [] });
    renderWithProviders(<VisaServicesPage />);

    expect(
      await screen.findByText(/visa details coming soon/i),
    ).toBeInTheDocument();
  });
});
