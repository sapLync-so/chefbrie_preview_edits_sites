"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildMailtoUrl, submitInquiry } from "@/lib/inquiry";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-md border border-border bg-bg px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/35 focus-visible:ring-2 focus-visible:ring-gold-bright";

export type InquiryField = {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  placeholder?: string;
  rows?: number;
};

type InquiryDialogProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  subject: string;
  formType: string;
  fields: InquiryField[];
  triggerClassName?: string;
  triggerVariant?: "default" | "outline";
};

export function InquiryDialog({
  triggerLabel,
  title,
  description,
  subject,
  formType,
  fields,
  triggerClassName,
  triggerVariant = "default",
}: InquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto">("idle");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setValues({});
    setStatus("idle");
    setError(null);
  };

  const buildBody = () =>
    fields.map((f) => `${f.label}: ${values[f.id]?.trim() || "—"}`).join("\n");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const body = buildBody();
    const result = await submitInquiry({ subject, body, formType });
    if (result.ok) {
      setStatus("sent");
      return;
    }
    if (result.preview) {
      window.location.href = buildMailtoUrl({ subject, body });
      setStatus("mailto");
      return;
    }
    setError(result.error ?? "Could not send. Please email Chef Brie directly.");
    setStatus("idle");
  };

  const allRequiredFilled = fields.every((f) => !f.required || (values[f.id]?.trim()?.length ?? 0) > 0);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <Dialog.Trigger asChild>
        <Button type="button" variant={triggerVariant} className={triggerClassName}>
          {triggerLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(100vw-2rem,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
            "rounded-lg border border-border bg-bg-elevated p-6 shadow-soft focus:outline-none"
          )}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-serif text-2xl font-light text-ink">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-2 font-sans text-sm leading-relaxed text-ink/65">
                  {description}
                </Dialog.Description>
              ) : null}
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
                <p>Your message was sent to Chef Brie. She will follow up soon.</p>
              ) : (
                <p>
                  This preview opened your email app with your message ready to send. On the live site at{" "}
                  <strong className="font-normal text-gold">chefbrie.llc</strong>, the same form posts to the contact
                  API when enabled.
                </p>
              )}
              <Button type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      required={field.required}
                      rows={field.rows ?? 4}
                      placeholder={field.placeholder}
                      value={values[field.id] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                      className={fieldClass}
                    />
                  ) : (
                    <input
                      id={field.id}
                      type={field.type ?? "text"}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={values[field.id] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                      className={fieldClass}
                    />
                  )}
                </div>
              ))}
              {error ? <p className="font-sans text-sm text-red-300">{error}</p> : null}
              <p className="font-sans text-xs leading-relaxed text-ink/45">
                In this public preview, submissions use the contact API when available or your email app via mailto. No
                third-party keys are stored in the repo.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={!allRequiredFilled || status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send inquiry"}
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
