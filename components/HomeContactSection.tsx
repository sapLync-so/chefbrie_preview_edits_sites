"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import type { ServiceValue } from "@/lib/booking";

const VALID_SERVICES = new Set<ServiceValue>(["meal-prep", "micro-catering", "tasting-popup", "other"]);

function ContactWithParams() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("service") ?? "";
  const defaultService = VALID_SERVICES.has(raw as ServiceValue) ? (raw as ServiceValue) : "";

  return <ContactForm defaultService={defaultService} />;
}

export function HomeContactSection() {
  return (
    <Suspense fallback={<ContactForm />}>
      <ContactWithParams />
    </Suspense>
  );
}
