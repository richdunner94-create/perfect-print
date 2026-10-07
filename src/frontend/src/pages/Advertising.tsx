import { PostCategory } from "@/backend";
import { PageHero, Section, SectionHeading } from "@/components/Section";
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
import { usePosts } from "@/hooks/use-backend";
import { formatDate, postCategoryLabels, whatsappLink } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Megaphone,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";

const categoryIcon = {
  [PostCategory.promotion]: Tag,
  [PostCategory.announcement]: Megaphone,
  [PostCategory.advertising]: Megaphone,
};

const advertisingPoints = [
  {
    title: "In-studio placement",
    description:
      "Feature your brand on our printed collateral and in-store displays seen by every walk-in customer.",
  },
  {
    title: "Digital spotlight",
    description:
      "Your promotion appears here on our site and across our social channels for the full campaign window.",
  },
  {
    title: "Print partnership",
    description:
      "Bundle your campaign with discounted print runs — banners, flyers, and signage produced in-house.",
  },
];

export function AdvertisingPage() {
  const posts = usePosts();
  const published = (posts.data ?? []).filter((p) => p.published);
  const campaigns = published.filter(
    (p) =>
      p.category === PostCategory.advertising ||
      p.category === PostCategory.promotion,
  );

  return (
    <>
      <PageHero
        eyebrow="Advertising & Promotions"
        title="Offers, announcements & advertising"
        description="Current promotions, studio announcements, and advertising opportunities — all in one place."
      >
        <Button asChild className="rounded-full shadow-ink">
          <Link to="/contact" data-ocid="advertising.contact_button">
            Advertise with us
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Current Campaigns"
          title="What's running right now"
          description="Promotions and advertising campaigns published by the studio. New offers appear here the moment they go live."
        />
        {posts.isLoading ? (
          <LoadingState label="Loading campaigns…" />
        ) : posts.isError ? (
          <ErrorState
            description="We couldn't load the current campaigns. Please try again."
            action={
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => void posts.refetch()}
                data-ocid="advertising.retry_button"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Try again
              </Button>
            }
          />
        ) : campaigns.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="size-6" aria-hidden="true" />}
            title="No campaigns yet"
            description="Promotions and advertising campaigns will appear here as soon as they're published."
            action={
              <Button asChild className="rounded-full">
                <Link to="/contact" data-ocid="advertising.empty_contact_link">
                  Get in touch
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {campaigns.map((post, index) => {
              const Icon = categoryIcon[post.category];
              return (
                <Card
                  key={post.id.toString()}
                  data-ocid={`advertising.card.${index + 1}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border shadow-subtle transition-smooth hover:-translate-y-0.5 hover:shadow-elevated"
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
                      <Icon
                        className="size-8 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full uppercase tracking-wide"
                      >
                        <Icon className="size-3" aria-hidden="true" />
                        {postCategoryLabels[post.category]}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="font-display text-xl">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-4 leading-relaxed">
                      {post.body}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full"
                    >
                      <Link
                        to="/contact"
                        data-ocid={`advertising.enquire_button.${index + 1}`}
                      >
                        Enquire
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="Advertise With Us"
          title="Put your brand in front of our customers"
          description="We partner with local businesses to run campaigns across our studio, print products, and online channels."
        />
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {advertisingPoints.map((point, index) => (
            <div
              key={point.title}
              data-ocid={`advertising.point.${index + 1}`}
              className="rounded-2xl border border-border bg-card p-6 shadow-subtle"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full shadow-ink">
            <Link to="/contact" data-ocid="advertising.cta_contact_button">
              Request a media kit
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a
              href={whatsappLink(
                "Hi! I'd like to learn more about advertising with Washington's Perfect Print.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="advertising.whatsapp_button"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </Section>
    </>
  );
}
