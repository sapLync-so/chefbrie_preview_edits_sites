import { PageShell } from "@/components/PageShell";
import { ServiceCta } from "@/components/ServiceCta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Micro Catering | Chef Brie",
  description:
    "Elevated micro-catering for intimate events, corporate gatherings, retreats, and universities in NJ & PA.",
};

export default function MicroCateringPage() {
  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 pb-24">
        <p className="text-[#c9a96e] tracking-[0.4em] uppercase text-xs font-sans mb-4">Micro-Catering</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light leading-tight mb-8">
          Intimate events, <span className="italic text-[#c9a96e]">full-service craft</span>
        </h1>
        <div className="space-y-5 text-[#f5f0e8]/75 font-sans font-light leading-relaxed text-base">
          <p>
            Elevated catering for small, curated gatherings — birthdays, brunches, celebrations, team dinners,
            and institutional events such as retreats, conferences, and university programming. Chef Brie brings
            full culinary execution to your venue with menus tailored to your guests, dietary needs, and vision.
          </p>
          <p>
            Choose from passed appetizers, buffet-style service, or plated courses. Vegan, gluten-free, and
            celiac accommodations are available. Delivery, setup, and on-site service options across New Jersey
            and Pennsylvania.
          </p>
          <p>
            Browse the catering menu for per-person pricing on appetizers, entrees, sides, desserts, and
            charcuterie — then reach out for a custom quote aligned to your headcount and event format.
          </p>
        </div>
        <ServiceCta
          service="micro-catering"
          primaryLabel="Request a Quote"
          menuHref="/menu#catering"
          inquiryMode="quote"
        />
      </article>
    </PageShell>
  );
}
