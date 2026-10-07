import { PageHero, Section, SectionHeading } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactMessage } from "@/hooks/use-backend";
import { WHATSAPP_URL } from "@/lib/format";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const emptyForm: FormState = { name: "", email: "", phone: "", message: "" };

const openingHours = [
  { days: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
  { days: "Saturday", hours: "10:00 AM – 4:00 PM" },
  { days: "Sunday", hours: "Closed" },
];

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (206) 555-0142",
    href: "tel:+12065550142",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@washingtonsperfectprint.com",
    href: "mailto:hello@washingtonsperfectprint.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "1420 Western Ave, Seattle, WA 98101",
    href: null,
  },
];

export function ContactPage() {
  const submitMessage = useSubmitContactMessage();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { ...form };
    setForm(emptyForm);
    submitMessage.mutate(payload, {
      onSuccess: () => {
        setSubmitted(true);
        toast.success("Message sent", {
          description: "We'll get back to you as soon as we can.",
        });
      },
      onError: () => {
        setForm(payload);
        toast.error("Could not send your message", {
          description: "Please try again or reach us on WhatsApp.",
        });
      },
    });
  }

  const canSubmit =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.message.trim() !== "";

  return (
    <>
      <PageHero
        eyebrow="Contact & About"
        title="Let's talk about your project"
        description="Washington's Perfect Print is a Seattle print and visa studio. Reach out with a question, a quote request, or just to say hello."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {submitted ? (
              <div
                data-ocid="contact.success_state"
                className="flex flex-col items-center gap-4 rounded-2xl border border-success/30 bg-success/5 px-6 py-14 text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Message sent
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thanks for reaching out. We&apos;ve received your message and
                  will reply shortly.
                </p>
                <Button
                  type="button"
                  className="rounded-full shadow-ink"
                  onClick={() => setSubmitted(false)}
                  data-ocid="contact.new_message_button"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-subtle md:p-8"
                data-ocid="contact.form"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Full name</Label>
                    <Input
                      id="contact-name"
                      data-ocid="contact.name_input"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      data-ocid="contact.email_input"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone (optional)</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    data-ocid="contact.phone_input"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+1 (206) 555-0142"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    data-ocid="contact.message_textarea"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="How can we help?"
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full shadow-ink"
                  disabled={!canSubmit || submitMessage.isPending}
                  data-ocid="contact.submit_button"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {submitMessage.isPending ? "Sending…" : "Send message"}
                </Button>
                {!canSubmit ? (
                  <p className="text-center text-xs text-muted-foreground">
                    Add your name, email, and a message to send.
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Visit or call
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                {contactDetails.map((detail) => (
                  <li key={detail.label} className="flex items-start gap-3">
                    <detail.icon
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="break-all transition-smooth hover:text-foreground"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <span>{detail.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                <Clock className="size-5 text-primary" aria-hidden="true" />
                Opening hours
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {openingHours.map((entry) => (
                  <div
                    key={entry.days}
                    className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-muted-foreground">{entry.days}</dt>
                    <dd className="font-mono text-xs text-foreground">
                      {entry.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
              <h2 className="font-display text-xl font-semibold text-foreground">
                About the studio
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We combine a print workshop&apos;s attention to detail with
                practical visa guidance — two services, one trusted team.
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
                  data-ocid="contact.whatsapp_link"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <Section muted>
        <SectionHeading
          eyebrow="About Us"
          title="A Seattle print & visa studio"
          description="Washington's Perfect Print has served Seattle businesses and travellers for over fifteen years."
        />
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Who we are
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A family-run studio on Western Avenue, pairing commercial printing
              with hands-on visa document support for our neighbours.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
            <h3 className="font-display text-lg font-semibold text-foreground">
              What we do
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Business cards, banners, and signage produced in-house, plus
              guidance for visa applications to China, France, and the USA.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle">
            <h3 className="font-display text-lg font-semibold text-foreground">
              How to reach us
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Call, email, or send the form above. For the fastest reply,
              message us on WhatsApp during opening hours.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
