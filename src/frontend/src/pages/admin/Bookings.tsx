import { BookingStatus } from "@/backend";
import { EmptyState, ErrorState, LoadingState } from "@/components/States";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useBookings,
  useDeleteBooking,
  useUpdateBookingStatus,
} from "@/hooks/use-backend";
import type { Booking } from "@/lib/api";
import {
  bookingStatusLabels,
  formatDateTime,
  formatPreferredDate,
} from "@/lib/format";
import { CalendarDays, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const statusStyles: Record<BookingStatus, string> = {
  [BookingStatus.pending]: "bg-warning/15 text-warning border-warning/30",
  [BookingStatus.confirmed]: "bg-info/15 text-info border-info/30",
  [BookingStatus.completed]: "bg-success/15 text-success border-success/30",
  [BookingStatus.cancelled]:
    "bg-destructive/15 text-destructive border-destructive/30",
};

type StatusFilter = BookingStatus | "all";

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge
      variant="outline"
      className={`rounded-full uppercase tracking-wide ${statusStyles[status]}`}
    >
      {bookingStatusLabels[status]}
    </Badge>
  );
}

function StatusSelect({
  booking,
  index,
  onChange,
}: {
  booking: Booking;
  index: number;
  onChange: (status: BookingStatus) => void;
}) {
  return (
    <Select
      value={booking.status}
      onValueChange={(value) => onChange(value as BookingStatus)}
    >
      <SelectTrigger
        size="sm"
        className="w-[8.5rem]"
        aria-label={`Status for ${booking.name}`}
        data-ocid={`admin_bookings.status_select.${index + 1}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(BookingStatus).map((status) => (
          <SelectItem key={status} value={status}>
            {bookingStatusLabels[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AdminBookingsPage() {
  const bookings = useBookings();
  const updateStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);

  const list = bookings.data ?? [];
  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? list
        : list.filter((booking) => booking.status === statusFilter),
    [list, statusFilter],
  );

  function handleStatusChange(booking: Booking, status: BookingStatus) {
    updateStatus.mutate(
      { id: booking.id, status },
      {
        onSuccess: () => toast.success("Booking status updated"),
        onError: () => toast.error("Could not update the booking status"),
      },
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteBooking.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Booking deleted");
        setPendingDelete(null);
      },
      onError: () => toast.error("Could not delete the booking"),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Bookings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review appointment requests and update their status.
          </p>
        </div>
        {list.length > 0 ? (
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger
              className="w-[11rem]"
              aria-label="Filter by status"
              data-ocid="admin_bookings.status_filter"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.values(BookingStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {bookingStatusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {bookings.isLoading ? (
        <LoadingState label="Loading bookings…" />
      ) : bookings.isError ? (
        <ErrorState
          description="We couldn't load your bookings. Please try again."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void bookings.refetch()}
              data-ocid="admin_bookings.retry_button"
            >
              Retry
            </Button>
          }
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-6" aria-hidden="true" />}
          title="No bookings yet"
          description="Appointment requests submitted through the public site will appear here."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-6" aria-hidden="true" />}
          title="No bookings with this status"
          description="Try a different status filter."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-2xl border border-border bg-card shadow-subtle md:block">
            <Table data-ocid="admin_bookings.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Preferred</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((booking, index) => (
                  <TableRow
                    key={booking.id.toString()}
                    data-ocid={`admin_bookings.row.${index + 1}`}
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {booking.name}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {booking.phone}
                      </div>
                      {booking.email ? (
                        <div className="text-xs text-muted-foreground">
                          {booking.email}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="max-w-[12rem] whitespace-normal">
                      <div className="text-sm text-foreground">
                        {booking.serviceType}
                      </div>
                      {booking.notes ? (
                        <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {booking.notes}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">
                        {formatPreferredDate(booking.preferredDate)}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {booking.preferredTime}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Requested {formatDateTime(booking.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <StatusSelect
                          booking={booking}
                          index={index}
                          onChange={(status) =>
                            handleStatusChange(booking, status)
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete booking from ${booking.name}`}
                          onClick={() => setPendingDelete(booking)}
                          data-ocid={`admin_bookings.delete_button.${index + 1}`}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-4 md:hidden">
            {filtered.map((booking, index) => (
              <Card
                key={booking.id.toString()}
                data-ocid={`admin_bookings.card.${index + 1}`}
                className="rounded-2xl border shadow-subtle"
              >
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {booking.name}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {booking.phone}
                      </p>
                      {booking.email ? (
                        <p className="break-all text-xs text-muted-foreground">
                          {booking.email}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground">{booking.serviceType}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPreferredDate(booking.preferredDate)} ·{" "}
                      <span className="font-mono">{booking.preferredTime}</span>
                    </p>
                    {booking.notes ? (
                      <p className="text-xs text-muted-foreground">
                        {booking.notes}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Requested {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <StatusSelect
                      booking={booking}
                      index={index}
                      onChange={(status) => handleStatusChange(booking, status)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      aria-label={`Delete booking from ${booking.name}`}
                      onClick={() => setPendingDelete(booking)}
                      data-ocid={`admin_bookings.delete_button.${index + 1}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="admin_bookings.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this booking?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The appointment request from {pendingDelete?.name} will be
              permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-full"
              data-ocid="admin_bookings.delete_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleteBooking.isPending}
              data-ocid="admin_bookings.delete_confirm_button"
            >
              {deleteBooking.isPending ? "Deleting…" : "Delete booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
