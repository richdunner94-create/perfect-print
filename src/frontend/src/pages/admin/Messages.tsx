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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useContactMessages,
  useDeleteContactMessage,
} from "@/hooks/use-backend";
import type { ContactMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminMessagesPage() {
  const messages = useContactMessages();
  const deleteMessage = useDeleteContactMessage();
  const [pendingDelete, setPendingDelete] = useState<ContactMessage | null>(
    null,
  );

  const list = messages.data ?? [];

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteMessage.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Message deleted");
        setPendingDelete(null);
      },
      onError: () => toast.error("Could not delete the message"),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Contact messages
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Messages submitted through the public contact form.
        </p>
      </div>

      {messages.isLoading ? (
        <LoadingState label="Loading messages…" />
      ) : messages.isError ? (
        <ErrorState
          description="We couldn't load your messages. Please try again."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void messages.refetch()}
              data-ocid="admin_messages.retry_button"
            >
              Retry
            </Button>
          }
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Mail className="size-6" aria-hidden="true" />}
          title="No messages yet"
          description="Messages from the contact form will appear here."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {list.map((message, index) => (
            <Card
              key={message.id.toString()}
              data-ocid={`admin_messages.card.${index + 1}`}
              className="rounded-2xl border shadow-subtle"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="font-display text-lg">
                      {message.name}
                    </CardTitle>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      {message.email}
                    </p>
                    {message.phone ? (
                      <p className="font-mono text-xs text-muted-foreground">
                        {message.phone}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {formatDateTime(message.createdAt)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {message.message}
                </p>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <a
                      href={`mailto:${message.email}`}
                      data-ocid={`admin_messages.reply_button.${index + 1}`}
                    >
                      <Mail className="size-3.5" aria-hidden="true" />
                      Reply
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(message)}
                    data-ocid={`admin_messages.delete_button.${index + 1}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="admin_messages.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this message?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The message from {pendingDelete?.name} will be permanently
              removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-full"
              data-ocid="admin_messages.delete_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleteMessage.isPending}
              data-ocid="admin_messages.delete_confirm_button"
            >
              {deleteMessage.isPending ? "Deleting…" : "Delete message"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
