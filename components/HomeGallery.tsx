"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { homeGalleryImages } from "@/data/gallery";
import { cn } from "@/lib/utils";

export function HomeGallery() {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const count = homeGalleryImages.length;

  const goPrev = () => setGalleryIndex((i) => (i === 0 ? count - 1 : i - 1));
  const goNext = () => setGalleryIndex((i) => (i === count - 1 ? 0 : i + 1));

  const current = homeGalleryImages[galleryIndex];

  return (
    <section id="gallery" className="scroll-mt-28 bg-bg-muted px-5 py-section">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-10">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold">Gallery</p>
          <h2 className="mt-2 text-3xl font-light md:text-4xl">Plates &amp; moments</h2>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="relative overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-soft">
            <div className="relative aspect-[4/3] md:aspect-[16/10]">
              <Image
                src={`/images/chef-brie-gallery/${current.file}`}
                alt={`Chef Brie gallery image ${galleryIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover"
                style={{ objectPosition: current.objectPosition ?? "center" }}
              />
            </div>
            <button
              type="button"
              aria-label="Previous gallery image"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/20 bg-bg/75 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next gallery image"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/20 bg-bg/75 text-ink backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
            <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-bg via-bg/85 to-transparent px-5 py-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold">Gallery frame</p>
                  <p className="mt-2 font-sans text-sm text-ink/70">
                    {String(galleryIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </p>
                </div>
                <div className="hidden gap-2 sm:flex">
                  {homeGalleryImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to gallery image ${i + 1}`}
                      aria-current={i === galleryIndex}
                      onClick={() => setGalleryIndex(i)}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all",
                        i === galleryIndex ? "scale-110 bg-gold" : "bg-white/35 hover:bg-white/60"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto pb-2">
            <div className="grid min-w-max grid-flow-col auto-cols-[92px] gap-3">
              {homeGalleryImages.map((img, i) => (
                <button
                  key={img.file}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  aria-label={`Select gallery image ${i + 1}`}
                  aria-current={i === galleryIndex}
                  className={cn(
                    "group relative overflow-hidden rounded-md border-2 transition-all",
                    i === galleryIndex ? "border-gold" : "border-transparent opacity-85 hover:border-gold/40 hover:opacity-100"
                  )}
                >
                  <div className="relative aspect-square w-[92px]">
                    <Image
                      src={`/images/chef-brie-gallery/${img.file}`}
                      alt=""
                      fill
                      sizes="92px"
                      className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                      style={{ objectPosition: img.objectPosition ?? "center" }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
