import { PageShell } from "@/components/PageShell";
import { ServiceCta } from "@/components/ServiceCta";
import { previewRobotsMetadata, productionCanonical } from "@/lib/preview-seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...previewRobotsMetadata,
  ...productionCanonical("/services/meal-prep"),
  title: "Meal Prep | Chef Brie",
  description:
    "Chef-crafted weekly meal prep with rotating menus. Pickup in Langhorne, PA and Princeton, NJ.",
};

export default function MealPrepPage() {
  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 pb-24">
        <p className="text-[#c9a96e] tracking-[0.4em] uppercase text-xs font-sans mb-4">Meal Prep</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light leading-tight mb-8">
          Weekly meals, <span className="italic text-[#c9a96e]">chef-crafted</span>
        </h1>
        <div className="space-y-5 text-[#f5f0e8]/75 font-sans font-light leading-relaxed text-base">
          <p>
            Chef Brie prepares fresh breakfast and dinner options each week — designed around your goals,
            preferences, and schedule. Menus rotate seasonally so you always have something new on the table
            without sacrificing nutrition or flavor.
          </p>
          <p>
            Ideal for busy professionals, families, and campus-adjacent communities who want reliable,
            restaurant-quality meals without the daily grind. Custom meal prep plans and family bundles are
            available on request.
          </p>
          <p>
            Pick up in Langhorne, PA (Sundays) or Princeton, NJ (Mondays). See the current weekly menu for
            dishes and per-meal pricing.
          </p>
        </div>
        <ServiceCta service="meal-prep" primaryLabel="Request Meal Prep" menuHref="/menu#meal-prep" />
      </article>
    </PageShell>
  );
}
