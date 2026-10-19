"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoBanner } from "@/components/DemoBanner";
import { MobileBookBar } from "@/components/MobileBookBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mealPrepMenu } from "@/data/menus";
import { formatMealPrepPrice } from "@/lib/menu-utils";
import { cn } from "@/lib/utils";

const services = [
  { id: "meal-prep", label: "Weekly Meal Prep" },
  { id: "micro-catering", label: "Micro-Catering" },
  { id: "supper-club", label: "Brie's Supper Club" },
] as const;

type ServiceId = (typeof services)[number]["id"];

export default function DemoBookPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceId>("meal-prep");
  const [date, setDate] = useState("");
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const weeks = mealPrepMenu.weeks;

  const lineItems = useMemo(() => {
    return weeks
      .filter((w) => selectedWeeks.includes(w.dateLabel))
      .flatMap((w) => [
        { label: `${w.dateLabel} — Breakfast`, detail: w.breakfast.name, price: w.breakfast.price },
        { label: `${w.dateLabel} — Dinner`, detail: w.dinner.name, price: w.dinner.price },
      ]);
  }, [selectedWeeks, weeks]);

  const total = lineItems.reduce((sum, item) => sum + item.price, 0);

  const toggleWeek = (dateLabel: string) => {
    setSelectedWeeks((prev) =>
      prev.includes(dateLabel) ? prev.filter((d) => d !== dateLabel) : [...prev, dateLabel]
    );
  };

  return (
    <div className="min-h-screen bg-bg pb-28 text-ink md:pb-12">
      <DemoBanner />
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 pt-28">
        <Badge variant="placeholder" className="mb-4">
          Demo — not connected to live orders
        </Badge>
        <h1 className="text-4xl font-light leading-tight md:text-5xl">
          Request an <span className="italic text-gold">experience</span>
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-ink/65">
          This multi-step flow shows how booking could feel — dates, meal picks, and a clear summary. Nothing you enter
          is sent anywhere.
        </p>

        <ol className="mt-10 flex gap-2 font-sans text-[10px] uppercase tracking-[0.2em]" aria-label="Progress">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className={cn(
                "flex-1 rounded-full py-2 text-center",
                step >= n ? "bg-gold/20 text-gold" : "bg-bg-elevated text-ink/40"
              )}
            >
              Step {n}
            </li>
          ))}
        </ol>

        {!submitted ? (
          <div className="mt-10 space-y-8 rounded-lg border border-border bg-bg-elevated p-6 shadow-glow">
            {step === 1 && (
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

            {step === 2 && service === "meal-prep" && (
              <fieldset className="space-y-4">
                <legend className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Select meal prep weeks</legend>
                <p className="font-sans text-sm text-ink/60">Choose one or more weeks from the current menu.</p>
                <ul className="space-y-3">
                  {weeks.map((week) => (
                    <li key={week.dateLabel}>
                      <label
                        className={cn(
                          "flex cursor-pointer gap-3 rounded-md border p-4 transition-colors",
                          selectedWeeks.includes(week.dateLabel)
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/35"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedWeeks.includes(week.dateLabel)}
                          onChange={() => toggleWeek(week.dateLabel)}
                          className="mt-1 accent-gold"
                        />
                        <div className="font-sans text-sm">
                          <p className="font-medium text-ink">{week.dateLabel}</p>
                          <p className="mt-1 text-ink/65">Breakfast: {week.breakfast.name}</p>
                          <p className="text-ink/65">Dinner: {week.dinner.name}</p>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}

            {step === 2 && service !== "meal-prep" && (
              <div className="space-y-4 font-sans text-sm text-ink/70">
                <p>
                  For <span className="text-gold">{services.find((s) => s.id === service)?.label}</span>, a production
                  flow would capture guest count, venue, and dietary notes. This demo skips item selection and jumps to
                  summary.
                </p>
                <Badge variant="placeholder">Placeholder — catering & supper club fields</Badge>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-sans text-xs uppercase tracking-[0.25em] text-gold">Summary</h2>
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
                {service === "meal-prep" && lineItems.length > 0 && (
                  <ul className="space-y-3 font-sans text-sm">
                    {lineItems.map((item) => (
                      <li key={item.label} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                        <span>
                          <span className="block text-ink/50">{item.label}</span>
                          {item.detail}
                        </span>
                        <span className="shrink-0 tabular-nums">{formatMealPrepPrice(item.price)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between gap-4 pt-2 font-semibold">
                      <span>Demo subtotal</span>
                      <span>{formatMealPrepPrice(total)}</span>
                    </li>
                  </ul>
                )}
                <p className="font-sans text-xs text-ink/45">
                  Live site would send this to Chef Brie via email or a connected form.{" "}
                  <Link href="/#contact" className="text-gold underline-offset-2 hover:underline">
                    Current contact form
                  </Link>{" "}
                  remains the real path today.
                </p>
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
                  disabled={step === 1 && !date}
                >
                  Continue
                </Button>
              ) : (
                <Button type="button" onClick={() => setSubmitted(true)}>
                  Submit (demo only)
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-gold/40 bg-gold/10 p-8 text-center">
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold">Demo complete</p>
            <p className="mt-4 font-sans text-sm text-ink/75">
              Your selections were not transmitted. To reach Chef Brie, use the contact section on the home page.
            </p>
            <Button asChild className="mt-6">
              <Link href="/#contact">Go to contact</Link>
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
      <MobileBookBar />
    </div>
  );
}
