"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Suspense, useCallback, useMemo, useState } from "react";
import { DemoBanner } from "@/components/DemoBanner";
import { MealPrepCustomizeMenuCallout } from "@/components/MealPrepCustomizeMenuDialog";
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
import {
  MEAL_PREP_MIN_ORDER,
  mealPrepEstimatedTotal,
  mealPrepSalesTax,
  meetsOrderMinimum,
  minimumOrderMessage,
  serviceSubtotal,
  totalMealQuantity,
} from "@/lib/meal-prep-order";
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

type MealPrepWeek = (typeof mealPrepMenu.weeks)[number];

type WeekQuantities = Record<string, number>;

function MealPrepWeekQuantityGrid({
  weeks,
  quantities,
  onChangeQuantity,
  getMeal,
}: {
  weeks: MealPrepWeek[];
  quantities: WeekQuantities;
  onChangeQuantity: (weekId: string, next: number) => void;
  getMeal: (week: MealPrepWeek) => { name: string; price: number };
}) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {weeks.map((week, index) => {
        const meal = getMeal(week);
        const qty = quantities[week.id] ?? 0;
        const lineTotal = qty * meal.price;
        return (
          <div
            key={week.id}
            className={cn(
              "box-border flex h-full min-w-0 flex-col rounded-md border p-3 transition-colors",
              qty > 0 ? "border-gold bg-gold/10" : "border-border"
            )}
          >
            <span className="font-sans text-[10px] uppercase leading-tight tracking-[0.12em] text-gold">
              {mealPrepRotationLabel(index)}
            </span>
            <span className="mt-2 flex-1 font-sans text-xs leading-snug text-ink/85 md:text-sm">{meal.name}</span>
            <span className="mt-2 font-sans text-xs tabular-nums text-ink/55">
              {formatMealPrepPrice(meal.price)} each
            </span>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
              <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink/45">Qty</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-border bg-bg-elevated"
                  aria-label={`Decrease ${mealPrepRotationLabel(index)} quantity`}
                  disabled={qty <= 0}
                  onClick={() => onChangeQuantity(week.id, qty - 1)}
                >
                  <Minus className="h-4 w-4" aria-hidden />
                </Button>
                <span
                  className="min-w-[2rem] text-center font-sans text-sm tabular-nums text-ink"
                  aria-live="polite"
                >
                  {qty}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-border bg-bg-elevated"
                  aria-label={`Increase ${mealPrepRotationLabel(index)} quantity`}
                  onClick={() => onChangeQuantity(week.id, qty + 1)}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
            {qty > 0 ? (
              <p className="mt-2 text-right font-sans text-xs tabular-nums text-gold">
                {formatMealPrepPrice(lineTotal)}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const serviceToggleButtonClass = (enabled: boolean) =>
  cn(
    "h-10 w-full font-sans text-xs uppercase tracking-[0.12em] sm:w-auto sm:min-w-[11rem] sm:self-start",
    enabled ? "bg-gold text-bg hover:bg-gold/90" : "border-border bg-bg-elevated text-ink hover:border-gold/50"
  );

function MealPrepServiceHeader({
  title,
  enabled,
  onToggle,
  selectLabel,
  deselectLabel,
}: {
  title: string;
  enabled: boolean;
  onToggle: () => void;
  selectLabel: string;
  deselectLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-sans text-sm font-medium uppercase tracking-[0.15em] text-ink">{title}</h3>
      <Button
        type="button"
        variant={enabled ? "default" : "outline"}
        className={serviceToggleButtonClass(enabled)}
        onClick={onToggle}
        aria-pressed={enabled}
      >
        {enabled ? deselectLabel : selectLabel}
      </Button>
    </div>
  );
}

function DemoBookContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") === "meal-prep" ? "meal-prep" : "meal-prep";

  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceId>(initialService);
  const [date, setDate] = useState("");
  const [breakfastServiceEnabled, setBreakfastServiceEnabled] = useState(false);
  const [dinnerServiceEnabled, setDinnerServiceEnabled] = useState(false);
  const [breakfastQuantities, setBreakfastQuantities] = useState<WeekQuantities>({});
  const [dinnerQuantities, setDinnerQuantities] = useState<WeekQuantities>({});
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

  const setMealQuantity = useCallback(
    (service: "breakfast" | "dinner", weekId: string, next: number) => {
      const clamped = Math.max(0, Math.min(99, next));
      const setter = service === "breakfast" ? setBreakfastQuantities : setDinnerQuantities;
      setter((prev) => {
        if (clamped === 0) {
          const { [weekId]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [weekId]: clamped };
      });
    },
    []
  );

  const breakfastSubtotal = useMemo(
    () => (breakfastServiceEnabled ? serviceSubtotal(breakfastQuantities, weeks, "breakfast") : 0),
    [breakfastServiceEnabled, breakfastQuantities, weeks]
  );
  const dinnerSubtotal = useMemo(
    () => (dinnerServiceEnabled ? serviceSubtotal(dinnerQuantities, weeks, "dinner") : 0),
    [dinnerServiceEnabled, dinnerQuantities, weeks]
  );

  const lineItems = useMemo(() => {
    const items: { key: string; label: string; detail: string; quantity: number; price: number }[] = [];
    weeks.forEach((w, index) => {
      const rotation = mealPrepRotationLabel(index);
      if (breakfastServiceEnabled) {
        const qty = breakfastQuantities[w.id] ?? 0;
        if (qty > 0) {
          items.push({
            key: `${w.id}-breakfast`,
            label: `${rotation}, Breakfast`,
            detail: w.breakfast.name,
            quantity: qty,
            price: qty * w.breakfast.price,
          });
        }
      }
      if (dinnerServiceEnabled) {
        const qty = dinnerQuantities[w.id] ?? 0;
        if (qty > 0) {
          items.push({
            key: `${w.id}-dinner`,
            label: `${rotation}, Dinner`,
            detail: w.dinner.name,
            quantity: qty,
            price: qty * w.dinner.price,
          });
        }
      }
    });
    return items;
  }, [breakfastServiceEnabled, dinnerServiceEnabled, breakfastQuantities, dinnerQuantities, weeks]);

  const subtotal = lineItems.reduce((sum, item) => sum + item.price, 0);
  const salesTax = mealPrepSalesTax(subtotal);
  const estimatedTotal = mealPrepEstimatedTotal(subtotal);

  const toggleBreakfastService = () => {
    setBreakfastServiceEnabled((on) => {
      if (on) setBreakfastQuantities({});
      return !on;
    });
  };

  const toggleDinnerService = () => {
    setDinnerServiceEnabled((on) => {
      if (on) setDinnerQuantities({});
      return !on;
    });
  };

  const mealPrepStep2Valid = useMemo(() => {
    const breakfastMeals = breakfastServiceEnabled ? totalMealQuantity(breakfastQuantities) : 0;
    const dinnerMeals = dinnerServiceEnabled ? totalMealQuantity(dinnerQuantities) : 0;
    if (breakfastMeals + dinnerMeals === 0) return false;
    return meetsOrderMinimum(subtotal);
  }, [breakfastServiceEnabled, dinnerServiceEnabled, breakfastQuantities, dinnerQuantities, subtotal]);

  const stepLabels = isMealPrep
    ? (["Intake", "The Menu", "Summary"] as const)
    : (["Service & date", "Details", "Summary"] as const);

  const canContinue =
    step === 1
      ? isMealPrep
        ? isMealPrepIntakeComplete(intake)
        : Boolean(date)
      : step === 2
        ? isMealPrep
          ? mealPrepStep2Valid
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
            .map((w, index) => {
              const bQty = breakfastServiceEnabled ? (breakfastQuantities[w.id] ?? 0) : 0;
              const dQty = dinnerServiceEnabled ? (dinnerQuantities[w.id] ?? 0) : 0;
              if (bQty <= 0 && dQty <= 0) return null;
              return {
                rotationLabel: mealPrepRotationLabel(index),
                ...(bQty > 0
                  ? {
                      breakfast: w.breakfast.name,
                      breakfastPrice: w.breakfast.price,
                      breakfastQuantity: bQty,
                    }
                  : {}),
                ...(dQty > 0
                  ? { dinner: w.dinner.name, dinnerPrice: w.dinner.price, dinnerQuantity: dQty }
                  : {}),
              };
            })
            .filter((row): row is NonNullable<typeof row> => row != null),
          subtotal,
          salesTax,
          estimatedTotal,
          breakfastServiceSelected: breakfastServiceEnabled,
          dinnerServiceSelected: dinnerServiceEnabled,
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
    <main className={cn("mx-auto min-w-0 px-5 pt-28", isMealPrep ? "w-full max-w-5xl" : "max-w-2xl")}>
      <Badge variant="placeholder" className="mb-4">
        Demo — preview booking flow
      </Badge>
      <h1 className="text-4xl font-light leading-tight md:text-5xl">
        Request an <span className="italic text-gold">Experience</span>
      </h1>
      <p className="mt-4 font-sans text-sm leading-relaxed text-ink/65">
        {isMealPrep
          ? "Let's get started! Complete our meal prep intake form to share your preferences, select your desired meal plan duration, and review your selections. Once submitted, Chef Brie will be in touch to confirm the details and next steps."
          : "This multi-step flow shows how booking could feel for catering and supper club inquiries."}
      </p>

      <ol className="mt-10 flex w-full min-w-0 gap-2 font-sans text-[10px] uppercase tracking-[0.2em]" aria-label="Progress">
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
        <div className="relative mt-10 w-full min-w-0 space-y-8 rounded-lg border border-border bg-bg-elevated p-6 shadow-glow">
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
            <fieldset className="min-w-0 space-y-8">
              <legend className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Build your order</legend>
              <MealPrepCustomizeMenuCallout intake={intake} />
              <p className="font-sans text-sm leading-relaxed text-ink/65">
                Choose breakfast and/or dinner — orders have a ${MEAL_PREP_MIN_ORDER} minimum (combined pre-tax subtotal).
                Pick as many weeks as you like. Cancellations must be made by Friday morning; otherwise payments are
                non-refundable (see intake form).
              </p>

              <section className="w-full min-w-0 space-y-4 rounded-lg border border-border bg-bg p-4 md:p-5">
                <MealPrepServiceHeader
                  title="Breakfast"
                  enabled={breakfastServiceEnabled}
                  onToggle={toggleBreakfastService}
                  selectLabel="Select Breakfast"
                  deselectLabel="Deselect Breakfast"
                />
                {breakfastServiceEnabled ? (
                  <>
                    <MealPrepWeekQuantityGrid
                      weeks={weeks}
                      quantities={breakfastQuantities}
                      onChangeQuantity={(weekId, next) => setMealQuantity("breakfast", weekId, next)}
                      getMeal={(week) => week.breakfast}
                    />
                    <p className="font-sans text-xs tabular-nums text-ink/55">
                      Breakfast subtotal (estimated): {formatMealPrepPrice(breakfastSubtotal)}
                    </p>
                  </>
                ) : (
                  <p className="font-sans text-sm text-ink/45">Breakfast is not included in this order.</p>
                )}
              </section>

              <section className="w-full min-w-0 space-y-4 rounded-lg border border-border bg-bg p-4 md:p-5">
                <MealPrepServiceHeader
                  title="Dinner"
                  enabled={dinnerServiceEnabled}
                  onToggle={toggleDinnerService}
                  selectLabel="Select Dinner"
                  deselectLabel="Deselect Dinner"
                />
                {dinnerServiceEnabled ? (
                  <>
                    <MealPrepWeekQuantityGrid
                      weeks={weeks}
                      quantities={dinnerQuantities}
                      onChangeQuantity={(weekId, next) => setMealQuantity("dinner", weekId, next)}
                      getMeal={(week) => week.dinner}
                    />
                    <p className="font-sans text-xs tabular-nums text-ink/55">
                      Dinner subtotal (estimated): {formatMealPrepPrice(dinnerSubtotal)}
                    </p>
                  </>
                ) : (
                  <p className="font-sans text-sm text-ink/45">Dinner is not included in this order.</p>
                )}
              </section>

              {!breakfastServiceEnabled && !dinnerServiceEnabled ? (
                <p className="font-sans text-sm text-ink/55">Select at least one service to continue.</p>
              ) : null}

              {(breakfastServiceEnabled || dinnerServiceEnabled) && lineItems.length > 0 && !meetsOrderMinimum(subtotal) ? (
                <p
                  className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-sans text-sm text-amber-100"
                  role="status"
                >
                  {minimumOrderMessage(subtotal)}
                </p>
              ) : null}

              {(breakfastServiceEnabled || dinnerServiceEnabled) && lineItems.length > 0 ? (
                <p className="font-sans text-xs tabular-nums text-ink/55">
                  Order subtotal (estimated): {formatMealPrepPrice(subtotal)}
                </p>
              ) : null}
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
                            {item.quantity} × {item.detail}
                          </span>
                          <span className="shrink-0 tabular-nums">{formatMealPrepPrice(item.price)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between gap-4 border-b border-border/60 pb-2 pt-1">
                        <span className="text-ink/70">Estimated subtotal</span>
                        <span className="shrink-0 tabular-nums">{formatMealPrepPrice(subtotal)}</span>
                      </li>
                      <li className="flex justify-between gap-4 border-b border-border/60 pb-2">
                        <span className="text-ink/70">Estimated NJ sales tax (6.6%)</span>
                        <span className="shrink-0 tabular-nums">{formatMealPrepPrice(salesTax)}</span>
                      </li>
                      <li className="flex justify-between gap-4 pt-2 font-semibold">
                        <span>Estimated total</span>
                        <span className="shrink-0 tabular-nums">{formatMealPrepPrice(estimatedTotal)}</span>
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
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue}
                variant={canContinue ? "default" : "outline"}
                className={cn(
                  !canContinue &&
                    "cursor-not-allowed border-border bg-bg-elevated text-ink/40 opacity-100 hover:border-border hover:bg-bg-elevated hover:text-ink/40 disabled:opacity-100"
                )}
                aria-disabled={!canContinue}
              >
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
