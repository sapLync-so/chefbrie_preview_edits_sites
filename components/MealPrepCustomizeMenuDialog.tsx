"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { HoneypotField } from "@/components/HoneypotField";
import { TurnstileField } from "@/components/TurnstileField";
import { Button } from "@/components/ui/button";
import { useFormStartedAt } from "@/lib/form-client-meta";
import {
  buildMailtoFromContact,
  buildMailtoUrl,
  submitContact,
  type ContactSubmitPayload,
} from "@/lib/inquiry";
import type { MealPrepIntakeData } from "@/lib/meal-prep-intake";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-md border border-border bg-bg px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/35 focus-visible:ring-2 focus-visible:ring-gold-bright";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  request: string;
};

function prefillFromIntake(intake: MealPrepIntakeData): FormValues {
  const emailPhone = intake.emailPhone.trim();
  const emailMatch = emailPhone.match(/[^\s,]+@[^\s,]+\.[^\s,]+/);
  let email = "";
  let phone = "";
  if (emailMatch) {
    email = emailMatch[0];
    phone = emailPhone.replace(emailMatch[0], "").replace(/[·|,]/g, " ").trim();
  } else {
    phone = emailPhone;
  }
  return {
    name: intake.clientName.trim(),
    email,
    phone,
    request: "",
  };
}

type MealPrepCustomizeMenuDialogProps = {
  intake: MealPrepIntakeData;
};

export function MealPrepCustomizeMenuCallout({ intake }: MealPrepCustomizeMenuDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(() => prefillFromIntake(intake));
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const formStartedAt = useFormStartedAt();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(prefillFromIntake(intake));
      setStatus("idle");
      setError(null);
    }
  }, [open, intake]);

  const reset = () => {
    setHoneypot("");
    setTurnstileToken("");
    setStatus("idle");
    setError(null);
  };

  const canSubmit =
    values.name.trim().length > 0 &&
    values.email.trim().length > 0 &&
    values.phone.trim().length > 0 &&
    values.request.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setError(null);

    const payload: ContactSubmitPayload = {
      formType: "meal-prep-custom-menu",
      company_website: honeypot,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      request: values.request.trim(),
    };

    const result = await submitContact(payload, { formStartedAt, turnstileToken: turnstileToken || undefined });
    if (result.ok) {
      setStatus("sent");
      return;
    }
    if (result.preview) {
      window.location.href = buildMailtoUrl(buildMailtoFromContact(payload));
      setStatus("mailto");
      return;
    }
    setError(result.error ?? "Could not send. Please email Chef Brie directly.");
    setStatus("idle");
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <div className="rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 font-sans text-sm leading-relaxed text-ink/75">
        Don&apos;t see what you like?{" "}
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="font-medium text-gold underline decoration-gold/50 underline-offset-2 hover:text-gold-bright"
          >
            Customize menu
          </button>
        </Dialog.Trigger>
        , and Bri will reach out to talk further.
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(100vw-2rem,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
            "rounded-lg border border-border bg-bg-elevated p-6 shadow-soft focus:outline-none"
          )}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-serif text-2xl font-light text-ink">Customize your menu</Dialog.Title>
              <Dialog.Description className="mt-2 font-sans text-sm leading-relaxed text-ink/65">
                Tell Bri what you&apos;d prefer — simpler plates, different proteins, or anything off the rotation.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md p-1 text-ink/50 hover:text-gold focus-visible:ring-2 focus-visible:ring-gold-bright"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {status === "sent" || status === "mailto" ? (
            <div className="space-y-4 font-sans text-sm text-ink/75">
              {status === "sent" ? (
                <p className="text-gold">Thank you — Bri received your custom menu request and will be in touch soon.</p>
              ) : (
                <p>
                  The server is not configured for this preview, so your email app opened with your message ready to
                  send.
                </p>
              )}
              <Button type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative space-y-4">
              <HoneypotField value={honeypot} onChange={setHoneypot} />
              <div>
                <label htmlFor="custom-menu-name" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  Name
                </label>
                <input
                  id="custom-menu-name"
                  required
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="custom-menu-email" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  Email
                </label>
                <input
                  id="custom-menu-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="custom-menu-phone" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  Phone
                </label>
                <input
                  id="custom-menu-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="custom-menu-request" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  What would you like?
                </label>
                <textarea
                  id="custom-menu-request"
                  required
                  rows={4}
                  placeholder="e.g. chicken, rice, and vegetables each week"
                  value={values.request}
                  onChange={(e) => setValues((v) => ({ ...v, request: e.target.value }))}
                  className={fieldClass}
                />
              </div>
              <TurnstileField onToken={setTurnstileToken} />
              {error ? <p className="font-sans text-sm text-red-300">{error}</p> : null}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={!canSubmit || status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send request"}
                </Button>
                <Dialog.Close asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
