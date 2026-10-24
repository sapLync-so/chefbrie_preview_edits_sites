"use client";

import { useState } from "react";
import { HoneypotField } from "@/components/HoneypotField";
import { TurnstileField } from "@/components/TurnstileField";
import { useFormStartedAt } from "@/lib/form-client-meta";
import { Button } from "@/components/ui/button";
import { SERVICE_OPTIONS, type ServiceValue } from "@/lib/booking";
import { buildMailtoFromContact, buildMailtoUrl, submitContact } from "@/lib/inquiry";

type ContactFormProps = {
  defaultService?: ServiceValue | "";
  compact?: boolean;
};

const fieldClass =
  "w-full rounded-md border border-border bg-bg px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/35 focus-visible:ring-2 focus-visible:ring-gold-bright";

export function ContactForm({ defaultService = "", compact = false }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<ServiceValue | "">(defaultService);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const formStartedAt = useFormStartedAt();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("sending");

    const payload = {
      formType: "contact" as const,
      company_website: honeypot,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      service: service || undefined,
      message: message.trim(),
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
    setError(result.error ?? "Could not send. Please try again.");
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div
        className={`border border-gold/35 bg-bg-elevated p-8 text-center md:p-10 ${compact ? "" : "min-h-[420px]"}`}
      >
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold">Message sent</p>
        <p className="mt-4 font-sans text-sm text-ink/75">Thank you — Chef Brie will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative border border-border bg-bg-elevated p-8 md:p-10 ${compact ? "" : "min-h-[420px]"}`}
    >
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <h3 className="mb-6 font-serif text-2xl font-light text-ink">Send a message</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
            Name
          </label>
          <input
            id="contact-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
            Phone (optional)
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="contact-service" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
            Service (optional)
          </label>
          <select
            id="contact-service"
            value={service}
            onChange={(e) => setService(e.target.value as ServiceValue | "")}
            className={fieldClass}
          >
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={fieldClass}
          />
        </div>
        <TurnstileField onToken={setTurnstileToken} />
        {error ? <p className="font-sans text-sm text-red-300">{error}</p> : null}
        <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
