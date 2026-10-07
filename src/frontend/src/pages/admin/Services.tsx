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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/hooks/use-backend";
import type { Service } from "@/lib/api";
import { Pencil, Plus, Printer, Search, Trash2 } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

interface ServiceForm {
  title: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

const emptyForm: ServiceForm = {
  title: "",
  description: "",
  imageUrl: "",
  active: true,
};

export function AdminServicesPage() {
  const services = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);
  const [query, setQuery] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl ?? "",
      active: service.active,
    });
    setOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
      active: form.active,
    };
    if (editing) {
      updateService.mutate(
        { ...payload, id: editing.id },
        {
          onSuccess: () => {
            toast.success("Service updated");
            setOpen(false);
          },
          onError: () => toast.error("Could not update the service"),
        },
      );
    } else {
      createService.mutate(payload, {
        onSuccess: () => {
          toast.success("Service created");
          setOpen(false);
        },
        onError: () => toast.error("Could not create the service"),
      });
    }
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteService.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Service deleted");
        setPendingDelete(null);
      },
      onError: () => toast.error("Could not delete the service"),
    });
  }

  const list = services.data ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return list;
    return list.filter(
      (service) =>
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q),
    );
  }, [list, query]);
  const isSaving = createService.isPending || updateService.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Services
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage the services shown on your public site.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-full shadow-ink"
          onClick={openCreate}
          data-ocid="admin_services.add_button"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add service
        </Button>
      </div>

      {services.isLoading ? (
        <LoadingState label="Loading services…" />
      ) : services.isError ? (
        <ErrorState
          description="We couldn't load your services. Please try again."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void services.refetch()}
              data-ocid="admin_services.retry_button"
            >
              Retry
            </Button>
          }
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Printer className="size-6" aria-hidden="true" />}
          title="No services yet"
          description="Add your first service to display it on the public site."
          action={
            <Button
              type="button"
              className="rounded-full"
              onClick={openCreate}
              data-ocid="admin_services.empty_add_button"
            >
              Add service
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          <div className="relative max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              aria-label="Search services"
              className="pl-9"
              data-ocid="admin_services.search_input"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="size-6" aria-hidden="true" />}
              title="No matching services"
              description="Try a different search term."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filtered.map((service, index) => (
                <Card
                  key={service.id.toString()}
                  data-ocid={`admin_services.card.${index + 1}`}
                  className="rounded-2xl border shadow-subtle"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="font-display text-lg">
                        {service.title}
                      </CardTitle>
                      <Badge
                        variant={service.active ? "default" : "secondary"}
                        className="rounded-full uppercase tracking-wide"
                      >
                        {service.active ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openEdit(service)}
                        data-ocid={`admin_services.edit_button.${index + 1}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full text-destructive hover:text-destructive"
                        onClick={() => setPendingDelete(service)}
                        data-ocid={`admin_services.delete_button.${index + 1}`}
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
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin_services.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit service" : "Add service"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details for this service."
                : "Create a new service for your public site."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-title">Title</Label>
              <Input
                id="service-title"
                data-ocid="admin_services.title_input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                data-ocid="admin_services.description_textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-image">Image URL (optional)</Label>
              <Input
                id="service-image"
                data-ocid="admin_services.image_input"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="/assets/images/example.jpg"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label htmlFor="service-active" className="cursor-pointer">
                Visible on public site
              </Label>
              <Switch
                id="service-active"
                data-ocid="admin_services.active_switch"
                checked={form.active}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, active: checked }))
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setOpen(false)}
                data-ocid="admin_services.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full shadow-ink"
                disabled={isSaving}
                data-ocid="admin_services.save_button"
              >
                {isSaving ? "Saving…" : "Save service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="admin_services.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this service?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will be removed from your
              public site. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-full"
              data-ocid="admin_services.delete_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={deleteService.isPending}
              data-ocid="admin_services.delete_confirm_button"
            >
              {deleteService.isPending ? "Deleting…" : "Delete service"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
