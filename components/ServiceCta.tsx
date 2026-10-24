"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InquiryDialog, type InquiryField } from "@/components/InquiryDialog";
import type { ContactSubmitPayload } from "@/lib/inquiry";
import type { ServiceValue } from "@/lib/booking";

const quoteFields: InquiryField[] = [
  { id: "name", label: "Your name", required: true },
  { id: "email", label: "Email", type: "email", required: true },
  { id: "phone", label: "Phone", type: "tel" },
  {
    id: "details",
    label: "Tell us about your event",
    type: "textarea",
    required: true,
    rows: 5,
    placeholder: "Guest count, date, venue, menu ideas, dietary needs…",
  },
];

type ServiceCtaProps = {
  service: ServiceValue;
  primaryLabel?: string;
  menuHref?: string;
  /** Opens an inquiry dialog instead of linking to contact (e.g. Request a Quote). */
  inquiryMode?: "quote" | "artist";
};

export function ServiceCta({
  service,
  primaryLabel = "Book Now",
  menuHref,
  inquiryMode,
}: ServiceCtaProps) {
  const bookHref =
    service === "meal-prep" ? "/demo/book?service=meal-prep" : `/?service=${service}#contact`;

  return (
    <div className="mt-10 flex flex-wrap gap-4">
      {inquiryMode === "quote" ? (
        <InquiryDialog
          triggerLabel={primaryLabel}
          title="Request a quote"
          description="Describe your micro-catering needs and Chef Brie will follow up with pricing and availability."
          formType="micro-catering-quote"
          fields={quoteFields}
        />
      ) : inquiryMode === "artist" ? (
        <InquiryDialog
          triggerLabel={primaryLabel}
          title="Artist application"
          description="Apply to showcase your work at an upcoming Brie's Supper Club evening."
          formType="supper-club-artist"
          fields={[
            { id: "artistName", label: "Artist name", required: true },
            { id: "medium", label: "Medium", required: true, placeholder: "Painting, photography, music…" },
            { id: "location", label: "Location", required: true },
            { id: "contact", label: "Contact info (email / phone)", required: true },
            {
              id: "whyJoin",
              label: "Why do you want to join?",
              type: "textarea",
              required: true,
              rows: 4,
            },
          ]}
        />
      ) : service === "meal-prep" ? (
        <Button asChild>
          <Link href={bookHref}>{primaryLabel}</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href={bookHref}>{primaryLabel}</Link>
        </Button>
      )}
      {menuHref && (
        <Button asChild variant="outline">
          <Link href={menuHref}>View Menu</Link>
        </Button>
      )}
    </div>
  );
}
