import Image from "next/image";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Reveal } from "@/components/motion/Reveal";
import { PageShell } from "@/components/PageShell";
import { ServiceCta } from "@/components/ServiceCta";
import { Button } from "@/components/ui/button";
import { supperClubGallerySlides } from "@/data/gallery";
import { previewRobotsMetadata, productionCanonical } from "@/lib/preview-seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  ...previewRobotsMetadata,
  ...productionCanonical("/services/supper-club"),
  title: "Brie's Supper Club | Chef Brie",
  description:
    "An immersive multi-course supper club experience — curated venues, storytelling, and unforgettable evenings in NJ & PA.",
};

export default function SupperClubPage() {
  return (
    <PageShell>
      <section className="relative flex min-h-[85vh] items-end overflow-hidden">
        <div className="absolute inset-0 bg-bg">
          <video
            className="h-full w-full object-cover opacity-95 motion-reduce:opacity-100"
            autoPlay
            muted
            loop
            playsInline
            poster="/videos/supper-club-poster.jpg"
            preload="metadata"
          >
            <source src="/videos/supper-club-reel.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/25" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(13_13_13/0.5)_100%)]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-20 pt-32">
          <Reveal>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-gold">Brie&apos;s Supper Club</p>
            <h1 className="text-4xl font-light leading-tight md:text-6xl">
              The full <span className="italic text-gold">chef experience</span>
            </h1>
            <p className="mt-4 max-w-xl font-sans text-lg font-light text-ink/80">
              Multiple courses. A breathtaking venue. People, plates, and atmosphere woven into one unforgettable evening.
            </p>
            <Button asChild className="mt-8">
              <Link href="/demo/book">Join the waitlist (demo)</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-bg-muted px-5 py-20" aria-labelledby="supper-club-gallery-heading">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 max-w-xl">
            <h2 id="supper-club-gallery-heading" className="text-3xl font-light">
              Evenings in <span className="italic text-gold">motion</span>
            </h2>
            <p className="mt-3 font-sans text-sm text-ink/60">
              A wider, cinematic gallery — swipe or use arrow keys. Auto-advance pauses on hover and respects reduced
              motion.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <ImageCarousel
              slides={supperClubGallerySlides}
              autoAdvanceMs={6000}
              ariaLabel="Supper club experience photos"
              cinematic
            />
          </Reveal>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </section>

      <article className="mx-auto max-w-3xl px-5 py-20">
        <Reveal>
          <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-lg border border-border shadow-soft">
            <Image
              src="/images/chef-brie-gallery/IMG_4453.jpg"
              alt="Shared table at a Chef Brie supper club evening"
              fill
              sizes="768px"
              className="object-cover"
            />
          </div>
          <div className="space-y-6 font-sans text-base font-light leading-relaxed text-ink/75">
            <p>
              Brie&apos;s Supper Club is an immersive, restaurant-quality pop-up — not a typical reservation, but a
              curated gathering. Each event features a multi-course menu, intentional pacing, and a setting chosen to
              match the story of the meal.
            </p>
            <p>
              Some chefs pair wine with dishes. Chef Brie pairs people, plates, and atmosphere — so every seat at the
              table feels part of something larger than dinner.
            </p>
            <p>
              Follow along on social for upcoming dates and venues. When seats open, they go quickly — reserve your
              place through the inquiry form and note &ldquo;Supper Club&rdquo; so Brie can share the next experience with you.
            </p>
          </div>
          <ServiceCta service="tasting-popup" primaryLabel="Reserve / Join Waitlist" />
        </Reveal>
      </article>
    </PageShell>
  );
}
