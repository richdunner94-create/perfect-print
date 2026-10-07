import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WHATSAPP_URL } from "@/lib/format";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("WhatsAppButton", () => {
  it("links to the business WhatsApp number", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("href", WHATSAPP_URL);
    expect(link).toHaveAttribute("href", "https://wa.me/241777913361");
  });

  it("opens in a new tab without leaking the opener", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
