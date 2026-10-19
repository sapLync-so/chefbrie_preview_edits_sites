"use client";

import type { ServiceValue } from "@/lib/booking";

type ContactFormProps = {
  defaultService?: ServiceValue | "";
  compact?: boolean;
};

/** Client preview: form UI is shown for layout only; nothing is submitted. */
export function ContactForm({ compact = false }: ContactFormProps) {
  return (
    <div
      className={`border border-[#c9a96e]/30 bg-[#0d0d0d]/40 p-8 md:p-10 ${compact ? "" : "min-h-[420px]"}`}
      role="status"
    >
      <p className="mb-2 text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        Preview only
      </p>
      <h3 className="mb-3 text-center font-serif text-2xl font-light text-[#f5f0e8]">Contact form disabled</h3>
      <p className="mx-auto max-w-md text-center font-sans text-sm font-light leading-relaxed text-[#f5f0e8]/55">
        This public demo shows the proposed layout and styling. Inquiries are not sent or stored here. For a real
        booking, use the live site at{" "}
        <a href="https://chefbrie.llc" className="text-gold underline decoration-gold/50 underline-offset-2">
          chefbrie.llc
        </a>
        .
      </p>
    </div>
  );
}
