import { ErrorState, LoadingState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardCounts } from "@/hooks/use-backend";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Mail,
  Newspaper,
  Printer,
  Stamp,
} from "lucide-react";

export function AdminDashboardPage() {
  const counts = useDashboardCounts();

  const stats = [
    {
      label: "Services",
      value: counts.data?.services,
      icon: Printer,
      to: "/admin/services" as const,
    },
    {
      label: "Posts",
      value: counts.data?.posts,
      icon: Newspaper,
      to: "/admin/posts" as const,
    },
    {
      label: "Pending appointments",
      value: counts.data?.pendingAppointments,
      icon: CalendarDays,
      to: "/admin/bookings" as const,
    },
    {
      label: "Total appointments",
      value: counts.data?.totalAppointments,
      icon: Stamp,
      to: "/admin/bookings" as const,
    },
    {
      label: "Contact messages",
      value: counts.data?.contactMessages,
      icon: Mail,
      to: "/admin/messages" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An overview of your site&apos;s content and activity.
        </p>
      </div>

      {counts.isLoading ? (
        <LoadingState label="Loading dashboard…" />
      ) : counts.isError ? (
        <ErrorState
          description="We couldn't load your dashboard counts. Please try again."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void counts.refetch()}
              data-ocid="admin_dashboard.retry_button"
            >
              Retry
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              data-ocid={`admin.stat.${stat.label.toLowerCase().replace(/\s+/g, "_")}`}
              className="rounded-2xl border shadow-subtle transition-smooth hover:shadow-elevated"
            >
              <CardHeader className="flex-row items-center justify-between gap-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <stat.icon className="size-4" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-3xl font-bold text-foreground">
                  {stat.value !== undefined ? stat.value.toString() : "—"}
                </p>
                <Button
                  asChild
                  variant="link"
                  className="mt-2 h-auto p-0 text-sm"
                >
                  <Link
                    to={stat.to}
                    data-ocid={`admin.stat_link.${stat.label.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    Manage
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
