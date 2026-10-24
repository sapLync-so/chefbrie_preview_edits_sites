"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { DemoBanner } from "@/components/DemoBanner";
import { MealPrepIntakeForm } from "@/components/MealPrepIntakeForm";
import { MobileBookBar } from "@/components/MobileBookBar";
import { PaymentZelle } from "@/components/PaymentZelle";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mealPrepMenu, mealPrepRotationLabel } from "@/data/menus";
import { formatMealPrepPrice } from "@/lib/menu-utils";
import { isMealPrepIntakeComplete, MEAL_PREP_INTAKE_COPY, type MealPrepIntakeData } from "@/lib/meal-prep-intake";
import { buildMailtoFromContact, buildMailtoUrl, submitContact } from "@/lib/inquiry";
import { HoneypotField } from "@/components/HoneypotField";
import { TurnstileField } from "@/components/TurnstileField";
import { useFormStartedAt } from "@/lib/form-client-meta";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-md border border-border bg-bg px-4 py-3 font-sans text-sm text-ink focus-visible:ring-2 focus-visible:ring-gold-bright";

const services = [
  { id: "meal-prep", label: "Weekly Meal Prep" },
  { id: "micro-catering", label: "Micro-Catering" },
  { id: "supper-club", label: "Brie's Supper Club" },
] as const;

type ServiceId = (typeof services)[number]["id"];

const emptyIntake = (): MealPrepIntakeData => ({
  clientName: "",
  emailPhone: "",
  dietaryRestrictions: "",
  acknowledgmentName: "",
  signatureDataUrl: "",
  signatureDate: "",
});

function DemoBookContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") === "meal-prep" ? "meal-prep" : "meal-prep";

  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceId>(initialService);
  const [date, setDate] = useState("");
  const [selectedWeekIds, setSelectedWeekIds] = useState<string[]>([]);
  const [intake, setIntake] = useState<MealPrepIntakeData>(emptyIntake);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmailPhone, setBookingEmailPhone] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const formStartedAt = useFormStartedAt();

  const weeks = mealPrepMenu.weeks;
  const isMealPrep = service === "meal-prep";

  const lineItems = useMemo(() => {
    return weeks
      .filter((w) => selectedWeekIds.includes(w.id))
      .flatMap((w) => {
        const label = mealPrepRotationLabel(weeks.indexOf(w));
        return [
          { key: `${w.id}-breakfast`, label: `${label} — Breakfast`, detail: w.breakfast.name, price: w.breakfast.price },
          { key: `${w.id}-dinner`, label: `${label} — Dinner`, detail: w.dinner.name, price: w.dinner.price },
        ];
      });
  }, [selectedWeekIds, weeks]);

  const total = lineItems.reduce((sum, item) => sum + item.price, 0);

  const toggleWeek = (id: string) => {
    setSelectedWeekIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const stepLabels = isMealPrep
    ? (["Intake", "Your weeks", "Summary"] as const)
    : (["Service & date", "Details", "Summary"] as const);

  const canContinue =
    step === 1
      ? isMealPrep
        ? isMealPrepIntakeComplete(intake)
        : Boolean(date)
      : step === 2
        ? isMealPrep
          ? selectedWeekIds.length > 0
          : bookingName.trim().length > 0 && bookingEmailPhone.trim().length > 0
        : true;

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    const meta = { formStartedAt, turnstileToken: turnstileToken || undefined };

    const payload = isMealPrep
      ? {
          formType: "meal-prep-booking" as const,
          company_website: honeypot,
          clientName: intake.clientName,
          emailPhone: intake.emailPhone,
          dietaryRestrictions: intake.dietaryRestrictions,
          acknowledgmentName: intake.acknowledgmentName,
          signatureDate: intake.signatureDate,
          signatureDataUrl: intake.signatureDataUrl,
          selectedWeeks: weeks
            .filter((w) => selectedWeekIds.includes(w.id))
            .map((w) => {
              const index = weeks.indexOf(w);
              return {
                rotationLabel: mealPrepRotationLabel(index),
                breakfast: w.breakfast.name,
                dinner: w.dinner.name,
                breakfastPrice: w.breakfast.price,
                dinnerPrice: w.dinner.price,
              };
            }),
          subtotal: total,
          paymentNote: MEAL_PREP_INTAKE_COPY.payment,
        }
      : {
          formType: "general-booking" as const,
          company_website: honeypot,
          name: bookingName.trim(),
          emailPhone: bookingEmailPhone.trim(),
          service: services.find((s) => s.id === service)?.label ?? service,
          preferredDate: date,
          message: bookingMessage.trim() || undefined,
        };

    const result = await submitContact(payload, meta);
    setIsSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    if (result.preview) {
      window.location.href = buildMailtoUrl(buildMailtoFromContact(payload));
      return;
    }
    setSubmitError(result.error ?? "Could not send your request. Please try again or email Chef Brie directly.");
  };

  return (
    <main className="mx-auto max-w-2xl px-5 pt-28">
      <Badge variant="placeholder" className="mb-4">
        Demo — preview booking flow
      </Badge>
      <h1 className="text-4xl font-light leading-tight md:text-5xl">
        Request an <span className="italic text-gold">experience</span>
      </h1>
      <p className="mt-4 font-sans text-sm leading-relaxed text-ink/65">
        {isMealPrep
          ? "Start with the meal prep intake form, then choose how many weeks you’d like. On the live site, your request is emailed to Chef Brie via the contact handler or your mail app."
          : "This multi-step flow shows how booking could feel for catering and supper club inquiries."}
      </p>

      <ol className="mt-10 flex gap-2 font-sans text-[10px] uppercase tracking-[0.2em]" aria-label="Progress">
        {stepLabels.map((label, i) => {
          const n = i + 1;
          return (
            <li
              key={label}
              className={cn(
                "flex-1 rounded-full py-2 text-center",
                step >= n ? "bg-gold/20 text-gold" : "bg-bg-elevated text-ink/40"
              )}
            >
              {label}
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <div className="relative mt-10 space-y-8 rounded-lg border border-border bg-bg-elevated p-6 shadow-glow">
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          {step === 1 && isMealPrep && <MealPrepIntakeForm data={intake} onChange={setIntake} />}

          {step === 1 && !isMealPrep && (
            <fieldset className="space-y-6">
              <legend className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Service & date</legend>
              <div className="space-y-3">
                {services.map((s) => (
                  <label
                    key={s.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 font-sans text-sm transition-colors",
                      service === s.id ? "border-gold bg-gold/10" : "border-border hover:border-gold/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      checked={service === s.id}
                      onChange={() => setService(s.id)}
                      className="accent-gold"
                    />
                    {s.label}
                  </label>
                ))}
              </div>
              <div>
                <label htmlFor="event-date" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  Preferred date
                </label>
                <input
                  id="event-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 font-sans text-sm text-ink focus-visible:ring-2 focus-visible:ring-gold-bright"
                />
              </div>
            </fieldset>
          )}

          {step === 2 && isMealPrep && (
            <fieldset className="space-y-4">
              <legend className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Select your weeks</legend>
              <p className="font-sans text-sm leading-relaxed text-ink/65">
                Order as many weeks as you want — many clients book a month at a time. Each week includes breakfast and
                dinner from the rotating Sunday menu. Cancellations must be made by Friday morning; otherwise payments
                are non-refundable (see intake form).
              </p>
              <ul className="space-y-3">
                {weeks.map((week, index) => (
                  <li key={week.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-md border p-4 transition-colors",
                        selectedWeekIds.includes(week.id) ? "border-gold bg-gold/10" : "border-border hover:border-gold/35"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedWeekIds.includes(week.id)}
                        onChange={() => toggleWeek(week.id)}
                        className="mt-1 accent-gold"
                      />
                      <div className="font-sans text-sm">
                        <p className="font-medium text-ink">{mealPrepRotationLabel(index)}</p>
                        <p className="mt-1 text-ink/65">Breakfast: {week.breakfast.name}</p>
                        <p className="text-ink/65">Dinner: {week.dinner.name}</p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}

          {step === 2 && !isMealPrep && (
            <fieldset className="space-y-4">
              <legend className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Your details</legend>
              <div>
                <label htmlFor="booking-name" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  Name
                </label>
                <input
                  id="booking-name"
                  required
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="booking-contact" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  Email / phone
                </label>
                <input
                  id="booking-contact"
                  required
                  value={bookingEmailPhone}
                  onChange={(e) => setBookingEmailPhone(e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="booking-message" className="mb-2 block font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
                  Notes (guest count, venue, dietary needs)
                </label>
                <textarea
                  id="booking-message"
                  rows={4}
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Summary</h2>
              {isMealPrep ? (
                <>
                  <dl className="space-y-3 font-sans text-sm">
                    <div className="flex justify-between gap-4 border-b border-border pb-2">
                      <dt className="text-ink/50">Client</dt>
                      <dd className="text-right">{intake.clientName}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-border pb-2">
                      <dt className="text-ink/50">Contact</dt>
                      <dd className="text-right">{intake.emailPhone}</dd>
                    </div>
                    <div className="border-b border-border pb-2">
                      <dt className="text-ink/50">Dietary notes</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-ink/85">{intake.dietaryRestrictions}</dd>
                    </div>
                  </dl>
                  {lineItems.length > 0 && (
                    <ul className="space-y-3 font-sans text-sm">
                      {lineItems.map((item) => (
                        <li key={item.key} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                          <span>
                            <span className="block text-ink/50">{item.label}</span>
                            {item.detail}
                          </span>
                          <span className="shrink-0 tabular-nums">{formatMealPrepPrice(item.price)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between gap-4 pt-2 font-semibold">
                        <span>Estimated total</span>
                        <span>{formatMealPrepPrice(total)}</span>
                      </li>
                    </ul>
                  )}
                  <PaymentZelle />
                </>
              ) : (
                <>
                  <dl className="space-y-3 font-sans text-sm">
                    <div className="flex justify-between gap-4 border-b border-border pb-2">
                      <dt className="text-ink/50">Service</dt>
                      <dd>{services.find((s) => s.id === service)?.label}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-border pb-2">
                      <dt className="text-ink/50">Date</dt>
                      <dd>{date || "—"}</dd>
                    </div>
                  </dl>
                </>
              )}
              <TurnstileField onToken={setTurnstileToken} />
              {submitError ? <p className="font-sans text-sm text-red-300">{submitError}</p> : null}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Submit request"}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-gold/40 bg-gold/10 p-8 text-center">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold">Request sent</p>
          <p className="mt-4 font-sans text-sm text-ink/75">
            {isMealPrep
              ? "Chef Brie received your intake and week selections. She will confirm pickup and payment details."
              : "This demo did not transmit data. Use the contact section or service inquiry forms to reach Chef Brie."}
          </p>
          <Button asChild className="mt-6">
            <Link href="/#contact">Go to contact</Link>
          </Button>
        </div>
      )}
    </main>
  );
}

export default function DemoBookPage() {
  return (
    <div className="min-h-screen bg-bg pb-28 text-ink md:pb-12">
      <DemoBanner />
      <SiteNav />
      <Suspense fallback={<main className="mx-auto max-w-2xl px-5 pt-28 font-sans text-sm text-ink/60">Loading…</main>}>
        <DemoBookContent />
      </Suspense>
      <SiteFooter />
      <MobileBookBar />
    </div>
  );
}
