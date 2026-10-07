import { EmptyState, ErrorState, LoadingState } from "@/components/States";
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateVisa, useVisas } from "@/hooks/use-backend";
import type { VisaDetails } from "@/lib/api";
import { visaCountryFlags, visaCountryLabels } from "@/lib/format";
import { Pencil, Stamp } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface VisaForm {
  title: string;
  description: string;
  requirements: string;
  processingInfo: string;
  fees: string;
}

const emptyForm: VisaForm = {
  title: "",
  description: "",
  requirements: "",
  processingInfo: "",
  fees: "",
};

export function AdminVisasPage() {
  const visas = useVisas();
  const updateVisa = useUpdateVisa();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VisaDetails | null>(null);
  const [form, setForm] = useState<VisaForm>(emptyForm);

  function openEdit(visa: VisaDetails) {
    setEditing(visa);
    setForm({
      title: visa.title,
      description: visa.description,
      requirements: visa.requirements,
      processingInfo: visa.processingInfo,
      fees: visa.fees,
    });
    setOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    updateVisa.mutate(
      {
        country: editing.country,
        title: form.title.trim(),
        description: form.description.trim(),
        requirements: form.requirements.trim(),
        processingInfo: form.processingInfo.trim(),
        fees: form.fees.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Visa details updated");
          setOpen(false);
        },
        onError: () => toast.error("Could not update the visa details"),
      },
    );
  }

  const list = visas.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Visa services
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit the visa guidance shown for each destination.
        </p>
      </div>

      {visas.isLoading ? (
        <LoadingState label="Loading visa services…" />
      ) : visas.isError ? (
        <ErrorState
          description="We couldn't load the visa details. Please try again."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void visas.refetch()}
              data-ocid="admin_visas.retry_button"
            >
              Retry
            </Button>
          }
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Stamp className="size-6" aria-hidden="true" />}
          title="No visa details"
          description="Visa guidance for each destination will appear here once configured."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {list.map((visa, index) => (
            <Card
              key={visa.country}
              data-ocid={`admin_visas.card.${index + 1}`}
              className="rounded-2xl border shadow-subtle"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {visaCountryFlags[visa.country]}
                  </span>
                  <div>
                    <Badge
                      variant="secondary"
                      className="mb-1 rounded-full uppercase tracking-wide"
                    >
                      {visaCountryLabels[visa.country]}
                    </Badge>
                    <CardTitle className="font-display text-lg">
                      {visa.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {visa.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>
                    <span className="font-semibold uppercase tracking-wider">
                      Fees:
                    </span>{" "}
                    <span className="font-mono">{visa.fees}</span>
                  </span>
                  <span>
                    <span className="font-semibold uppercase tracking-wider">
                      Processing:
                    </span>{" "}
                    {visa.processingInfo}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => openEdit(visa)}
                  data-ocid={`admin_visas.edit_button.${index + 1}`}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                  Edit details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-ocid="admin_visas.dialog"
          className="max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Edit {editing ? visaCountryLabels[editing.country] : ""} visa
            </DialogTitle>
            <DialogDescription>
              Update the guidance shown on the public visa services page.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visa-title">Title</Label>
              <Input
                id="visa-title"
                data-ocid="admin_visas.title_input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visa-description">Description</Label>
              <Textarea
                id="visa-description"
                data-ocid="admin_visas.description_textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visa-requirements">
                Requirements (one per line)
              </Label>
              <Textarea
                id="visa-requirements"
                data-ocid="admin_visas.requirements_textarea"
                value={form.requirements}
                onChange={(e) =>
                  setForm((f) => ({ ...f, requirements: e.target.value }))
                }
                rows={4}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="visa-processing">Processing info</Label>
                <Input
                  id="visa-processing"
                  data-ocid="admin_visas.processing_input"
                  value={form.processingInfo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, processingInfo: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visa-fees">Fees</Label>
                <Input
                  id="visa-fees"
                  data-ocid="admin_visas.fees_input"
                  value={form.fees}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fees: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setOpen(false)}
                data-ocid="admin_visas.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full shadow-ink"
                disabled={updateVisa.isPending}
                data-ocid="admin_visas.save_button"
              >
                {updateVisa.isPending ? "Saving…" : "Save details"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
