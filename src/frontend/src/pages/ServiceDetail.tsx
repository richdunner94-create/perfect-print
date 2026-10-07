import { PageHero, Section } from "@/components/Section";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { useService } from "@/hooks/use-backend";
import { WHATSAPP_URL, formatDate, whatsappLink } from "@/lib/format";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  MessageCircle,
  Printer,
} from "lucide-react";

export function ServiceDetailPage() {
  const { serviceId } = useParams({ from: "/services/$serviceId" });
  const service = useService(serviceId);

  const data = service.data;
  const notFound = !service.isLoading && !service.isError && !data;

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={data ? data.title : "Service details"}
        description={
          data
            ? "Review the full details below, then book an appointment and we'll take it from there."
            : "Full details for this printing service."
        }
      >
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/services" data-ocid="service_detail.back_link">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All services
          </Link>
        </Button>
      </PageHero>

      <Section>
        {service.isLoading ? (
          <LoadingState label="Loading service…" />
        ) : service.isError ? (
          <ErrorState
            title="Couldn't load this service"
            description="Something went wrong while fetching the details. Please try again."
            action={
              <Button
                type="button"
                className="rounded-full"
                onClick={() => void service.refetch()}
                data-ocid="service_detail.retry_button"
              >
                Try again
              </Button>
            }
          />
        ) : notFound || !data ? (
          <EmptyState
            icon={<Printer className="size-6" aria-hidden="true" />}
            title="Service not found"
            description="This service may have been removed or is no longer available. Browse our current catalogue instead."
            action={
              <Button asChild className="rounded-full">
                <Link to="/services" data-ocid="service_detail.not_found_link">
                  Browse services
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-subtle">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center bg-secondary">
                    <Printer
                      className="size-10 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  About this service
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {data.description}
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Ready to get started?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Book an appointment for {data.title} and we&apos;ll confirm
                  your slot and prepare everything in advance.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-5 w-full rounded-full shadow-ink"
                >
                  <Link
                    to="/appointments"
                    search={{ service: data.title }}
                    data-ocid="service_detail.book_button"
                  >
                    <CalendarCheck className="size-4" aria-hidden="true" />
                    Book this service
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="mt-3 w-full rounded-full"
                >
                  <a
                    href={whatsappLink(
                      `Hi, I'd like to ask about ${data.title}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="service_detail.whatsapp_link"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Ask on WhatsApp
                  </a>
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-6">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Service details
                </h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Availability</dt>
                    <dd className="font-medium text-foreground">
                      {data.active ? "Available" : "Unavailable"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Listed</dt>
                    <dd className="font-mono text-foreground">
                      {formatDate(data.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              <Button asChild variant="ghost" className="w-full rounded-full">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="service_detail.contact_link"
                >
                  Prefer to chat? Message us
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </aside>
          </div>
        )}
      </Section>
    </>
  );
}
