import { PageHero, Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking, useServices } from "@/hooks/use-backend";
import { WHATSAPP_URL } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearch } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      /^[+]?[\d\s().-]{7,20}$/,
      "Enter a valid phone number (at least 7 digits).",
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  serviceType: z.string().min(1, "Please choose a service."),
  preferredDate: z.string().min(1, "Please choose a preferred date."),
  preferredTime: z.string().min(1, "Please choose a preferred time."),
  notes: z.string().trim().max(600, "Please keep notes under 600 characters."),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const emptyValues: BookingFormValues = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
};

const steps = [
  {
    title: "Submit your request",
    body: "Share your details and the date and time that suit you best.",
  },
  {
    title: "We confirm your slot",
    body: "Our team reviews your request and confirms availability by phone or WhatsApp.",
  },
  {
    title: "Come in prepared",
    body: "Bring your files or artwork — we'll have everything ready for your visit.",
  },
];

export function AppointmentsPage() {
  const services = useServices();
  const createBooking = useCreateBooking();
  const search = useSearch({ from: "/appointments" });
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: emptyValues,
    mode: "onTouched",
  });

  const activeServices = useMemo(
    () => (services.data ?? []).filter((s) => s.active),
    [services.data],
  );

  const preselected = search.service?.trim() ?? "";

  // Pre-fill the service field once, from a query param set by the
  // Services / Visa Services pages. Never overwrites a user's own choice.
  useEffect(() => {
    if (!preselected) return;
    if (form.getValues("serviceType")) return;
    form.setValue("serviceType", preselected, { shouldValidate: false });
  }, [preselected, form]);

  // A pre-selected value (e.g. "Visa assistance — China") may not match a
  // catalogue service, so surface it as its own option to keep the trigger
  // populated and the value submittable.
  const serviceOptions = useMemo(() => {
    const titles = activeServices.map((s) => s.title);
    const options = [...titles, "Visa assistance", "General inquiry"];
    if (preselected && !options.includes(preselected)) {
      options.unshift(preselected);
    }
    return options;
  }, [activeServices, preselected]);

  function onSubmit(values: BookingFormValues) {
    createBooking.mutate(values, {
      onSuccess: () => {
        setSubmitted(true);
        form.reset(emptyValues);
        toast.success("Appointment request received", {
          description: "We'll confirm your booking shortly.",
        });
      },
      onError: () => {
        toast.error("Could not submit your request", {
          description: "Please try again or message us on WhatsApp.",
        });
      },
    });
  }

  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Book your appointment"
        description="Tell us what you need and when you'd like to come in. We'll confirm your slot and have everything ready before you arrive."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            {submitted ? (
              <div
                data-ocid="appointments.success_state"
                className="flex flex-col items-center gap-4 rounded-2xl border border-success/30 bg-success/5 px-6 py-14 text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Request received
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thank you. We&apos;ve received your appointment request and
                  will confirm it shortly. For anything urgent, message us on
                  WhatsApp.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    type="button"
                    className="rounded-full shadow-ink"
                    onClick={() => setSubmitted(false)}
                    data-ocid="appointments.new_request_button"
                  >
                    Book another appointment
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="appointments.success_whatsapp_link"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      WhatsApp us
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-subtle md:p-8"
                  data-ocid="appointments.form"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="name"
                              placeholder="Jane Doe"
                              data-ocid="appointments.name_input"
                            />
                          </FormControl>
                          <FormMessage data-ocid="appointments.name_error" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              autoComplete="tel"
                              placeholder="+1 (206) 555-0142"
                              data-ocid="appointments.phone_input"
                            />
                          </FormControl>
                          <FormMessage data-ocid="appointments.phone_error" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            autoComplete="email"
                            placeholder="jane@example.com"
                            data-ocid="appointments.email_input"
                          />
                        </FormControl>
                        <FormMessage data-ocid="appointments.email_error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="w-full"
                              data-ocid="appointments.service_select"
                            >
                              <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceOptions.map((title) => (
                              <SelectItem key={title} value={title}>
                                {title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Printing services, a consultation, or visa assistance.
                        </FormDescription>
                        <FormMessage data-ocid="appointments.service_error" />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred date</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              data-ocid="appointments.date_input"
                            />
                          </FormControl>
                          <FormMessage data-ocid="appointments.date_error" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred time</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger
                                className="w-full"
                                data-ocid="appointments.time_select"
                              >
                                <SelectValue placeholder="Choose a time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage data-ocid="appointments.time_error" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Tell us about your project, quantity, or any deadlines."
                            data-ocid="appointments.notes_textarea"
                          />
                        </FormControl>
                        <FormMessage data-ocid="appointments.notes_error" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full shadow-ink"
                    disabled={createBooking.isPending}
                    data-ocid="appointments.submit_button"
                  >
                    <CalendarCheck className="size-4" aria-hidden="true" />
                    {createBooking.isPending
                      ? "Submitting…"
                      : "Request appointment"}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                What to expect
              </h2>
              <ol className="mt-4 space-y-4">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="font-mono text-sm font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Prefer to chat?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Message us on WhatsApp and we&apos;ll help you book directly.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 w-full rounded-full"
              >
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="appointments.whatsapp_link"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
