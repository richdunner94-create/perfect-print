import { PageHero, Section } from "@/components/Section";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVisas } from "@/hooks/use-backend";
import {
  WHATSAPP_URL,
  visaCountryFlags,
  visaCountryLabels,
} from "@/lib/format";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Stamp,
  Wallet,
} from "lucide-react";

/** Per-country accent rule colors, echoing the print-workshop ink palette. */
const countryAccents: Record<string, string> = {
  china: "bg-destructive",
  france: "bg-primary",
  usa: "bg-accent",
};

export function VisaServicesPage() {
  const visas = useVisas();
  const list = visas.data ?? [];

  return (
    <>
      <PageHero
        eyebrow="Visa Services"
        title="Visa assistance, made clear"
        description="We help you understand the requirements and prepare your documents for visa applications to China, France, and the United States."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full shadow-ink">
            <Link to="/appointments" search={{}} data-ocid="visa.book_button">
              Request assistance
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="visa.whatsapp_link"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </PageHero>

      <Section>
        {visas.isLoading ? (
          <LoadingState label="Loading visa services…" />
        ) : visas.isError ? (
          <ErrorState
            description="We couldn't load the visa details right now. Please try again or reach us on WhatsApp."
            action={
              <Button
                type="button"
                className="rounded-full"
                onClick={() => void visas.refetch()}
                data-ocid="visa.retry_button"
              >
                Try again
              </Button>
            }
          />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<Stamp className="size-6" aria-hidden="true" />}
            title="Visa details coming soon"
            description="Our visa guidance is being prepared. Contact us for current requirements and timelines."
            action={
              <Button asChild className="rounded-full">
                <Link to="/contact" data-ocid="visa.empty_contact_link">
                  Contact us
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            <nav
              aria-label="Jump to a country"
              className="mb-10 flex flex-wrap gap-2"
              data-ocid="visa.country_nav"
            >
              {list.map((visa) => (
                <a
                  key={visa.country}
                  href={`#visa-${visa.country}`}
                  data-ocid={`visa.country_link.${visa.country}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span aria-hidden="true">
                    {visaCountryFlags[visa.country]}
                  </span>
                  {visaCountryLabels[visa.country]}
                </a>
              ))}
            </nav>

            <div className="space-y-10">
              {list.map((visa, index) => (
                <Card
                  key={visa.country}
                  id={`visa-${visa.country}`}
                  data-ocid={`visa.card.${index + 1}`}
                  className="scroll-mt-24 overflow-hidden rounded-2xl border shadow-subtle"
                >
                  <CardHeader className="border-b border-border bg-muted/40">
                    <div className="flex items-center gap-4">
                      <span
                        className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-3xl shadow-subtle"
                        aria-hidden="true"
                      >
                        {visaCountryFlags[visa.country]}
                      </span>
                      <div className="min-w-0">
                        <Badge
                          variant="secondary"
                          className="mb-1 rounded-full uppercase tracking-wide"
                        >
                          {visaCountryLabels[visa.country]}
                        </Badge>
                        <CardTitle className="font-display text-2xl">
                          {visa.title}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-1.5" aria-hidden="true">
                      <span
                        className={`h-1 w-16 rounded-full ${
                          countryAccents[visa.country] ?? "bg-primary"
                        }`}
                      />
                      <span className="h-1 w-8 rounded-full bg-border" />
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-8 pt-6 md:grid-cols-2">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Overview
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground">
                          {visa.description}
                        </p>
                      </div>
                      <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
                        <Wallet
                          className="mt-0.5 size-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Fees
                          </p>
                          <p className="font-mono text-sm font-semibold text-foreground">
                            {visa.fees}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
                        <Clock
                          className="mt-0.5 size-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Processing
                          </p>
                          <p className="text-sm text-foreground">
                            {visa.processingInfo}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Requirements
                      </h3>
                      <ul className="space-y-2.5">
                        {visa.requirements
                          .split(/\n|;/)
                          .map((req) => req.trim())
                          .filter(Boolean)
                          .map((req) => (
                            <li
                              key={`${visa.country}-${req}`}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                            >
                              <CheckCircle2
                                className="mt-0.5 size-4 shrink-0 text-success"
                                aria-hidden="true"
                              />
                              <span>{req}</span>
                            </li>
                          ))}
                      </ul>
                      <Button
                        asChild
                        className="mt-6 w-full rounded-full shadow-ink sm:w-auto"
                      >
                        <Link
                          to="/appointments"
                          search={{
                            service: `Visa assistance — ${visaCountryLabels[visa.country]}`,
                          }}
                          data-ocid={`visa.request_button.${index + 1}`}
                        >
                          Request visa assistance
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </Section>
    </>
  );
}
