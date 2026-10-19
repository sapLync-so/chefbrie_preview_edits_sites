"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cateringMenu, mealPrepMenu, type MenuItem } from "@/data/menus";
import { extractDietaryTags, formatMealPrepPrice } from "@/lib/menu-utils";
import { cn } from "@/lib/utils";

type MenuView = "meal-prep" | "catering";
type CateringFilter = "all" | (typeof cateringMenu.sections)[number]["id"];

export function MenuExperience() {
  const [view, setView] = useState<MenuView>("meal-prep");
  const [cateringFilter, setCateringFilter] = useState<CateringFilter>("all");
  const [dietaryOnly, setDietaryOnly] = useState<"all" | "V" | "GFO">("all");

  const filteredSections = useMemo(() => {
    let sections = cateringMenu.sections;
    if (cateringFilter !== "all") {
      sections = sections.filter((s) => s.id === cateringFilter);
    }
    if (dietaryOnly === "all") return sections;
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const { tags } = extractDietaryTags(item.name);
          return tags.includes(dietaryOnly);
        }),
      }))
      .filter((s) => s.items.length > 0);
  }, [cateringFilter, dietaryOnly]);

  return (
    <div className="pb-16">
      <div className="px-5 pb-12">
        <Reveal className="mx-auto max-w-6xl text-center">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold">Menus</p>
          <h1 className="mt-2 text-4xl font-light md:text-5xl">
            Seasonal <span className="italic text-gold">offerings</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm text-ink/55">
            Filter by service, category, and dietary tags. All dishes and prices are from Chef Brie&apos;s current menus.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-2">
          {(
            [
              { id: "meal-prep" as const, label: "Weekly meal prep" },
              { id: "catering" as const, label: "Catering menu" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              className={cn(
                "rounded-full border px-5 py-2.5 font-sans text-xs uppercase tracking-[0.15em] transition-colors",
                view === tab.id ? "border-gold bg-gold/15 text-gold" : "border-border text-ink/55 hover:border-gold/40"
              )}
              aria-pressed={view === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {view === "meal-prep" && (
        <section id="meal-prep" className="scroll-mt-28 border-y border-gold/25 bg-cream px-5 py-16 text-ink-cream">
          <div className="mx-auto max-w-5xl">
            <header className="text-center">
              <p className="font-serif text-sm italic tracking-[0.2em] text-ink-cream/70">Chef</p>
              <p className="text-4xl font-semibold tracking-[0.08em]">BRIE</p>
              <p className="mt-2 font-sans text-xs uppercase tracking-[0.3em] text-ink-cream/60">Weekly Meal Prep Menu</p>
            </header>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {mealPrepMenu.weeks.map((week, i) => (
                <Reveal key={week.dateLabel} delay={i * 0.04}>
                  <article className="rounded-lg border border-gold/40 bg-cream-muted p-6 shadow-sm">
                    <h2 className="border-b border-gold/30 pb-3 text-center font-sans text-sm uppercase tracking-[0.12em]">
                      {week.dateLabel}
                    </h2>
                    <div className="mt-5 space-y-5 font-serif text-sm leading-relaxed">
                      <div>
                        <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-ink-cream/55">Breakfast</p>
                        <p>{week.breakfast.name}</p>
                        <Badge variant="price" className="mt-2 border-ink-cream/25 bg-ink-cream/10 text-ink-cream">
                          {formatMealPrepPrice(week.breakfast.price)} per meal
                        </Badge>
                      </div>
                      <div>
                        <p className="mb-1 font-sans text-xs uppercase tracking-[0.2em] text-ink-cream/55">Dinner</p>
                        <p>{week.dinner.name}</p>
                        <Badge variant="price" className="mt-2 border-ink-cream/25 bg-ink-cream/10 text-ink-cream">
                          {formatMealPrepPrice(week.dinner.price)} per meal
                        </Badge>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="mt-14 grid gap-10 border-t border-gold/25 pt-10 font-sans text-sm md:grid-cols-2">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-cream/55">{mealPrepMenu.pickup.heading}</p>
                <ul className="space-y-2">
                  {mealPrepMenu.pickup.locations.map((loc) => (
                    <li key={loc.day}>
                      <span className="font-medium">{loc.day}</span> – {loc.place}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p>
                  <a href={`tel:${mealPrepMenu.pickup.phone.replace(/-/g, "")}`} className="hover:text-gold">
                    {mealPrepMenu.pickup.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${mealPrepMenu.pickup.email}`} className="hover:text-gold">
                    {mealPrepMenu.pickup.email}
                  </a>
                </p>
                <p>
                  <a
                    href={`https://instagram.com/${mealPrepMenu.pickup.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold"
                  >
                    {mealPrepMenu.pickup.instagram}
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Button asChild variant="cream">
                <Link href="/demo/book">Order meal prep (demo)</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {view === "catering" && (
        <section id="catering" className="scroll-mt-28 bg-cream px-5 py-16 text-ink-cream">
          <div className="mx-auto max-w-6xl">
            <header className="text-center">
              <p className="font-serif text-sm italic">Chef BRIE</p>
              <h2 className="mt-2 text-2xl uppercase tracking-[0.2em]">The Menu</h2>
              <p className="mt-4 font-sans text-sm">{cateringMenu.legend}</p>
            </header>

            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setCateringFilter("all")}
                className={cn(
                  "rounded-full border px-4 py-2 font-sans text-[11px] uppercase tracking-wider",
                  cateringFilter === "all" ? "border-gold bg-gold/15" : "border-ink-cream/20"
                )}
              >
                All categories
              </button>
              {cateringMenu.sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setCateringFilter(section.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 font-sans text-[11px] uppercase tracking-wider",
                    cateringFilter === section.id ? "border-gold bg-gold/15" : "border-ink-cream/20"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {(["all", "V", "GFO"] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setDietaryOnly(tag)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider",
                    dietaryOnly === tag ? "border-emerald-800 bg-emerald-950/10" : "border-ink-cream/15"
                  )}
                >
                  {tag === "all" ? "All diets" : tag}
                </button>
              ))}
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className={cn(
                    "rounded-lg border border-gold/30 bg-cream-muted p-6",
                    section.id === "charcuterie" && "lg:col-span-2"
                  )}
                >
                  <h3 className="mb-4 text-center font-sans text-sm uppercase tracking-[0.25em]">
                    {section.title}
                    {section.footerNote && (
                      <span className="mt-1 block text-xs normal-case tracking-normal">{section.footerNote}</span>
                    )}
                  </h3>
                  {section.id === "sides" ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-serif text-sm">
                      {section.items.map((item) => (
                        <p key={item.name}>{item.name}</p>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-4 font-serif text-sm">
                      {section.items.map((item: MenuItem) => {
                        const { cleanName, tags } = extractDietaryTags(item.name);
                        return (
                          <li key={item.name} className="border-b border-gold/15 pb-3 last:border-0">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <span className="min-w-0 flex-1">{cleanName}</span>
                              <div className="flex shrink-0 flex-wrap items-center gap-2">
                                {tags.map((t) => (
                                  <Badge key={t} variant="dietary">
                                    {t}
                                  </Badge>
                                ))}
                                {item.price ? (
                                  <Badge variant="price" className="border-gold/30 bg-gold/15 text-ink-cream">
                                    {item.price}
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                            {"note" in item && item.note ? (
                              <p className="mt-1 text-xs italic text-ink-cream/65">{item.note}</p>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <p className="mx-auto mt-12 max-w-2xl text-center font-serif text-sm italic text-ink-cream/70">
              {cateringMenu.customItemsNote}
            </p>

            <div className="mt-10 text-center">
              <Button asChild variant="cream">
                <Link href="/demo/book">Request catering quote (demo)</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
