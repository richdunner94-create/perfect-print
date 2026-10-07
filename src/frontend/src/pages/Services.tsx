import { PageHero, Section } from "@/components/Section";
import { EmptyState, LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServices } from "@/hooks/use-backend";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Printer } from "lucide-react";

export function ServicesPage() {
  const services = useServices();
  const activeServices = (services.data ?? []).filter((s) => s.active);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Printing & signage for every need"
        description="Business cards, banners, signage, and more — produced with premium stock and a craftsman's eye for detail."
      >
        <Button asChild className="rounded-full shadow-ink">
          <Link to="/appointments" data-ocid="services.book_button">
            Book an Appointment
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <Section>
        {services.isLoading ? (
          <LoadingState label="Loading services…" />
        ) : activeServices.length === 0 ? (
          <EmptyState
            icon={<Printer className="size-6" aria-hidden="true" />}
            title="No services listed yet"
            description="Our catalogue is being updated. Reach out and we'll help with your project directly."
            action={
              <Button asChild className="rounded-full">
                <Link to="/contact" data-ocid="services.empty_contact_link">
                  Contact us
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {activeServices.map((service, index) => (
              <Card
                key={service.id.toString()}
                data-ocid={`services.card.${index + 1}`}
                className="group overflow-hidden rounded-2xl border shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <Link
                  to="/services/$serviceId"
                  params={{ serviceId: service.id.toString() }}
                  data-ocid={`services.card_link.${index + 1}`}
                  className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="aspect-[16/10] w-full object-cover transition-smooth group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[16/10] w-full items-center justify-center bg-secondary">
                      <Printer
                        className="size-8 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="font-display text-xl">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <div className="flex items-center gap-1.5 px-6 pb-6 text-sm font-semibold text-primary transition-smooth group-hover:gap-2.5">
                    View details
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
