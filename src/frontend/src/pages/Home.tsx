import { PostCategory } from "@/backend";
import { Section, SectionHeading } from "@/components/Section";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePosts, useServices, useVisas } from "@/hooks/use-backend";
import {
  WHATSAPP_URL,
  formatDate,
  postCategoryLabels,
  visaCountryFlags,
  visaCountryLabels,
} from "@/lib/format";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Megaphone,
  MessageCircle,
  Newspaper,
  Printer,
  Stamp,
  Truck,
} from "lucide-react";

const highlights = [
  {
    icon: BadgeCheck,
    title: "Craftsmanship",
    description: "Every job inspected by hand before it leaves the studio.",
  },
  {
    icon: Truck,
    title: "Fast Turnaround",
    description: "Same-week production on most print and signage orders.",
  },
  {
    icon: Stamp,
    title: "Visa Expertise",
    description: "Document guidance for China, France, and the USA.",
  },
];

export function HomePage() {
  const services = useServices();
  const posts = usePosts();
  const visas = useVisas();

  const activeServices = (services.data ?? []).filter((s) => s.active);
  const publishedPosts = (posts.data ?? []).filter((p) => p.published);
  const promotion = publishedPosts.find(
    (p) => p.category === PostCategory.promotion,
  );
  const announcements = publishedPosts
    .filter((p) => p.category !== PostCategory.promotion)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-subtle">
        <div
          aria-hidden="true"
          className="texture-paper pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-up">
            <Badge className="mb-5 rounded-full border-transparent bg-accent text-accent-foreground">
              Seattle&apos;s Print &amp; Visa Studio
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Premium Printing.
              <br />
              Seamless Visa Support.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Your trusted partner in Seattle for business cards, banners,
              signage, and expert visa assistance — delivered with the care of a
              true print workshop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full shadow-ink">
                <Link to="/appointments" data-ocid="home.book_button">
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  Book an Appointment
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full"
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="home.whatsapp_button"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
              <img
                src="/assets/images/hero-print-studio.jpg"
                alt="A print workshop bench with freshly printed business cards, ink swatches, and a visa stamp"
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-elevated sm:block">
              <p className="font-mono text-2xl font-bold text-primary">15+</p>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Years of craft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {highlights.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section muted>
        <SectionHeading
          eyebrow="What We Do"
          title="Printing & signage, done right"
          description="From a single business card run to full storefront signage, we handle the details so your brand looks sharp."
        />
        {services.isLoading ? (
          <LoadingState label="Loading services…" />
        ) : services.isError ? (
          <ErrorState
            description="We couldn't load our services right now. Please try again or reach out on WhatsApp."
            action={
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void services.refetch()}
                data-ocid="home.services_retry_button"
              >
                Try again
              </Button>
            }
          />
        ) : activeServices.length === 0 ? (
          <EmptyState
            icon={<Printer className="size-6" aria-hidden="true" />}
            title="Services coming soon"
            description="Our service catalogue is being updated. Check back shortly or reach out on WhatsApp."
            action={
              <Button asChild className="rounded-full">
                <Link to="/services" data-ocid="home.services_empty_link">
                  View services
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {activeServices.slice(0, 6).map((service, index) => (
              <Card
                key={service.id.toString()}
                data-ocid={`home.service_card.${index + 1}`}
                className="group overflow-hidden rounded-2xl border shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated"
              >
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="aspect-[16/10] w-full object-cover"
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
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-10">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/services" data-ocid="home.all_services_link">
              Explore all services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Promotion */}
      {promotion ? (
        <Section>
          <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-accent px-6 py-10 text-accent-foreground shadow-elevated md:px-12 md:py-14">
            <div
              aria-hidden="true"
              className="texture-paper pointer-events-none absolute inset-0 opacity-30"
            />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <Badge className="mb-4 rounded-full border-transparent bg-accent-foreground/15 text-accent-foreground">
                  <Megaphone className="size-3" aria-hidden="true" />
                  {postCategoryLabels[promotion.category]}
                </Badge>
                <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {promotion.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed opacity-90 md:text-base">
                  {promotion.body}
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-wider opacity-75">
                  {formatDate(promotion.createdAt)}
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="shrink-0 rounded-full bg-accent-foreground text-accent hover:bg-accent-foreground/90"
              >
                <Link to="/advertising" data-ocid="home.promo_button">
                  See the offer
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      ) : null}

      {/* Announcements */}
      <Section muted>
        <SectionHeading
          eyebrow="Latest News"
          title="Announcements & updates"
          description="News, seasonal notices, and studio updates published by our team."
        />
        {posts.isLoading ? (
          <LoadingState label="Loading announcements…" />
        ) : posts.isError ? (
          <ErrorState
            description="We couldn't load the latest updates right now. Please try again shortly."
            action={
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void posts.refetch()}
                data-ocid="home.posts_retry_button"
              >
                Try again
              </Button>
            }
          />
        ) : announcements.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="size-6" aria-hidden="true" />}
            title="No announcements yet"
            description="We haven't published any updates yet. Follow along — news and seasonal notices will appear here."
            action={
              <Button asChild className="rounded-full">
                <Link to="/advertising" data-ocid="home.posts_empty_link">
                  View promotions
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {announcements.map((post, index) => (
              <Card
                key={post.id.toString()}
                data-ocid={`home.post_card.${index + 1}`}
                className="flex flex-col overflow-hidden rounded-2xl border shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated"
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center bg-secondary">
                    <Newspaper
                      className="size-8 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-full text-[0.65rem] uppercase tracking-wider"
                    >
                      {postCategoryLabels[post.category]}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="font-display text-xl">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {post.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Visa assistance */}
      <Section>
        <SectionHeading
          eyebrow="Visa Assistance"
          title="Guidance for your next journey"
          description="We help you prepare and organise the documents for visa applications to three destinations."
        />
        {visas.isLoading ? (
          <LoadingState label="Loading visa services…" />
        ) : visas.isError ? (
          <ErrorState
            description="We couldn't load visa guidance right now. Please try again or contact us directly."
            action={
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void visas.refetch()}
                data-ocid="home.visas_retry_button"
              >
                Try again
              </Button>
            }
          />
        ) : (visas.data ?? []).length === 0 ? (
          <EmptyState
            icon={<Stamp className="size-6" aria-hidden="true" />}
            title="Visa details coming soon"
            description="Our visa guidance pages are being prepared. Contact us for current requirements."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {(visas.data ?? []).map((visa, index) => (
              <Card
                key={visa.country}
                data-ocid={`home.visa_card.${index + 1}`}
                className="rounded-2xl border shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <CardHeader>
                  <span className="text-3xl" aria-hidden="true">
                    {visaCountryFlags[visa.country]}
                  </span>
                  <CardTitle className="font-display text-xl">
                    {visaCountryLabels[visa.country]}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {visa.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to="/visa-services"
                    data-ocid={`home.visa_link.${index + 1}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-smooth hover:gap-2.5"
                  >
                    Request assistance
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section muted>
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-subtle md:px-12 md:py-16">
          <CalendarCheck
            className="mx-auto mb-5 size-8 text-primary"
            aria-hidden="true"
          />
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to start your project?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Book an appointment and tell us what you need. We&apos;ll take it
            from there.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full shadow-ink">
              <Link to="/appointments" data-ocid="home.cta_book_button">
                Book an Appointment
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <Link to="/contact" data-ocid="home.cta_contact_button">
                Contact us
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
